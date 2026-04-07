from __future__ import annotations

import html
import json
import mimetypes
import re
import ssl
import subprocess
import time
import unicodedata
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

from bs4 import BeautifulSoup, Comment
from markdownify import markdownify

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "src" / "content" / "blog"
ASSET_ROOT = ROOT / "public" / "legacy" / "blogger"
REPORT_PATH = ROOT / "reports" / "imported-blogger-2026.json"
BLOGGER_FEED_URL = "https://rickenbazolo.blogspot.com/feeds/posts/default?alt=json&max-results=500"
SSL_CONTEXT = ssl._create_unverified_context()
TOKEN_PATTERN = re.compile(r"\[\[\[(TOKEN\d+)\]\]\]")


@dataclass
class PostPayload:
    slug: str
    title: str
    excerpt: str
    published_at: str
    tags: list[str]
    source_lang: str
    canonical: str
    source_markdown: str
    translated_title: str
    translated_excerpt: str
    translated_markdown: str
    cover_image: str | None = None
    assets: list[str] = field(default_factory=list)


def fetch_json(url: str):
    raw = subprocess.check_output(["curl", "-Lks", url], text=True)
    return json.loads(raw)


def fetch_page_post_html(url: str) -> str:
    raw = subprocess.check_output(["curl", "-Lks", url], text=True)
    soup = BeautifulSoup(raw, "html.parser")
    body = soup.select_one("div.post-body.entry-content")
    return body.decode_contents() if body else ""


def google_translate(text: str, target_lang: str, source_lang: str = "auto") -> tuple[str, str]:
    if not text.strip():
        return text, source_lang

    query = urllib.parse.quote(text)
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl={source_lang}&tl={target_lang}&dt=t&q={query}"
    )
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, context=SSL_CONTEXT, timeout=30) as response:
        data = json.loads(response.read().decode("utf-8"))

    translated = "".join(part[0] for part in data[0] if part and part[0])
    detected = data[2] if len(data) > 2 and data[2] else source_lang
    return translated, detected


def detect_language(title: str, excerpt: str, content: str) -> str:
    sample = "\n\n".join(part for part in [title, excerpt, content[:1200]] if part).strip()
    _, detected = google_translate(sample, "en", "auto")
    return "en" if detected == "en" else "fr"


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    normalized = normalized.lower()
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized)
    return normalized.strip("-") or "post"


def make_unique_slug(base_slug: str, used_slugs: set[str]) -> str:
    slug = base_slug
    counter = 2
    while slug in used_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1
    used_slugs.add(slug)
    return slug


def infer_extension(response, url: str) -> str:
    content_disposition = response.headers.get("Content-Disposition", "")
    match = re.search(r'filename="?([^";]+)"?', content_disposition)
    if match:
        suffix = Path(match.group(1)).suffix.lower()
        if suffix:
            return suffix

    content_type = response.headers.get_content_type()
    guessed = mimetypes.guess_extension(content_type or "")
    if guessed:
        return ".jpg" if guessed == ".jpe" else guessed

    suffix = Path(urllib.parse.urlsplit(url).path).suffix.lower()
    return suffix or ".bin"


def download_asset(url: str, slug: str, index: int) -> str | None:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, context=SSL_CONTEXT, timeout=30) as response:
        extension = infer_extension(response, url)
        filename = f"{index:02d}{extension}"
        destination = ASSET_ROOT / slug / filename
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(response.read())
    return f"/legacy/blogger/{slug}/{filename}"


