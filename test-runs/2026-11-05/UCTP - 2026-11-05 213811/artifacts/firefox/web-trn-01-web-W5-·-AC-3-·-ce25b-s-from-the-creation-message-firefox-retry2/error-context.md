# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\trn-01-web.spec.ts >> W5 · AC-3 · trim surrounding spaces from the creation message
- Location: tests\web\trn-01-web.spec.ts:88:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Ana thqu Dela Cruz created — mobile 09886315179.', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Ana thqu Dela Cruz created — mobile 09886315179.', { exact: true }) with timeout 5000ms
  - waiting for getByText('Ana thqu Dela Cruz created — mobile 09886315179.', { exact: true })

```

```yaml
- note: TRAINING — made-up data only
- navigation "Main":
  - link "UCTP":
    - /url: /
  - link "Home":
    - /url: /
  - link "Training setup":
    - /url: /training
  - link "Teller POS":
    - /url: /pos
  - link "Citizen portal":
    - /url: /portal
  - link "Simulator":
    - /url: /simulator
  - link "My data":
    - /url: /my-data
  - link "API docs":
    - /url: /docs
  - text: "You are:"
  - strong: ted-1234
  - link "Change":
    - /url: "#"
- main:
  - heading "Training setup" [level=1]
  - paragraph: Create the data you will use in class — everything here is fictional and yours only.
  - heading "1 — Create a taxpayer" [level=2]
  - text: Full name
  - textbox "Full name": Ana thqu Dela Cruz
  - text: Mobile (09XXXXXXXXX)
  - textbox "Mobile (09XXXXXXXXX)": "09886315179"
  - text: Email (optional)
  - textbox "Email (optional)"
  - button "Create taxpayer"
  - strong: Ana thqu Dela Cruz
  - text: created — mobile
  - code: "09886315179"
  - text: .
  - button "Create a property tax bill for this taxpayer"
  - button "Create a business tax or fee bill"
  - heading "2 — Create a property tax bill" [level=2]
  - text: Taxpayer (only yours are listed)
  - combobox "Taxpayer (only yours are listed)":
    - option "— pick a taxpayer —" [selected]
    - option "Ana thqu Dela Cruz (09886315179)"
    - option "Ana yznz Dela Cruz (09886302501)"
    - option "Ana ncku Dela Cruz (09886289343)"
    - option "Ana nidu Dela Cruz (09886281818)"
    - option "Ana Dela Cruz (09862750191)"
    - option "Ana pmbf Dela Cruz (09886242960)"
    - option "Ana eegq Dela Cruz (09886210553)"
    - option "Ana lrha Dela Cruz (09886177337)"
    - option "Ana evgz Dela Cruz (09886146548)"
    - option "Ana omzx Dela Cruz (09886134630)"
    - option "Ana Dela Cruz (09861255491)"
    - option "Ana mmlk Dela Cruz (09886112363)"
    - option "Ana zrdn Dela Cruz (09886103109)"
    - option "Ana qtoi Dela Cruz (09886093387)"
    - option "Ana wqxa Dela Cruz (09886084357)"
    - option "Ana utkt Dela Cruz (09886073945)"
    - option "Ana Dela Cruz (09860659361)"
    - option "Ana fpxi Dela Cruz (09886032746)"
    - option "Ana kxyc Dela Cruz (09886001495)"
    - option "Ana zmkv Dela Cruz (09885969214)"
    - option "Ana abxw Dela Cruz (09885939454)"
    - option "Ñoño O'Brien-Cruz Jr. (09859184743)"
    - option "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA (09859132622)"
    - option "Ana Dela Cruz (09859080561)"
    - option "Ana yrut Dela Cruz (09884275471)"
    - option "Ana eiye Dela Cruz (09884274360)"
    - option "Ana bfkp Dela Cruz (09884273287)"
    - option "Ana meij Dela Cruz (09884272256)"
    - option "Ana lkhh Dela Cruz (09884269945)"
    - option "Ana brjm Dela Cruz (09884269262)"
    - option "Abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb (09884267230)"
    - option "Ab (09884266553)"
    - option "Ana imrt Dela Cruz (09884265504)"
    - option "Rosa Web (09842431343)"
    - option "Ana Dela Cruz (09842384452)"
    - option "Ana Dela Cruz (09842352061)"
    - option "Ana vudi Dela Cruz (09884206187)"
    - option "Ana trgc Dela Cruz (09884158912)"
    - option "Ana kzsl Dela Cruz (09884143867)"
    - option "Rosa Web (09841229593)"
    - option "Ana Dela Cruz (09841184732)"
    - option "Ana Dela Cruz (09841153461)"
  - text: PIN (NNN-NN-NNN-NNN-NNN)
  - textbox "PIN (NNN-NN-NNN-NNN-NNN)"
  - text: Property class
  - combobox "Property class":
    - option "RESIDENTIAL" [selected]
    - option "COMMERCIAL"
    - option "AGRICULTURAL"
    - option "INDUSTRIAL"
  - text: Assessed value (₱)
  - textbox "Assessed value (₱)"
  - text: Tax year
  - textbox "Tax year": "2026"
  - button "Create property tax bill"
  - heading "3 — Create a business tax or fee bill" [level=2]
  - text: Taxpayer (only yours are listed)
  - combobox "Taxpayer (only yours are listed)":
    - option "— pick a taxpayer —" [selected]
    - option "Ana thqu Dela Cruz (09886315179)"
    - option "Ana yznz Dela Cruz (09886302501)"
    - option "Ana ncku Dela Cruz (09886289343)"
    - option "Ana nidu Dela Cruz (09886281818)"
    - option "Ana Dela Cruz (09862750191)"
    - option "Ana pmbf Dela Cruz (09886242960)"
    - option "Ana eegq Dela Cruz (09886210553)"
    - option "Ana lrha Dela Cruz (09886177337)"
    - option "Ana evgz Dela Cruz (09886146548)"
    - option "Ana omzx Dela Cruz (09886134630)"
    - option "Ana Dela Cruz (09861255491)"
    - option "Ana mmlk Dela Cruz (09886112363)"
    - option "Ana zrdn Dela Cruz (09886103109)"
    - option "Ana qtoi Dela Cruz (09886093387)"
    - option "Ana wqxa Dela Cruz (09886084357)"
    - option "Ana utkt Dela Cruz (09886073945)"
    - option "Ana Dela Cruz (09860659361)"
    - option "Ana fpxi Dela Cruz (09886032746)"
    - option "Ana kxyc Dela Cruz (09886001495)"
    - option "Ana zmkv Dela Cruz (09885969214)"
    - option "Ana abxw Dela Cruz (09885939454)"
    - option "Ñoño O'Brien-Cruz Jr. (09859184743)"
    - option "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA (09859132622)"
    - option "Ana Dela Cruz (09859080561)"
    - option "Ana yrut Dela Cruz (09884275471)"
    - option "Ana eiye Dela Cruz (09884274360)"
    - option "Ana bfkp Dela Cruz (09884273287)"
    - option "Ana meij Dela Cruz (09884272256)"
    - option "Ana lkhh Dela Cruz (09884269945)"
    - option "Ana brjm Dela Cruz (09884269262)"
    - option "Abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb (09884267230)"
    - option "Ab (09884266553)"
    - option "Ana imrt Dela Cruz (09884265504)"
    - option "Rosa Web (09842431343)"
    - option "Ana Dela Cruz (09842384452)"
    - option "Ana Dela Cruz (09842352061)"
    - option "Ana vudi Dela Cruz (09884206187)"
    - option "Ana trgc Dela Cruz (09884158912)"
    - option "Ana kzsl Dela Cruz (09884143867)"
    - option "Rosa Web (09841229593)"
    - option "Ana Dela Cruz (09841184732)"
    - option "Ana Dela Cruz (09841153461)"
  - text: Type
  - combobox "Type":
    - option "BUSINESS" [selected]
    - option "FEE"
  - text: Reference
  - textbox "Reference"
  - text: Description
  - textbox "Description"
  - text: Amount (₱)
  - textbox "Amount (₱)"
  - text: Due date
  - textbox "Due date":
    - /placeholder: YYYY-MM-DD
  - button "Create bill"
  - heading "4 — Create my teller" [level=2]
  - text: Display name
  - textbox "Display name"
  - button "Create my teller"
  - heading "5 — Create my approver" [level=2]
  - paragraph: Your own City Treasurer for approving or rejecting void requests on receipts your tellers issued. One per student — clicking again shows the one you have.
  - text: Display name (optional)
  - textbox "Display name (optional)"
  - button "Create my approver"
