from __future__ import annotations

import html
import json
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Tuple
from urllib.parse import quote, urlparse, urlunparse
from urllib.request import urlopen

from bs4 import BeautifulSoup
from googletrans import Translator
from markdownify import markdownify
import re

BLOG_DIR = Path("src/content/blog")
ASSET_ROOT = Path("public/legacy")
BLOG_DIR.mkdir(parents=True, exist_ok=True)
ASSET_ROOT.mkdir(parents=True, exist_ok=True)

SITEMAP_2022: List[Tuple[str, str]] = [
    ("2022-07-25", "https://autourducode.net/java/java-17-les-nouvelles-fonctionnalites-depuis-java-11/"),
    ("2022-07-25", "https://autourducode.net/java/java-8-stream-api-illegalstateexception-supplier/"),
    ("2022-07-25", "https://autourducode.net/java/java-comment-convertir-une-enumeration-en-stream/"),
    ("2022-07-25", "https://autourducode.net/java/java-streams-operations-terminales-avec-exemples/"),
    ("2022-07-25", "https://autourducode.net/java/jpa-hibernate-cle-primaire-composite/"),
    ("2022-07-25", "https://autourducode.net/java/la-difference-entre-jdk-jre-et-jvm/"),
    ("2022-07-25", "https://autourducode.net/non-classe/architecture-monolithique-ou-microservices/"),
    ("2022-07-25", "https://autourducode.net/spring/spring-security-websecurityconfigureradapter-deprecated/"),
    ("2022-07-26", "https://autourducode.net/java/spring-boot-security-api-rest-securisee/"),
    ("2022-07-31", "https://autourducode.net/java/difference-entre-equals-et-operateur-egalite/"),
    ("2022-09-08", "https://autourducode.net/cloud/kubernetes-introduction/"),
    ("2022-09-08", "https://autourducode.net/java/architecture-en-couches-springboot/"),
    ("2022-09-08", "https://autourducode.net/java/java-persistence-api-conversion-mappage-xml-hibernate-annotations-jpa/"),
    ("2022-09-08", "https://autourducode.net/java/jpa-eclipse-link-mappage-de-composants/"),
    ("2022-09-08", "https://autourducode.net/java/spring-vs-springboot-vs-springmvc/"),
    ("2022-10-15", "https://autourducode.net/java/spring-boot-approches-pour-tester-une-api-rest/"),
    ("2022-10-16", "https://autourducode.net/java/spring-webclient-client-web-non-bloquant-et-reactif/"),
    ("2022-11-12", "https://autourducode.net/java/jakarta-ee-10-comment-creer-une-api-rest/"),
]


@dataclass
class PostData:
    slug: str
    title: str
    published_at: str
    tags: List[str]
    excerpt: str
    content_html: str
    content_md: str = ""
    canonical: str = ""
    title_en: str = ""
    excerpt_en: str = ""
    assets: List[str] = field(default_factory=list)


def fetch_html(url: str) -> str:
    with urlopen(url) as response:
        return response.read().decode("utf-8")


def sanitize_filename(url: str) -> str:
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path) or "image"
    if "." not in filename:
        filename = f"{filename}.jpg"
    return filename


def download_images(content_html: str, slug: str, year: str) -> tuple[str, List[str]]:
    """Download images locally and rewrite their src to /legacy/<year>/<slug>/..."""
    soup = BeautifulSoup(content_html, "html.parser")
    dest_dir = ASSET_ROOT / year / slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    saved_paths: List[str] = []

    for img in soup.find_all("img"):
        src = img.get("src")
        if not src or src.startswith("data:"):
            continue

        parsed = urlparse(src)
        safe_path = quote(parsed.path)
        safe_src = urlunparse(parsed._replace(path=safe_path))

        filename = sanitize_filename(safe_src)
        dest_path = dest_dir / filename
        counter = 1
        while dest_path.exists():
            stem, ext = os.path.splitext(filename)
            dest_path = dest_dir / f"{stem}-{counter}{ext}"
            counter += 1

        try:
            with urlopen(safe_src) as resp:
                dest_path.write_bytes(resp.read())
            public_path = f"/legacy/{year}/{slug}/{dest_path.name}"
            img["src"] = public_path
            saved_paths.append(public_path)
        except Exception as exc:  # pragma: no cover
            print(f"Failed to download image {src}: {exc}")
            continue

    return str(soup), saved_paths


def html_to_markdown(content_html: str) -> str:
    md = markdownify(
        content_html,
        heading_style="ATX",
        escape_asterisks=False,
        escape_underscores=False,
        strip=["mark"],
    ).strip()
    # Convert autolink-style <https://...> to plain URLs to keep MDX happy
    md = re.sub(r"<(https?://[^>\\s]+)>", r"\\1", md)
    return md


