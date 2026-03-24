// ─────────────────────────────────────────────
// Journal Card
// src/components/JournalCard.jsx
// ─────────────────────────────────────────────
// Journal entry card with date, mood badge,
// content preview, and edit/delete dropdown.
// Hover behaviour handled by CSS :hover.

import { useState } from "react";
import styles from "../styles/components/journal-card.module.css";
import { MOOD_CONFIG } from "../constants/moods";

export default function JournalCard({ entry, onEdit, onDelete }) {
  const [showOptions, setShowOptions] = useState(false);
  const date      = new Date(entry.createdAt);
  const moodColor = MOOD_CONFIG[entry.mood]?.color;
  const moodBg    = moodColor ? `${moodColor}18` : undefined;

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <div className={styles.dateLabel}>
            {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <div className={styles.timeLabel}>
            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className={styles.headerRight}>
          {/* Mood badge — color is dynamic */}
          {entry.mood && moodColor && (
            <span
              className={styles.moodBadge}
              style={{ background: moodBg, color: moodColor }}
            >
              {entry.mood}
            </span>
          )}

          {/* Options dropdown */}
          <div className={styles.optionsWrap}>
            <button
              className={styles.optionsBtn}
              onClick={() => setShowOptions((v) => !v)}
            >
              ⋯
            </button>

            {showOptions && (
              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownItem} ${styles.edit}`}
                  onClick={() => { onEdit(entry); setShowOptions(false); }}
                >
                  ✏ Edit
                </button>
                <button
                  className={`${styles.dropdownItem} ${styles.delete}`}
                  onClick={() => { onDelete(entry.id); setShowOptions(false); }}
                >
                  ✕ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content preview ── */}
      <p className={styles.excerpt}>{entry.content}</p>
    </div>
  );
}
