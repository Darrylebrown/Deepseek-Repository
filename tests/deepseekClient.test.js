import { DeepSeekClient } from '../src/deepseekClient.js';

describe('DeepSeekClient', () => {
  test('throws when no API key is provided', () => {
    expect(() => new DeepSeekClient('')).toThrow('DeepSeek API key is required');
    expect(() => new DeepSeekClient(null)).toThrow('DeepSeek API key is required');
    expect(() => new DeepSeekClient(undefined)).toThrow('DeepSeek API key is required');
  });

  test('uses the default model when none is specified', () => {
    const client = new DeepSeekClient('test-key');
    expect(client.model).toBe('deepseek-chat');
  });

  test('uses a custom model when provided', () => {
    const client = new DeepSeekClient('test-key', 'deepseek-reasoner');
    expect(client.model).toBe('deepseek-reasoner');
  });

  test('stores the API key on the instance', () => {
    const client = new DeepSeekClient('my-api-key');
    expect(client.apiKey).toBe('my-api-key');
  });

  test('fetchPublication throws on non-ok HTTP response', async () => {
    const mockFetch = async () => ({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    const client = new DeepSeekClient('test-key', 'deepseek-chat', mockFetch);

    await expect(client.fetchPublication('hello')).rejects.toThrow(
      'DeepSeek API error 401'
    );
  });

  test('fetchPublication throws when API returns no choices', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({
        id: 'x',
        model: 'deepseek-chat',
        created: 0,
        choices: [],
        usage: {},
      }),
    });

    const client = new DeepSeekClient('test-key', 'deepseek-chat', mockFetch);

    await expect(client.fetchPublication('hello')).rejects.toThrow(
      'No choices returned'
    );
  });

  test('fetchPublication returns a structured publication object', async () => {
    const mockFetch = async () => ({
      ok: true,
      json: async () => ({
        id: 'chatcmpl-abc',
        model: 'deepseek-chat',
        created: 1700000000,
        choices: [{ message: { content: 'Hello world' } }],
        usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 },
      }),
    });

    const client = new DeepSeekClient('test-key', 'deepseek-chat', mockFetch);
    const result = await client.fetchPublication('Say hello');

    expect(result).toEqual({
      id: 'chatcmpl-abc',
      content: 'Hello world',
      model: 'deepseek-chat',
      created: 1700000000,
      usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 },
    });
  });

  test('fetchPublication forwards custom opts (model, maxTokens, temperature)', async () => {
    let capturedBody;
    const mockFetch = async (_url, init) => {
      capturedBody = JSON.parse(init.body);
      return {
        ok: true,
        json: async () => ({
          id: 'x',
          model: 'deepseek-reasoner',
          created: 0,
          choices: [{ message: { content: 'ok' } }],
          usage: {},
        }),
      };
    };

    const client = new DeepSeekClient('test-key', 'deepseek-chat', mockFetch);
    await client.fetchPublication('prompt', {
      model: 'deepseek-reasoner',
      maxTokens: 512,
      temperature: 0.3,
    });

    expect(capturedBody.model).toBe('deepseek-reasoner');
    expect(capturedBody.max_tokens).toBe(512);
    expect(capturedBody.temperature).toBe(0.3);
  });
});
