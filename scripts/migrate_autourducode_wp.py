from __future__ import annotations

import html
import json
import re
import ssl
import subprocess
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from bs4 import BeautifulSoup, Comment
from markdownify import markdownify

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "src" / "content" / "blog"
REPORT_PATH = ROOT / "reports" / "imported-autourducode-2026.json"
WP_POSTS_URL = "https://autourducode.net/wp-json/wp/v2/posts?per_page=100&_embed&page=1"
SSL_CONTEXT = ssl._create_unverified_context()
GENERIC_TAGS = {"non-classe", "uncategorized"}
TOKEN_PATTERN = re.compile(r"\[\[\[(TOKEN\d+)\]\]\]")


@dataclass
class PostPayload:
    slug: str
    title: str
    excerpt: str
    published_at: str
    canonical: str
    tags: list[str]
    source_lang: str
    source_markdown: str
    translated_title: str
    translated_excerpt: str
    translated_markdown: str


def fetch_json(url: str):
    raw = subprocess.check_output(
        [
            "curl",
            "-Lks",
            url,
        ],
        text=True,
    )
    return json.loads(raw)


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


def clean_html_content(raw_html: str) -> str:
    soup = BeautifulSoup(raw_html, "html.parser")

    for node in soup.find_all(string=lambda value: isinstance(value, Comment)):
        node.extract()

    for selector in [
        "div.wp-block-spacer",
        "script",
        "style",
        "figure.wp-block-embed",
        "div.sharedaddy",
    ]:
        for node in soup.select(selector):
            node.decompose()

    return str(soup)


def guess_code_language(code: str) -> str:
    stripped = code.strip()
    if not stripped:
        return ""

    first_line = stripped.splitlines()[0].strip()
    if first_line.startswith("<?xml") or re.search(r"</?[A-Za-z][\w:-]*", stripped):
        return "xml"
    if first_line.startswith("FROM ") or first_line.startswith("RUN "):
        return "dockerfile"
    if (
        "@Configuration" in stripped
        or "@SpringBootApplication" in stripped
        or "public class " in stripped
        or "System.out.println" in stripped
    ):
        return "java"
    if first_line.startswith("git ") or first_line.startswith("./") or first_line.startswith("curl "):
        return "bash"
    if re.match(r"^[A-Za-z0-9_.-]+\s*=\s*.+$", first_line):
        return "properties"
    if first_line.startswith("{") or first_line.startswith("["):
        return "json"
    return ""


def annotate_code_fences(markdown: str) -> str:
    fence_pattern = re.compile(r"```([^\n`]*)\n(.*?)```", re.DOTALL)

    def replace(match: re.Match[str]) -> str:
        language = match.group(1).strip()
        code = match.group(2)
        if language:
            return match.group(0)
        guessed = guess_code_language(code)
        if not guessed:
            return match.group(0)
        return f"```{guessed}\n{code}```"

    return fence_pattern.sub(replace, markdown)


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


def extract_terms(post: dict) -> list[str]:
    terms = []
    for group in post.get("_embedded", {}).get("wp:term", []):
        for term in group:
            slug = term.get("slug")
            taxonomy = term.get("taxonomy")
            if taxonomy not in {"category", "post_tag"} or not slug:
                continue
            if slug in GENERIC_TAGS:
                continue
            terms.append(slug)
    return sorted(dict.fromkeys(terms))


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
    ]

    masked = markdown
    for pattern in patterns:
        masked = pattern.sub(lambda match: store(match.group(0)), masked)
    return masked, placeholders


def restore_segments(text: str, placeholders: dict[str, str]) -> str:
    def replace(match: re.Match[str]) -> str:
        key = match.group(1)
        return placeholders.get(key, match.group(0))

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


def decode_rendered_text(rendered_html: str) -> str:
    return BeautifulSoup(rendered_html, "html.parser").get_text(" ", strip=True)


def build_payload(post: dict) -> PostPayload:
    title = html.unescape(post["title"]["rendered"]).strip()
    excerpt = decode_rendered_text(post["excerpt"]["rendered"])
    content_html = clean_html_content(post["content"]["rendered"])
    source_markdown = html_to_markdown(content_html)
    source_lang = detect_language(title, excerpt, source_markdown)
    target_lang = "en" if source_lang == "fr" else "fr"

    translated_title, _ = google_translate(title, target_lang, source_lang)
    translated_excerpt, _ = google_translate(excerpt, target_lang, source_lang)
    translated_markdown = translate_markdown(source_markdown, target_lang, source_lang)

    return PostPayload(
        slug=post["slug"],
        title=title,
        excerpt=excerpt,
        published_at=post["date"][:10],
        canonical=post["link"],
        tags=extract_terms(post),
        source_lang=source_lang,
        source_markdown=source_markdown,
        translated_title=translated_title.strip(),
        translated_excerpt=translated_excerpt.strip(),
        translated_markdown=translated_markdown,
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
        "canonical": payload.canonical,
    }

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


def write_post(payload: PostPayload):
    destination = BLOG_DIR / payload.slug
    destination.mkdir(parents=True, exist_ok=True)

    if payload.source_lang == "fr":
        fr_content = payload.source_markdown
        en_content = payload.translated_markdown
        fr_title = payload.title
        en_title = payload.translated_title
        fr_excerpt = payload.excerpt
        en_excerpt = payload.translated_excerpt
    else:
        en_content = payload.source_markdown
        fr_content = payload.translated_markdown
        en_title = payload.title
        fr_title = payload.translated_title
        en_excerpt = payload.excerpt
        fr_excerpt = payload.translated_excerpt

    (destination / "fr.mdx").write_text(
        to_frontmatter(payload, "fr", fr_title, fr_excerpt, fr_content),
        encoding="utf-8",
    )
    (destination / "en.mdx").write_text(
        to_frontmatter(payload, "en", en_title, en_excerpt, en_content),
        encoding="utf-8",
    )


def existing_slugs() -> set[str]:
    return {path.name for path in BLOG_DIR.iterdir() if path.is_dir()}


def select_missing(posts: Iterable[dict]) -> list[dict]:
    known = existing_slugs()
    return [post for post in posts if post["slug"] not in known]


def main():
    posts = fetch_json(WP_POSTS_URL)
    missing_posts = select_missing(posts)
    imported_report = []

    for index, post in enumerate(missing_posts, start=1):
        print(f"[{index}/{len(missing_posts)}] Importing {post['slug']} ...")
        payload = build_payload(post)
        write_post(payload)
        imported_report.append(
            {
                "slug": payload.slug,
                "publishedAt": payload.published_at,
                "canonical": payload.canonical,
                "sourceLanguage": payload.source_lang,
                "tags": payload.tags,
            }
        )
        time.sleep(0.3)

    REPORT_PATH.write_text(json.dumps(imported_report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(imported_report)} posts")


if __name__ == "__main__":
    main()
