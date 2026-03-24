// SiteFooter — shared across all pages

import styles from "../styles/components/site-footer.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.privacy}>🔒 This conversation is private to your session</p>
      <p className={styles.credit}>
        Developed by{" "}
        <span className={styles.name}>Godwin Daniel</span>{" "}
        for{" "}
        <span className={styles.brand}>RaenestXDevCareers</span>
        {" "}—{" "}
        <span className={styles.tag}>#RaenestHackathon</span>
      </p>
    </footer>
  );
}
