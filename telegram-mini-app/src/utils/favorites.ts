import { useState } from 'react';

const STORAGE_KEY = 'umkafit_favorites';

export interface FavoriteItem {
  id: string;
  title: string;
  href: string;
}

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (x): x is FavoriteItem =>
        typeof x === 'object' &&
        x !== null &&
        typeof (x as FavoriteItem).id === 'string' &&
        typeof (x as FavoriteItem).title === 'string' &&
        typeof (x as FavoriteItem).href === 'string'
    );
  } catch {
    return [];
  }
}

function saveFavorites(items: FavoriteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function getFavorites(): FavoriteItem[] {
  return loadFavorites();
}

export function isFavorite(id: string): boolean {
  return loadFavorites().some((f) => f.id === id);
}

export function addFavorite(item: FavoriteItem): void {
  const list = loadFavorites();
  if (list.some((f) => f.id === item.id)) return;
  saveFavorites([...list, item]);
}

export function removeFavorite(id: string): void {
  saveFavorites(loadFavorites().filter((f) => f.id !== id));
}

export function toggleFavorite(item: FavoriteItem): boolean {
  const list = loadFavorites();
  const idx = list.findIndex((f) => f.id === item.id);
  if (idx >= 0) {
    saveFavorites(list.filter((_, i) => i !== idx));
    return false;
  }
  saveFavorites([...list, item]);
  return true;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => loadFavorites());

  const refresh = () => setFavorites(loadFavorites());

  const toggle = (item: FavoriteItem) => {
    toggleFavorite(item);
    refresh();
  };

  const isFavoriteId = (id: string) => favorites.some((f) => f.id === id);

  return { favorites, isFavoriteId, toggle };
}
