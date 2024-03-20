
export function convertToCurrencyTHB(currency: number, styleCurrency: "THB" | "฿") {
  return currency.toLocaleString(styleCurrency === "THB" ? 'en-US' : "th-Th", {
    style: 'currency',
    currency: 'THB', // Currency code for Thai Baht
    minimumFractionDigits: 0, // Show 0 decimal places
    maximumFractionDigits: 0, // Show 0 decimal places
  })
}

export function convertToCurrencyTHBVat(currency: string, styleCurrency: "THB" | "฿") {
  const currencyAsFloat = parseFloat(currency); // Parse the currency parameter as a float

  return currencyAsFloat.toLocaleString(styleCurrency === "THB" ? 'en-US' : "th-Th", {
    style: 'currency',
    currency: 'THB', // Currency code for Thai Baht
    minimumFractionDigits: 0, // Show 0 decimal places
    maximumFractionDigits: 2, // Show 0 decimal places
  });
}