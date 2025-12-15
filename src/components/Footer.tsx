import React, { useState } from "react";
import { Github, Linkedin, Mail, Globe, X, Heart, Copy, Check } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const developerEmail = "pnsssanand@gmail.com";
  const portfolioUrl = "https://portfolio-anand-one.vercel.app/";
  const githubUrl = "https://github.com/pnsssanand";
  const linkedinUrl = "https://www.linkedin.com/in/pinisetty-naga-satya-surya-shiva-anand-087351389/";
  
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(developerEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };
  
  const handleOpenGmail = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${developerEmail}`, '_blank');
  };

  return (
    <>
      <footer className="site-footer">
        <div className="footer-container">
          {/* Left Section - App Branding */}
          <div className="footer-section footer-branding">
            <div className="footer-logo">
              <div className="logo-icon">
                <span>AT</span>
              </div>
              <span className="logo-text">Anand Travel Agency</span>
            </div>
            <p className="footer-tagline">
              Your trusted travel partner. Experience seamless bookings and unforgettable journeys.
            </p>
          </div>

          {/* Center Section - Developer Info */}
          <div className="footer-section footer-developer">
            <p className="developer-label">
              Designed & Developed with <Heart className="heart-icon" size={16} /> by
            </p>
            <h3 className="developer-name">Mr. Anand Pinisetty</h3>
            <p className="developer-title">Full Stack Developer</p>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-btn"
            >
              <Globe size={18} />
              <span>View Developer Portfolio</span>
            </a>
          </div>

          {/* Right Section - Connect */}
          <div className="footer-section footer-connect">
            <p className="connect-label">Connect with the developer</p>
            <div className="social-icons-row">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn github"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn linkedin"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <button
                onClick={() => setShowEmailPopup(true)}
                className="social-icon-btn email"
                title="Email"
              >
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© 2025 Anand Travel Agency. All rights reserved.</p>
          </div>
          <div className="footer-bottom-center">
            <span className="tech-stack">
              <span className="tech-bracket">&lt;/&gt;</span> Built with React, TypeScript & Supabase
            </span>
          </div>
          <div className="footer-bottom-right">
            <a href="#" className="footer-link">Privacy Policy</a>
            <span className="footer-divider">•</span>
            <a href="#" className="footer-link">Terms of Service</a>
            <span className="footer-divider">•</span>
            <button onClick={() => setShowEmailPopup(true)} className="footer-link">Contact</button>
          </div>
        </div>

        <div className="footer-credit">
          <p>v1.0.0 • Crafted with precision by Anand Pinisetty</p>
        </div>
      </footer>

      {/* Email Popup Modal */}
      {showEmailPopup && (
        <div className="email-popup-overlay" onClick={() => setShowEmailPopup(false)}>
          <div className="email-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={() => setShowEmailPopup(false)}>
              <X size={20} />
            </button>
            <div className="popup-content">
              <div className="popup-icon">
                <Mail size={32} />
              </div>
              <h3 className="popup-title">Developer Email</h3>
              <div className="email-display">
                <span className="email-text">{developerEmail}</span>
                <button 
                  className="copy-btn"
                  onClick={handleCopyEmail}
                  title={copied ? "Copied!" : "Copy email"}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <div className="popup-actions">
                <button className="action-btn primary" onClick={handleOpenGmail}>
                  Open in Gmail
                </button>
                <a 
                  href={`mailto:${developerEmail}`}
                  className="action-btn secondary"
                >
                  Open in Default Mail App
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
