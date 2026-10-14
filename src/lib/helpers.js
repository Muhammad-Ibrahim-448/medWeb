export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const effectivePrice = (product) => {
  if (!product) return 0;
  return Number(product.sale_price ?? product.price ?? 0);
};

export const discountPercent = (product) => {
  const price = Number(product?.price || 0);
  const sale = Number(product?.sale_price || 0);
  if (!sale || sale >= price) return 0;
  return Math.round(((price - sale) / price) * 100);
};

export const stockStatus = (product) => {
  const qty = Number(product?.stock_quantity || 0);
  const threshold = Number(product?.low_stock_threshold || 5);
  if (qty <= 0) return { label: 'Out of Stock', color: 'text-red-600', key: 'out' };
  if (qty <= threshold) return { label: `Only ${qty} left`, color: 'text-amber-600', key: 'low' };
  return { label: 'In Stock', color: 'text-green-600', key: 'in' };
};

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join('');