def clean_html_content(raw_html: str, slug: str) -> tuple[str, list[str], str | None]:
    soup = BeautifulSoup(raw_html, "html.parser")

    for node in soup.find_all(string=lambda value: isinstance(value, Comment)):
        node.extract()

    assets: list[str] = []
    cover_image: str | None = None
    img_index = 1

    for img in soup.find_all("img"):
        source = img.get("src")
        parent = img.parent if img.parent and img.parent.name == "a" else None
        parent_href = parent.get("href") if parent else None
        asset_url = parent_href if parent_href and "googleusercontent.com" in parent_href else source

        if not asset_url:
            img.decompose()
            continue

        try:
            local_path = download_asset(asset_url, slug, img_index)
        except Exception as exc:
            print(f"Failed to download Blogger image {asset_url}: {exc}")
            img.decompose()
            if parent and parent.get_text(strip=True) == "":
                parent.decompose()
            continue

        img_index += 1
        assets.append(local_path)
        if cover_image is None:
            cover_image = local_path

        img["src"] = local_path
        for attr in ["width", "height", "data-original-width", "data-original-height", "srcset"]:
            img.attrs.pop(attr, None)

        if parent and parent_href and "googleusercontent.com" in parent_href:
            parent.replace_with(img)

    for selector in ["script", "style"]:
        for node in soup.select(selector):
            node.decompose()

    for iframe in soup.find_all("iframe"):
        src = iframe.get("src", "").strip()
        if not src:
            iframe.decompose()
            continue
        replacement = soup.new_tag("p")
        link = soup.new_tag("a", href=src)
        link.string = "Watch video on YouTube" if "youtube.com" in src or "youtu.be" in src else src
        replacement.append(link)
        iframe.replace_with(replacement)

    for br in soup.find_all("br"):
        if br.parent and br.parent.name == "div" and br.parent.get_text(strip=True) == "":
            br.parent.decompose()

    rendered = str(soup)
    rendered = re.sub(r"<div><br\s*/?></div>", "", rendered)
    rendered = re.sub(r"<div>\s*</div>", "", rendered)
    return rendered, assets, cover_image


def guess_code_language(code: str) -> str:
    stripped = code.strip()
    if not stripped:
        return ""
    first_line = stripped.splitlines()[0].strip()
    if first_line.startswith("<?xml") or re.search(r"</?[A-Za-z][\w:-]*", stripped):
        return "xml"
    if first_line.startswith("git ") or first_line.startswith("./") or first_line.startswith("docker "):
        return "bash"
    if "@SpringBootApplication" in stripped or "public class " in stripped:
        return "java"
    if first_line.startswith("{") or first_line.startswith("["):
        return "json"
    if re.match(r"^[A-Za-z0-9_.-]+\s*=\s*.+$", first_line):
        return "properties"
    return ""


def annotate_code_fences(markdown: str) -> str:
    pattern = re.compile(r"```([^\n`]*)\n(.*?)```", re.DOTALL)

    def replace(match: re.Match[str]) -> str:
        language = match.group(1).strip()
        code = match.group(2)
        if language:
            return match.group(0)
        guessed = guess_code_language(code)
        return match.group(0) if not guessed else f"```{guessed}\n{code}```"

    return pattern.sub(replace, markdown)


def html_to_markdown(content_html: str) -> str:
    rendered = markdownify(
        content_html,
        heading_style="ATX",
        escape_asterisks=False,
        escape_underscores=False,
        strip=["style", "script"],
    ).strip()
    rendered = rendered.replace("\xa0", " ")
    rendered = re.sub(r"<(https?://[^>\s]+)>", r"\1", rendered)
    rendered = re.sub(r"\n{3,}", "\n\n", rendered)
    return annotate_code_fences(rendered)


