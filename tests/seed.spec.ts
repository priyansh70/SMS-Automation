import { test } from '@playwright/test';

test('seed: verify test environment is reachable', async ({ request }) => {
  const response = await request.get('https://smsplusextensionapp.evdpl.com/');
  // Just assert the app responds with a 2xx status
  if (!response.ok()) {
    throw new Error(
      `Seed check failed — app responded with status ${response.status()}`
    );
  }
  console.log('✅ Seed check passed — app is reachable');
});