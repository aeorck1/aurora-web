// ─────────────────────────────────────────────
// Storage Abstraction (Privacy Layer)
// src/utils/storage.js
// ─────────────────────────────────────────────
// Wraps localStorage with JSON serialisation,
// error swallowing, and scoped key names.
// Only Aurora's own keys are cleared on reset.

const PREFIX = "aurora_";

function key(name) {
  return `${PREFIX}${name}`;
}

export const StorageKeys = {
  userId:    key("user_id"),
  sessionId: key("session_id"),
  journal:   key("journal"),
  theme:     key("theme"),
  onboarded: key("onboarded"),
};

export const Storage = {
  get(userSession) {
    try {
      const raw = localStorage.getItem(userSession);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(userSession, value) {
    try {
      localStorage.setItem(k, JSON.stringify(value));
      return true;
    } catch {
      console.warn("[Aurora] Storage write failed for key:", userSession);
      return false;
    }
  },

  remove(userSession) {
    localStorage.removeItem(userSession);
  },

  /** Clears only Aurora's own keys — leaves other site data untouched. */
  clear() {
    Object.values(StorageKeys).forEach((userSession) => localStorage.removeItem(userSession));
  },
};
