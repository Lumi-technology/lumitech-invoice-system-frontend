export const CURRENCIES = [
  { code: "KES", name: "Kenyan Shilling" },
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "USD", name: "US Dollar" },
  { code: "GBP", name: "British Pound" },
  { code: "EUR", name: "Euro" },
  { code: "ZAR", name: "South African Rand" },
  { code: "RWF", name: "Rwandan Franc" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "XOF", name: "West African CFA Franc" },
  { code: "XAF", name: "Central African CFA Franc" },
];

export const CURRENCY_CODES = CURRENCIES.map(c => c.code);

/** Format a number in a given currency */
export function formatCurrency(amount, currencyCode = "KES") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount ?? 0);
}
