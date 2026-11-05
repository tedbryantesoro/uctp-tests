# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\trn-01-web.spec.ts >> W1 · AC-1 · show the exact created message with the submitted full name and mobile
- Location: tests\web\trn-01-web.spec.ts:34:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - note [ref=e2]: TRAINING — made-up data only
  - navigation "Main" [ref=e3]:
    - link "UCTP" [ref=e4] [cursor=pointer]:
      - /url: /
    - generic [ref=e5]:
      - link "Home" [ref=e6] [cursor=pointer]:
        - /url: /
      - link "Training setup" [ref=e7] [cursor=pointer]:
        - /url: /training
      - link "Teller POS" [ref=e8] [cursor=pointer]:
        - /url: /pos
      - link "Citizen portal" [ref=e9] [cursor=pointer]:
        - /url: /portal
      - link "Simulator" [ref=e10] [cursor=pointer]:
        - /url: /simulator
      - link "My data" [ref=e11] [cursor=pointer]:
        - /url: /my-data
      - link "API docs" [ref=e12] [cursor=pointer]:
        - /url: /docs
    - generic [ref=e14]:
      - text: "You are:"
      - strong [ref=e15]: ted-1234
      - link "Change" [ref=e16] [cursor=pointer]:
        - /url: "#"
  - main [ref=e17]:
    - heading "Unified City Treasury Platform — Tagaytay pilot" [level=1] [ref=e18]
    - paragraph [ref=e19]: Every flow starts here. Pick a role; each screen hands off to the next step.
    - generic [ref=e20]:
      - generic [ref=e21]:
        - heading "Training setup" [level=2] [ref=e22]
        - paragraph [ref=e23]: Create the taxpayers, bills, and teller booklets you will use in class.
        - link [ref=e24] [cursor=pointer]:
          - /url: /training
          - button "Create my data" [ref=e25]
      - generic [ref=e26]:
        - 'heading "Teller: POS" [level=2] [ref=e27]'
        - paragraph [ref=e28]: Counter cashiering — load an Order of Payment, tender cash or cheque, print the OR.
        - link [ref=e29] [cursor=pointer]:
          - /url: /pos
          - button "Open POS" [ref=e30]
      - generic [ref=e31]:
        - 'heading "Citizen: portal" [level=2] [ref=e32]'
        - paragraph [ref=e33]: Taxpayer self-service — look up what you owe and pay online.
        - link [ref=e34] [cursor=pointer]:
          - /url: /portal
          - button "Open portal" [ref=e35]
      - generic [ref=e36]:
        - 'heading "Bank: settlement simulator" [level=2] [ref=e37]'
        - paragraph [ref=e38]: Training tool that drives the real settlement endpoints with a simulated bank reference.
        - link [ref=e39] [cursor=pointer]:
          - /url: /simulator
          - button "Open simulator" [ref=e40]
      - generic [ref=e41]:
        - heading "My data" [level=2] [ref=e42]
        - paragraph [ref=e43]: Everything you created — taxpayers, bills, tellers, receipts — and the next action for each.
        - link [ref=e44] [cursor=pointer]:
          - /url: /my-data
          - button "See my data" [ref=e45]
      - generic [ref=e46]:
        - heading "API docs" [level=2] [ref=e47]
        - paragraph [ref=e48]: OpenAPI / Swagger reference for every endpoint in the platform.
        - link [ref=e49] [cursor=pointer]:
          - /url: /docs
          - button "Open API docs" [ref=e50]
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
> 19  |   await page.goto('/');
      |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
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
  46  |     ).toBeVisible();
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
```