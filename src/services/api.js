import axios from 'axios'

/**
 * Currency exchange support (optional).
 * - If `VITE_EXCHANGE_API_KEY` is set, uses the v6 endpoint.
 * - Otherwise tries a keyless v4 endpoint (may fail depending on provider policy).
 */
export async function getExchangeRate(fromCurrency, toCurrency) {
  const from = String(fromCurrency || '').toUpperCase()
  const to = String(toCurrency || '').toUpperCase()
  if (!from || !to) throw new Error('Missing currency codes')
  if (from === to) return 1

  const apiKey = String(import.meta.env.VITE_EXCHANGE_API_KEY || '').trim()

  // exchangerate-api.com endpoints differ by version; we attempt both styles.
  const urlWithKey = apiKey
    ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`
    : null

  const urlWithoutKey = `https://api.exchangerate-api.com/v4/latest/${from}`

  // Prefer keyed endpoint when present, but fall back to keyless if it fails.
  const tryUrls = urlWithKey ? [urlWithKey, urlWithoutKey] : [urlWithoutKey]

  let lastErr
  for (const url of tryUrls) {
    try {
      const res = await axios.get(url, { timeout: 12000 })
      const data = res.data
      const rates = data?.conversion_rates || data?.rates
      const rate = rates?.[to]
      if (!rate || typeof rate !== 'number') throw new Error('Rate not found in response')
      return rate
    } catch (err) {
      lastErr = err
    }
  }

  throw lastErr || new Error('Unable to fetch exchange rate')
}

