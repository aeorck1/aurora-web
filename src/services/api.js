
// Aurora API Service Layer
// src/services/api.js

// All backend communication goes through this
// module. Errors are handled gracefully so the
// app degrades to local-only mode if the API
// is unavailable.

const API_BASE = "https://aiurora-backend-production.up.railway.app";

const defaultHeaders = { "Content-Type": "application/json" };

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: defaultHeaders,
    ...options,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}


/**
 * Create a new user account.
 * @returns {{ user_id: string }}
 */
export async function createUser() {
  try {
    return await request("/api/users", {
      method: "POST",
      body: JSON.stringify({ created_at: new Date().toISOString() }),
    });
  } catch {
    // Offline fallback: generate a local pseudo-ID
    // return {
    //   user_id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    // };
  }
}

//  Chat 

/**
 * Fetch a user's full chat history.
 * @param {string} userId
 * @returns {Array<{ id, role, content, created_at }>}
 */
export async function getChatHistory(userId) {
  try {
    return await request(`/api/chat/${userId}`);
  } catch {
    return [];
  }
}

/**
 * Send a message and get Aurora's response.
 * @param {string} userId
 * @param {string} sessionId
 * @param {string} message
 * @returns {{ message: string, session_id: string }}
 */
export async function sendMessage(userId, sessionId, message) {
  return request("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
      message,
    }),
  });
}

/**
 * Send an audio blob and get Aurora's response (fallback when SpeechRecognition is unavailable).
 * @param {string} userId
 * @param {string} sessionId
 * @param {Blob}   audioBlob
 * @returns {{ message: string }}
 */
export async function sendAudioMessage(userId, sessionId, audioBlob) {
  const form = new FormData();
  form.append("user_id",    userId);
  form.append("session_id", sessionId);
  form.append("audio",      audioBlob, "recording.webm");

  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    body: form,
    // Note: do NOT set Content-Type here — browser sets multipart boundary automatically
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

export default { createUser, getChatHistory, sendMessage, sendAudioMessage };
