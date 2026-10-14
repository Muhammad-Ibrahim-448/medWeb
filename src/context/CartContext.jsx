// src/context/CartContext.jsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import api from '@/lib/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'sj_cart_items';

/* ------------------------------------------------------------------ */
/* Normalize a server cart item into the shape the UI expects          */
/* ------------------------------------------------------------------ */
function normalizeServerItem(row) {
  const unitPrice = Number(row.unit_price ?? row.sale_price ?? row.price ?? 0);
  return {
    cart_item_id: row.cart_item_id ?? row.id ?? null,
    product_id: Number(row.product_id ?? row.id),
    name: row.name,
    slug: row.slug,
    sku: row.sku ?? null,
    price: Number(row.price ?? 0),
    sale_price: row.sale_price != null ? Number(row.sale_price) : null,
    unit_price: unitPrice,
    quantity: Number(row.quantity) || 1,
    stock_quantity: Number(row.stock_quantity) || 0,
    product_status: row.product_status ?? 'active',
    gender: row.gender ?? null,
    category_name: row.category_name ?? null,
    primary_image: row.primary_image ?? row.image ?? null,
    in_stock:
      typeof row.in_stock === 'boolean'
        ? row.in_stock
        : row.product_status === 'active' && Number(row.stock_quantity) > 0,
    line_total: unitPrice * (Number(row.quantity) || 1),
  };
}

/* ------------------------------------------------------------------ */
/* Normalize a locally stored item (guest cart)                        */
/* ------------------------------------------------------------------ */
function normalizeLocalItem(row) {
  const unitPrice = Number(row.unit_price ?? row.sale_price ?? row.price ?? 0);
  const qty = Number(row.quantity) || 1;
  return {
    cart_item_id: null,
    product_id: Number(row.product_id ?? row.id),
    name: row.name,
    slug: row.slug,
    sku: row.sku ?? null,
    price: Number(row.price ?? 0),
    sale_price: row.sale_price != null ? Number(row.sale_price) : null,
    unit_price: unitPrice,
    quantity: qty,
    stock_quantity: Number(row.stock_quantity ?? row.stock ?? 0),
    product_status: 'active',
    gender: row.gender ?? null,
    category_name: row.category_name ?? null,
    primary_image: row.primary_image ?? row.image ?? null,
    in_stock: Number(row.stock_quantity ?? row.stock ?? 1) > 0,
    line_total: unitPrice * qty,
  };
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */
export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const hasMergedGuestCart = useRef(false);

  /* ── 1. Load guest cart from localStorage (once) ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.map(normalizeLocalItem));
        }
      }
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  /* ── 2. Persist guest cart ONLY when not authenticated ── */
  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) {
      // Logged-in carts live on the server; don't mirror to localStorage
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      return;
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          items.map((i) => ({
            product_id: i.product_id,
            name: i.name,
            slug: i.slug,
            price: i.price,
            sale_price: i.sale_price,
            unit_price: i.unit_price,
            quantity: i.quantity,
            stock_quantity: i.stock_quantity,
            primary_image: i.primary_image,
            category_name: i.category_name,
            gender: i.gender,
          }))
        )
      );
    } catch {}
  }, [items, isAuthenticated, hydrated]);

  /* ── 3. Server sync ── */
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      const serverItems = (data?.data?.items || []).map(normalizeServerItem);
      setItems(serverItems);
    } catch (err) {
      // 401 during logout race — ignore
      if (err?.status !== 401) console.error('Cart fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /* ── 4. On login: merge guest cart → server, then fetch ── */
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      hasMergedGuestCart.current = false;
      return;
    }

    if (hasMergedGuestCart.current) return;
    hasMergedGuestCart.current = true;

    (async () => {
      // Merge any pre-login local items into the server cart
      const guestItems = items.filter((i) => i.product_id);
      if (guestItems.length > 0) {
        try {
          await Promise.all(
            guestItems.map((i) =>
              api
                .post('/cart', { productId: i.product_id, quantity: i.quantity })
                .catch(() => null)
            )
          );
        } catch {}
      }
      await fetchCart();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  /* ── 5. addToCart ── */
  const addToCart = useCallback(
    async (productOrId, quantity = 1) => {
      const productId =
        typeof productOrId === 'object' ? productOrId.id : productOrId;

      const product =
        typeof productOrId === 'object' ? productOrId : null;

      if (!productId) throw new Error('Invalid product');

      if (isAuthenticated) {
        // Server-authoritative
        const { data } = await api.post('/cart', { productId, quantity });
        await fetchCart();
        return data;
      }

      // Guest: local update
      if (!product) {
        throw new Error(
          'A full product object is required to add items to a guest cart.'
        );
      }

      setItems((prev) => {
        const existing = prev.find((i) => i.product_id === productId);
        if (existing) {
          return prev.map((i) =>
            i.product_id === productId
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  line_total: i.unit_price * (i.quantity + quantity),
                }
              : i
          );
        }
        return [...prev, normalizeLocalItem({ ...product, quantity })];
      });
    },
    [isAuthenticated, fetchCart]
  );

  /* ── 6. updateQuantity ── */
  const updateQuantity = useCallback(
    async (productId, quantity) => {
      const qty = Math.max(0, Math.floor(Number(quantity) || 0));

      if (isAuthenticated) {
        if (qty === 0) {
          await api.delete(`/cart/${productId}`);
        } else {
          await api.put(`/cart/${productId}`, { quantity: qty });
        }
        await fetchCart();
        return;
      }

      // Guest: local
      if (qty === 0) {
        setItems((prev) => prev.filter((i) => i.product_id !== productId));
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.product_id === productId
              ? { ...i, quantity: qty, line_total: i.unit_price * qty }
              : i
          )
        );
      }
    },
    [isAuthenticated, fetchCart]
  );

  /* ── 7. removeFromCart ── */
  const removeFromCart = useCallback(
    async (productId) => {
      if (isAuthenticated) {
        await api.delete(`/cart/${productId}`);
        await fetchCart();
        return;
      }
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
    },
    [isAuthenticated, fetchCart]
  );

  /* ── 8. clearCart ── */
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      await api.delete('/cart');
    }
    setItems([]);
  }, [isAuthenticated]);

  /* ── 9. isInCart ── */
  const isInCart = useCallback(
    (productId) => items.some((i) => i.product_id === Number(productId)),
    [items]
  );

  const getQuantity = useCallback(
    (productId) =>
      items.find((i) => i.product_id === Number(productId))?.quantity || 0,
    [items]
  );

  /* ── 10. Derived totals ── */
  const { subtotal, itemCount, shipping, total } = useMemo(() => {
    const sub = items.reduce(
      (sum, i) => sum + Number(i.unit_price) * Number(i.quantity),
      0
    );
    const count = items.reduce((sum, i) => sum + Number(i.quantity), 0);

    const freeThreshold =
      Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 5000;
    const baseShipping =
      Number(process.env.NEXT_PUBLIC_SHIPPING_FEE) || 250;

    const ship = sub === 0 || sub >= freeThreshold ? 0 : baseShipping;
    return { subtotal: sub, itemCount: count, shipping: ship, total: sub + ship };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      loading,
      hydrated,
      itemCount,
      totalItems: itemCount,       // alias for convenience
      subtotal,
      shipping,
      total,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isInCart,
      getQuantity,
      refresh: fetchCart,

      // Legacy aliases — keep until all old usages are migrated
      addItem: addToCart,
      removeItem: removeFromCart,
    }),
    [
      items,
      loading,
      hydrated,
      itemCount,
      subtotal,
      shipping,
      total,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isInCart,
      getQuantity,
      fetchCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}