import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Persists received DeepSeek publications to a local JSON file.
 */
export class PublicationsStore {
  /**
   * @param {string} [storePath] - Path to the JSON storage file
   */
  constructor(storePath = join('data', 'publications.json')) {
    this.storePath = storePath;
  }

  /**
   * Load all stored publications.
   * @returns {Promise<Array>}
   */
  async load() {
    if (!existsSync(this.storePath)) {
      return [];
    }
    const raw = await readFile(this.storePath, 'utf8');
    return JSON.parse(raw);
  }

  /**
   * Save a publication received from DeepSeek.
   *
   * @param {string} prompt         - The original prompt that produced the publication
   * @param {object} publication    - The publication object returned by DeepSeekClient
   * @returns {Promise<object>}     - The saved entry (with receivedAt timestamp)
   */
  async save(prompt, publication) {
    const entries = await this.load();

    const entry = {
      receivedAt: new Date().toISOString(),
      prompt,
      ...publication,
    };

    entries.push(entry);

    await mkdir(this._dirOf(this.storePath), { recursive: true });
    await writeFile(this.storePath, JSON.stringify(entries, null, 2), 'utf8');

    return entry;
  }

  /**
   * Return the number of stored publications.
   * @returns {Promise<number>}
   */
  async count() {
    const entries = await this.load();
    return entries.length;
  }

  /** @private */
  _dirOf(filePath) {
    const parts = filePath.split(/[/\\]/);
    parts.pop();
    return parts.join('/') || '.';
  }
}
