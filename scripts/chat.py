#!/usr/bin/env python3
"""One-shot chat against DeepSeek. Usage: python scripts/chat.py "hello" """

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from deepseek_client import DeepSeekError, chat  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="Send one prompt to DeepSeek.")
    parser.add_argument("prompt", help="the prompt to send")
    parser.add_argument("--system", default="You are a concise, helpful assistant.")
    parser.add_argument("--model", default=None, help="override DEEPSEEK_MODEL")
    parser.add_argument("--temperature", type=float, default=0.7)
    args = parser.parse_args()

    messages = [
        {"role": "system", "content": args.system},
        {"role": "user", "content": args.prompt},
    ]

    try:
        print(chat(messages, model=args.model, temperature=args.temperature))
    except DeepSeekError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
