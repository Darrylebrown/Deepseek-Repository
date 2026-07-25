import fetch from 'node-fetch';

const DEEPSEEK_API_BASE = 'https://api.deepseek.com/v1';

/**
 * DeepSeek API client — sends requests and returns the model's reply.
 */
export class DeepSeekClient {
  /**
   * @param {string}   apiKey    - DeepSeek API key (DEEPSEEK_API_KEY env var)
   * @param {string}  [model]    - Model identifier (default: deepseek-chat)
   * @param {Function}[fetchFn]  - HTTP fetch implementation (injectable for tests)
   */
  constructor(apiKey, model = 'deepseek-chat', fetchFn = fetch) {
    if (!apiKey) {
      throw new Error(
        'DeepSeek API key is required. Set DEEPSEEK_API_KEY in your .env file.'
      );
    }
    this.apiKey = apiKey;
    this.model = model;
    this._fetch = fetchFn;
  }

  /**
   * Send a prompt and receive a publication (completion) from DeepSeek.
   *
   * @param {string} prompt  - The user's prompt / query
   * @param {object} [opts]  - Optional overrides: { model, maxTokens, temperature }
   * @returns {Promise<{id: string, content: string, model: string, created: number, usage: object}>}
   */
  async fetchPublication(prompt, opts = {}) {
    const body = {
      model: opts.model ?? this.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.7,
    };

    const authHeader = 'Bearer ' + this.apiKey;

    const response = await this._fetch(`${DEEPSEEK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice) {
      throw new Error('No choices returned from DeepSeek API');
    }

    return {
      id: data.id,
      content: choice.message.content,
      model: data.model,
      created: data.created,
      usage: data.usage,
    };
  }
}
