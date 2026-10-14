// src/lib/collections.js
export const COLLECTIONS = {
  gold: {
    slug: 'gold',
    name: 'Gold Collection',
    tagline: 'Timeless 22K & 18K gold craftsmanship',
    description:
      'Explore our finest gold jewellery — handcrafted rings, necklaces, chains, and bangles. Each piece is certified and built to last generations.',
    hero: '/images/home/gold-collection.png',
    accent: 'from-amber-500 via-yellow-500 to-amber-600',
    materials: ['22K Gold', '18K Gold', '18K Rose Gold'],
  },
  silver: {
    slug: 'silver',
    name: 'Silver Collection',
    tagline: 'Refined sterling silver for everyday',
    description:
      'Discover contemporary silver jewellery with clean lines and modern silhouettes. Perfect for daily elegance and effortless layering.',
    hero: '/images/home/silver-collection.png',
    accent: 'from-slate-400 via-slate-300 to-slate-500',
    materials: ['Sterling Silver', '925 Silver'],
  },
  diamond: {
    slug: 'diamond',
    name: 'Diamond Collection',
    tagline: 'Brilliant-cut diamonds, timeless settings',
    description:
      'Our diamond pieces are hand-selected for exceptional clarity and fire. From solitaire rings to tennis bracelets — made for moments that matter.',
    hero: '/images/home/diamond-collection.png',
    accent: 'from-cyan-400 via-sky-400 to-indigo-500',
    materials: ['18K White Gold', '18K Gold', 'Platinum'],
  },
};

export const COLLECTION_LIST = Object.values(COLLECTIONS);

/**
 * Match a product to a collection by its `material`, `stone`, or category name.
 */
export function productMatchesCollection(product, slug) {
  if (!product) return false;
  const hay = [
    product.material,
    product.stone,
    product.category_name,
    product.name,
    product.short_description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (slug === 'gold') return /gold/.test(hay) && !/white gold/.test(hay);
  if (slug === 'silver') return /silver/.test(hay);
  if (slug === 'diamond') return /diamond/.test(hay);
  return false;
}

/**
 * Build a WHERE-clause fragment + params for a collection query.
 * Adjust these rules to match how your products are actually classified.
 */
export function collectionFilter(slug) {
  switch (slug) {
    case 'gold':
      return {
        where: `(p.material LIKE ? OR p.name LIKE ? OR p.short_description LIKE ?)`,
        params: ['%Gold%', '%Gold%', '%Gold%'],
      };
    case 'silver':
      return {
        where: `(p.material LIKE ? OR p.name LIKE ? OR p.short_description LIKE ?)`,
        params: ['%Silver%', '%Silver%', '%Silver%'],
      };
    case 'diamond':
      return {
        where: `(p.stone LIKE ? OR p.name LIKE ? OR p.short_description LIKE ?)`,
        params: ['%Diamond%', '%Diamond%', '%Diamond%'],
      };
    default:
      return { where: '1=1', params: [] };
  }
}