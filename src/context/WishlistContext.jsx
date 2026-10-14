// src/context/WishlistContext.jsx
'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);          // array of product objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set of product IDs for O(1) "is wishlisted?" lookups
  const [ids, setIds] = useState(() => new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/wishlist', { cache: 'no-store' });
      if (res.status === 401) {
        setItems([]);
        setIds(new Set());
        return;
      }
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
        setIds(new Set((data.data || []).map((p) => p.id)));
      } else {
        setError(data.message || 'Failed to load wishlist');
      }
    } catch (err) {
      console.error('Wishlist load error:', err);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isWishlisted = useCallback((productId) => ids.has(Number(productId)), [ids]);

  const add = useCallback(async (productId) => {
    const pid = Number(productId);
    // optimistic
    setIds((prev) => new Set(prev).add(pid));
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: pid }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setIds((prev) => { const n = new Set(prev); n.delete(pid); return n; });
        throw new Error('UNAUTHORIZED');
      }
      if (!res.ok || !data.success) {
        setIds((prev) => { const n = new Set(prev); n.delete(pid); return n; });
        throw new Error(data.message || 'Failed to add');
      }
      return true;
    } catch (err) {
      console.error('Wishlist add error:', err);
      throw err;
    }
  }, []);

  const remove = useCallback(async (productId) => {
    const pid = Number(productId);
    setIds((prev) => { const n = new Set(prev); n.delete(pid); return n; });
    setItems((prev) => prev.filter((p) => p.id !== pid));
    try {
      const res = await fetch(`/api/wishlist/${pid}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to remove');
      }
      return true;
    } catch (err) {
      console.error('Wishlist remove error:', err);
      // On failure, just reload to resync
      load();
      throw err;
    }
  }, [load]);

  const toggle = useCallback(
    (productId) => (isWishlisted(productId) ? remove(productId) : add(productId)),
    [isWishlisted, add, remove]
  );

  const clear = useCallback(async () => {
    setItems([]);
    setIds(new Set());
    try {
      await fetch('/api/wishlist', { method: 'DELETE' });
    } catch (err) {
      console.error('Wishlist clear error:', err);
      load();
    }
  }, [load]);

  const value = {
    items,
    ids,
    loading,
    error,
    count: items.length,
    isWishlisted,
    add,
    remove,
    toggle,
    clear,
    refresh: load,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}