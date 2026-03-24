
// Chat Bubble

import styles from "../styles/components/chat-bubble.module.css";

export default function ChatBubble({ message, isUser, isTyping }) {
  return (
    <div className={styles.wrapper} data-user={String(isUser)}>
      {/* Aura avatar — AI messages only */}
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
