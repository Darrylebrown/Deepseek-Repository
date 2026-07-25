# Deepseek-Repository

Publications Compliments from the Deepseek Node

A small, public-safe starter for calling DeepSeek from local scripts and GitHub Actions.
No API keys live in this repository — they are supplied by a local `.env` file or a
GitHub Actions secret.

Publisher: [Gullah Geechee Biz](https://gullahgeecheebiz.com/) · Author: Darryl Elliott Brown

## 1. Get an API key

Create a key at [platform.deepseek.com](https://platform.deepseek.com).

## 2. Local setup

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env               # then open .env and paste your key
```

`.env` is listed in `.gitignore`. **Never commit `.env` or paste a key into any tracked file.**

## 3. GitHub setup

In this repository: **Settings → Secrets and variables → Actions → New repository secret**

- Name: `DEEPSEEK_API_KEY`
- Value: your key from platform.deepseek.com

Then run the smoke test: **Actions → DeepSeek smoke test → Run workflow**. It prints
`DEEPSEEK_OK` on success and fails with a clear error if the secret is missing.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | *(required)* | Your API key. |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | Any OpenAI-compatible endpoint. |
| `DEEPSEEK_MODEL` | `deepseek-chat` | Model name. |
| `DEEPSEEK_TIMEOUT` | `120` | Request timeout in seconds. |

Because the client speaks the OpenAI-compatible `/v1/chat/completions` API, you can point it
at a self-hosted runtime instead:

```bash
# Ollama
DEEPSEEK_BASE_URL=http://localhost:11434
DEEPSEEK_MODEL=deepseek-r1
DEEPSEEK_API_KEY=ollama          # any non-empty value

# RunPod (vLLM / TGI OpenAI-compatible endpoint)
DEEPSEEK_BASE_URL=https://<your-pod-id>-8000.proxy.runpod.net
DEEPSEEK_MODEL=deepseek-ai/DeepSeek-V3
DEEPSEEK_API_KEY=<your-runpod-endpoint-token>
```

In Actions, `DEEPSEEK_BASE_URL` and `DEEPSEEK_MODEL` are read from repository *variables*
(**Settings → Secrets and variables → Actions → Variables**), so overriding them never
requires touching the workflow file.

## Usage

One-shot chat, useful as a smoke test:

```bash
python scripts/chat.py "hello"
python scripts/chat.py "summarize this in one line" --model deepseek-reasoner
```

Draft a Gullah Geechee Biz culture pack:

```bash
python scripts/ggb_pack_draft.py --topic "sweetgrass basket weaving in the Lowcountry"
```

This writes `out/<slug>.json` and `out/<slug>.md`. The `out/` directory is gitignored, and
every pack is a **draft that needs human review** before publication.

## Drop zone

Finished agent output goes in [`data/`](data/), where the team picks it up for KDP and
social packaging — `data/volumes/` for manuscripts, `data/social/` for calendars,
`data/packs/` for culture packs. The `out/` directory stays local and gitignored.

[`data/README.md`](data/README.md) covers naming and the brand rules every drop is held to.
[`data/INBOX.md`](data/INBOX.md) is the checklist for what happens to a drop once it is
marked ready.

## Layout

```
src/deepseek_client.py       chat() helper over the OpenAI-compatible API
scripts/chat.py              one-shot CLI chat
scripts/ggb_pack_draft.py    culture pack drafter
data/                        drop zone for agent output (volumes, social, packs)
.github/workflows/           DeepSeek smoke test (manual trigger)
```
