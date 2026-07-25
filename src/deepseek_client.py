"""Minimal OpenAI-compatible client for DeepSeek (or any compatible endpoint)."""

import os

import httpx
from dotenv import load_dotenv

load_dotenv()

DEFAULT_BASE_URL = "https://api.deepseek.com"
DEFAULT_MODEL = "deepseek-chat"
DEFAULT_TIMEOUT = 120.0


class DeepSeekError(RuntimeError):
    pass


def _base_url() -> str:
    url = (os.getenv("DEEPSEEK_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")
    if url.endswith("/v1"):
        url = url[: -len("/v1")]
    return url


def _timeout() -> float:
    raw = os.getenv("DEEPSEEK_TIMEOUT")
    if not raw:
        return DEFAULT_TIMEOUT
    try:
        return float(raw)
    except ValueError:
        raise DeepSeekError(f"DEEPSEEK_TIMEOUT must be a number, got {raw!r}")


def _api_key() -> str:
    key = os.getenv("DEEPSEEK_API_KEY")
    if not key or not key.strip():
        raise DeepSeekError(
            "DEEPSEEK_API_KEY is not set.\n"
            "  Local:  copy .env.example to .env and fill in your key from "
            "https://platform.deepseek.com\n"
            "  CI:     add a repository secret named DEEPSEEK_API_KEY "
            "(Settings -> Secrets and variables -> Actions)"
        )
    return key.strip()


def chat(messages, model=None, temperature=0.7) -> str:
    """Send a chat completion request and return the assistant's message content."""
    payload = {
        "model": model or os.getenv("DEEPSEEK_MODEL") or DEFAULT_MODEL,
        "messages": messages,
        "temperature": temperature,
        "stream": False,
    }
    headers = {
        "Authorization": f"Bearer {_api_key()}",
        "Content-Type": "application/json",
    }
    url = f"{_base_url()}/v1/chat/completions"

    try:
        response = httpx.post(url, json=payload, headers=headers, timeout=_timeout())
    except httpx.HTTPError as exc:
        raise DeepSeekError(f"Could not reach {url}: {exc}") from exc

    if response.status_code == 401:
        raise DeepSeekError("DeepSeek rejected the API key (401). Check DEEPSEEK_API_KEY.")
    if response.status_code >= 400:
        raise DeepSeekError(
            f"DeepSeek returned HTTP {response.status_code} from {url}: {response.text[:500]}"
        )

    try:
        return response.json()["choices"][0]["message"]["content"]
    except (KeyError, IndexError, ValueError) as exc:
        raise DeepSeekError(f"Unexpected response shape: {response.text[:500]}") from exc
