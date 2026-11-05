# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\trn-01-web.spec.ts >> W1 · AC-1 · show the exact created message with the submitted full name and mobile
- Location: tests\web\trn-01-web.spec.ts:34:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Ana kzsl Dela Cruz created — mobile 09884143867.', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Ana kzsl Dela Cruz created — mobile 09884143867.', { exact: true }) with timeout 5000ms
  - waiting for getByText('Ana kzsl Dela Cruz created — mobile 09884143867.', { exact: true })

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
  - textbox "Full name": Ana kzsl Dela Cruz
  - text: Mobile (09XXXXXXXXX)
  - textbox "Mobile (09XXXXXXXXX)": "09884143867"
  - text: Email (optional)
  - textbox "Email (optional)"
  - button "Create taxpayer"
  - strong: Ana kzsl Dela Cruz
  - text: created — mobile
  - code: "09884143867"
  - text: .
  - button "Create a property tax bill for this taxpayer"
  - button "Create a business tax or fee bill"
  - heading "2 — Create a property tax bill" [level=2]
  - text: Taxpayer (only yours are listed)
  - combobox "Taxpayer (only yours are listed)":
    - option "— pick a taxpayer —" [selected]
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
  8   |   const letters = Math.random().toString(36)
  9   |     .replace(/[^a-z]/g, '').padEnd(4, 'x').slice(0, 4);
  10  |   return `Ana ${letters} Dela Cruz`;
  11  | }
  12  | 
  13  | function uniqueMobile() {
  14  |   sequence += 1;
  15  |   return `09${String(Date.now() + sequence).slice(-9).padStart(9, '0')}`;
  16  | }
  17  | 
  18  | async function openCreate(page: any) {
  19  |   await page.goto('/');
  20  |   await page.getByRole('link', { name: 'Training setup' }).click();
  21  | }
  22  | 
  23  | async function submit(page: any, name: string, mobile: string, email = '') {
  24  |   await page.getByLabel('Full name').fill(name);
  25  |   await page.getByLabel('Mobile (09XXXXXXXXX)').fill(mobile);
  26  | 
  27  |   if (email) {
  28  |     await page.getByLabel('Email (optional)').fill(email);
  29  |   }
  30  | 
  31  |   await page.getByRole('button', { name: 'Create taxpayer' }).click();
  32  | }
  33  | 
  34  | test('W1 · AC-1 · show the exact created message with the submitted full name and mobile',
  35  |   async ({ page }) => {
  36  |     await signIn(page);
  37  |     await openCreate(page);
  38  | 
  39  |     const name = uniqueName();
  40  |     const mobile = uniqueMobile();
  41  | 
  42  |     await submit(page, name, mobile);
  43  | 
  44  |     await expect(
  45  |       page.getByText(`${name} created — mobile ${mobile}.`, { exact: true })
> 46  |     ).toBeVisible();
      |       ^ Error: expect(locator).toBeVisible() failed
  47  |   });
  48  | 
  49  | test('W2 · AC-1 · refuse submission when Full name is empty',
  50  |   async ({ page }) => {
  51  |     await signIn(page);
  52  |     await openCreate(page);
  53  | 
  54  |     await submit(page, '', uniqueMobile());
  55  | 
  56  |     await expect(
  57  |       page.getByText(
  58  |         "2-100 characters: letters, spaces, . - ' and Ñ only",
  59  |         { exact: true }
  60  |       )
  61  |     ).toBeVisible();
  62  |   });
  63  | 
  64  | test('W3 · AC-1 · refuse submission when Mobile has an unsupported prefix',
  65  |   async ({ page }) => {
  66  |     await signIn(page);
  67  |     await openCreate(page);
  68  | 
  69  |     await submit(page, uniqueName(), '08123456789');
  70  | 
  71  |     await expect(
  72  |       page.getByText(
  73  |         'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
  74  |         { exact: true }
  75  |       )
  76  |     ).toBeVisible();
  77  |   });
  78  | 
  79  | test('W4 · AC-1 · refuse submission when Email has no @ separator',
  80  |   async ({ page }) => {
  81  |     await signIn(page);
  82  |     await openCreate(page);
  83  | 
  84  |     await submit(page, uniqueName(), uniqueMobile(), 'ana.example.com');
  85  | 
  86  |     await expect(
  87  |       page.getByText('invalid email format', { exact: true })
  88  |     ).toBeVisible();
  89  |   });
  90  | 
  91  | test('W5 · AC-3 · remove leading and trailing spaces from the created name message',
  92  |   async ({ page }) => {
  93  |     await signIn(page);
  94  |     await openCreate(page);
  95  | 
  96  |     const name = uniqueName();
  97  |     const mobile = uniqueMobile();
  98  | 
  99  |     await submit(page, `   ${name}   `, mobile);
  100 | 
  101 |     await expect(
  102 |       page.getByText(`${name} created — mobile ${mobile}.`, { exact: true })
  103 |     ).toBeVisible();
  104 |   });
  105 | 
  106 | test('W6 · AC-3 · refuse a name containing only spaces after trimming',
  107 |   async ({ page }) => {
  108 |     await signIn(page);
  109 |     await openCreate(page);
  110 | 
  111 |     await submit(page, '     ', uniqueMobile());
  112 | 
  113 |     await expect(
  114 |       page.getByText(
  115 |         "2-100 characters: letters, spaces, . - ' and Ñ only",
  116 |         { exact: true }
  117 |       )
  118 |     ).toBeVisible();
  119 |   });
  120 | 
  121 | test('W7 · AC-3 · refuse a one-character name after trimming surrounding spaces',
  122 |   async ({ page }) => {
  123 |     await signIn(page);
  124 |     await openCreate(page);
  125 | 
  126 |     await submit(page, '   A   ', uniqueMobile());
  127 | 
  128 |     await expect(
  129 |       page.getByText(
  130 |         "2-100 characters: letters, spaces, . - ' and Ñ only",
  131 |         { exact: true }
  132 |       )
  133 |     ).toBeVisible();
  134 |   });
  135 | 
  136 | test('W8 · AC-3 · refuse a trimmed name containing an unsupported character',
  137 |   async ({ page }) => {
  138 |     await signIn(page);
  139 |     await openCreate(page);
  140 | 
  141 |     await submit(page, '  Ana@Dela Cruz  ', uniqueMobile());
  142 | 
  143 |     await expect(
  144 |       page.getByText(
  145 |         "2-100 characters: letters, spaces, . - ' and Ñ only",
  146 |         { exact: true }
```