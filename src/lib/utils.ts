import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert integer cents to a display string like "9,999.99" */
export function centsToDisplay(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Convert a display string like "9.99" to integer cents */
export function displayToCents(value: string): number {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

// Currencies where the symbol appears after the number: "1,394.83 kr."
const SUFFIX_CURRENCIES = new Set(["DKK", "SEK", "NOK", "ISK"]);
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£",
  DKK: "kr", SEK: "kr", NOK: "kr",
  CHF: "CHF", CAD: "CA$", AUD: "A$", JPY: "¥",
};

/** Format a display string with the correct currency symbol placement.
 *  Prefix currencies: "$9.99"  |  Suffix currencies: "9.99 kr." */
export function formatAmount(valueStr: string, currency: string): string {
  if (SUFFIX_CURRENCIES.has(currency)) {
    const sym = CURRENCY_SYMBOLS[currency] ?? currency;
    return `${valueStr} ${sym}.`;
  }
  const sym = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${sym}${valueStr}`;
}

/** Normalise a subscription's amountCents to monthly cents */
export function toMonthlyCents(amountCents: number, billingCycle: string): number {
  if (billingCycle === "annual") return Math.round(amountCents / 12);
  return amountCents;
}
