# Deepseek-Repository

Publications Completions from the Deepseek Node

A Node.js project that connects to the [DeepSeek](https://www.deepseek.com/) API, receives AI-generated publications (completions), and stores them locally for later review.

---

## Features

- **DeepSeek API client** — sends prompts and receives publication responses via the OpenAI-compatible DeepSeek API.
- **Publications store** — persists every received publication to `data/publications.json` with a timestamp and the original prompt.
- **CLI entry point** — run a prompt from the command line and see the publication printed to the terminal.

---

## Requirements

- Node.js 18 or later
- A [DeepSeek API key](https://platform.deepseek.com/)

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/Darrylebrown/Deepseek-Repository.git
cd Deepseek-Repository

# 2. Install dependencies
npm install

# 3. Configure your API key
cp .env.example .env
# Then edit .env and set DEEPSEEK_API_KEY=<your_key>
```

---

## Usage

```bash
# Send a prompt and receive a publication
node src/index.js "Explain the transformer architecture in simple terms."

# Use the default demo prompt
node src/index.js
```

Publications are printed to the terminal and automatically saved to `data/publications.json`.

---

## Project structure

```
.
├── src/
│   ├── index.js              # CLI entry point
│   ├── deepseekClient.js     # DeepSeek API client
│   └── publicationsStore.js  # JSON-based publication storage
├── tests/
│   ├── deepseekClient.test.js
│   └── publicationsStore.test.js
├── data/                     # Created at runtime (git-ignored)
│   └── publications.json
├── .env.example              # Environment variable template
└── package.json
```

---

## Running tests

```bash
npm test
```

---

## Environment variables

| Variable          | Required | Default        | Description                      |
|-------------------|----------|----------------|----------------------------------|
| `DEEPSEEK_API_KEY`| ✅ Yes   | —              | Your DeepSeek platform API key   |
| `DEEPSEEK_MODEL`  | No       | `deepseek-chat`| Model to use for completions     |
