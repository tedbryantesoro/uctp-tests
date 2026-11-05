
// file: tests/api/trn-01-api.spec.ts
import { test, expect } from '@playwright/test';

const endpoint = '/api/v1/training/taxpayers';

const headers = {
  'X-Tenant-ID': 'TAGAYTAY',
  'X-User-ID': 'ted-1234',
};

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

async function create(
  request: any,
  full_name = uniqueName(),
  mobile = uniqueMobile(),
  email?: string
) {
  const data: Record<string, string> = { full_name, mobile };
  if (email !== undefined) data.email = email;

  return request.post(endpoint, { headers, data });
}

test('A1 · AC-4 · reject an already registered mobile for TAGAYTAY',
  async ({ request }) => {
    const mobile = uniqueMobile();

    expect((await create(request, uniqueName(), mobile)).status()).toBe(201);

    const response = await create(request, uniqueName(), mobile);
    expect(response.status()).toBe(409);
    expect(await response.json()).toEqual({
      detail: { mobile: 'already registered for this tenant' },
    });
  });

test.fixme('A2 · AC-4 · ASK: alternate user ID for duplicate registration test',
  async ({ request }) => {}
);

test.fixme('A3 · AC-4 · ASK: alternate tenant ID for duplicate registration test',
  async ({ request }) => {}
);

test.fixme('A4 · AC-4 · ASK: confirm whether 09 and +639 representations are equivalent for duplicate detection',
  async ({ request }) => {}
);

test('A5 · AC-5 · accept full names with exactly 2 and 100 characters',
  async ({ request }) => {
    const two = await create(request, 'Ab');
    const hundred = await create(request, `A${'b'.repeat(99)}`);

    expect(two.status()).toBe(201);
    expect((await two.json()).taxpayer_id).toBeTruthy();

    expect(hundred.status()).toBe(201);
    expect((await hundred.json()).taxpayer_id).toBeTruthy();
  });

test('A6 · AC-5 · reject a one-character full name',
  async ({ request }) => {
    const response = await create(request, 'A');
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        full_name: "2-100 characters: letters, spaces, . - ' and Ñ only",
      },
    });
  });

test('A7 · AC-5 · reject a 101-character full name',
  async ({ request }) => {
    const response = await create(request, `A${'b'.repeat(100)}`);
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        full_name: "2-100 characters: letters, spaces, . - ' and Ñ only",
      },
    });
  });

test('A8 · AC-5 · reject a full name containing @',
  async ({ request }) => {
    const response = await create(request, 'Ana@Dela Cruz');
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        full_name: "2-100 characters: letters, spaces, . - ' and Ñ only",
      },
    });
  });

test('A9 · AC-6 · accept a taxpayer creation request with email omitted',
  async ({ request }) => {
    const response = await create(request);
    expect(response.status()).toBe(201);
    expect((await response.json()).taxpayer_id).toBeTruthy();
  });

test('A10 · AC-6 · reject an email without @',
  async ({ request }) => {
    const response = await create(
      request, uniqueName(), uniqueMobile(), 'ana.example.com'
    );
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: { email: 'invalid email format' },
    });
  });

test('A11 · AC-6 · reject an email without a dot after @',
  async ({ request }) => {
    const response = await create(
      request, uniqueName(), uniqueMobile(), 'ana@examplecom'
    );
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: { email: 'invalid email format' },
    });
  });

test('A12 · AC-6 · reject an email longer than 254 characters',
  async ({ request }) => {
    const email = `${'a'.repeat(243)}@example.com`;
    expect(email.length).toBe(255);

    const response = await create(
      request, uniqueName(), uniqueMobile(), email
    );
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: { email: 'invalid email format' },
    });
  });

test('A13 · AC-8 · accept both supported PH mobile formats',
  async ({ request }) => {
    const local = uniqueMobile();
    const international = `+639${local.slice(2)}`;

    const first = await create(request, uniqueName(), local);
    const second = await create(request, uniqueName(), international);

    expect(first.status()).toBe(201);
    expect((await first.json()).taxpayer_id).toBeTruthy();

    expect(second.status()).toBe(201);
    expect((await second.json()).taxpayer_id).toBeTruthy();
  });

test('A14 · AC-8 · reject a mobile with an unsupported prefix',
  async ({ request }) => {
    const response = await create(request, uniqueName(), '08123456789');
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        mobile: 'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
      },
    });
  });

test('A15 · AC-8 · reject a mobile with too few digits',
  async ({ request }) => {
    const response = await create(request, uniqueName(), '0912345678');
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        mobile: 'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
      },
    });
  });

test('A16 · AC-8 · reject a mobile containing spaces and dashes',
  async ({ request }) => {
    const response = await create(request, uniqueName(), '0912-345 6789');
    expect(response.status()).toBe(422);
    expect(await response.json()).toEqual({
      detail: {
        mobile: 'must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX',
      },
    });
  });

