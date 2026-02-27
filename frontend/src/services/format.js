export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export const formatNumber = (n) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)

export const formatPercent = (n) =>
  `${n > 0 ? '+' : ''}${n.toFixed(2)}%`
