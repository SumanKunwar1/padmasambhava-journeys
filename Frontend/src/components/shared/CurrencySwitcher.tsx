// src/components/shared/CurrencySwitcher.tsx
import { useCurrency } from "@/context/CurrencyContext";
import { CURRENCIES, CURRENCY_META, type Currency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  className?: string;
  /**
   * "compact" is the segmented control for the navbar; "full" is the wider
   * stacked list used inside the mobile menu, where there is room for names.
   */
  variant?: "compact" | "full";
}

export function CurrencySwitcher({
  className,
  variant = "compact",
}: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();

  if (variant === "full") {
    return (
      <div className={cn("space-y-1", className)}>
        <p className="px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Currency
        </p>
        <div className="grid grid-cols-3 gap-2 px-4 pt-1">
          {CURRENCIES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCurrency(code)}
              aria-pressed={currency === code}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2.5 transition-colors",
                currency === code
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:bg-muted"
              )}
            >
              <span className="text-sm font-semibold">{code}</span>
              <span className="text-[10px] leading-tight text-muted-foreground">
                {CURRENCY_META[code].symbol}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted/60 p-0.5",
        className
      )}
      role="group"
      aria-label="Display currency"
    >
      {CURRENCIES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code as Currency)}
          aria-pressed={currency === code}
          title={`Show prices in ${CURRENCY_META[code].label}`}
          className={cn(
            "rounded-full px-2 py-1 text-xs font-semibold transition-colors",
            currency === code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
