// ─────────────────────────────────────────────
// Journal Page
// src/pages/JournalPage.jsx
// ─────────────────────────────────────────────
import { useState } from "react";
import styles from "../styles/pages/journal.module.css";
import { useAurora } from "../store/AuroraContext";
import { MOOD_LIST } from "../constants/moods";
import BgBlobs     from "../components/BgBlobs";
import MoodTag     from "../components/MoodTag";
import JournalCard from "../components/JournalCard";

export default function JournalPage() {
  const {
    journal, addJournalEntry, updateJournalEntry,
    deleteJournalEntry, clearAllData, exportJournal,
  } = useAurora();

  const [view,         setView]         = useState("list");
  const [editingEntry, setEditingEntry] = useState(null);
  const [content,      setContent]      = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const filteredJournal = journal.filter(
    (e) => !searchQuery ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.mood && e.mood.includes(searchQuery.toLowerCase()))
  );

  const todayWords = journal
    .filter((e) => new Date(e.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, e) => acc + e.content.split(" ").length, 0);

  const handleSave = () => {
    if (!content.trim()) return;
    if (editingEntry) {
      updateJournalEntry(editingEntry.id, { content, mood: selectedMood });
    } else {
      addJournalEntry({ content, mood: selectedMood });
    }
    setContent(""); setSelectedMood(""); setEditingEntry(null); setView("list");
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setContent(entry.content);
    setSelectedMood(entry.mood || "");
    setView("edit");
  };

  const handleNewEntry = () => {
    setContent(""); setSelectedMood(""); setEditingEntry(null); setView("write");
  };

  const handleCancel = () => {
    setView("list"); setContent(""); setSelectedMood(""); setEditingEntry(null);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure? This will permanently delete all your data — journal entries, chat history, and your account. This cannot be undone.")) {
      clearAllData();
    }
  };

  return (
    <div className={styles.page}>
      <BgBlobs />

      <div className={styles.inner}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>My Journal</h1>
            <p className={styles.headerMeta}>
              🔒 Local only · {journal.length} {journal.length === 1 ? "entry" : "entries"} ·{" "}
              {todayWords > 0 ? `${todayWords} words today` : "No entries today yet"}
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.exportBtn} onClick={exportJournal}>↓ Export</button>
            <button className={styles.newEntryBtn} onClick={handleNewEntry}>+ New entry</button>
            <button className={styles.settingsBtn} onClick={() => setShowSettings((v) => !v)}>⚙</button>
          </div>
        </div>

        {/* ── Settings panel ── */}
        {showSettings && (
          <div className={styles.settingsPanel}>
            <h3 className={styles.settingsTitle}>Privacy &amp; Data</h3>
            <p className={styles.settingsDesc}>
              All journal entries are stored exclusively in your browser's local storage. They never leave your device.
              You can export your journal as a text file or permanently delete all Aurora data.
            </p>
            <div className={styles.settingsActions}>
              <button className={styles.settingsExportBtn} onClick={exportJournal}>Export journal (.txt)</button>
              <button className={styles.settingsDeleteBtn} onClick={handleClearData}>Delete all data</button>
            </div>
          </div>
        )}

        {/* ── Write / Edit panel ── */}
        {(view === "write" || view === "edit") && (
          <div className={styles.editorPanel}>
            <div className={styles.editorBody}>
              <div className={styles.editorDate}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
              <textarea
                className={styles.editorTextarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write freely… this space is yours."
                autoFocus
              />
            </div>

            <div className={styles.editorFooter}>
              <div className={styles.moodRow}>
                <span className={styles.moodLabel}>Mood:</span>
                {MOOD_LIST.map((m) => (
                  <MoodTag
                    key={m} mood={m}
                    selected={selectedMood === m}
                    onClick={() => setSelectedMood(selectedMood === m ? "" : m)}
                  />
                ))}
              </div>

              <div className={styles.editorBtns}>
                <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                <button
                  className={styles.saveBtn}
                  data-active={content.trim() ? "true" : "false"}
                  disabled={!content.trim()}
                  onClick={handleSave}
                >
                  Save entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Search ── */}
        {view === "list" && journal.length > 0 && (
          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries…"
            />
          </div>
        )}

        {/* ── Journal list ── */}
        {view === "list" && (
          <>
            {filteredJournal.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>◈</span>
                <h3 className={styles.emptyTitle}>
                  {searchQuery ? "No entries found" : "Your journal awaits"}
                </h3>
                <p className={styles.emptyDesc}>
                  {searchQuery
                    ? "Try a different search term"
                    : "Begin writing to capture your thoughts, feelings, and reflections. Everything here stays on your device."}
                </p>
                {!searchQuery && (
                  <button className={styles.emptyBtn} onClick={() => setView("write")}>
                    Write your first entry
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.entryGrid}>
                {filteredJournal.map((entry, i) => (
                  <div key={entry.id} className={styles.entryItem} style={{ animationDelay: `${i * 0.05}s` }}>
                    <JournalCard entry={entry} onEdit={handleEdit} onDelete={deleteJournalEntry} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