```

# Test source

```ts
  1   | 
  2   | // file: tests/web/trn-01-web.spec.ts
  3   | import { test, expect, signIn } from '../../helpers/web';
  4   | 
  5   | let sequence = 0;
  6   | 
  7   | function uniqueName() {
  8   |   const letters = Array.from({ length: 4 }, () =>
  9   |     String.fromCharCode(97 + Math.floor(Math.random() * 26))
  10  |   ).join('');
  11  |   return `Ana ${letters} Dela Cruz`;
  12  | }
  13  | 
  14  | function uniqueMobile() {
  15  |   sequence++;
  16  |   return `09${String(Date.now() + sequence).slice(-9).padStart(9, '0')}`;
  17  | }
  18  | 
  19  | async function openTrainingSetup(page: any) {
  20  |   await page.goto('https://city-treasurer-staging.aiqe.pro');
  21  |   await page.getByRole('link', { name: 'Training setup' }).click();
  22  | }
  23  | 
  24  | async function submit(
  25  |   page: any, name: string, mobile: string, email?: string
  26  | ) {
  27  |   await page.getByLabel('Full name').fill(name);
  28  |   await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
  29  | 
  30  |   if (email !== undefined) {
  31  |     await page.getByLabel('Email (optional)').fill(email);
  32  |   }
  33  | 
  34  |   await page.getByRole('button', { name: 'Create taxpayer' }).click();
  35  | }
  36  | 
  37  | test('W1 · AC-1 · display the exact taxpayer creation message',
  38  |   async ({ page }) => {
  39  |     await signIn(page);
  40  |     await openTrainingSetup(page);
  41  | 
  42  |     const name = uniqueName();
  43  |     const mobile = uniqueMobile();
  44  | 
  45  |     await submit(page, name, mobile);
  46  | 
  47  |     await expect(page.getByText(
  48  |       `${name} created — mobile ${mobile}.`, { exact: true }
  49  |     )).toBeVisible();
  50  |   });
  51  | 
  52  | test('W2 · AC-1 · reject an empty full name',
  53  |   async ({ page }) => {
  54  |     await signIn(page);
  55  |     await openTrainingSetup(page);
  56  |     await submit(page, '', uniqueMobile());
  57  | 
  58  |     await expect(page.getByText(
  59  |       "2-100 characters: letters, spaces, . - ' and Ñ only",
  60  |       { exact: true }
  61  |     )).toBeVisible();
  62  |   });
  63  | 
  64  | test('W3 · AC-1 · reject a name containing @',
  65  |   async ({ page }) => {
  66  |     await signIn(page);
  67  |     await openTrainingSetup(page);
  68  |     await submit(page, 'Ana@Dela Cruz', uniqueMobile());
  69  | 
  70  |     await expect(page.getByText(
  71  |       "2-100 characters: letters, spaces, . - ' and Ñ only",
  72  |       { exact: true }
  73  |     )).toBeVisible();
  74  |   });
  75  | 
  76  | test('W4 · AC-1 · reject a malformed mobile',
  77  |   async ({ page }) => {
  78  |     await signIn(page);
  79  |     await openTrainingSetup(page);
  80  |     await submit(page, uniqueName(), '08123456789');
  81  | 
  82  |     await expect(page.getByText(
  83  |       'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
  84  |       { exact: true }
  85  |     )).toBeVisible();
  86  |   });
  87  | 
  88  | test('W5 · AC-3 · trim surrounding spaces from the creation message',
  89  |   async ({ page }) => {
  90  |     await signIn(page);
  91  |     await openTrainingSetup(page);
  92  | 
  93  |     const name = uniqueName();
  94  |     const mobile = uniqueMobile();
  95  | 
  96  |     await submit(page, `   ${name}   `, mobile);
  97  | 
  98  |     await expect(page.getByText(
  99  |       `${name} created — mobile ${mobile}.`, { exact: true }
> 100 |     )).toBeVisible();
      |        ^ Error: expect(locator).toBeVisible() failed
  101 |   });
  102 | 
  103 | test('W6 · AC-3 · reject a whitespace-only name',
  104 |   async ({ page }) => {
  105 |     await signIn(page);
  106 |     await openTrainingSetup(page);
  107 |     await submit(page, '     ', uniqueMobile());
  108 | 
  109 |     await expect(page.getByText(
  110 |       "2-100 characters: letters, spaces, . - ' and Ñ only",
  111 |       { exact: true }
  112 |     )).toBeVisible();
  113 |   });
  114 | 
  115 | test('W7 · AC-3 · reject a one-character name after trimming',
  116 |   async ({ page }) => {
  117 |     await signIn(page);
  118 |     await openTrainingSetup(page);
  119 |     await submit(page, '   A   ', uniqueMobile());
  120 | 
  121 |     await expect(page.getByText(
  122 |       "2-100 characters: letters, spaces, . - ' and Ñ only",
  123 |       { exact: true }
  124 |     )).toBeVisible();
  125 |   });
  126 | 
  127 | test('W8 · AC-3 · reject a trimmed name containing @',
  128 |   async ({ page }) => {
  129 |     await signIn(page);
  130 |     await openTrainingSetup(page);
  131 |     await submit(page, '  Ana@Dela Cruz  ', uniqueMobile());
  132 | 
  133 |     await expect(page.getByText(
  134 |       "2-100 characters: letters, spaces, . - ' and Ñ only",
  135 |       { exact: true }
  136 |     )).toBeVisible();
  137 |   });
  138 | 
  139 | 
```