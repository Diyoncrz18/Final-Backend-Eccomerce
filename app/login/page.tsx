"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthTransition from "../components/AuthTransition";
import { login } from "../../services/api";

function LoginContent({ navigate }: { navigate: (href: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });

      if (result.success && result.data?.user) {
        navigate("/dashboard");
      } else {
        setError(result.message || 'Email atau password salah');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bone)",
      }}
      className="auth-layout"
    >
      {/* ── Left: Hero Image ─────────────────────────────── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
        }}
        className="auth-image-panel"
      >
        <Image
          src="/hero-living.png"
          alt="Interior Maison"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
        {/* Dark overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(26,23,20,0.25) 0%, rgba(26,23,20,0.55) 100%)",
          }}
        />

        {/* Brand signature */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "2.5rem 3rem",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 300,
              color: "var(--cream)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Maison
          </Link>

          {/* Quote */}
          <div style={{ animation: "fadeUp 0.8s var(--ease-out-expo) 0.3s both" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                fontWeight: 300,
                color: "var(--cream)",
                lineHeight: 1.2,
                marginBottom: "1rem",
                fontStyle: "italic",
              }}
            >
              &ldquo;Rumah adalah cermin<br />jiwa Anda.&rdquo;
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 400,
                color: "rgba(245,240,232,0.65)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              — Koleksi Maison 2025
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ─────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(2rem, 6vw, 5rem) clamp(2rem, 7vw, 6rem)",
          position: "relative",
          background: "var(--bone)",
          overflowY: "auto",
        }}
      >
        {/* Top bar (mobile only logo) */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            fontWeight: 300,
            color: "var(--charcoal)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "3rem",
            display: "none",
          }}
          className="mobile-logo"
        >
          Maison
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "2.75rem", animation: "fadeUp 0.6s var(--ease-out-expo) both" }}>
          <p
            className="text-label"
            style={{ color: "var(--copper)", marginBottom: "0.75rem" }}
          >
            Selamat Datang Kembali
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
              fontWeight: 300,
              color: "var(--charcoal)",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            Masuk ke{" "}
            <em style={{ fontStyle: "italic", color: "var(--copper)" }}>Akun</em>
          </h1>
          <p className="text-body" style={{ fontSize: "0.9rem" }}>
            Belum punya akun?{" "}
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "var(--copper)",
                fontWeight: 500,
                borderBottom: "1px solid var(--copper)",
                paddingBottom: "1px",
                transition: "opacity 0.2s ease",
                fontFamily: "var(--font-body)",
                fontSize: "inherit",
              }}
            >
              Daftar Sekarang
            </button>
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            animation: "fadeUp 0.6s var(--ease-out-expo) 0.1s both",
          }}
        >
          {/* Error message */}
          {error && (
            <div
              style={{
                padding: "1rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ position: "relative" }}>
            <label
              htmlFor="login-email"
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: focused === "email" ? "var(--copper)" : "var(--charcoal-soft)",
                marginBottom: "0.6rem",
                transition: "color 0.25s ease",
              }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="nama@email.com"
              required
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                background: "var(--white)",
                border: `1px solid ${focused === "email" ? "var(--copper)" : "var(--stone-light)"}`,
                outline: "none",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "var(--charcoal)",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                boxShadow:
                  focused === "email"
                    ? "0 0 0 3px rgba(196,113,58,0.1)"
                    : "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.6rem",
              }}
            >
              <label
                htmlFor="login-password"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color:
                    focused === "password" ? "var(--copper)" : "var(--charcoal-soft)",
                  transition: "color 0.25s ease",
                }}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--charcoal-soft)",
                  transition: "color 0.2s ease",
                }}
                id="forgot-password-link"
              >
                Lupa password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="Masukkan password"
                required
                style={{
                  width: "100%",
                  padding: "1rem 3rem 1rem 1.25rem",
                  background: "var(--white)",
                  border: `1px solid ${focused === "password" ? "var(--copper)" : "var(--stone-light)"}`,
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--charcoal)",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                  boxShadow:
                    focused === "password"
                      ? "0 0 0 3px rgba(196,113,58,0.1)"
                      : "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--stone)",
                  lineHeight: 0,
                  transition: "color 0.2s ease",
                }}
              >
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              id="remember-me"
              style={{
                width: "16px",
                height: "16px",
                accentColor: "var(--copper)",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                color: "var(--charcoal-soft)",
              }}
            >
              Ingat saya selama 30 hari
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1.1rem",
              background: loading ? "var(--charcoal-soft)" : "var(--charcoal)",
              color: "var(--cream)",
              border: "none",
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s ease, transform 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginTop: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--copper)";
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--charcoal)";
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(245,240,232,0.4)",
                    borderTop: "2px solid var(--cream)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
                Memproses...
              </>
            ) : (
              <>
                Masuk
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "2rem 0",
            animation: "fadeUp 0.6s var(--ease-out-expo) 0.2s both",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "var(--stone-light)" }} />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              color: "var(--stone)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            atau lanjutkan dengan
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--stone-light)" }} />
        </div>

        {/* Social Login */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            animation: "fadeUp 0.6s var(--ease-out-expo) 0.25s both",
          }}
        >
          {[
            {
              label: "Google",
              id: "login-google",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              ),
            },
            {
              label: "Apple",
              id: "login-apple",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              ),
            },
          ].map((s) => (
            <button
              key={s.label}
              id={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                padding: "0.85rem",
                background: "var(--white)",
                border: "1px solid var(--stone-light)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--charcoal)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bone)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--white)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone-light)";
              }}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Footer */}
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--stone)",
            textAlign: "center",
            marginTop: "2.5rem",
            lineHeight: 1.7,
            animation: "fadeUp 0.6s var(--ease-out-expo) 0.3s both",
          }}
        >
          Dengan masuk, Anda menyetujui{" "}
          <Link href="/terms" style={{ color: "var(--charcoal-soft)", borderBottom: "1px solid var(--stone-light)" }}>
            Syarat & Ketentuan
          </Link>{" "}
          dan{" "}
          <Link href="/privacy" style={{ color: "var(--charcoal-soft)", borderBottom: "1px solid var(--stone-light)" }}>
            Kebijakan Privasi
          </Link>{" "}
          kami.
        </p>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .auth-layout { grid-template-columns: 1fr !important; }
          .auth-image-panel { display: none !important; }
          .mobile-logo { display: block !important; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthTransition>
      {(navigate) => <LoginContent navigate={navigate} />}
    </AuthTransition>
  );
}
