
// file: tests/api/trn-01-api.spec.ts
import { test, expect } from '@playwright/test';

const headers = {
  'X-Tenant-ID': 'TAGAYTAY',
  'X-User-ID': 'ted-1234',
};
const basePath = '/api/v1/training/taxpayers';
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

async function create(request: any, full_name = uniqueName(),
  mobile = uniqueMobile(), email = '') {
  return request.post(basePath, {
    headers,
    data: { full_name, mobile, email },
  });
}

test('A1 · AC-4 · refuse a second taxpayer with the same mobile for this tenant',
  async ({ request }) => {
    const mobile = uniqueMobile();
    expect((await create(request, uniqueName(), mobile)).status()).toBe(201);

    const response = await create(request, uniqueName(), mobile);
    expect(response.status()).toBe(409);
    expect(await response.json()).toEqual({
      detail: { mobile: 'already registered for this tenant' },
    });
  });

test.fixme(
  'A2 · AC-4 · ASK: should a duplicate mobile be rejected across different tenants?',
  async ({ request }) => {}
);

test.fixme(
  'A3 · AC-4 · ASK: should a duplicate mobile be rejected across different user IDs in the same tenant?',
  async ({ request }) => {}
);

test.fixme(
  'A4 · AC-4 · ASK: are 09 and +639 representations of the same mobile treated as duplicates?',
  async ({ request }) => {}
);

test('A5 · AC-5 · accept names at both length boundaries, 2 and 100 characters',
  async ({ request }) => {
    const two = 'Ab';
    const hundred = `A${'b'.repeat(99)}`;

    expect((await create(request, two)).status()).toBe(201);
    expect((await create(request, hundred)).status()).toBe(201);
  });

test('A6 · AC-5 · refuse a one-character full name',
  async ({ request }) => {
    const response = await create(request, 'A');
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        full_name: "2-100 characters: letters, spaces, . - ' and Ñ only",
      },
    });
  });

test('A7 · AC-5 · refuse a 101-character full name',
  async ({ request }) => {
    const response = await create(request, `A${'b'.repeat(100)}`);
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        full_name: "2-100 characters: letters, spaces, . - ' and Ñ only",
      },
    });
  });

test('A8 · AC-5 · refuse a full name containing an unsupported character @',
  async ({ request }) => {
    const response = await create(request, 'Ana@Dela Cruz');
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        full_name: "2-100 characters: letters, spaces, . - ' and Ñ only",
      },
    });
  });

test('A9 · AC-6 · accept an omitted email and an email with one @ and a dot after it',
  async ({ request }) => {
    const omitted = await request.post(basePath, {
      headers,
      data: {
        full_name: uniqueName(),
        mobile: uniqueMobile(),
      },
    });
    expect(omitted.status()).toBe(201);

    const supplied = await create(
      request, uniqueName(), uniqueMobile(), 'ana@example.com'
    );
    expect(supplied.status()).toBe(201);
  });

test('A10 · AC-6 · refuse an email without @',
  async ({ request }) => {
    const response = await create(
      request, uniqueName(), uniqueMobile(), 'ana.example.com'
    );
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: { email: 'invalid email format' },
    });
  });

test('A11 · AC-6 · refuse an email without a dot after @',
  async ({ request }) => {
    const response = await create(
      request, uniqueName(), uniqueMobile(), 'ana@examplecom'
    );
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: { email: 'invalid email format' },
    });
  });

test('A12 · AC-6 · refuse an email longer than 254 characters',
  async ({ request }) => {
    const email = `${'a'.repeat(245)}@example.com`;
    expect(email.length).toBeGreaterThan(254);

    const response = await create(
      request, uniqueName(), uniqueMobile(), email
    );
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: { email: 'invalid email format' },
    });
  });

test('A13 · AC-8 · accept both PH mobile formats 09XXXXXXXXX and +639XXXXXXXXX',
  async ({ request }) => {
    const local = uniqueMobile();
    const international = `+639${local.slice(2)}`;

    expect((await create(request, uniqueName(), local)).status()).toBe(201);
    expect((await create(request, uniqueName(), international)).status()).toBe(201);
  });

test('A14 · AC-8 · refuse a mobile with a non-PH prefix',
  async ({ request }) => {
    const response = await create(
      request, uniqueName(), `08${uniqueMobile().slice(2)}`
    );
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        mobile: 'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
      },
    });
  });

test('A15 · AC-8 · refuse a mobile with too few digits',
  async ({ request }) => {
    const response = await create(request, uniqueName(), '0912345678');
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        mobile: 'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
      },
    });
  });

test('A16 · AC-8 · refuse a mobile containing spaces or dashes',
  async ({ request }) => {
    const response = await create(
      request, uniqueName(), '0912-345 6789'
    );
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        mobile: 'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
      },
    });
  });

