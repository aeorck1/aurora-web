
// Landing Page

import styles from "../styles/pages/landing.module.css";
import { useAura } from "../store/AuraContext";
import BgBlobs from "../components/BgBlobs";

const FEATURES = [
  { icon: "◎", title: "AI Therapy Chat", color: "#7c3aed", desc: "Share what's on your mind. Aura listens without judgment, offering thoughtful responses to help you process your feelings." },
  { icon: "◈", title: "Private Journaling", color: "#3b82f6", desc: "Write freely in your personal journal. All entries live only on your device — completely private, forever yours." },
  { icon: "◌", title: "Mood Tracking", color: "#10b981", desc: "Tag your emotional state with each entry to observe patterns and better understand your inner landscape over time." },
  { icon: "✦", title: "Session Memory", color: "#f59e0b", desc: "Aura remembers your conversations within a session, providing continuity and context as you explore your thoughts." },
];

export default function LandingPage() {
  const { setCurrentPage, isOnboarded, initUser } = useAura();

  const handleGetStarted = async () => {
    await initUser();
    setCurrentPage("chat");
  };

  return (
    <div className={styles.page}>
      <BgBlobs />

      <div className={styles.inner}>
        {/*  Hero  */}
        <div className={styles.hero}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>Your safe space to breathe</span>
          </div>

          <h1 className={styles.headline}>
            A calmer mind<br />
            <em className={styles.headlineAccent}>begins here.</em>
          </h1>

          <p className={styles.subtext}>
            Aura is a private, AI-powered space for therapy conversations and personal journaling.
            Your thoughts stay on your device, and you stay in control.
          </p>

          <div className={styles.ctaRow}>
            <button className={styles.ctaPrimary} onClick={handleGetStarted}>
              {isOnboarded ? "Continue session →" : "Begin your journey →"}
            </button>
            <button className={styles.ctaSecondary} onClick={() => setCurrentPage("journal")}>
              Open journal
            </button>
          </div>
        </div>

        {/*  Features Grid  */}
        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={styles.featureCard}
              style={{ animation: `fadeUp 0.5s ${0.35 + i * 0.08}s ease both` }}
            >
              {/* feature icon bg/color are dynamic per-feature */}
              <div
                className={styles.featureIcon}
                style={{ background: f.color + "18", color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/*  Privacy Note  */}
        <div className={styles.privacyNote}>
          <p className={styles.privacyText}>
            <span className={styles.privacyHighlight}>🔒 Privacy first.</span>{" "}
            Journal entries never leave your browser. Chat sessions use a private session ID.
            You can delete all data at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
