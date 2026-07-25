#!/usr/bin/env python3
"""Draft a short Gullah Geechee Biz culture pack with DeepSeek.

Usage: python scripts/ggb_pack_draft.py --topic "sweetgrass basket weaving"

Writes out/<slug>.json and out/<slug>.md. Output is a draft for human review.
"""

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from deepseek_client import DeepSeekError, chat  # noqa: E402

AUTHOR = "Darryl Elliott Brown"
PUBLISHER = "Gullah Geechee Biz"
SITE = "https://gullahgeecheebiz.com/"
OUT_DIR = Path(__file__).resolve().parents[1] / "out"

SYSTEM_PROMPT = f"""You draft culture packs for {PUBLISHER}, published by {AUTHOR}.

Voice and standards:
- Culture first. Lead with heritage, craft, place, and community; commerce stays secondary.
- Write in clear, dignified standard English. Never imitate or phonetically spell Gullah
  Geechee dialect, and never put invented quotes in anyone's mouth.
- Respect living traditions and the Gullah Geechee Cultural Heritage Corridor. Where a
  detail is uncertain, say it is uncertain rather than inventing specifics.
- No celebrity or public-figure name-drops. No invented statistics, dates, or citations.
- One soft call to action at most, and it points only to {SITE}.
- No mention of any tooling, platform, or vendor used to produce the draft.

Return only a JSON object, no prose and no code fences, with these keys:
  title            string, under 70 characters
  summary          string, 2-3 sentences
  cultural_context string, one paragraph on heritage and place
  sections         array of 3-5 objects, each {{"heading": string, "body": string}}
  key_terms        array of 3-6 objects, each {{"term": string, "meaning": string}}
  respect_notes    array of 2-4 strings on handling this topic responsibly
  call_to_action   string, one soft sentence referencing {SITE}
"""


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug[:60] or "culture-pack"


def parse_pack(raw: str) -> dict:
    text = raw.strip()
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n", "", text)
        text = re.sub(r"\n```\s*$", "", text)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise DeepSeekError(f"Model did not return JSON:\n{raw[:500]}")
    return json.loads(text[start : end + 1])


def to_markdown(pack: dict) -> str:
    lines = [
        f"# {pack.get('title', 'Culture Pack')}",
        "",
        f"*Author: {AUTHOR} · Publisher: {PUBLISHER} · Drafted {date.today().isoformat()}*",
        "",
        "> Draft for human review before publication.",
        "",
        "## Summary",
        "",
        pack.get("summary", ""),
        "",
        "## Cultural Context",
        "",
        pack.get("cultural_context", ""),
        "",
    ]

    for section in pack.get("sections", []):
        lines += [f"## {section.get('heading', '')}", "", section.get("body", ""), ""]

    key_terms = pack.get("key_terms", [])
    if key_terms:
        lines += ["## Key Terms", ""]
        lines += [f"- **{t.get('term', '')}** — {t.get('meaning', '')}" for t in key_terms]
        lines += [""]

    respect_notes = pack.get("respect_notes", [])
    if respect_notes:
        lines += ["## Respect Notes", ""]
        lines += [f"- {note}" for note in respect_notes]
        lines += [""]

    if pack.get("call_to_action"):
        lines += ["## More", "", pack["call_to_action"], ""]

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Draft a GGB culture pack.")
    parser.add_argument("--topic", required=True, help="subject of the culture pack")
    parser.add_argument("--model", default=None, help="override DEEPSEEK_MODEL")
    parser.add_argument("--temperature", type=float, default=0.6)
    parser.add_argument("--name", default=None, help="output filename stem")
    args = parser.parse_args()

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Draft a short culture pack on: {args.topic}"},
    ]

    try:
        pack = parse_pack(chat(messages, model=args.model, temperature=args.temperature))
    except (DeepSeekError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    pack["meta"] = {
        "topic": args.topic,
        "author": AUTHOR,
        "publisher": PUBLISHER,
        "site": SITE,
        "drafted": date.today().isoformat(),
        "status": "draft - needs human review",
    }

    stem = slugify(args.name or args.topic)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    json_path = OUT_DIR / f"{stem}.json"
    md_path = OUT_DIR / f"{stem}.md"
    json_path.write_text(json.dumps(pack, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    md_path.write_text(to_markdown(pack), encoding="utf-8")

    print(f"wrote {json_path}")
    print(f"wrote {md_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
