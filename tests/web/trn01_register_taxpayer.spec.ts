// file: tests/web/trn01_register_taxpayer.spec.ts
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

function makeMobile639(): string {
  const suffix = String(Date.now() + Math.floor(Math.random() * 1000)).slice(-9);
  return `+639${suffix}`;
}

test.describe('TRN-01 Web tests', () => {

  test('W1 · AC-1 · enter "Ana abcd Dela Cruz", "09171234567" and click "Create taxpayer"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name = makeName();
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();
    await expect(page.locator('body')).toContainText(`${name} created — mobile ${mobile}.`);
  });

  test('W2 · AC-1 · submit form with empty full_name and mobile "09171234567"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();
    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W3 · AC-1 · submit form with full_name "Ana abcd Dela Cruz" and empty mobile', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();
    await expect(page.locator('body')).toContainText('must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX');
  });

  test('W4 · AC-1 · click "Create taxpayer" with empty fields', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();
    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W5 · AC-2 · create taxpayer via web form then navigate to My data › My taxpayers', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name = makeName();
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();
    
    await page.click('text=My data');
    await page.click('text=My taxpayers');
    await expect(page.locator('body')).toContainText(name);
    await expect(page.locator('body')).toContainText(mobile);
  });

  test('W6 · AC-2 · view My data › My taxpayers when zero taxpayers created', async ({ page }) => {
    const uniqueUser = 'ted-1234-empty-' + Date.now();
    await signIn(page, uniqueUser);
    await page.click('text=My data');
    await page.click('text=My taxpayers');
    await expect(page.locator('body')).toContainText('None yet — create one in Training setup.');
  });

  test('W7 · AC-2 · attempt creation with mobile containing spaces then check My data', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill('0917 123 4567');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await page.click('text=My data');
    await page.click('text=My taxpayers');
    await expect(page.locator('body')).not.toContainText('0917 123 4567');
  });

  test('W8 · AC-2 · attempt creation with 1 letter name then check My data › My taxpayers', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('X');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await page.click('text=My data');
    await page.click('text=My taxpayers');
    await expect(page.locator('body')).not.toContainText('X created');
  });

  test('W9 · AC-3 · enter full_name "   Ana abcd Dela Cruz   " and submit', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const baseName = makeName();
    const paddedName = `   ${baseName}   `;
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(paddedName);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText(`${baseName} created — mobile ${mobile}.`);
    await expect(page.locator('body')).not.toContainText(`   ${baseName}   created`);
  });

  test('W10 · AC-3 · enter full_name with spaces only "     " and submit', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('     ');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W11 · AC-3 · enter full_name "  A  " and submit', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('  A  ');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W12 · AC-3 · enter full_name with spaces around symbol "   Ana #123   "', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('   Ana #123   ');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W13 · AC-3 · enter full_name with spaces around 101 letters', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const longName = '  ' + 'A'.repeat(101) + '  ';
    await page.getByLabel('Full name').fill(longName);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W14 · AC-4 · register taxpayer with new mobile "09170000002"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name = makeName();
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText(`${name} created — mobile ${mobile}.`);
  });

  test('W15 · AC-4 · enter mobile already registered for TAGAYTAY tenant', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name1 = makeName();
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name1);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    const name2 = makeName();
    await page.getByLabel('Full name').fill(name2);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('already registered for this tenant');
  });

  test('W16 · AC-4 · submit form twice in succession with identical mobile', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await page.getByRole('button', { name: 'Create taxpayer' }).click();
    await expect(page.locator('body')).toContainText('already registered for this tenant');
  });

  test('W17 · AC-4 · attempt registering second taxpayer using the same mobile number', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const sharedMobile = makeMobile();
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(sharedMobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(sharedMobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('already registered for this tenant');
  });

  test('W18 · AC-5 · enter full_name "José-Ma. O\'Niel Ñ"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name = "José-Ma. O'Niel Ñ";
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText(`${name} created — mobile ${mobile}.`);
  });

  test('W19 · AC-5 · enter 1 character "A" for full_name', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('A');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W20 · AC-5 · enter 101 characters for full_name', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('A'.repeat(101));
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W21 · AC-5 · enter full_name with numbers "John Doe 2nd"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('John Doe 2nd');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W22 · AC-5 · enter full_name with symbol "Ana # Cruz"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('Ana # Cruz');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W23 · AC-5 · enter full_name with exclamation "Ana!"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('Ana!');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W24 · AC-5 · enter full_name with semicolon "Ana; Dela Cruz"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill('Ana; Dela Cruz');
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('2-100 characters: letters, spaces, . - \' and Ñ only');
  });

  test('W25 · AC-6 · submit form with empty email field', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name = makeName();
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByLabel('Email (optional)').fill('');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText(`${name} created — mobile ${mobile}.`);
  });

  test('W26 · AC-6 · submit form with email "test.user@domain.com"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name = makeName();
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByLabel('Email (optional)').fill('test.user@domain.com');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText(`${name} created — mobile ${mobile}.`);
  });

  test('W27 · AC-6 · enter email without @ "plainaddress"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill('plainaddress');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W28 · AC-6 · enter email with two @ signs "a@b@c.com"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill('a@b@c.com');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W29 · AC-6 · enter email missing dot after @ "user@domain"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill('user@domain');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W30 · AC-6 · enter 255 character email', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const longEmail = 'a'.repeat(240) + '@example.com';
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill(longEmail);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W31 · AC-6 · enter email with only @ "user@"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill('user@');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W32 · AC-6 · enter email with spaces "user name@domain.com"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill('user name@domain.com');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W33 · AC-6 · enter email with missing username "@domain.com"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill('@domain.com');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W34 · AC-6 · enter email "user@.com"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill('user@.com');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W35 · AC-6 · enter email "user domain.com"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(makeMobile());
    await page.getByLabel('Email (optional)').fill('user domain.com');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('invalid email format');
  });

  test('W36 · AC-7 · signIn(page, "ted-1234"), create taxpayer, navigate to My data › My taxpayers', async ({ page }) => {
    await signIn(page, 'ted-1234');
    await page.click('text=Training setup');
    const name = makeName();
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await page.click('text=My data');
    await page.click('text=My taxpayers');
    await expect(page.locator('body')).toContainText(name);
  });

  test('W37 · AC-7 · signIn(page, "ted-1234-other"), navigate to My data › My taxpayers', async ({ page }) => {
    await signIn(page, 'ted-1234-other');
    await page.click('text=My data');
    await page.click('text=My taxpayers');
    await expect(page.locator('body')).toContainText('None yet — create one in Training setup.');
  });

  test('W38 · AC-7 · signIn(page, "ted-1234-other"), check Training setup result box / lists', async ({ page }) => {
    await signIn(page, 'ted-1234-other');
    await page.click('text=Training setup');
    await expect(page.locator('body')).not.toContainText('created — mobile');
  });

  test('W39 · AC-7 · create taxpayer under ted-1234-other, signIn(page, "ted-1234")', async ({ page }) => {
    await signIn(page, 'ted-1234-other');
    await page.click('text=Training setup');
    const nameOther = makeName();
    const mobileOther = makeMobile();
    await page.getByLabel('Full name').fill(nameOther);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobileOther);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await signIn(page, 'ted-1234');
    await page.click('text=My data');
    await page.click('text=My taxpayers');
    await expect(page.locator('body')).not.toContainText(nameOther);
  });

  test('W40 · AC-8 · enter mobile "09998765432"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name = makeName();
    const mobile = makeMobile();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText(`${name} created — mobile ${mobile}.`);
  });

  test('W41 · AC-8 · enter mobile "+639998765432"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    const name = makeName();
    const mobile = makeMobile639();
    await page.getByLabel('Full name').fill(name);
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText(`${name} created — mobile ${mobile}.`);
  });

  test('W42 · AC-8 · enter mobile with spaces "0917 123 4567"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill('0917 123 4567');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX');
  });

  test('W43 · AC-8 · enter mobile with dashes "0917-123-4567"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill('0917-123-4567');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX');
  });

  test('W44 · AC-8 · enter short mobile "09171234"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill('09171234');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX');
  });

  test('W45 · AC-8 · enter long mobile "0917123456789"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill('0917123456789');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX');
  });

  test('W46 · AC-8 · enter landline format "0281234567"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill('0281234567');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX');
  });

  test('W47 · AC-8 · enter mobile with letters "0917ABCDEFG"', async ({ page }) => {
    await signIn(page);
    await page.click('text=Training setup');
    await page.getByLabel('Full name').fill(makeName());
    await page.getByLabel('Mobile (09XXXXXXXXX)').fill('0917ABCDEFG');
    await page.getByRole('button', { name: 'Create taxpayer' }).click();

    await expect(page.locator('body')).toContainText('must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX');
  });

});

