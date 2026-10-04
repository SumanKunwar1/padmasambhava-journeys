// src/lib/currency.ts
//
// One rule governs every price on the site: amounts are stored in INR, and a
// currency the admin filled in by hand always beats a converted one.

export type Currency = "INR" | "USD";

export const CURRENCIES: Currency[] = ["INR", "USD"];

/** Everything in the database is INR. */
export const BASE_CURRENCY: Currency = "INR";

/** What a first-time visitor sees before they pick anything. */
export const DEFAULT_CURRENCY: Currency = "USD";

export const CURRENCY_META: Record<
  Currency,
  { symbol: string; label: string; locale: string; decimals: number }
> = {
  INR: { symbol: "₹", label: "Indian Rupee", locale: "en-IN", decimals: 0 },
  USD: { symbol: "$", label: "US Dollar", locale: "en-US", decimals: 0 },
};

/** How much one INR is worth in each currency. */
export type RateTable = Record<Currency, number>;

export const FALLBACK_RATES: RateTable = {
  INR: 1,
  USD: 0.0104,
};

/** The manual per-currency prices an admin may have entered on a record. */
export interface PriceOverrides {
  priceUSD?: number | null;
}

export interface ResolvedPrice {
  amount: number;
  currency: Currency;
  /** True when this came from the day's rate rather than a typed-in price. */
  isConverted: boolean;
}

function isUsableAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/**
 * Rounds to something a person would actually see on a price tag. Small USD
 * figures keep their precision; four-figure rupee amounts lose the noise so a
 * converted price does not read as a suspiciously exact 41,837.
 */
function roundForDisplay(amount: number, currency: Currency): number {
  if (currency === "USD") {
    return amount < 100 ? Math.round(amount) : Math.round(amount / 5) * 5;
  }
  if (amount >= 10000) return Math.round(amount / 100) * 100;
  if (amount >= 1000) return Math.round(amount / 10) * 10;
  return Math.round(amount);
}

export function convert(
  amountInBase: number,
  target: Currency,
  rates: RateTable
): number {
  const rate = rates[target];
  if (!isUsableAmount(rate)) return amountInBase;
  return amountInBase * rate;
}

/**
 * The price to show for `target`, given an INR base and whatever manual prices
 * exist on the record. A manual price is returned verbatim and never rounded —
 * if an admin typed 1,499 they mean 1,499.
 */
export function resolvePrice(
  basePriceINR: number,
  overrides: PriceOverrides | undefined,
  target: Currency,
  rates: RateTable
): ResolvedPrice {
  const manual = target === "USD" ? overrides?.priceUSD : undefined;

  if (isUsableAmount(manual)) {
    return { amount: manual, currency: target, isConverted: false };
  }

  if (target === BASE_CURRENCY) {
    return { amount: basePriceINR, currency: target, isConverted: false };
  }

  return {
    amount: roundForDisplay(convert(basePriceINR, target, rates), target),
    currency: target,
    isConverted: true,
  };
}

/**
 * A secondary amount (an original price, a per-date price, a booking total)
 * that has no manual override of its own. When the headline price for this
 * currency WAS set by hand, the same ratio is applied so the discount stays
 * consistent — otherwise a hand-set USD price against a converted USD
 * original would advertise a discount nobody intended.
 */
export function resolveRelatedPrice(
  relatedPriceINR: number,
  basePriceINR: number,
  overrides: PriceOverrides | undefined,
  target: Currency,
  rates: RateTable
): ResolvedPrice {
  const headline = resolvePrice(basePriceINR, overrides, target, rates);

  if (!headline.isConverted && basePriceINR > 0 && target !== BASE_CURRENCY) {
    const ratio = headline.amount / basePriceINR;
    return {
      amount: roundForDisplay(relatedPriceINR * ratio, target),
      currency: target,
      isConverted: false,
    };
  }

  if (target === BASE_CURRENCY) {
    return { amount: relatedPriceINR, currency: target, isConverted: false };
  }

  return {
    amount: roundForDisplay(convert(relatedPriceINR, target, rates), target),
    currency: target,
    isConverted: true,
  };
}

export function formatPrice(
  amount: number,
  currency: Currency,
  options: { withSymbol?: boolean } = {}
): string {
  const { symbol, locale, decimals } = CURRENCY_META[currency];
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.round(amount));

  return options.withSymbol === false ? formatted : `${symbol}${formatted}`;
}
