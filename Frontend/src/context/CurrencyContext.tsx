// src/context/CurrencyContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api-config";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  FALLBACK_RATES,
  type Currency,
  type RateTable,
} from "@/lib/currency";

// Bumped when DEFAULT_CURRENCY changed to USD: the old key holds choices
// visitors made under the previous default, and reading those back would
// keep showing them a currency the site no longer leads with.
const STORAGE_KEY = "padmasambhava.currency.v2";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (next: Currency) => void;
  rates: RateTable;
  /** True until the day's rates land; prices render from fallbacks meanwhile. */
  isLoadingRates: boolean;
  /** When the upstream feed last published, for the "rates as of" note. */
  ratesUpdatedAt: string | null;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

function readStoredCurrency(): Currency {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && CURRENCIES.includes(stored as Currency)) {
      return stored as Currency;
    }
  } catch {
    // Private browsing or blocked storage — fall through to the default.
  }
  return DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() =>
    typeof window === "undefined" ? DEFAULT_CURRENCY : readStoredCurrency()
  );
  const [rates, setRates] = useState<RateTable>(FALLBACK_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadRates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/exchange-rates`);
        const table = response.data?.data;
        if (cancelled || !table?.rates) return;

        // Only adopt the table if every currency came back usable. A partial
        // response would silently mis-price whatever it was missing.
        const isComplete = CURRENCIES.every(
          (code) =>
            typeof table.rates[code] === "number" && table.rates[code] > 0
        );
        if (!isComplete) return;

        setRates(table.rates as RateTable);
        setRatesUpdatedAt(table.fetchedAt ?? null);
      } catch (error) {
        // Keep the fallback rates. Prices still render, just not at today's
        // exact rate, which beats showing nothing.
        console.error("Could not load exchange rates:", error);
      } finally {
        if (!cancelled) setIsLoadingRates(false);
      }
    };

    loadRates();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not being able to remember the choice is not worth failing over.
    }
  };

  const value = useMemo(
    () => ({ currency, setCurrency, rates, isLoadingRates, ratesUpdatedAt }),
    [currency, rates, isLoadingRates, ratesUpdatedAt]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
