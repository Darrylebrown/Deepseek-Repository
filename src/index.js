import 'dotenv/config';
import { DeepSeekClient } from './deepseekClient.js';
import { PublicationsStore } from './publicationsStore.js';

/**
 * Main entry point.
 *
 * Usage:
 *   DEEPSEEK_API_KEY=<key> node src/index.js "Your prompt here"
 *   node src/index.js  # uses the default demo prompt
 */
async function main() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  const prompt = process.argv[2] || 'Summarize the latest advances in large language models.';

  const client = new DeepSeekClient(apiKey, model);
  const store = new PublicationsStore();

  console.log('Sending prompt to DeepSeek...');
  console.log(`Prompt: "${prompt}"\n`);

  const publication = await client.fetchPublication(prompt);

  console.log('--- Publication received ---');
  console.log(publication.content);
  console.log('---------------------------\n');

  const entry = await store.save(prompt, publication);
  const total = await store.count();

  console.log(`Publication saved. Total publications stored: ${total}`);
  console.log(`Stored at: ${entry.receivedAt}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
