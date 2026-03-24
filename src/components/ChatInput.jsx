/* Voice flow:
  1. Click mic → SpeechRecognition starts (if supported) + MediaRecorder starts
  2. Click mic again → both stop; transcript populates textarea
  3. If SpeechRecognition not supported → audioBlob passed to onAudioReady()
   4. Permission denied → mic button disabled gracefully 
   */

import { useState, useEffect, useCallback } from "react";
import styles from "../styles/components/chat-input.module.css";
import { useSpeechToText }  from "../hooks/useSpeechToText";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

export default function ChatInput({
  value,
  onChange,
  onSend,
  onAudioReady, // called with audioBlob when SpeechRecognition is unavailable
  placeholder,
  disabled,
}) {
  const [micBlocked, setMicBlocked] = useState(false);

  
  const {
    isSupported: speechSupported,
    isListening, transcript,
    startListening, stopListening, resetTranscript,
  } = useSpeechToText();

  const {
    isRecording, startRecording, stopRecording, audioBlob,
  } = useAudioRecorder();

  // When SpeechRecognition produces a transcript, populate the input
  useEffect(() => {
    if (transcript) onChange(transcript);
  }, [transcript, onChange]);

  // When MediaRecorder produces a blob (fallback path), pass it up
  useEffect(() => {
    if (audioBlob && !speechSupported && onAudioReady) {
      onAudioReady(audioBlob);
    }
  }, [audioBlob, speechSupported, onAudioReady]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  
  const handleMicToggle = useCallback(async () => {
    if (isRecording || isListening) {
      // Stop everything
      stopRecording();
      stopListening();
      return;
    }

    // Start recording
    resetTranscript();
    try {
      await startRecording();
      if (speechSupported) startListening();
    } catch {
      // Permission denied
      setMicBlocked(true);
    }
  }, [
    isRecording, isListening,
    stopRecording, stopListening,
    startRecording, startListening,
    resetTranscript, speechSupported,
  ]);

  const isActive   = isRecording || isListening;
  const hasText    = value.trim().length > 0;

  return (
    <div className={styles.inputBar}>
      {/* ── Textarea ── */}
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isActive ? "Listening…" : placeholder}
        disabled={disabled}
        rows={1}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
        }}
      />

      
      <button
        className={styles.micBtn}
        onClick={handleMicToggle}
        disabled={disabled || micBlocked}
        data-recording={String(isActive)}
        title={
          micBlocked         ? "Microphone access denied" :
          !speechSupported   ? "Record audio" :
          isActive           ? "Stop recording" :
                               "Voice input"
        }
        aria-label={isActive ? "Stop recording" : "Start voice input"}
      >
        {isActive ? (
          /* Animated waveform when recording */
          <span className={styles.waveform} aria-hidden="true">
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </span>
        ) : (
          "🎤"
        )}
      </button>

      
      <button
        className={styles.sendBtn}
        onClick={onSend}
        disabled={disabled || !hasText}
        data-active={String(hasText && !disabled)}
        aria-label="Send message"
      >
        ↑
      </button>
    </div>
  );
}
