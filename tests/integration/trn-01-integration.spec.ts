
// file: tests/integration/trn-01-integration.spec.ts
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

async function createOnTrainingSetup(
  page: any, name: string, mobile: string, email = ''
) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Training setup' }).click();

  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);

  if (email) {
    await page.getByLabel('Email (optional)').fill(email);
  }

  await page.getByRole('button', { name: 'Create taxpayer' }).click();
}

async function openMyTaxpayers(page: any) {
  await page.getByRole('link', { name: 'My data' }).click();
  await page.getByRole('link', { name: 'My taxpayers' }).click();
}

test('I1 · AC-2 · show the created taxpayer details under My data › My taxpayers',
  async ({ page }) => {
    await signIn(page);

    const name = uniqueName();
    const mobile = uniqueMobile();
    const email = 'ana@example.com';

    await createOnTrainingSetup(page, name, mobile, email);
    await openMyTaxpayers(page);

    await expect(page.getByText(name, { exact: true })).toBeVisible();
    await expect(page.getByText(mobile, { exact: true })).toBeVisible();
    await expect(page.getByText(email, { exact: true })).toBeVisible();
  });

test.fixme(
  'I2 · AC-2 · ASK: what exact UI behavior/message should appear if the taxpayer name is missing from My taxpayers?',
  async ({ page }) => {}
);

test.fixme(
  'I3 · AC-2 · ASK: what exact UI behavior/message should appear if the taxpayer mobile is missing from My taxpayers?',
  async ({ page }) => {}
);

test.fixme(
  'I4 · AC-2 · ASK: should optional email be displayed in My taxpayers, and how is an omitted email represented?',
  async ({ page }) => {}
);

test('I5 · AC-7 · show taxpayer only under ted-1234 and show the specified empty state under another name-tag',
  async ({ page }) => {
    await signIn(page);

    const name = uniqueName();
    const mobile = uniqueMobile();

    await createOnTrainingSetup(page, name, mobile);
    await openMyTaxpayers(page);

    await expect(page.getByText(name, { exact: true })).toBeVisible();

    await signIn(page, 'ted-1234-other');
    await openMyTaxpayers(page);

    await expect(
      page.getByText(
        'None yet — create one in Training setup.',
        { exact: true }
      )
    ).toBeVisible();

    await expect(page.getByText(name, { exact: true })).toHaveCount(0);
    await expect(page.getByText(mobile, { exact: true })).toHaveCount(0);
  });

test('I6 · AC-7 · refuse taxpayer name leakage into the other name-tag list',
  async ({ page }) => {
    await signIn(page);

    const name = uniqueName();

    await createOnTrainingSetup(page, name, uniqueMobile());

    await signIn(page, 'ted-1234-other');
    await openMyTaxpayers(page);

    await expect(page.getByText(name, { exact: true })).toHaveCount(0);
  });

test('I7 · AC-7 · show the exact empty-state message under the other name-tag',
  async ({ page }) => {
    await signIn(page, 'ted-1234-other');
    await openMyTaxpayers(page);

    await expect(
      page.getByText(
        'None yet — create one in Training setup.',
        { exact: true }
      )
    ).toBeVisible();
  });

test('I8 · AC-7 · show no taxpayer entries in the other name-tag taxpayer list',
  async ({ page }) => {
    await signIn(page, 'ted-1234-other');
    await openMyTaxpayers(page);

    // The specified empty-state copy indicates an empty taxpayer list.
    await expect(
      page.getByText(
        'None yet — create one in Training setup.',
        { exact: true }
      )
    ).toBeVisible();
  });

