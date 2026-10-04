// src/components/shared/Price.tsx
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import {
  formatPrice,
  resolvePrice,
  resolveRelatedPrice,
  type Currency,
  type PriceOverrides,
} from "@/lib/currency";

interface PriceProps extends PriceOverrides {
  /** The stored amount, always in NPR. */
  amount: number;
  /**
   * Set when `amount` is a secondary figure (an original price, a per-date
   * price) that should follow the headline price's manual rate rather than
   * being converted on its own.
   */
  relatedTo?: number;
  className?: string;
  /**
   * Show a "≈" before converted amounts. On by default: a visitor deciding on
   * a trip should know which number is the quoted price and which is today's
   * conversion of it.
   */
  showApprox?: boolean;
  /**
   * Pin this amount to one currency, ignoring the visitor's selection.
   * Used everywhere outside the trip detail price card, so browsing shows
   * one consistent currency and only that card follows the toggle.
   */
  currency?: Currency;
}

/**
 * Renders one amount in whichever currency the visitor has chosen.
 */
export function Price({
  amount,
  relatedTo,
  priceUSD,
  className,
  showApprox = true,
  currency: fixedCurrency,
}: PriceProps) {
  const { currency: selectedCurrency, rates } = useCurrency();
  const currency = fixedCurrency ?? selectedCurrency;
  const overrides = { priceUSD };

  const resolved =
    relatedTo === undefined
      ? resolvePrice(amount, overrides, currency, rates)
      : resolveRelatedPrice(amount, relatedTo, overrides, currency, rates);

  return (
    <span className={cn("whitespace-nowrap tabular-nums", className)}>
      {showApprox && resolved.isConverted && (
        <span
          aria-hidden="true"
          className="mr-0.5 font-normal opacity-70"
          title={`Converted from Indian Rupees at today's rate`}
        >
          ≈
        </span>
      )}
      {formatPrice(resolved.amount, resolved.currency)}
      {resolved.isConverted && (
        <span className="sr-only"> approximately, converted at today's rate</span>
      )}
    </span>
  );
}
