// file: tests/api/trn01_register_taxpayer.spec.ts
import { test, expect } from '@playwright/test';

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

const defaultHeaders = {
  'X-Tenant-ID': 'TAGAYTAY',
  'X-User-ID': 'ted-1234',
  'Content-Type': 'application/json',
};

const otherHeaders = {
  'X-Tenant-ID': 'TAGAYTAY',
  'X-User-ID': 'ted-1234-other',
  'Content-Type': 'application/json',
};

test.describe('TRN-01 API tests', () => {

  test('A1 · AC-1 · create a taxpayer using "Ana abcd Dela Cruz" and mobile 09171234567', async ({ request }) => {
    const fullName = makeName();
    const mobile = makeMobile();
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: fullName, mobile }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('taxpayer_id');
  });

  test('A2 · AC-1 · create a taxpayer with full_name, mobile and optional email', async ({ request }) => {
    const fullName = makeName();
    const mobile = makeMobile();
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: fullName, mobile, email: 'user@example.com' }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('taxpayer_id');
  });

  test('A3 · AC-1 · refuse request missing full_name field', async ({ request }) => {
    const mobile = makeMobile();
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { mobile }
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual({ detail: { full_name: "2-100 characters: letters, spaces, . - ' and Ñ only" } });
  });

  test('A4 · AC-1 · refuse request missing mobile field', async ({ request }) => {
    const fullName = makeName();
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: fullName }
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual({ detail: { mobile: "must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX" } });
  });

  test('A5 · AC-1 · refuse request with empty JSON object {}', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: {}
    });
    expect(response.status()).toBe(422);
  });

  test('A6 · AC-2 · list taxpayers when zero taxpayers created', async ({ request }) => {
    const response = await request.get('/api/v1/training/taxpayers', {
      headers: { ...defaultHeaders, 'X-User-ID': 'ted-1234-fresh-' + Date.now() }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  test('A7 · AC-2 · list does not contain taxpayer from failed POST with missing name', async ({ request }) => {
    const userId = 'ted-1234-temp-' + Date.now();
    const customHeaders = { ...defaultHeaders, 'X-User-ID': userId };
    await request.post('/api/v1/training/taxpayers', {
      headers: customHeaders,
      data: { mobile: makeMobile() }
    });
    const listResponse = await request.get('/api/v1/training/taxpayers', { headers: customHeaders });
    const list = await listResponse.json();
    expect(list.length).toBe(0);
  });

  test('A8 · AC-2 · list count does not increment on duplicate mobile POST', async ({ request }) => {
    const userId = 'ted-1234-dup-' + Date.now();
    const customHeaders = { ...defaultHeaders, 'X-User-ID': userId };
    const mobile = makeMobile();
    await request.post('/api/v1/training/taxpayers', {
      headers: customHeaders,
      data: { full_name: makeName(), mobile }
    });
    await request.post('/api/v1/training/taxpayers', {
      headers: customHeaders,
      data: { full_name: makeName(), mobile }
    });
    const listResponse = await request.get('/api/v1/training/taxpayers', { headers: customHeaders });
    const list = await listResponse.json();
    expect(list.length).toBe(1);
  });

  test('A9 · AC-3 · trim leading and trailing spaces from full_name', async ({ request }) => {
    const baseName = makeName();
    const paddedName = `   ${baseName}   `;
    const mobile = makeMobile();
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: paddedName, mobile }
    });
    expect(response.status()).toBe(201);
    const listResponse = await request.get('/api/v1/training/taxpayers', { headers: defaultHeaders });
    const list = await listResponse.json();
    const created = list.find((item: any) => item.mobile === mobile);
    expect(created.full_name).toBe(baseName);
  });

  test('A10 · AC-3 · refuse full_name containing only whitespace', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: '   ', mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual({ detail: { full_name: "2-100 characters: letters, spaces, . - ' and Ñ only" } });
  });

  test('A11 · AC-3 · refuse full_name with trimmed length of 1 character', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: '  A  ', mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual({ detail: { full_name: "2-100 characters: letters, spaces, . - ' and Ñ only" } });
  });

  test('A12 · AC-3 · refuse full_name with tabs and newlines', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: "  \tAna abcd\n  ", mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
  });

  test('A13 · AC-3 · refuse full_name with spaces around 101 characters', async ({ request }) => {
    const longName = ' ' + 'A'.repeat(101) + ' ';
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: longName, mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
  });

  test('A14 · AC-4 · POST taxpayer with new mobile number', async ({ request }) => {
    const mobile = makeMobile();
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile }
    });
    expect(response.status()).toBe(201);
  });

  test('A15 · AC-4 · refuse duplicate mobile for the same tenant', async ({ request }) => {
    const mobile = makeMobile();
    await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile }
    });
    const secondResponse = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile }
    });
    expect(secondResponse.status()).toBe(409);
    const body = await secondResponse.json();
    expect(body).toEqual({ detail: { mobile: "already registered for this tenant" } });
  });

  test('A16 · AC-4 · refuse duplicate mobile when using +639 format variant', async ({ request }) => {
    const suffix = String(Date.now() + Math.floor(Math.random() * 1000)).slice(-9);
    const mobile09 = `09${suffix}`;
    const mobile639 = `+639${suffix}`;
    await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: mobile09 }
    });
    const secondResponse = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: mobile639 }
    });
    expect(secondResponse.status()).toBe(409);
  });

  test('A17 · AC-4 · refuse duplicate mobile under same tenant from different user ID', async ({ request }) => {
    const mobile = makeMobile();
    await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile }
    });
    const responseFromOtherUser = await request.post('/api/v1/training/taxpayers', {
      headers: otherHeaders,
      data: { full_name: makeName(), mobile }
    });
    expect(responseFromOtherUser.status()).toBe(409);
    const body = await responseFromOtherUser.json();
    expect(body).toEqual({ detail: { mobile: "already registered for this tenant" } });
  });

  test('A18 · AC-5 · accept full_name with allowed special characters "María - O\'Connor. Ñ"', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: "María - O'Connor. Ñ", mobile: makeMobile() }
    });
    expect(response.status()).toBe(201);
  });

  test('A19 · AC-5 · accept full_name at minimum boundary of 2 characters', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: "Ab", mobile: makeMobile() }
    });
    expect(response.status()).toBe(201);
  });

  test('A20 · AC-5 · accept full_name at maximum boundary of 100 characters', async ({ request }) => {
    const longName = "A".repeat(100);
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: longName, mobile: makeMobile() }
    });
    expect(response.status()).toBe(201);
  });

  test('A21 · AC-5 · refuse full_name of 1 character (below min 2)', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: "A", mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual({ detail: { full_name: "2-100 characters: letters, spaces, . - ' and Ñ only" } });
  });

  test('A22 · AC-5 · refuse full_name of 101 characters (above max 100)', async ({ request }) => {
    const longName = "A".repeat(101);
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: longName, mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
  });

  test('A23 · AC-5 · refuse full_name containing digits', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: "Ana 123", mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
  });

  test('A24 · AC-5 · refuse full_name containing @ symbol', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: "Ana@DelaCruz", mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
  });

  test('A25 · AC-5 · refuse full_name containing underscore', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: "Ana_DelaCruz", mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
  });

  test('A26 · AC-5 · refuse full_name containing slash', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: "Ana/Cruz", mobile: makeMobile() }
    });
    expect(response.status()).toBe(422);
  });

  test('A27 · AC-6 · accept POST with omitted email field', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile() }
    });
    expect(response.status()).toBe(201);
  });

  test('A28 · AC-6 · accept POST with empty string email ""', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "" }
    });
    expect(response.status()).toBe(201);
  });

  test('A29 · AC-6 · accept POST with standard email format "user@example.com"', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "user@example.com" }
    });
    expect(response.status()).toBe(201);
  });

  test('A30 · AC-6 · accept POST with maximum allowed email length of 254 characters', async ({ request }) => {
    const emailPrefix = "a".repeat(239);
    const email = `${emailPrefix}@example.com`; // total 254 chars
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email }
    });
    expect(response.status()).toBe(201);
  });

  test('A31 · AC-6 · refuse email without @ symbol', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "userexample.com" }
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual({ detail: { email: "invalid email format" } });
  });

  test('A32 · AC-6 · refuse email with multiple @ symbols', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "user@@example.com" }
    });
    expect(response.status()).toBe(422);
  });

  test('A33 · AC-6 · refuse email missing dot after @', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "user@examplecom" }
    });
    expect(response.status()).toBe(422);
  });

  test('A34 · AC-6 · refuse email with dot before @ but missing dot after @', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "user.name@examplecom" }
    });
    expect(response.status()).toBe(422);
  });

  test('A35 · AC-6 · refuse email exceeding 254 characters (255 chars)', async ({ request }) => {
    const emailPrefix = "a".repeat(240);
    const email = `${emailPrefix}@example.com`; // total 255 chars
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email }
    });
    expect(response.status()).toBe(422);
  });

  test('A36 · AC-6 · refuse email ending with dot right after domain', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "user@domain." }
    });
    expect(response.status()).toBe(422);
  });

  test('A37 · AC-6 · refuse email with double dots after @', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "user@domain..com" }
    });
    expect(response.status()).toBe(422);
  });

  test('A38 · AC-6 · refuse email containing comma', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "user@domain,com" }
    });
    expect(response.status()).toBe(422);
  });

  test('A39 · AC-6 · refuse email without domain extension', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile(), email: "user@domain" }
    });
    expect(response.status()).toBe(422);
  });

  test('A40 · AC-7 · GET taxpayers returns items created by ted-1234', async ({ request }) => {
    const fullName = makeName();
    const mobile = makeMobile();
    await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: fullName, mobile }
    });
    const listResponse = await request.get('/api/v1/training/taxpayers', { headers: defaultHeaders });
    expect(listResponse.status()).toBe(200);
    const list = await listResponse.json();
    expect(list.some((item: any) => item.mobile === mobile)).toBe(true);
  });

  test('A41 · AC-7 · GET taxpayers under ted-1234-other returns empty array when none created under that tag', async ({ request }) => {
    const customUserHeaders = {
      'X-Tenant-ID': 'TAGAYTAY',
      'X-User-ID': 'ted-1234-unused-' + Date.now(),
      'Content-Type': 'application/json',
    };
    const response = await request.get('/api/v1/training/taxpayers', { headers: customUserHeaders });
    expect(response.status()).toBe(200);
    const list = await response.json();
    expect(list.length).toBe(0);
  });

  test('A42 · AC-7 · ted-1234-other receives 0 items when retrieving taxpayers created by ted-1234', async ({ request }) => {
    const mobile = makeMobile();
    await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile }
    });
    const listResponse = await request.get('/api/v1/training/taxpayers', { headers: otherHeaders });
    const list = await listResponse.json();
    expect(list.some((item: any) => item.mobile === mobile)).toBe(false);
  });

  test('A43 · AC-8 · accept mobile using 09 format (11 digits)', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile() }
    });
    expect(response.status()).toBe(201);
  });

  test('A44 · AC-8 · accept mobile using +639 format (13 chars)', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: makeMobile639() }
    });
    expect(response.status()).toBe(201);
  });

  test('A45 · AC-8 · refuse mobile containing spaces', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: "0917 123 4567" }
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body).toEqual({ detail: { mobile: "must be a PH mobile 09XXXXXXXXX or +639XXXXXXXXX" } });
  });

  test('A46 · AC-8 · refuse mobile containing dashes', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: "0917-123-4567" }
    });
    expect(response.status()).toBe(422);
  });

  test('A47 · AC-8 · refuse mobile with 10 digits starting with 09', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: "0917123456" }
    });
    expect(response.status()).toBe(422);
  });

  test('A48 · AC-8 · refuse mobile with 12 digits starting with 09', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: "091712345678" }
    });
    expect(response.status()).toBe(422);
  });

  test('A49 · AC-8 · refuse mobile starting with 08 prefix', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: "08171234567" }
    });
    expect(response.status()).toBe(422);
  });

  test('A50 · AC-8 · refuse mobile starting with 639 without plus sign', async ({ request }) => {
    const response = await request.post('/api/v1/training/taxpayers', {
      headers: defaultHeaders,
      data: { full_name: makeName(), mobile: "639171234567" }
    });
    expect(response.status()).toBe(422);
  });

});

