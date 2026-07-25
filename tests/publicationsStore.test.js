import { PublicationsStore } from '../src/publicationsStore.js';
import { readFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const TEST_STORE_PATH = join('data', 'test_publications.json');

describe('PublicationsStore', () => {
  afterEach(async () => {
    if (existsSync(TEST_STORE_PATH)) {
      await rm(TEST_STORE_PATH);
    }
  });

  test('load returns an empty array when the store file does not exist', async () => {
    const store = new PublicationsStore(TEST_STORE_PATH);
    const entries = await store.load();
    expect(entries).toEqual([]);
  });

  test('count returns 0 for an empty store', async () => {
    const store = new PublicationsStore(TEST_STORE_PATH);
    expect(await store.count()).toBe(0);
  });

  test('save persists a publication and returns the entry', async () => {
    const store = new PublicationsStore(TEST_STORE_PATH);

    const publication = {
      id: 'pub-1',
      content: 'Test content',
      model: 'deepseek-chat',
      created: 1700000000,
      usage: {},
    };

    const entry = await store.save('Test prompt', publication);

    expect(entry.prompt).toBe('Test prompt');
    expect(entry.content).toBe('Test content');
    expect(entry.id).toBe('pub-1');
    expect(entry.receivedAt).toBeDefined();
  });

  test('save writes valid JSON to disk', async () => {
    const store = new PublicationsStore(TEST_STORE_PATH);

    await store.save('prompt', {
      id: 'p1',
      content: 'hello',
      model: 'deepseek-chat',
      created: 0,
      usage: {},
    });

    const raw = await readFile(TEST_STORE_PATH, 'utf8');
    const data = JSON.parse(raw);

    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(1);
    expect(data[0].content).toBe('hello');
  });

  test('save accumulates multiple publications', async () => {
    const store = new PublicationsStore(TEST_STORE_PATH);

    for (let i = 1; i <= 3; i++) {
      await store.save(`prompt ${i}`, {
        id: `p${i}`,
        content: `content ${i}`,
        model: 'deepseek-chat',
        created: i,
        usage: {},
      });
    }

    expect(await store.count()).toBe(3);
    const entries = await store.load();
    expect(entries[0].id).toBe('p1');
    expect(entries[2].id).toBe('p3');
  });

  test('receivedAt is an ISO 8601 timestamp', async () => {
    const store = new PublicationsStore(TEST_STORE_PATH);

    const entry = await store.save('prompt', {
      id: 'px',
      content: 'text',
      model: 'deepseek-chat',
      created: 0,
      usage: {},
    });

    expect(() => new Date(entry.receivedAt)).not.toThrow();
    expect(new Date(entry.receivedAt).toISOString()).toBe(entry.receivedAt);
  });
});
