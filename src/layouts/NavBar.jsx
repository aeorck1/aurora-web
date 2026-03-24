// ─────────────────────────────────────────────
// NavBar
// src/layouts/NavBar.jsx
// ─────────────────────────────────────────────
// Fixed top nav with logo, page links, and
// theme toggle. Active state via data-active.

import styles from "../styles/components/nav-bar.module.css";
import { useAurora } from "../store/AuroraContext";

const NAV_ITEMS = [
  { id: "landing", label: "Home",    icon: "✦" },
  { id: "chat",    label: "Chat",    icon: "◎" },
  { id: "journal", label: "Journal", icon: "◈" },
];

export default function NavBar() {
  const { theme, toggleTheme, currentPage, setCurrentPage, isOnboarded } = useAurora();

  const handleNavClick = (itemId) => {
    if (itemId === "chat" && !isOnboarded) {
      setCurrentPage("onboarding");
    } else {
      setCurrentPage(itemId);
    }
  };

  return (
    <nav className={styles.nav}>
      {/* Logo */}
      <button className={styles.logoBtn} onClick={() => setCurrentPage("landing")}>
        <div className={styles.logoOrb}>✦</div>
        <span className={styles.logoText}>Aurora</span>
      </button>

      {/* Nav links */}
      <div className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={styles.navBtn}
            data-active={currentPage === item.id ? "true" : "false"}
            onClick={() => handleNavClick(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "light" ? "☽" : "☀"}
        </button>
      </div>
    </nav>
  );
}
