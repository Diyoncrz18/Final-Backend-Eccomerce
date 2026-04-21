"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthTransition from "../components/AuthTransition";
import { register } from "../../services/api";

function RegisterContent({ navigate }: { navigate: (href: string) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
    newsletter: true,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (key: keyof typeof form, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const strength = (() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];
  const strengthColor = ["", "#e53e3e", "#C4713A", "#68a96c", "#2a9d57"][strength];

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(result.message || 'Pendaftaran gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name: string) => ({
    width: "100%",
    padding: "1rem 1.25rem",
    background: "var(--white)",
    border: `1px solid ${focused === name ? "var(--copper)" : "var(--stone-light)"}`,
    outline: "none",
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    color: "var(--charcoal)",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    boxShadow: focused === name ? "0 0 0 3px rgba(196,113,58,0.1)" : "none",
  });

  const labelStyle = (name: string) => ({
    display: "block" as const,
    fontFamily: "var(--font-body)",
    fontSize: "0.7rem",
    fontWeight: 500 as const,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: focused === name ? "var(--copper)" : "var(--charcoal-soft)",
    marginBottom: "0.6rem",
    transition: "color 0.25s ease",
  });

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
      {/* ── Left: Form Panel ─────────────────────────────── */}
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
        {/* Mobile logo */}
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

        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            marginBottom: "2.5rem",
            animation: "fadeUp 0.5s var(--ease-out-expo) both",
          }}
        >
          {[1, 2].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      step > s
                        ? "var(--copper)"
                        : step === s
                        ? "var(--charcoal)"
                        : "transparent",
                    border:
                      step > s
                        ? "2px solid var(--copper)"
                        : step === s
                        ? "2px solid var(--charcoal)"
                        : "2px solid var(--stone-light)",
                    transition: "all 0.4s var(--ease-smooth)",
                  }}
                >
                  {step > s ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: step === s ? "var(--cream)" : "var(--stone)",
                      }}
                    >
                      {s}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    color: step === s ? "var(--charcoal)" : "var(--stone)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s === 1 ? "Data Diri" : "Keamanan"}
                </span>
              </div>
              {i === 0 && (
                <div
                  style={{
                    width: "80px",
                    height: "1px",
                    background: step > 1 ? "var(--copper)" : "var(--stone-light)",
                    margin: "0 0.75rem",
                    marginBottom: "1.2rem",
                    transition: "background 0.4s ease",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ marginBottom: "2.25rem", animation: "fadeUp 0.6s var(--ease-out-expo) 0.05s both" }}>
          <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.75rem" }}>
            {step === 1 ? "Langkah 1 dari 2" : "Langkah 2 dari 2"}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              fontWeight: 300,
              color: "var(--charcoal)",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            {step === 1 ? (
              <>Buat <em style={{ fontStyle: "italic", color: "var(--copper)" }}>Akun</em> Baru</>
            ) : (
              <>Atur <em style={{ fontStyle: "italic", color: "var(--copper)" }}>Keamanan</em> Akun</>
            )}
          </h1>
          <p className="text-body" style={{ fontSize: "0.9rem" }}>
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "var(--copper)",
                fontWeight: 500,
                borderBottom: "1px solid var(--copper)",
                paddingBottom: "1px",
                fontFamily: "var(--font-body)",
                fontSize: "inherit",
              }}
            >
              Masuk di sini
            </button>
          </p>
        </div>

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
              marginBottom: "1.5rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            style={{
              padding: "1rem",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#16a34a",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Akun berhasil dibuat! Mengalihkan ke halaman masuk...
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <form
            onSubmit={handleStep1}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem", animation: "fadeUp 0.5s var(--ease-out-expo) 0.1s both" }}
          >
            <div>
              <label htmlFor="reg-name" style={labelStyle("name")}>Nama Lengkap</label>
              <input
                id="reg-name"
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="Nama lengkap Anda"
                required
                style={inputStyle("name")}
              />
            </div>

            <div>
              <label htmlFor="reg-email" style={labelStyle("email")}>Email</label>
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="nama@email.com"
                required
                style={inputStyle("email")}
              />
            </div>

            <div>
              <label htmlFor="reg-phone" style={labelStyle("phone")}>
                Nomor Telepon{" "}
                <span style={{ color: "var(--stone)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                  (opsional)
                </span>
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "1.25rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    color: "var(--charcoal-soft)",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  +62
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  placeholder="8xx xxxx xxxx"
                  style={{ ...inputStyle("phone"), paddingLeft: "3.5rem" }}
                />
              </div>
            </div>

            {/* Perks highlight */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(196,113,58,0.08), rgba(196,113,58,0.04))",
                border: "1px solid rgba(196,113,58,0.2)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.25rem" }}>
                Yang Anda Dapatkan
              </p>
              {[
                "Akses ke koleksi eksklusif member",
                "500 poin selamat datang",
                "Konsultasi desain gratis pertama",
                "Early access ke sale & produk baru",
              ].map((perk) => (
                <div key={perk} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontSize: "0.82rem", color: "var(--charcoal-mid)", fontWeight: 300 }}>
                    {perk}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              id="register-step1"
              style={{
                width: "100%",
                padding: "1.1rem",
                background: "var(--charcoal)",
                color: "var(--cream)",
                border: "none",
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                transition: "background 0.3s ease",
                marginTop: "0.25rem",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--copper)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--charcoal)")}
            >
              Lanjutkan
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem", animation: "fadeUp 0.5s var(--ease-out-expo) both" }}
          >
            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={labelStyle("password")}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Minimal 8 karakter"
                  required
                  style={{ ...inputStyle("password"), paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--stone)", lineHeight: 0 }}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: "0.6rem" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "0.35rem" }}>
                    {[1,2,3,4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: "3px",
                          background: i <= strength ? strengthColor : "var(--stone-light)",
                          transition: "background 0.3s ease",
                          borderRadius: "2px",
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.68rem", color: strengthColor, fontWeight: 500, letterSpacing: "0.08em" }}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="reg-confirm" style={labelStyle("confirm")}>Konfirmasi Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused(null)}
                  placeholder="Ulangi password Anda"
                  required
                  style={{
                    ...inputStyle("confirm"),
                    paddingRight: "3rem",
                    borderColor:
                      form.confirmPassword && form.confirmPassword !== form.password
                        ? "#e53e3e"
                        : focused === "confirm"
                        ? "var(--copper)"
                        : "var(--stone-light)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--stone)", lineHeight: 0 }}
                >
                  {showConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p style={{ fontSize: "0.72rem", color: "#e53e3e", marginTop: "0.4rem" }}>
                  Password tidak cocok
                </p>
              )}
              {form.confirmPassword && form.confirmPassword === form.password && (
                <p style={{ fontSize: "0.72rem", color: "var(--copper)", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Password cocok
                </p>
              )}
            </div>

            {/* Agreements */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={form.agree}
                  onChange={(e) => update("agree", e.target.checked)}
                  required
                  style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px", accentColor: "var(--copper)", cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", lineHeight: 1.5 }}>
                  Saya menyetujui{" "}
                  <Link href="/terms" style={{ color: "var(--copper)", borderBottom: "1px solid var(--copper)" }}>
                    Syarat & Ketentuan
                  </Link>{" "}
                  dan{" "}
                  <Link href="/privacy" style={{ color: "var(--copper)", borderBottom: "1px solid var(--copper)" }}>
                    Kebijakan Privasi
                  </Link>
                </span>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  id="agree-newsletter"
                  checked={form.newsletter}
                  onChange={(e) => update("newsletter", e.target.checked)}
                  style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "2px", accentColor: "var(--copper)", cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", lineHeight: 1.5 }}>
                  Saya ingin menerima inspirasi desain, penawaran eksklusif & info koleksi terbaru
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  flex: "0 0 auto",
                  padding: "1.1rem 1.25rem",
                  background: "transparent",
                  border: "1px solid var(--stone-light)",
                  cursor: "pointer",
                  color: "var(--charcoal-soft)",
                  transition: "all 0.25s ease",
                  fontFamily: "var(--font-body)",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--charcoal)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--charcoal)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone-light)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--charcoal-soft)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="submit"
                id="register-submit"
                disabled={loading || !form.agree || form.password !== form.confirmPassword}
                style={{
                  flex: 1,
                  padding: "1.1rem",
                  background:
                    loading || !form.agree || form.password !== form.confirmPassword
                      ? "var(--stone-light)"
                      : "var(--charcoal)",
                  color:
                    loading || !form.agree || form.password !== form.confirmPassword
                      ? "var(--stone)"
                      : "var(--cream)",
                  border: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor:
                    loading || !form.agree || form.password !== form.confirmPassword
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  if (!btn.disabled) btn.style.background = "var(--copper)";
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  if (!btn.disabled) btn.style.background = "var(--charcoal)";
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
                    Membuat Akun...
                  </>
                ) : (
                  <>
                    Buat Akun
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Right: Visual Panel ──────────────────────────── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          background: "var(--charcoal)",
        }}
        className="auth-image-panel"
      >
        <Image
          src="/hero-bedroom.png"
          alt="Interior Maison"
          fill
          priority
          style={{ objectFit: "cover", opacity: 0.65 }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(26,23,20,0.7) 0%, rgba(26,23,20,0.2) 60%, transparent 100%)",
          }}
        />

        {/* Content */}
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
          {/* Top — Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 300,
              color: "var(--cream)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              alignSelf: "flex-end",
            }}
          >
            Maison
          </Link>

          {/* Bottom — testimonial */}
          <div style={{ animation: "fadeUp 0.8s var(--ease-out-expo) 0.3s both" }}>
            {/* Stars */}
            <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
              {[1,2,3,4,5].map((i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)",
                fontWeight: 300,
                color: "var(--cream)",
                lineHeight: 1.35,
                marginBottom: "1.25rem",
                fontStyle: "italic",
              }}
            >
              "Maison benar-benar mengubah cara saya memandang rumah sebagai ruang yang hidup dan bermakna."
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--copper-dark), var(--copper))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--white)",
                }}
              >
                DS
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 500, color: "var(--cream)" }}>
                  Dewi Sartika
                </p>
                <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.6)", letterSpacing: "0.1em" }}>
                  Member Maison · Bandung
                </p>
              </div>
            </div>
          </div>
        </div>
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

export default function RegisterPage() {
  return (
    <AuthTransition>
      {(navigate) => <RegisterContent navigate={navigate} />}
    </AuthTransition>
  );
}
