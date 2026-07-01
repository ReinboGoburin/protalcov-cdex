"use client";

import type { CollectionItem, ItemDetail } from "./types";

export const COLLECTION_KEY = "alcove_collection";
export const PENDING_ITEM_KEY = "alcove_pending_item";
export const SELECTED_ITEM_KEY = "alcove_selected_item";

export function readCollection(): CollectionItem[] {
  try {
    const raw = window.localStorage.getItem(COLLECTION_KEY);
    const items = raw ? (JSON.parse(raw) as CollectionItem[]) : [];
    return items.sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt));
  } catch {
    return [];
  }
}

export function writeCollection(items: CollectionItem[]) {
  window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(items));
}

export function savePendingItem(item: ItemDetail) {
  window.sessionStorage.setItem(PENDING_ITEM_KEY, JSON.stringify(item));
}

export function readPendingItem(): ItemDetail | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_ITEM_KEY);
    return raw ? (JSON.parse(raw) as ItemDetail) : null;
  } catch {
    return null;
  }
}

export function saveSelectedItem(item: ItemDetail) {
  window.sessionStorage.setItem(SELECTED_ITEM_KEY, JSON.stringify(item));
}

export function readSelectedItem(): ItemDetail | null {
  try {
    const raw = window.sessionStorage.getItem(SELECTED_ITEM_KEY);
    return raw ? (JSON.parse(raw) as ItemDetail) : null;
  } catch {
    return null;
  }
}

export function upsertItem(detail: ItemDetail, comment: CollectionItem["comment"]) {
  const current = readCollection();
  const exists = current.some((item) => item.id === detail.id && item.type === detail.type);
  if (exists) return { ok: false, reason: "duplicate" as const };

  writeCollection([{ ...detail, comment, addedAt: new Date().toISOString() }, ...current]);
  return { ok: true as const };
}

export function updateComment(id: string, type: string, comment: CollectionItem["comment"]) {
  const current = readCollection();
  writeCollection(current.map((item) => (item.id === id && item.type === type ? { ...item, comment } : item)));
}

export function removeItem(id: string, type: string) {
  const current = readCollection();
  const removed = current.find((item) => item.id === id && item.type === type) || null;
  writeCollection(current.filter((item) => item.id !== id || item.type !== type));
  return removed;
}

export function restoreItem(item: CollectionItem) {
  const current = readCollection();
  writeCollection([item, ...current.filter((entry) => entry.id !== item.id || entry.type !== item.type)]);
}
