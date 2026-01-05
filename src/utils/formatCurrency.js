// Formats a numeric value into a standardized currency-like string
export const formatCurrency = (value) => {
  // Handle null or undefined values early → return a default "0.00"
  if (value === null || value === undefined) return "0.00";

  // Convert value to string, remove commas (in case user input contains them), and trim spaces
  const cleaned = String(value).replace(/,/g, "").trim();

  // Convert the cleaned string into a floating-point number
  const numericValue = parseFloat(cleaned);

  // If parsing fails (NaN), return the default "0.00"
  if (isNaN(numericValue)) return "0.00";

  // Format number using Intl.NumberFormat:
  // - en-US locale (comma for thousands, dot for decimal)
  // - 2–3 decimal places allowed
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(numericValue);
};

// Formats input string as user types into an input field (live formatting with commas)
export const formatCurrencyInput = (value) => {
  // Handle null, undefined, or empty string → return empty string (so input stays blank)
  if (value === null || value === undefined || value === "") return "";

  // Split value into integer and decimal parts (if a decimal point exists)
  const parts = value.toString().split(".");

  // Add commas to integer part (thousands separators)
  // Regex explanation: \B(?=(\d{3})+(?!\d)) → find positions before groups of 3 digits, not at start
  let formatted = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // If there's a decimal part, reattach it after the formatted integer
  if (parts.length === 2) {
    formatted += "." + parts[1];
  }

  // Return the fully formatted string
  return formatted;
};
