/* eslint-disable no-console */
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function expectStatus(path, expectedStatus) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${expectedStatus} for ${path}, got ${response.status}`);
  }
  return response;
}

async function main() {
  console.log(`Running API contract checks against ${BASE_URL}`);

  const listResponse = await expectStatus('/api/albums', 200);
  const albums = await listResponse.json();

  if (!Array.isArray(albums)) {
    throw new Error('GET /api/albums did not return an array');
  }

  const malformedResponse = await expectStatus('/api/albums/abc', 400);
  const malformedBody = await malformedResponse.json();
  if (malformedBody?.message !== 'Invalid album id format') {
    throw new Error(`Unexpected malformed id message: ${JSON.stringify(malformedBody)}`);
  }

  const notFoundResponse = await expectStatus('/api/albums/507f1f77bcf86cd799439011', 404);
  const notFoundBody = await notFoundResponse.json();
  if (notFoundBody?.message !== 'Album not found') {
    throw new Error(`Unexpected not found message: ${JSON.stringify(notFoundBody)}`);
  }

  console.log(`All API contract checks passed. Album count: ${albums.length}`);
}

main().catch((error) => {
  console.error('API contract checks failed:', error.message);
  process.exit(1);
});
