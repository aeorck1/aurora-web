// ─────────────────────────────────────────────
// useAudioRecorder
// src/hooks/useAudioRecorder.js
// ─────────────────────────────────────────────
// Records audio via MediaRecorder API.
// Returns: { isRecording, startRecording,
//            stopRecording, audioBlob }

import { useState, useRef, useCallback } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob,   setAudioBlob]   = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);

  const startRecording = useCallback(async () => {
    setAudioBlob(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        // Stop all tracks to release the microphone indicator
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      // Permission denied or hardware unavailable
      console.warn("[Aurora] Microphone access denied:", err.message);
      throw err;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording, audioBlob };
}
