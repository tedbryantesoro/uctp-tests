
// file: tests/web/trn-01-web.spec.ts
import { test, expect, signIn } from '../../helpers/web';

let sequence = 0;

function uniqueName() {
  const letters = Math.random().toString(36)
    .replace(/[^a-z]/g, '').padEnd(4, 'x').slice(0, 4);
  return `Ana ${letters} Dela Cruz`;
}

function uniqueMobile() {
  sequence += 1;
  return `09${String(Date.now() + sequence).slice(-9).padStart(9, '0')}`;
}

async function openCreate(page: any) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Training setup' }).click();
}

async function submit(page: any, name: string, mobile: string, email = '') {
  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);

  if (email) {
    await page.getByLabel('Email (optional)').fill(email);
  }

  await page.getByRole('button', { name: 'Create taxpayer' }).click();
}

test('W1 · AC-1 · show the exact created message with the submitted full name and mobile',
  async ({ page }) => {
    await signIn(page);
    await openCreate(page);

    const name = uniqueName();
    const mobile = uniqueMobile();

    await submit(page, name, mobile);

    await expect(
      page.getByText(`${name} created — mobile ${mobile}.`, { exact: true })
    ).toBeVisible();
  });

test('W2 · AC-1 · refuse submission when Full name is empty',
  async ({ page }) => {
    await signIn(page);
    await openCreate(page);

    await submit(page, '', uniqueMobile());

    await expect(
      page.getByText(
        "2-100 characters: letters, spaces, . - ' and Ñ only",
        { exact: true }
      )
    ).toBeVisible();
  });

test('W3 · AC-1 · refuse submission when Mobile has an unsupported prefix',
  async ({ page }) => {
    await signIn(page);
    await openCreate(page);

    await submit(page, uniqueName(), '08123456789');

    await expect(
      page.getByText(
        'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
        { exact: true }
      )
    ).toBeVisible();
  });

test('W4 · AC-1 · refuse submission when Email has no @ separator',
  async ({ page }) => {
    await signIn(page);
    await openCreate(page);

    await submit(page, uniqueName(), uniqueMobile(), 'ana.example.com');

    await expect(
      page.getByText('invalid email format', { exact: true })
    ).toBeVisible();
  });

test('W5 · AC-3 · remove leading and trailing spaces from the created name message',
  async ({ page }) => {
    await signIn(page);
    await openCreate(page);

    const name = uniqueName();
    const mobile = uniqueMobile();

    await submit(page, `   ${name}   `, mobile);

    await expect(
      page.getByText(`${name} created — mobile ${mobile}.`, { exact: true })
    ).toBeVisible();
  });

test('W6 · AC-3 · refuse a name containing only spaces after trimming',
  async ({ page }) => {
    await signIn(page);
    await openCreate(page);

    await submit(page, '     ', uniqueMobile());

    await expect(
      page.getByText(
        "2-100 characters: letters, spaces, . - ' and Ñ only",
        { exact: true }
      )
    ).toBeVisible();
  });

test('W7 · AC-3 · refuse a one-character name after trimming surrounding spaces',
  async ({ page }) => {
    await signIn(page);
    await openCreate(page);

    await submit(page, '   A   ', uniqueMobile());

    await expect(
      page.getByText(
        "2-100 characters: letters, spaces, . - ' and Ñ only",
        { exact: true }
      )
    ).toBeVisible();
  });

test('W8 · AC-3 · refuse a trimmed name containing an unsupported character',
  async ({ page }) => {
    await signIn(page);
    await openCreate(page);

    await submit(page, '  Ana@Dela Cruz  ', uniqueMobile());

    await expect(
      page.getByText(
        "2-100 characters: letters, spaces, . - ' and Ñ only",
        { exact: true }
      )
    ).toBeVisible();
  });

