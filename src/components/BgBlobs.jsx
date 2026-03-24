// ─────────────────────────────────────────────
// Background Blobs
// src/components/BgBlobs.jsx
// ─────────────────────────────────────────────
import styles from "../styles/components/bg-blobs.module.css";

export default function BgBlobs() {
  return (
    <>
      <div className={`bg-blob ${styles.blob1}`} />
      <div className={`bg-blob ${styles.blob2}`} />
      <div className={`bg-blob ${styles.blob3}`} />
    </>
  );
}
