"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ─── Decorative SVG Pattern ─── */
function GridPattern() {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, opacity: 0.04 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FAF8F5" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* ─── Stat Item ─── */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.8rem",
          fontWeight: 300,
          color: "#FAF8F5",
          lineHeight: 1,
          marginBottom: "0.25rem",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.65rem", color: "rgba(250,248,245,0.5)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Main Login Page ─── */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if already logged in
    if (typeof window !== "undefined" && localStorage.getItem("maison_admin_auth") === "true") {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200));

    // Demo credentials
    if (email === "admin@maison.id" && password === "admin123") {
      localStorage.setItem("maison_admin_auth", "true");
      localStorage.setItem("maison_admin_name", "Admin Maison");
      router.replace("/admin");
    } else {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ──────────────── Left — Dark Branding Panel ──────────────── */}
      <div
        style={{
          flex: "0 0 42%",
          background: "#141210",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GridPattern />

        {/* Decorative copper ring */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(196,113,58,0.15)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            border: "1px solid rgba(196,113,58,0.1)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 300,
                color: "#FAF8F5",
                fontStyle: "italic",
                letterSpacing: "0.04em",
                lineHeight: 1,
                marginBottom: "0.4rem",
              }}
            >
              Maison
            </div>
            <div
              style={{
                fontSize: "0.58rem",
                color: "#C4713A",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              Admin Console
            </div>
          </Link>
        </div>

        {/* Center Copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "32px",
              height: "1px",
              background: "#C4713A",
              marginBottom: "1.5rem",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
              fontWeight: 300,
              color: "#FAF8F5",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Kelola toko Maison
            <br />
            dengan mudah.
          </h2>
          <p
            style={{
              fontSize: "0.82rem",
              color: "rgba(250,248,245,0.5)",
              lineHeight: 1.7,
              maxWidth: "280px",
            }}
          >
            Panel admin terpadu untuk manajemen produk, pesanan, pengguna, dan program loyalitas Maison.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(250,248,245,0.08)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <StatItem value="52" label="Produk" />
          <StatItem value="247" label="Pesanan" />
          <StatItem value="1.8rb" label="Member" />
        </div>
      </div>

      {/* ──────────────── Right — Login Form ──────────────── */}
      <div
        style={{
          flex: 1,
          background: "#FAF8F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
        }}
      >
        {/* Back to store link */}
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "1.75rem",
            right: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.75rem",
            color: "#8A8078",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Kembali ke Toko
        </Link>

        <div style={{ width: "100%", maxWidth: "400px" }}>
          {/* Form Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C4713A",
                marginBottom: "0.6rem",
              }}
            >
              Selamat Datang
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 300,
                color: "#1A1714",
                lineHeight: 1.1,
                marginBottom: "0.5rem",
              }}
            >
              Masuk ke Admin Panel
            </h1>
            <p style={{ fontSize: "0.82rem", color: "#8A8078" }}>
              Gunakan kredensial admin Anda untuk mengakses dashboard.
            </p>
          </div>

          {/* Demo Credentials Hint */}
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(196,113,58,0.05)",
              border: "1px solid rgba(196,113,58,0.2)",
              marginBottom: "1.75rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C4713A"
              strokeWidth="1.5"
              style={{ flexShrink: 0, marginTop: "1px" }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 500, color: "#C4713A", marginBottom: "0.2rem" }}>
                Demo Credentials
              </div>
              <div style={{ fontSize: "0.7rem", color: "#8A8078", lineHeight: 1.6 }}>
                Email: <span style={{ color: "#1A1714", fontWeight: 500 }}>admin@maison.id</span>
                <br />
                Password: <span style={{ color: "#1A1714", fontWeight: 500 }}>admin123</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  color: "#4A4640",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.04em",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@maison.id"
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  background: "#F4F0EA",
                  border: `1px solid ${error ? "#DC2626" : "#E4DDD3"}`,
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "#1A1714",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#C4713A";
                  e.target.style.boxShadow = "0 0 0 3px rgba(196,113,58,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? "#DC2626" : "#E4DDD3";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    color: "#4A4640",
                    letterSpacing: "0.04em",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Password
                </label>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "0.7rem",
                    color: "#C4713A",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    padding: 0,
                  }}
                >
                  Lupa password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "0.85rem 3rem 0.85rem 1rem",
                    background: "#F4F0EA",
                    border: `1px solid ${error ? "#DC2626" : "#E4DDD3"}`,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    color: "#1A1714",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#C4713A";
                    e.target.style.boxShadow = "0 0 0 3px rgba(196,113,58,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error ? "#DC2626" : "#E4DDD3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#B8AFA0",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(220,38,38,0.06)",
                  border: "1px solid rgba(220,38,38,0.2)",
                  marginBottom: "1.25rem",
                  animation: "shake 0.3s ease",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span style={{ fontSize: "0.78rem", color: "#DC2626" }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.95rem",
                background: loading ? "#8A4A1E" : "#1A1714",
                border: "1px solid #1A1714",
                color: "#FAF8F5",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#C4713A";
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#1A1714";
              }}
            >
              {loading ? (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      animation: "spin 0.8s linear infinite",
                    }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #E4DDD3",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.7rem", color: "#B8AFA0" }}>
              © 2025 Maison · Admin Panel
            </span>
            <div style={{ display: "flex", gap: "1rem" }}>
              {["Kebijakan Privasi", "Bantuan"].map((link) => (
                <button
                  key={link}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "0.7rem",
                    color: "#B8AFA0",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#C4713A")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#B8AFA0")}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
