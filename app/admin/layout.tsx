"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAdminDisplayName, isAdmin, isAuthenticated, logout } from "../../services/api";

const isBrowser = typeof window !== "undefined";

/* ─── Nav Config ─── */
const NAV_GROUPS = [
  {
    label: "Operasional",
    items: [
      { href: "/admin", label: "Overview", exact: true, icon: <GridIcon />, badge: null },
      { href: "/admin/produk", label: "Produk", exact: false, icon: <BoxIcon />, badge: null },
      { href: "/admin/pesanan", label: "Pesanan", exact: false, icon: <OrderIcon />, badge: 8 },
      { href: "/admin/pengguna", label: "Pengguna", exact: false, icon: <UserIcon />, badge: null },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/voucher", label: "Voucher & Promo", exact: false, icon: <TagIcon />, badge: null },
      { href: "/admin/rewards", label: "Rewards & Poin", exact: false, icon: <StarIcon />, badge: null },
      { href: "/admin/ulasan", label: "Ulasan", exact: false, icon: <ReviewIcon />, badge: 3 },
    ],
  },
  {
    label: "Sistem",
    items: [
      { href: "/admin/pengaturan", label: "Pengaturan", exact: false, icon: <SettingsIcon />, badge: null },
    ],
  },
];

/* ─── Admin Layout ─── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const isLoginPage = pathname === "/admin/login";
  const authChecked = isBrowser;
  const isAuthed = isBrowser && isAuthenticated() && isAdmin();
  const adminName = isBrowser ? getAdminDisplayName() : "Admin Maison";

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  if (isBrowser && !isLoginPage && !isAuthed) {
    router.replace("/admin/login");
    return null;
  }

  /* ── Login page — bare layout ── */
  if (isLoginPage) {
    return <>{children}</>;
  }

  /* ── Loading state while checking auth ── */
  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#F4F0EA", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontStyle: "italic", color: "#1A1714", marginBottom: "0.75rem" }}>
            Maison
          </div>
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%",
            border: "2px solid #E4DDD3", borderTopColor: "#C4713A",
            animation: "spin 0.7s linear infinite", margin: "0 auto",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  /* ── Not authenticated — return nothing (redirecting) ── */
  if (!isAuthed) return null;

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F0EA", fontFamily: "var(--font-body)" }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: collapsed ? "64px" : "240px",
          minWidth: collapsed ? "64px" : "240px",
          background: "#FAF8F5",
          borderRight: "1px solid #E4DDD3",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s ease, min-width 0.25s ease",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? "1.5rem 1rem" : "1.75rem 1.5rem",
            borderBottom: "1px solid #E4DDD3",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {!collapsed && (
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 300,
                  color: "#1A1714",
                  fontStyle: "italic",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                Maison
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.58rem",
                  color: "#C4713A",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginTop: "0.25rem",
                }}
              >
                Admin Console
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg, #C4713A, #8A4A1E)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  color: "#FAF8F5",
                  fontStyle: "italic",
                }}
              >
                M
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B8AFA0",
              flexShrink: 0,
              marginLeft: collapsed ? 0 : "auto",
            }}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {collapsed
                ? <path d="m9 18 6-6-6-6" />
                : <path d="m15 18-6-6 6-6" />}
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "0.75rem 0", overflowY: "auto" }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: "0.25rem" }}>
              {!collapsed && (
                <div
                  style={{
                    padding: "0.5rem 1.5rem 0.35rem",
                    fontSize: "0.58rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#B8AFA0",
                    fontWeight: 500,
                  }}
                >
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      padding: collapsed ? "0.75rem 1rem" : "0.65rem 1.5rem",
                      fontSize: "0.82rem",
                      fontWeight: active ? 500 : 400,
                      color: active ? "#1A1714" : "#6B6560",
                      background: active ? "rgba(196,113,58,0.07)" : "none",
                      borderLeft: `2px solid ${active ? "#C4713A" : "transparent"}`,
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      justifyContent: collapsed ? "center" : "flex-start",
                      position: "relative",
                      whiteSpace: "nowrap",
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <span style={{ color: active ? "#C4713A" : "currentColor", flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.badge !== null && (
                          <span
                            style={{
                              background: "#C4713A",
                              color: "#fff",
                              fontSize: "0.6rem",
                              padding: "0.1rem 0.45rem",
                              borderRadius: "99px",
                              fontWeight: 600,
                              lineHeight: 1.5,
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge !== null && (
                      <span
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#C4713A",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div
          style={{
            marginTop: "auto",
            padding: collapsed ? "1rem" : "1rem 1.25rem",
            borderTop: "1px solid #E4DDD3",
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#1A1714",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                color: "#C4713A",
                fontWeight: 700,
                margin: "0 auto",
              }}
            >
              {adminName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#1A1714",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  color: "#C4713A",
                  fontWeight: 700,
                }}
              >
                {adminName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.8rem", color: "#1A1714", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {adminName}
                </div>
                <div style={{ fontSize: "0.65rem", color: "#B8AFA0" }}>Super Admin</div>
              </div>
              <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                <Link
                  href="/"
                  style={{ color: "#B8AFA0", display: "flex", alignItems: "center" }}
                  title="Lihat Toko"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2 2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#B8AFA0", padding: 0, display: "flex", alignItems: "center" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Icon Components ─── */
function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 3H8v4h8V3z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function ReviewIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  );
}
