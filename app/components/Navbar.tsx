"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "1rem 0" : "1.5rem 0",
        background: scrolled ? "rgba(250, 248, 245, 0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(42, 38, 32, 0.08)" : "none",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left Nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2.5rem",
            }}
          >
            <nav
              role="navigation"
              aria-label="Main navigation"
              style={{ display: "flex", gap: "2rem" }}
              className="hidden-mobile"
            >
              {[
                { name: "Koleksi", href: "#featured-products" },
                { name: "Ruangan", href: "#categories" },
                { name: "Keunggulan", href: "#trust" },
                { name: "Tentang", href: "#editorial" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.78rem",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: scrolled ? "var(--charcoal)" : "var(--cream)",
                    transition: "color 0.3s ease",
                    padding: "0.25rem 0",
                    borderBottom: "1px solid transparent",
                    display: "block",
                  }}
                  className="nav-link"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 300,
              letterSpacing: "0.25em",
              color: scrolled ? "var(--charcoal)" : "var(--cream)",
              textTransform: "uppercase",
              transition: "color 0.3s ease",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Maison
          </Link>

          {/* Right Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {/* Search */}
            <button
              aria-label="Cari produk"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: scrolled ? "var(--charcoal)" : "var(--cream)",
                transition: "color 0.3s ease",
                padding: "0.25rem",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Keranjang belanja"
              style={{
                position: "relative",
                color: scrolled ? "var(--charcoal)" : "var(--cream)",
                transition: "color 0.3s ease",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "var(--copper)",
                    color: "var(--white)",
                    fontSize: "0.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="hidden-mobile"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: scrolled ? "var(--charcoal)" : "var(--cream)",
                border: `1px solid ${scrolled ? "var(--charcoal)" : "var(--cream)"}`,
                padding: "0.55rem 1.25rem",
                transition: "all 0.3s ease",
                background: "transparent",
              }}
              id="navbar-login-btn"
            >
              Masuk
            </Link>

            {/* Hamburger (mobile) */}
            <button
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
              }}
              className="mobile-menu-btn"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: "22px",
                    height: "1px",
                    background: scrolled ? "var(--charcoal)" : "var(--cream)",
                    transition: "all 0.3s ease",
                    transformOrigin: "center",
                    transform:
                      menuOpen
                        ? i === 0
                          ? "translateY(6px) rotate(45deg)"
                          : i === 2
                          ? "translateY(-6px) rotate(-45deg)"
                          : "scaleX(0)"
                        : "none",
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--charcoal)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {[
            { name: "Koleksi", href: "#featured-products" },
            { name: "Ruangan", href: "#categories" },
            { name: "Keunggulan", href: "#trust" },
            { name: "Tentang", href: "#editorial" },
            { name: "Masuk", href: "/login" },
          ].map((item, i) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: 300,
                color: "var(--cream)",
                letterSpacing: "0.05em",
                animation: `fadeUp 0.4s ease ${i * 0.06}s both`,
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        .nav-link:hover {
          border-bottom-color: currentColor !important;
        }
      `}</style>
    </nav>
  );
}
