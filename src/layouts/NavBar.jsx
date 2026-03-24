
// NavBar

import styles from "../styles/components/nav-bar.module.css";
import { useAura } from "../store/AuraContext";

const NAV_ITEMS = [
  { id: "landing", label: "Home", icon: "✦" },
  { id: "chat", label: "Chat", icon: "◎" },
  { id: "journal", label: "Journal", icon: "◈" },
];

export default function NavBar() {
  const { theme, toggleTheme, currentPage, setCurrentPage, isOnboarded } = useAura();

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
        <span className={styles.logoText}>Aura</span>
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