def extract_post(html_content: str, published_at: str) -> PostData:
    soup = BeautifulSoup(html_content, "html.parser")

    title_el = soup.select_one(".page-heading h1")
    title = title_el.get_text(strip=True) if title_el else "Sans titre"

    post_root = soup.find("div", class_=lambda c: c and "single-blog-post" in c.split())

    tags: List[str] = []
    if post_root:
        for cls in post_root.get("class", []):
            if cls.startswith("category-"):
                tags.append(cls.removeprefix("category-"))
            if cls.startswith("tag-"):
                tags.append(cls.removeprefix("tag-"))
    tags = sorted(dict.fromkeys(tags))

    content_div = post_root.find("div", class_="post-content") if post_root else None
    if content_div:
        for selector in ("div.post-cat", "div.post-meta"):
            extra = content_div.select_one(selector)
            if extra:
                extra.decompose()
        content_html = content_div.decode_contents()
    else:
        content_html = ""

    excerpt = ""
    if content_div:
        first_p = content_div.find("p")
        if first_p:
            excerpt = " ".join(first_p.get_text(" ", strip=True).split())[:300]

    canonical = (
        soup.find("link", {"rel": "canonical"}).get("href").rstrip("/").split("/")[-1]
        if soup.find("link", {"rel": "canonical"})
        else "post"
    )
    slug = canonical

    return PostData(
        slug=slug,
        title=html.unescape(title),
        published_at=published_at,
        tags=tags,
        excerpt=excerpt,
        content_html=content_html,
        canonical=f"https://autourducode.net/{slug}/" if "autourducode.net" not in canonical else canonical,
    )


def estimate_reading_time(text: str) -> int:
    words = max(1, len(text.split()))
    return max(1, round(words / 200))


def write_mdx(post: PostData, locale: str, content: str):
    post_dir = BLOG_DIR / post.slug
    post_dir.mkdir(parents=True, exist_ok=True)

    frontmatter = {
        "title": post.title if locale == "fr" else post.title_en,
        "slug": post.slug,
        "language": locale,
        "publishedAt": post.published_at,
        "tags": post.tags,
        "readingTime": estimate_reading_time(content),
        "excerpt": post.excerpt if locale == "fr" else post.excerpt_en,
        "status": "published",
        "canonical": post.canonical,
    }

    def q(text) -> str:
        text_str = str(text)
        return '"' + text_str.replace('"', '\\"') + '"'

    fm_lines = ["---"]
    for key, value in frontmatter.items():
        if isinstance(value, list):
            fm_lines.append(f"{key}: [{', '.join(q(v) for v in value)}]")
        elif isinstance(value, int):
            fm_lines.append(f"{key}: {value}")
        else:
            fm_lines.append(f"{key}: {q(value)}")
    fm_lines.append("---")

    mdx_path = post_dir / f"{locale}.mdx"
    mdx_path.write_text("\n".join(fm_lines) + "\n\n" + content + "\n", encoding="utf-8")
    print(f"Wrote {mdx_path}")


def translate_text(translator: Translator, text: str) -> str:
    if not text.strip():
        return ""
    try:
        chunks = []
        current = []
        total = 0
        for paragraph in text.split("\n\n"):
            block = paragraph.strip()
            if not block:
                continue
            size = len(block)
            if total + size > 4500 and current:
                chunks.append("\n\n".join(current))
                current = [block]
                total = size
            else:
                current.append(block)
                total += size
        if current:
            chunks.append("\n\n".join(current))

        translated_parts = []
        for chunk in chunks or [text]:
            res = translator.translate(chunk, src="fr", dest="en")
            if isinstance(res, list):
                translated_parts.extend([item.text for item in res])
            else:
                translated_parts.append(res.text)

        return "\n\n".join(translated_parts)
    except Exception as exc:  # pragma: no cover - best effort
        print(f"Translation failed ({exc}); falling back to source")
        return text


def main():
    translator = Translator()
    summary = []

    for published_at, url in SITEMAP_2022:
        print(f"Fetching {url} ...")
        html_content = fetch_html(url)
        post = extract_post(html_content, published_at)
        post.canonical = url
        post.title_en = translate_text(translator, post.title)
        post.excerpt_en = translate_text(translator, post.excerpt)

        year = published_at.split("-")[0]
        localized_html, assets = download_images(post.content_html, post.slug, year)
        post.assets = assets
        post.content_md = html_to_markdown(localized_html)
        content_en = translate_text(translator, post.content_md)

        write_mdx(post, "fr", post.content_md)
        write_mdx(post, "en", content_en)

        summary.append({"slug": post.slug, "publishedAt": published_at, "url": url, "assets": assets})

    Path("reports").mkdir(exist_ok=True)
    Path("reports/imported-2022.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("Report written to reports/imported-2022.json")


if __name__ == "__main__":
    main()
