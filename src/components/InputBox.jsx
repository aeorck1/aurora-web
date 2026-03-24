// ─────────────────────────────────────────────
// Input Box
// src/components/InputBox.jsx
// ─────────────────────────────────────────────
// Auto-resizing textarea with a send button.
// Submits on Enter (without Shift) or button click.

export default function InputBox({ value, onChange, onSend, placeholder, disabled }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      style={{
        display: "flex", gap: 10, alignItems: "flex-end",
        padding: "16px 20px",
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        style={{
          flex: 1, border: "1.5px solid var(--border)", borderRadius: 16,
          padding: "10px 16px", background: "var(--bg-input)",
          color: "var(--text-primary)", fontSize: 15, resize: "none",
          outline: "none", transition: "var(--transition)",
          maxHeight: 120, overflowY: "auto",
          fontFamily: "var(--font-body)", lineHeight: 1.5,
        }}
        onFocus={(e)  => (e.target.style.borderColor = "var(--border-focus)")}
        onBlur={(e)   => (e.target.style.borderColor = "var(--border)")}
        onInput={(e)  => {
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
        }}
      />

      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        style={{
          width: 44, height: 44, borderRadius: "50%", border: "none",
          background: value.trim() && !disabled ? "var(--accent)" : "var(--bg-tertiary)",
          color:      value.trim() && !disabled ? "white"        : "var(--text-muted)",
          fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "var(--transition)", flexShrink: 0,
          transform: value.trim() ? "scale(1)" : "scale(0.9)",
        }}
      >
        ↑
      </button>
    </div>
  );
}
