
// Chat Page
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "../styles/pages/chat.module.css";
import { useAurora } from "../store/AuroraContext";
import { Storage, StorageKeys } from "../utils/storage";
import { getChatHistory, sendMessage, sendAudioMessage } from "../services/api";
import BgBlobs from "../components/BgBlobs";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello, I'm Aurora 🌸\n\nThis is a safe, private space just for you. I'm here to listen — whether you want to talk through your feelings, work through something difficult, or simply reflect on your day.\n\nWhat's on your mind today?",
};

const CONVERSATION_STARTERS = [
  "I've been feeling anxious lately",
  "I need to talk about something",
  "Help me reflect on my day",
  "I'm struggling with a decision",
];

export default function ChatPage() {
  const { userId, sessionId, initUser } = useAurora();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const isInitializedRef = useRef(false);

  const resolveUser = useCallback(async () => {
    let uid = userId || Storage.get(StorageKeys.userId);
    if (!uid) uid = await initUser();
    return uid;
  }, [initUser, userId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load history once
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    (async () => {
      try {
        const uid = await resolveUser();
        const history = await getChatHistory(uid);
        if (history && history.length > 0) {
          setMessages(history.map((m) => ({
            id: m.id || Date.now() + Math.random(),
            role: m.role,
            content: m.content || m.message,
          })));
        } else {
          setMessages([WELCOME_MESSAGE]);
        }
      } catch {
        setMessages([{ ...WELCOME_MESSAGE, content: "Hello, I'm Aurora 🌸\n\nThis is a safe, private space just for you. What's on your mind today?" }]);
      } finally {
        setIsLoadingHistory(false);
      }
    })();
  }, [resolveUser]);

  // ── Generic message dispatcher ────────────
  const dispatchMessage = useCallback(async ({ text, audioBlob }) => {
    if ((!text && !audioBlob) || isLoading) return;

    const uid = await resolveUser();
    const sid = sessionId || Storage.get(StorageKeys.sessionId);

    const userMsg = {
      id: `u_${Date.now()}`,
      role: "user",
      content: text || "🎤 Voice message",
    };
    setMessages((prev) => [...prev, userMsg]);
    if (text) setInput("");
    setIsLoading(true);
    setError(null);

    const typingId = `typing_${Date.now()}`;
    setMessages((prev) => [...prev, { id: typingId, role: "assistant", content: "", isTyping: true }]);

    try {
      const response = audioBlob
        ? await sendAudioMessage(uid, sid, audioBlob)
        : await sendMessage(uid, sid, text);

      setMessages((prev) =>
        prev.filter((m) => m.id !== typingId).concat({
          id: `a_${Date.now()}`,
          role: "assistant",
          content: response.message || response.reply || response.response ||
            "I hear you. Can you tell me more about what you're experiencing?",
        })
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      setMessages((prev) => [...prev, {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: "There is a network error",
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, resolveUser, sessionId]);

  const handleSend = () => dispatchMessage({ text: input });
  const handleAudioReady = (blob) => dispatchMessage({ audioBlob: blob });

  return (
    <div className={styles.page}>
      <BgBlobs />

      <div className={styles.inner}>
        {/* Status pill */}
        <div className={styles.statusWrap}>
          <div className={styles.statusPill}>
            <div className={styles.statusDot} />
            <span className={styles.statusText}>Aurora is here · Private session</span>
          </div>
        </div>

        {/* Chat window */}
        <div className={styles.chatWindow}>
          <div className={styles.messageList}>
            {isLoadingHistory ? (
              <div className={styles.loadingWrap}>
                <div className={styles.loadingDots}>
                  <div className={styles.loadingDot} />
                  <div className={styles.loadingDot} />
                  <div className={styles.loadingDot} />
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    isUser={msg.role === "user"}
                    isTyping={msg.isTyping}
                  />
                ))}

                {/* Conversation starters */}
                {messages.length === 1 && !isLoading && (
                  <div className={styles.starters}>
                    {CONVERSATION_STARTERS.map((s) => (
                      <button
                        key={s}
                        className={styles.starterBtn}
                        onClick={() => setInput(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            onAudioReady={handleAudioReady}
            placeholder="Share what's on your mind…"
            disabled={isLoading || isLoadingHistory}
          />
        </div>

        <p className={styles.footerNote}>🔒 This conversation is private to your session</p>
      </div>
    </div>
  );
}
