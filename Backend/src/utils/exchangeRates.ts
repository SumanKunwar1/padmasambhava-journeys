// utils/exchangeRates.ts
//
// Daily FX rates for the two currencies the site quotes in. Everything is
// stored in INR, so INR is the base and the rates say how much ONE rupee is
// worth in each target currency.
//
// The upstream feed refreshes once a day and needs no API key. We cache in
// memory and keep serving the last good response (then a hardcoded floor) if
// it ever goes down, because a pricing page that renders nothing is worse than
// one that is a few days stale.

export type Currency = 'INR' | 'USD';

export const CURRENCIES: Currency[] = ['INR', 'USD'];
export const BASE_CURRENCY: Currency = 'INR';

export interface RateTable {
  base: Currency;
  rates: Record<Currency, number>;
  fetchedAt: string;
  source: 'live' | 'cache' | 'fallback';
}

const RATES_URL = 'https://open.er-api.com/v6/latest/INR';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h — upstream only moves once a day
const REQUEST_TIMEOUT_MS = 8000;

// Last-resort values so pricing still renders if the feed is unreachable on a
// cold start. Refresh these occasionally; they are a floor, not a source.
const FALLBACK_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.0104,
};

let cached: RateTable | null = null;
let cachedAt = 0;
let inFlight: Promise<RateTable> | null = null;

function isUsableRate(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

async function fetchRates(): Promise<RateTable> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(RATES_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Rate provider responded ${response.status}`);
    }

    const body = (await response.json()) as {
      result?: string;
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };

    if (body.result !== 'success' || !body.rates) {
      throw new Error('Rate provider returned an unsuccessful payload');
    }

    // Only trust the response if every currency we quote is present and sane.
    // A partial table would silently mis-price a product.
    const rates = {} as Record<Currency, number>;
    for (const currency of CURRENCIES) {
      const value = currency === BASE_CURRENCY ? 1 : body.rates[currency];
      if (!isUsableRate(value)) {
        throw new Error(`Rate provider is missing a usable ${currency} rate`);
      }
      rates[currency] = value;
    }

    return {
      base: BASE_CURRENCY,
      rates,
      fetchedAt: body.time_last_update_utc
        ? new Date(body.time_last_update_utc).toISOString()
        : new Date().toISOString(),
      source: 'live',
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Current rates, served from cache when fresh. Never rejects: a failed refresh
 * degrades to the previous table, then to the hardcoded fallback.
 */
export async function getExchangeRates(): Promise<RateTable> {
  const isFresh = cached && Date.now() - cachedAt < CACHE_TTL_MS;
  if (cached && isFresh) {
    return { ...cached, source: 'cache' };
  }

  // Collapse concurrent refreshes so a burst of traffic makes one upstream call.
  if (!inFlight) {
    inFlight = fetchRates()
      .then((table) => {
        cached = table;
        cachedAt = Date.now();
        return table;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  try {
    return await inFlight;
  } catch (error) {
    console.error('Exchange rate refresh failed:', (error as Error).message);

    if (cached) {
      return { ...cached, source: 'cache' };
    }

    return {
      base: BASE_CURRENCY,
      rates: { ...FALLBACK_RATES },
      fetchedAt: new Date().toISOString(),
      source: 'fallback',
    };
  }
}
