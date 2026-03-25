export function formatCurrencyINR(amount) {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num)
}

export function formatCurrency(amount, currency = 'INR') {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(num)
}

