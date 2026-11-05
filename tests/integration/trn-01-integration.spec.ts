
// file: tests/integration/trn-01-integration.spec.ts
import { test, expect, signIn } from '../../helpers/web';

let sequence = 0;

function uniqueName() {
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('');
  return `Ana ${letters} Dela Cruz`;
}

function uniqueMobile() {
  sequence++;
  return `09${String(Date.now() + sequence).slice(-9).padStart(9, '0')}`;
}

async function createTaxpayer(
  page: any, name: string, mobile: string, email?: string
) {
  await page.goto('https://city-treasurer-staging.aiqe.pro');
  await page.getByRole('link', { name: 'Training setup' }).click();

  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);

  if (email !== undefined) {
    await page.getByLabel('Email (optional)').fill(email);
  }

  await page.getByRole('button', { name: 'Create taxpayer' }).click();
}

async function openMyTaxpayers(page: any) {
  await page.getByRole('link', { name: 'My data' }).click();
  await page.getByRole('link', { name: 'My taxpayers' }).click();
}

test('I1 · AC-2 · show created name, mobile and supplied email in My taxpayers',
  async ({ page }) => {
    await signIn(page);

    const name = uniqueName();
    const mobile = uniqueMobile();
    const email = 'ana@example.com';

    await createTaxpayer(page, name, mobile, email);
    await openMyTaxpayers(page);

    await expect(page.getByText(name, { exact: true })).toBeVisible();
    await expect(page.getByText(mobile, { exact: true })).toBeVisible();
    await expect(page.getByText(email, { exact: true })).toBeVisible();
  });

test('I2 · AC-2 · do not display an email value when email was omitted',
  async ({ page }) => {
    await signIn(page);

    const name = uniqueName();
    const mobile = uniqueMobile();

    await createTaxpayer(page, name, mobile);
    await openMyTaxpayers(page);

    await expect(page.getByText(name, { exact: true })).toBeVisible();
    await expect(page.getByText(mobile, { exact: true })).toBeVisible();
    await expect(page.getByText('Email:', { exact: false })).toHaveCount(0);
  });

test('I3 · AC-2 · show an empty taxpayer list when no taxpayer was created',
  async ({ page }) => {
    await signIn(page, 'ted-1234-other');
    await openMyTaxpayers(page);

    await expect(page.getByText(
      'None yet — create one in Training setup.', { exact: true }
    )).toBeVisible();
  });

test('I4 · AC-2 · do not add a taxpayer after a refused mobile submission',
  async ({ page }) => {
    await signIn(page);
    await createTaxpayer(page, uniqueName(), '08123456789');

    await expect(page.getByText(
      'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
      { exact: true }
    )).toBeVisible();
  });

test('I5 · AC-7 · show a taxpayer under its creator name-tag',
  async ({ page }) => {
    await signIn(page);

    const name = uniqueName();
    const mobile = uniqueMobile();

    await createTaxpayer(page, name, mobile);
    await openMyTaxpayers(page);

    await expect(page.getByText(name, { exact: true })).toBeVisible();
    await expect(page.getByText(mobile, { exact: true })).toBeVisible();
  });

test('I6 · AC-7 · show the specified empty-state message under another name-tag',
  async ({ page }) => {
    await signIn(page, 'ted-1234-other');
    await openMyTaxpayers(page);

    await expect(page.getByText(
      'None yet — create one in Training setup.', { exact: true }
    )).toBeVisible();
  });

test('I7 · AC-7 · show zero taxpayer entries under another name-tag',
  async ({ page }) => {
    await signIn(page);
    const name = uniqueName();

    await createTaxpayer(page, name, uniqueMobile());

    await signIn(page, 'ted-1234-other');
    await openMyTaxpayers(page);

    await expect(page.getByText(name, { exact: true })).toHaveCount(0);
  });

test('I8 · AC-7 · keep the original taxpayer absent when navigating to My taxpayers under another name-tag',
  async ({ page }) => {
    await signIn(page);

    const name = uniqueName();
    await createTaxpayer(page, name, uniqueMobile());

    await signIn(page, 'ted-1234-other');
    await openMyTaxpayers(page);

    await expect(page.getByText(
      'None yet — create one in Training setup.', { exact: true }
    )).toBeVisible();

    await expect(page.getByText(name, { exact: true })).toHaveCount(0);
  });

