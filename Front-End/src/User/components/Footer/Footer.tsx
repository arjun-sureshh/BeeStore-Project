import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.body}>
      <div className={styles.footerTop}>
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>About Us</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="/about" className={styles.link}>
                Our Story
              </a>
            </li>
            <li>
              <a href="/careers" className={styles.link}>
                Careers
              </a>
            </li>
            <li>
              <a href="/press" className={styles.link}>
                Press
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="/terms" className={styles.link}>
                Terms of Use
              </a>
            </li>
            <li>
              <a href="/privacy" className={styles.link}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/sitemap" className={styles.link}>
                Sitemap
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Help</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="/contact" className={styles.link}>
                Contact Us
              </a>
            </li>
            <li>
              <a href="/faq" className={styles.link}>
                FAQ
              </a>
            </li>
            <li>
              <a href="/support" className={styles.link}>
                Support
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Follow Us</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="https://facebook.com" className={styles.link}>
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" className={styles.link}>
                Twitter
              </a>
            </li>
            <li>
              <a href="https://instagram.com" className={styles.link}>
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>© 2025 Buyway. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