def strip_markdown(markdown: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", markdown)
    text = re.sub(r"`[^`\n]+`", " ", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"^#+\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"[*_>#-]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def estimate_reading_time(markdown: str) -> int:
    words = len(strip_markdown(markdown).split())
    return max(1, round(max(words, 1) / 200))


def mask_segments(markdown: str) -> tuple[str, dict[str, str]]:
    placeholders: dict[str, str] = {}
    counter = 0

    def store(segment: str) -> str:
        nonlocal counter
        key = f"TOKEN{counter}"
        placeholders[key] = segment
        counter += 1
        return f"[[[{key}]]]"

    patterns = [
        re.compile(r"```[\s\S]*?```"),
        re.compile(r"`[^`\n]+`"),
        re.compile(r"https?://[^\s)>\]]+"),
        re.compile(r"/legacy/[^\s)>\]]+"),
        re.compile(r"/(?:fr|en)/blog/[^\s)>\]]+"),
    ]

    masked = markdown
    for pattern in patterns:
        masked = pattern.sub(lambda match: store(match.group(0)), masked)
    return masked, placeholders


def restore_segments(text: str, placeholders: dict[str, str]) -> str:
    def replace(match: re.Match[str]) -> str:
        return placeholders.get(match.group(1), match.group(0))

    return TOKEN_PATTERN.sub(replace, text)


def chunk_text(text: str, max_chars: int = 3800) -> list[str]:
    paragraphs = text.split("\n\n")
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for paragraph in paragraphs:
        part = paragraph.strip()
        if not part:
            continue
        addition = len(part) + (2 if current else 0)
        if current and current_len + addition > max_chars:
            chunks.append("\n\n".join(current))
            current = [part]
            current_len = len(part)
        else:
            current.append(part)
            current_len += addition

    if current:
        chunks.append("\n\n".join(current))

    return chunks or [text]


def translate_markdown(markdown: str, target_lang: str, source_lang: str) -> str:
    masked, placeholders = mask_segments(markdown)
    translated_chunks: list[str] = []

    for chunk in chunk_text(masked):
        translated, _ = google_translate(chunk, target_lang, source_lang)
        translated_chunks.append(translated)
        time.sleep(0.2)

    translated = "\n\n".join(translated_chunks)
    translated = restore_segments(translated, placeholders)
    translated = re.sub(r"\n{3,}", "\n\n", translated).strip()
    return translated


def rewrite_internal_links(markdown: str, locale: str, slug_map: dict[str, str]) -> str:
    def replace(match: re.Match[str]) -> str:
        href = match.group(2)
        slug = slug_map.get(href)
        if not slug:
            return match.group(0)
        return f"[{match.group(1)}](/{locale}/blog/{slug})"

    return re.sub(
        r"\[([^\]]+)\]\((https://rickenbazolo\.blogspot\.com/\d{4}/\d{2}/[^)\s]+\.html)\)",
        replace,
        markdown,
    )


def to_frontmatter(payload: PostPayload, locale: str, title: str, excerpt: str, content: str) -> str:
    frontmatter = {
        "title": title,
        "slug": payload.slug,
        "language": locale,
        "publishedAt": payload.published_at,
        "tags": payload.tags,
        "readingTime": estimate_reading_time(content),
        "excerpt": excerpt,
        "status": "published",
    }
    if payload.cover_image:
        frontmatter["coverImage"] = payload.cover_image

    def quote_string(value: str) -> str:
        return json.dumps(value, ensure_ascii=False)

    lines = ["---"]
    for key, value in frontmatter.items():
        if isinstance(value, list):
            lines.append(f"{key}: [{', '.join(quote_string(item) for item in value)}]")
        elif isinstance(value, int):
            lines.append(f"{key}: {value}")
        else:
            lines.append(f"{key}: {quote_string(value)}")
    lines.append("---")
    return "\n".join(lines) + "\n\n" + content.strip() + "\n"


def build_payload(entry: dict, used_slugs: set[str]) -> tuple[PostPayload, str]:
    title = html.unescape(entry["title"]["$t"]).strip()
    alternate_url = next(link["href"] for link in entry["link"] if link["rel"] == "alternate")
    tags = sorted({cat["term"].strip().lower() for cat in entry.get("category", []) if cat.get("term")})
    published_at = entry["published"]["$t"][:10]

    source_html, assets, cover_image = clean_html_content(entry["content"]["$t"], "tmp")
    source_markdown = html_to_markdown(source_html)
    plain_text = strip_markdown(source_markdown)

    if len(plain_text) < 40:
        page_html = fetch_page_post_html(alternate_url)
        if page_html.strip():
            source_html, assets, cover_image = clean_html_content(page_html, "tmp")
            source_markdown = html_to_markdown(source_html)
            plain_text = strip_markdown(source_markdown)

    excerpt = plain_text[:220].strip()
    source_lang = detect_language(title, excerpt, source_markdown)
    target_lang = "en" if source_lang == "fr" else "fr"

    base_slug = slugify(title)
    slug = make_unique_slug(base_slug, used_slugs)

    # Move downloaded tmp assets into the final slug folder if needed.
    if assets:
        tmp_dir = ASSET_ROOT / "tmp"
        final_dir = ASSET_ROOT / slug
        if tmp_dir.exists():
            final_dir.mkdir(parents=True, exist_ok=True)
            for asset in tmp_dir.iterdir():
                asset.rename(final_dir / asset.name)
            tmp_dir.rmdir()
            source_markdown = source_markdown.replace("/legacy/blogger/tmp/", f"/legacy/blogger/{slug}/")
            assets = [asset.replace("/legacy/blogger/tmp/", f"/legacy/blogger/{slug}/") for asset in assets]
            if cover_image:
                cover_image = cover_image.replace("/legacy/blogger/tmp/", f"/legacy/blogger/{slug}/")

    translated_title, _ = google_translate(title, target_lang, source_lang)
    translated_excerpt, _ = google_translate(excerpt, target_lang, source_lang)
    translated_markdown = translate_markdown(source_markdown, target_lang, source_lang)

    return (
        PostPayload(
            slug=slug,
            title=title,
            excerpt=excerpt,
            published_at=published_at,
            tags=tags,
            source_lang=source_lang,
            canonical=alternate_url,
            source_markdown=source_markdown,
            translated_title=translated_title.strip(),
            translated_excerpt=translated_excerpt.strip(),
            translated_markdown=translated_markdown,
            cover_image=cover_image,
            assets=assets,
        ),
        alternate_url,
    )


def write_post(payload: PostPayload):
    destination = BLOG_DIR / payload.slug
    destination.mkdir(parents=True, exist_ok=True)

    if payload.source_lang == "fr":
        fr_title = payload.title
        fr_excerpt = payload.excerpt
        fr_content = payload.source_markdown
        en_title = payload.translated_title
        en_excerpt = payload.translated_excerpt
        en_content = payload.translated_markdown
    else:
        en_title = payload.title
        en_excerpt = payload.excerpt
        en_content = payload.source_markdown
        fr_title = payload.translated_title
        fr_excerpt = payload.translated_excerpt
        fr_content = payload.translated_markdown

    (destination / "fr.mdx").write_text(
        to_frontmatter(payload, "fr", fr_title, fr_excerpt, fr_content),
        encoding="utf-8",
    )
    (destination / "en.mdx").write_text(
        to_frontmatter(payload, "en", en_title, en_excerpt, en_content),
        encoding="utf-8",
    )


def main():
    data = fetch_json(BLOGGER_FEED_URL)
    entries = data["feed"].get("entry", [])
    existing = {path.name for path in BLOG_DIR.iterdir() if path.is_dir()}
    used_slugs = set(existing)

    payloads: list[PostPayload] = []
    slug_map: dict[str, str] = {}

    for entry in entries:
        payload, alternate_url = build_payload(entry, used_slugs)
        payloads.append(payload)
        slug_map[alternate_url] = payload.slug

    for payload in payloads:
        payload.source_markdown = rewrite_internal_links(payload.source_markdown, "fr", slug_map)
        payload.translated_markdown = rewrite_internal_links(payload.translated_markdown, "en", slug_map)
        write_post(payload)

    report = {
        "source": BLOGGER_FEED_URL,
        "imported": [
            {
                "slug": payload.slug,
                "title": payload.title,
                "publishedAt": payload.published_at,
                "sourceLang": payload.source_lang,
                "canonical": payload.canonical,
                "assets": payload.assets,
            }
            for payload in payloads
        ],
    }
    REPORT_PATH.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Imported {len(payloads)} Blogger posts")


if __name__ == "__main__":
    main()
