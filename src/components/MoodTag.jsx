// ─────────────────────────────────────────────
// Mood Tag
// src/components/MoodTag.jsx
// ─────────────────────────────────────────────
// Pill-shaped mood selector button.
// Static layout from CSS module; dynamic
// border/bg/color remain inline (per-mood values).

import styles from "../styles/components/mood-tag.module.css";
import { MOOD_CONFIG } from "../constants/moods";

export default function MoodTag({ mood, selected, onClick }) {
  const m = MOOD_CONFIG[mood] ?? MOOD_CONFIG.calm;

  return (
    <button
      onClick={onClick}
      className={styles.tag}
      style={{
        border: `1.5px solid ${selected ? m.color : "var(--border)"}`,
        background: selected ? m.bg : "transparent",
        color: selected ? m.color : "var(--text-muted)",
      }}
    >
      <span className={styles.emoji}>{m.emoji}</span> {mood}
    </button>
  );
}
