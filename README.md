**HARD LOCKS:** [`HARD_LOCKS.md`](HARD_LOCKS.md)

**D2D always OFF:**
- ❌ Barnes & Noble / Nook
- ❌ Bookshop.org
- ❌ Select All

# Deepseek-Repository

Publications completions from the DeepSeek node — shared drop zone for **Computer** (Perplexity) and **Deep/Claw** agents.

Publisher: [Gullah Geechee Biz](https://gullahgeecheebiz.com/) · Author: Darryl Elliott Brown

## Connection to Computer

1. Deep/Claw produces packs and pushes them here under `data/`.
2. Computer brand-gates (culture first, soft CTA site only, no Manus links in shippable copy).
3. Computer builds EPUB/cover + KDP paste and logs the distributor queue.
4. Slack READY notices: `#all-gullah-geechee-biz` — reply `READY` + paths or `ASIN: B0… · Title`.

### Drop zones

| Path | Use |
| --- | --- |
| `data/packs/` | KDP/D2D submission packets |
| `data/volumes/` | Volume / encyclopedia descriptions |
| `data/social/` | Social calendars and captions |
| `data/publications.json` | Runtime Node store (gitignored) |

See [`data/README.md`](data/README.md) and [`data/INBOX.md`](data/INBOX.md).

## Get an API key

Create a key at [platform.deepseek.com](https://platform.deepseek.com).  
Add GitHub Actions secret: **Settings → Secrets → Actions → `DEEPSEEK_API_KEY`**.

```bash
cp .env.example .env   # never commit .env
```

## Python path (Computer / local scripts)

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/chat.py "hello"
python scripts/ggb_pack_draft.py --topic "sweetgrass basket weaving"
```

## Node path (Deep/Copilot publications client)

```bash
npm install
node src/index.js "Explain transformers in simple terms."
npm test
```

Completions print to the terminal and append to `data/publications.json`.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | *(required)* | API key |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | OpenAI-compatible base |
| `DEEPSEEK_MODEL` | `deepseek-chat` | Model name |
| `DEEPSEEK_TIMEOUT` | `120` | Seconds (Python client) |

Ollama / RunPod: set `DEEPSEEK_BASE_URL` + `DEEPSEEK_MODEL` to your OpenAI-compatible endpoint.

## Layout

```
src/deepseek_client.py      Python chat helper
src/deepseekClient.js       Node DeepSeek client
src/publicationsStore.js    Node JSON store → data/publications.json
src/index.js                Node CLI
scripts/chat.py             Python smoke chat
scripts/ggb_pack_draft.py   GGB culture pack drafter
data/packs|volumes|social   Team drop zones
.github/workflows/          DeepSeek smoke test
tests/                      Jest unit tests
```

## Brand gate (shippable copy)

- Author: Darryl Elliott Brown  
- Publisher: Gullah Geechee Biz  
- CTA: https://gullahgeecheebiz.com/  
- Culture first · no Manus links · no mock dialect · no celebrity name-drops  
