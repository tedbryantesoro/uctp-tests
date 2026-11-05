// file: tests/integration/trn01_register_taxpayer.spec.ts
import { test, expect, signIn } from '../../helpers/web';

function makeRandomLetters(len: number = 4): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function makeName(): string {
  return `Ana ${makeRandomLetters(4)} Dela Cruz`;
}

function makeMobile(): string {
  const suffix = String(Date.now() + Math.floor(Math.random() * 1000)).slice(-9);
  return `09${suffix}`;
}

const defaultHeaders = {
  'X-Tenant-ID': 'TAGAYTAY',
  'X-User-ID': 'ted-1234',
  'Content-Type': 'application/json',
};

test.describe('TRN-01 Integration tests', () => {

  test('I1 · AC-2 · POST taxpayer via API and check My data › My taxpayers', async ({ page, request }) => {
    const fullName = makeName();
    const mobile = makeMobile();
    const apiResponse = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: fullName, mobile }
    });
    expect(apiResponse.status()).toBe(201);

    await signIn(page, 'ted-1234');
    await page.click('text=My data');
    await page.click('text=My taxpayers');

    await expect(page.locator('body')).toContainText(fullName);
    await expect(page.locator('body')).toContainText(mobile);
  });

  test('I2 · AC-3 · create taxpayer with spaces "  Ana abcd Dela Cruz  " then check My data › My taxpayers', async ({ page, request }) => {
    const baseName = makeName();
    const paddedName = `  ${baseName}  `;
    const mobile = makeMobile();
    const apiResponse = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: paddedName, mobile }
    });
    expect(apiResponse.status()).toBe(201);

    await signIn(page, 'ted-1234');
    await page.click('text=My data');
    await page.click('text=My taxpayers');

    await expect(page.locator('body')).toContainText(baseName);
    await expect(page.locator('body')).not.toContainText(paddedName);
  });

  test('I3 · AC-3 · POST full_name "   " via API then check My data › My taxpayers', async ({ page, request }) => {
    await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: '   ', mobile: makeMobile() }
    });

    await signIn(page, 'ted-1234');
    await page.click('text=My data');
    await page.click('text=My taxpayers');

    await expect(page.locator('body')).not.toContainText('   ');
  });

  test('I4 · AC-7 · create taxpayer as ted-1234, switch session to ted-1234-other and check My data › My taxpayers', async ({ page, request }) => {
    const fullName = makeName();
    const mobile = makeMobile();
    await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: fullName, mobile }
    });

    await signIn(page, 'ted-1234-other');
    await page.click('text=My data');
    await page.click('text=My taxpayers');

    await expect(page.locator('body')).toContainText('None yet — create one in Training setup.');
    await expect(page.locator('body')).not.toContainText(fullName);
  });

});

