// ─────────────────────────────────────────────
// Chat Bubble
// src/components/ChatBubble.jsx
// ─────────────────────────────────────────────
// Renders a single user or AI message bubble.
// data-user attribute drives CSS branching.

import styles from "../styles/components/chat-bubble.module.css";

export default function ChatBubble({ message, isUser, isTyping }) {
  return (
    <div className={styles.wrapper} data-user={String(isUser)}>
      {/* Aurora avatar — AI messages only */}
      {!isUser && <div className={styles.avatar}>✦</div>}

      <div className={styles.bubble} data-user={String(isUser)}>
        {isTyping ? (
          <div className={styles.typingDots}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        ) : (
          <span className={styles.text}>{message.content}</span>
        )}
      </div>
    </div>
  );
}
