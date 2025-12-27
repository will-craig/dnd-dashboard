import { test, expect } from '@playwright/test';

test('create session navigates to dashboard', async ({ page }) => {
  await page.route('**/api/session**', async (route) => {
    const request = route.request();

    if (request.method() === 'POST') {
      await route.fulfill({ status: 201, body: 'test-session' });
      return;
    }

    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-session',
          partyName: 'Test Party',
          players: [],
        }),
      });
      return;
    }

    await route.fulfill({ status: 404 });
  });

  await page.goto('/');
  await page.getByLabel('Party name').fill('Test Party');
  await page.getByLabel('Start session').click();

  await expect(page).toHaveURL(/\/session\/test-session$/);
  await expect(page.getByLabel('Party name')).toHaveValue('Test Party');
});
