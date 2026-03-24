
// Export Journal Utility

// Generates a formatted .txt file from the
// user's journal entries and triggers a download.

/**
 * Download all journal entries as a .txt file.
 * @param {Array} entries - Journal entry array from state
 */
export function exportJournalToText(entries) {
  if (!entries || entries.length === 0) {
    alert("No journal entries to export.");
    return;
  }

  const formatted = entries
    .map((e) => {
      const date = new Date(e.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = new Date(e.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const mood = e.mood ? `Mood: ${e.mood}` : "";
      return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📅 ${date} · ${time}${mood ? `\n${mood}` : ""}\n\n${e.content}\n`;
    })
    .join("\n");

  const header = `AURORA — Personal Journal\nExported on ${new Date().toLocaleDateString()}\n${entries.length} entries\n${"─".repeat(32)}\n\n`;
  const content = header + formatted;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aurora-journal-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
