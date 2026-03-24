
// Aurora Context (Global State)


import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Storage, StorageKeys } from "../utils/storage";
import { createUser } from "../services/api";
import { exportJournalToText } from "../utils/exportJournal";

export const AuroraContext = createContext(null);

/** Access global Aurora state from any component. */
export const useAurora = () => useContext(AuroraContext);

export function AuroraProvider({ children }) {
  const [theme, setTheme] = useState(() => Storage.get(StorageKeys.theme) || "light");
  const [userId, setUserId] = useState(() => Storage.get(StorageKeys.userId));
  const [sessionId, setSessionId] = useState(() => Storage.get(StorageKeys.sessionId));
  const [journal, setJournal] = useState(() => Storage.get(StorageKeys.journal) || []);
  const [isOnboarded, setIsOnboarded] = useState(() => !!Storage.get(StorageKeys.onboarded));
  const [currentPage, setCurrentPage] = useState("landing");

  // Sync theme attribute + persist to storage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    Storage.set(StorageKeys.theme, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // ── User Initialisation ───────────────────

  const initUser = useCallback(async () => {
    if (userId) return userId;
    const { user_id } = await createUser();
    const sid = `session_${Date.now()}`;
    Storage.set(StorageKeys.userId, user_id);
    Storage.set(StorageKeys.sessionId, sid);
    Storage.set(StorageKeys.onboarded, true);
    setUserId(user_id);
    setSessionId(sid);
    setIsOnboarded(true);
    return user_id;
  }, [userId]);

  // Auto-init on first load if no user exists
  useEffect(() => {
    if (!Storage.get(StorageKeys.userId)) {
      initUser();
    }
  }, [initUser]);

  // ── Journal CRUD ─────────────────────────

  const addJournalEntry = (entry) => {
    const newEntry = {
      id: `j_${Date.now()}`,
      ...entry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJournal((prev) => {
      const updated = [newEntry, ...prev];
      Storage.set(StorageKeys.journal, updated);
      return updated;
    });
    return newEntry;
  };

  const updateJournalEntry = (id, updates) => {
    setJournal((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
      );
      Storage.set(StorageKeys.journal, updated);
      return updated;
    });
  };

  const deleteJournalEntry = (id) => {
    setJournal((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      Storage.set(StorageKeys.journal, updated);
      return updated;
    });
  };

  // ── Data Management ───────────────────────

  const clearAllData = () => {
    Storage.clear();
    setUserId(null);
    setSessionId(null);
    setJournal([]);
    setIsOnboarded(false);
    setCurrentPage("landing");
  };

  const exportJournal = () => exportJournalToText(journal);

  return (
    <AuroraContext.Provider
      value={{
        theme,
        toggleTheme,
        userId,
        sessionId,
        journal,
        isOnboarded,
        currentPage,
        setCurrentPage,
        initUser,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        clearAllData,
        exportJournal,
      }}
    >
      {children}
    </AuroraContext.Provider>
  );
}
