
// file: tests/web/trn-01-web.spec.ts
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

async function openTrainingSetup(page: any) {
  await page.goto('https://city-treasurer-staging.aiqe.pro');
  await page.getByRole('link', { name: 'Training setup' }).click();
}

async function submit(
  page: any, name: string, mobile: string, email?: string
) {
  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);

  if (email !== undefined) {
    await page.getByLabel('Email (optional)').fill(email);
  }

  await page.getByRole('button', { name: 'Create taxpayer' }).click();
}

test('W1 · AC-1 · display the exact taxpayer creation message',
  async ({ page }) => {
    await signIn(page);
    await openTrainingSetup(page);

    const name = uniqueName();
    const mobile = uniqueMobile();

    await submit(page, name, mobile);

    await expect(page.getByText(
      `${name} created — mobile ${mobile}.`, { exact: true }
    )).toBeVisible();
  });

test('W2 · AC-1 · reject an empty full name',
  async ({ page }) => {
    await signIn(page);
    await openTrainingSetup(page);
    await submit(page, '', uniqueMobile());

    await expect(page.getByText(
      "2-100 characters: letters, spaces, . - ' and Ñ only",
      { exact: true }
    )).toBeVisible();
  });

test('W3 · AC-1 · reject a name containing @',
  async ({ page }) => {
    await signIn(page);
    await openTrainingSetup(page);
    await submit(page, 'Ana@Dela Cruz', uniqueMobile());

    await expect(page.getByText(
      "2-100 characters: letters, spaces, . - ' and Ñ only",
      { exact: true }
    )).toBeVisible();
  });

test('W4 · AC-1 · reject a malformed mobile',
  async ({ page }) => {
    await signIn(page);
    await openTrainingSetup(page);
    await submit(page, uniqueName(), '08123456789');

    await expect(page.getByText(
      'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
      { exact: true }
    )).toBeVisible();
  });

test('W5 · AC-3 · trim surrounding spaces from the creation message',
  async ({ page }) => {
    await signIn(page);
    await openTrainingSetup(page);

    const name = uniqueName();
    const mobile = uniqueMobile();

    await submit(page, `   ${name}   `, mobile);

    await expect(page.getByText(
      `${name} created — mobile ${mobile}.`, { exact: true }
    )).toBeVisible();
  });

test('W6 · AC-3 · reject a whitespace-only name',
  async ({ page }) => {
    await signIn(page);
    await openTrainingSetup(page);
    await submit(page, '     ', uniqueMobile());

    await expect(page.getByText(
      "2-100 characters: letters, spaces, . - ' and Ñ only",
      { exact: true }
    )).toBeVisible();
  });

test('W7 · AC-3 · reject a one-character name after trimming',
  async ({ page }) => {
    await signIn(page);
    await openTrainingSetup(page);
    await submit(page, '   A   ', uniqueMobile());

    await expect(page.getByText(
      "2-100 characters: letters, spaces, . - ' and Ñ only",
      { exact: true }
    )).toBeVisible();
  });

test('W8 · AC-3 · reject a trimmed name containing @',
  async ({ page }) => {
    await signIn(page);
    await openTrainingSetup(page);
    await submit(page, '  Ana@Dela Cruz  ', uniqueMobile());

    await expect(page.getByText(
      "2-100 characters: letters, spaces, . - ' and Ñ only",
      { exact: true }
    )).toBeVisible();
  });

