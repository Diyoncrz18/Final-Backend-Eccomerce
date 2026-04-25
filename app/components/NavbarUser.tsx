"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart, logout } from "../../services/api";

interface User {
  name: string;
  email: string;
  tier: string;
  points: number;
}

export default function NavbarUser({ user }: { user: User }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMenuOpen(false);
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    let active = true;
    async function loadCartCount() {
      const cart = await getCart();
      if (active) setCartCount(cart.count);
    }

    void loadCartCount();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const close = () => setProfileOpen(false);
    if (profileOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [profileOpen]);

  const initials = user.name.split(" ").slice(0, 2).map((n) => n[0]).join("");
  const close = () => setMenuOpen(false);

  const NAV_LINKS = [
    { name: "Koleksi", href: "/koleksi" },
    { name: "Ruangan", href: "/ruangan" },
    { name: "Sale", href: "/sale" },
    { name: "Tentang", href: "/tentang" },
  ];

  return (
    <>
      <nav
        id="navbar-user"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? "0.85rem 0" : "1.25rem 0",
          background: scrolled ? "rgba(250,248,245,0.97)" : "rgba(42,38,32,0.85)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          boxShadow: scrolled ? "0 1px 0 rgba(42,38,32,0.08)" : "none",
          transition: "all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        <div className="container-main">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>

            {/* Left — Nav Links (Desktop) */}
            <nav role="navigation" aria-label="User navigation"
              style={{ display: "flex", gap: "2rem", alignItems: "center" }}
              className="hidden-mobile">
              {NAV_LINKS.map((item) => (
                <Link key={item.name} href={item.href}
                  style={{
                    fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 400,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: scrolled ? "var(--charcoal)" : "var(--cream)",
                    transition: "color 0.3s ease", padding: "0.25rem 0",
                    borderBottom: "1px solid transparent",
                  }}
                  className="nav-link">
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <Link href="/dashboard" style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 300, letterSpacing: "0.25em",
              color: scrolled ? "var(--charcoal)" : "var(--cream)",
              textTransform: "uppercase", transition: "color 0.3s ease",
              position: "absolute", left: "50%", transform: "translateX(-50%)",
            }}>
              Maison
            </Link>

            {/* Right — Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>

              {/* Search (Desktop) */}
              <button aria-label="Cari produk" className="hidden-mobile"
                style={{ background: "none", border: "none", cursor: "pointer", color: scrolled ? "var(--charcoal)" : "var(--cream)", transition: "color 0.3s ease", lineHeight: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>

              {/* Cart */}
              <Link href="/cart" aria-label={`Keranjang (${cartCount})`}
                style={{ position: "relative", color: scrolled ? "var(--charcoal)" : "var(--cream)", transition: "color 0.3s ease", lineHeight: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    width: "17px", height: "17px", borderRadius: "50%",
                    background: "var(--copper)", color: "var(--white)",
                    fontSize: "0.58rem", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown (Desktop) */}
              <div style={{ position: "relative" }} className="hidden-mobile">
                <button id="profile-trigger" aria-label="Menu profil" aria-expanded={profileOpen}
                  onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                  style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", cursor: "pointer", padding: "0.2rem" }}>
                  <span style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--copper-dark), var(--copper))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600,
                    color: "var(--white)", letterSpacing: "0.05em", flexShrink: 0,
                  }}>{initials}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: scrolled ? "var(--charcoal)" : "var(--cream)", transition: "color 0.3s ease" }}>
                    {user.name.split(" ")[0]}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={scrolled ? "var(--charcoal)" : "var(--cream)"} strokeWidth="2"
                    style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease" }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {profileOpen && (
                  <div onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute", top: "calc(100% + 0.75rem)", right: 0,
                      width: "240px", background: "var(--white)",
                      boxShadow: "0 16px 48px rgba(42,38,32,0.15)",
                      zIndex: 200, animation: "fadeUp 0.2s ease both",
                    }}>
                    <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--stone-light)", background: "var(--bone)" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--charcoal)", marginBottom: "0.15rem" }}>{user.name}</p>
                      <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.1rem" }}>{user.tier}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--stone)" }}>{user.email}</p>
                    </div>
                    {[
                      { label: "Dashboard", href: "/dashboard" },
                      { label: "Pesanan Saya", href: "/dashboard/orders" },
                      { label: "Wishlist", href: "/dashboard/wishlist" },
                      { label: "Poin & Reward", href: "/dashboard/rewards" },
                      { label: "Pengaturan Akun", href: "/dashboard/profile" },
                    ].map((item) => (
                      <Link key={item.label} href={item.href}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.5rem", fontSize: "0.82rem", color: "var(--charcoal-mid)", borderBottom: "1px solid rgba(184,175,160,0.2)", transition: "all 0.2s ease" }}
                        className="dd-item" onClick={() => setProfileOpen(false)}>
                        {item.label}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    ))}
                    <button id="logout-btn"
                      style={{ width: "100%", padding: "0.85rem 1.5rem", background: "none", border: "none", textAlign: "left", fontSize: "0.82rem", fontWeight: 500, color: "#C0392B", cursor: "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.5rem", transition: "background 0.2s ease" }}
                      onClick={handleLogout}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(192,57,43,0.06)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "none")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Keluar
                    </button>
                  </div>
                )}
              </div>

              {/* Hamburger Button */}
              <button
                id="burger-menu-btn"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  gap: "5px", background: "none", border: "none",
                  cursor: "pointer", padding: "0.3rem", width: "30px", height: "30px",
                }}
                className="mobile-menu-btn"
              >
                <span style={{
                  display: "block", width: "22px", height: "1.5px",
                  background: menuOpen ? "var(--cream)" : (scrolled ? "var(--charcoal)" : "var(--cream)"),
                  transition: "transform 0.3s ease, background 0.3s ease",
                  transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
                }} />
                <span style={{
                  display: "block", width: "22px", height: "1.5px",
                  background: menuOpen ? "var(--cream)" : (scrolled ? "var(--charcoal)" : "var(--cream)"),
                  transition: "opacity 0.3s ease, background 0.3s ease",
                  opacity: menuOpen ? 0 : 1,
                }} />
                <span style={{
                  display: "block", width: "22px", height: "1.5px",
                  background: menuOpen ? "var(--cream)" : (scrolled ? "var(--charcoal)" : "var(--cream)"),
                  transition: "transform 0.3s ease, background 0.3s ease",
                  transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
                }} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Simple Sidebar Drawer ── */}
      {/* Backdrop */}
      {menuOpen && (
        <div
          onClick={close}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(42,38,32,0.4)",
            zIndex: 140,
            backdropFilter: "blur(2px)",
            animation: "fadeIn 0.25s ease both",
          }}
        />
      )}

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(320px, 85vw)",
          background: "var(--white)",
          zIndex: 150,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          display: "flex", flexDirection: "column",
          boxShadow: menuOpen ? "-8px 0 40px rgba(42,38,32,0.15)" : "none",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--stone-light)",
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "1.25rem",
            fontWeight: 300, letterSpacing: "0.25em", color: "var(--charcoal)",
            textTransform: "uppercase",
          }}>
            Maison
          </span>
          <button onClick={close} aria-label="Tutup menu"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--charcoal-soft)", lineHeight: 0, padding: "0.25rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* User strip */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.85rem",
          padding: "1rem 1.5rem",
          background: "var(--bone)",
          borderBottom: "1px solid var(--stone-light)",
          flexShrink: 0,
        }}>
          <span style={{
            width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--copper-dark), var(--copper))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", fontWeight: 600, color: "var(--white)", letterSpacing: "0.04em",
          }}>{initials}</span>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--charcoal)", marginBottom: "0.1rem" }}>{user.name}</p>
            <p style={{ fontSize: "0.68rem", color: "var(--copper)", letterSpacing: "0.08em" }}>{user.tier}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: "0.5rem 0" }}>
          {[
            { name: "Dashboard", href: "/dashboard", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
            { name: "Koleksi", href: "/koleksi", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> },
            { name: "Ruangan", href: "/ruangan", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 22V9l11-7 11 7v13"/><path d="M9 22V12h6v10"/></svg> },
            { name: "Sale", href: "/sale", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"/></svg> },
            { name: "Tentang", href: "/tentang", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
          ].map((link, i) => (
            <Link key={link.name} href={link.href} onClick={close}
              style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                padding: "0.9rem 1.5rem",
                fontSize: "0.85rem", color: "var(--charcoal)",
                borderBottom: i < 4 ? "1px solid rgba(184,175,160,0.2)" : "none",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              className="sidebar-link">
              <span style={{ color: "var(--stone)", lineHeight: 0 }}>{link.icon}</span>
              {link.name}
            </Link>
          ))}

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--stone-light)", margin: "0.5rem 0" }} />

          {[
            { name: "Pesanan Saya", href: "/dashboard/orders" },
            { name: "Keranjang", href: "/cart" },
            { name: "Wishlist", href: "/dashboard/wishlist" },
            { name: "Poin & Reward", href: "/dashboard/rewards" },
          ].map((link) => (
            <Link key={link.name} href={link.href} onClick={close}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.85rem 1.5rem",
                fontSize: "0.82rem", color: "var(--charcoal-soft)",
                borderBottom: "1px solid rgba(184,175,160,0.15)",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              className="sidebar-link">
              {link.name}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          ))}
        </nav>

        {/* Footer: poin + logout */}
        <div style={{ borderTop: "1px solid var(--stone-light)", flexShrink: 0 }}>
          {/* Poin */}
          <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bone)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span style={{ fontSize: "0.78rem", color: "var(--charcoal-soft)" }}>Poin Saya</span>
            </div>
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--copper)" }}>
              {(user.points || 0).toLocaleString()}
            </span>
          </div>
          {/* Logout */}
          <button
            style={{
              width: "100%", padding: "0.9rem 1.5rem",
              background: "none", border: "none",
              fontSize: "0.82rem", color: "#C0392B",
              fontFamily: "var(--font-body)", fontWeight: 500,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem",
              transition: "background 0.15s ease",
            }}
            onClick={handleLogout}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(192,57,43,0.05)")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "none")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        .nav-link:hover { border-bottom-color: currentColor !important; }
        .dd-item:hover  { background: var(--bone); color: var(--charcoal) !important; }
        .sidebar-link:hover { background: var(--bone) !important; color: var(--charcoal) !important; }
      `}</style>
    </>
  );
}
