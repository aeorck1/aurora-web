// ─────────────────────────────────────────────
// useSpeechToText
// src/hooks/useSpeechToText.js
// ─────────────────────────────────────────────
// Wraps the Web Speech API (SpeechRecognition).
// Returns: { isSupported, isListening, transcript,
//            startListening, stopListening,
//            resetTranscript }
// Falls back gracefully when not supported.

import { useState, useRef, useCallback } from "react";

// Browser-prefix normalisation
const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export function useSpeechToText() {
  const isSupported = Boolean(SpeechRecognition);
  const [isListening, setIsListening] = useState(false);
  const [transcript,  setTranscript]  = useState("");
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous      = false; // stop automatically after a pause
    recognition.interimResults  = true;
    recognition.lang            = "en-US";
    recognitionRef.current      = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = "";
      let final   = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }
      // Show interim results immediately; commit final
      setTranscript(final || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.warn("[Aurora] SpeechRecognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  }, [isSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => setTranscript(""), []);

  return {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  };
}
