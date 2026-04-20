"use client";
import React, { useState } from "react";
import Link from "next/link";
import NavbarUser from "../../components/NavbarUser";

const USER = {
  name: "Budi Santoso",
  email: "budi@email.com",
  phone: "+62 812 3456 7890",
  tier: "Gold Member",
  points: 2450,
  joinDate: "Maret 2024",
  avatar: null as string | null,
  gender: "Laki-laki",
  birthdate: "1990-05-15",
};

const ADDRESSES = [
  {
    id: 1,
    label: "Rumah",
    recipient: "Budi Santoso",
    phone: "+62 812 3456 7890",
    address: "Jl. Kuningan Mulia No. 12, RT 004/RW 003",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postal: "12980",
    isPrimary: true,
  },
  {
    id: 2,
    label: "Kantor",
    recipient: "Budi Santoso",
    phone: "+62 812 3456 7890",
    address: "Gedung Sudirman Plaza, Lantai 18, Jl. Jenderal Sudirman Kav. 29",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postal: "10350",
    isPrimary: false,
  },
];

type Section = "profil" | "alamat" | "keamanan" | "notifikasi";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<Section>("profil");
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editAddress, setEditAddress] = useState<number | null>(null);
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [notifs, setNotifs] = useState({
    order: true,
    promo: true,
    restock: false,
    newsletter: true,
    sms: false,
  });

  const [formData, setFormData] = useState({
    name: USER.name,
    email: USER.email,
    phone: USER.phone,
    gender: USER.gender,
    birthdate: USER.birthdate,
  });

  const NAV_ITEMS: { key: Section; label: string; icon: React.ReactNode }[] = [
    {
      key: "profil",
      label: "Informasi Profil",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      key: "alamat",
      label: "Daftar Alamat",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      key: "keamanan",
      label: "Keamanan Akun",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      key: "notifikasi",
      label: "Notifikasi",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={USER} />

      {/* ── Page Header ── */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)", paddingTop: "72px" }}>
        <div className="container-main" style={{ padding: "2rem var(--container-px, 2rem)" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--stone)", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Dashboard</Link>
            {" / "}
            <span style={{ color: "var(--charcoal)" }}>Profil Saya</span>
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
            Profil Saya
          </h1>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", alignItems: "flex-start" }} className="profile-layout">

          {/* ── Sidebar Nav ── */}
          <div style={{ position: "sticky", top: "90px" }}>
            {/* Avatar card */}
            <div style={{
              background: "var(--charcoal)",
              padding: "2rem 1.5rem",
              textAlign: "center",
              marginBottom: "0.5rem",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-30%", right: "-20%", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(196,113,58,0.12)", pointerEvents: "none" }} />
              {/* Avatar circle */}
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(196,113,58,0.3) 0%, rgba(196,113,58,0.1) 100%)",
                border: "2px solid rgba(196,113,58,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem", position: "relative",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                {/* Upload overlay button */}
                <button style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "rgba(0,0,0,0)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s ease",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0)"; }}
                  title="Ganti foto">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </button>
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 300, color: "var(--cream)", marginBottom: "0.2rem", position: "relative" }}>
                {USER.name}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", position: "relative" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <p style={{ fontSize: "0.65rem", color: "var(--copper)", letterSpacing: "0.12em" }}>{USER.tier}</p>
              </div>
            </div>

            {/* Nav links */}
            <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)" }}>
              {NAV_ITEMS.map((item, i) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "1rem 1.25rem",
                    background: activeSection === item.key ? "var(--bone)" : "transparent",
                    border: "none",
                    borderLeft: `3px solid ${activeSection === item.key ? "var(--copper)" : "transparent"}`,
                    borderBottom: i < NAV_ITEMS.length - 1 ? "1px solid var(--stone-light)" : "none",
                    color: activeSection === item.key ? "var(--copper)" : "var(--charcoal-soft)",
                    fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 500,
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ opacity: activeSection === item.key ? 1 : 0.6 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Member since badge */}
            <div style={{ marginTop: "1rem", padding: "0.85rem 1.25rem", background: "var(--white)", border: "1px solid var(--stone-light)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.65rem", color: "var(--stone)", marginBottom: "0.1rem" }}>Member sejak</p>
                <p style={{ fontSize: "0.78rem", color: "var(--charcoal)", fontWeight: 500 }}>{USER.joinDate}</p>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div>

            {/* ════ SECTION: PROFIL ════ */}
            {activeSection === "profil" && (
              <div>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.25rem" }}>Akun Anda</p>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 300, color: "var(--charcoal)" }}>
                      Informasi Pribadi
                    </h2>
                  </div>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        padding: "0.6rem 1.25rem",
                        background: "var(--charcoal)", border: "none",
                        color: "var(--cream)", fontFamily: "var(--font-body)",
                        fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em",
                        textTransform: "uppercase", cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit Profil
                    </button>
                  )}
                </div>

                <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)" }}>
                  {/* Form fields */}
                  {[
                    { label: "Nama Lengkap", key: "name", type: "text", value: formData.name },
                    { label: "Alamat Email", key: "email", type: "email", value: formData.email },
                    { label: "Nomor Telepon", key: "phone", type: "tel", value: formData.phone },
                    { label: "Tanggal Lahir", key: "birthdate", type: "date", value: formData.birthdate },
                  ].map((field, i, arr) => (
                    <div
                      key={field.key}
                      style={{
                        display: "grid", gridTemplateColumns: "180px 1fr",
                        alignItems: "center", gap: "1.5rem",
                        padding: "1.25rem 1.75rem",
                        borderBottom: i < arr.length - 1 ? "1px solid var(--stone-light)" : "none",
                      }}
                    >
                      <p style={{ fontSize: "0.78rem", color: "var(--stone)", fontWeight: 500 }}>{field.label}</p>
                      {editMode ? (
                        <input
                          id={`profile-${field.key}`}
                          type={field.type}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          style={{
                            padding: "0.65rem 1rem",
                            border: "1px solid var(--stone-light)",
                            borderRadius: "0",
                            background: "var(--bone)",
                            fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--charcoal)",
                            outline: "none", width: "100%", maxWidth: "420px",
                            transition: "border-color 0.2s ease",
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = "var(--copper)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "var(--stone-light)")}
                        />
                      ) : (
                        <p style={{ fontSize: "0.88rem", color: "var(--charcoal)" }}>{field.value}</p>
                      )}
                    </div>
                  ))}

                  {/* Gender — dropdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: "1.5rem", padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--stone-light)" }}>
                    <p style={{ fontSize: "0.78rem", color: "var(--stone)", fontWeight: 500 }}>Jenis Kelamin</p>
                    {editMode ? (
                      <select
                        id="profile-gender"
                        value={formData.gender}
                        onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        style={{
                          padding: "0.65rem 1rem", border: "1px solid var(--stone-light)", background: "var(--bone)",
                          fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--charcoal)",
                          outline: "none", width: "100%", maxWidth: "420px", cursor: "pointer",
                        }}
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                        <option value="Tidak disebutkan">Tidak disebutkan</option>
                      </select>
                    ) : (
                      <p style={{ fontSize: "0.88rem", color: "var(--charcoal)" }}>{formData.gender}</p>
                    )}
                  </div>

                  {/* Member tier — read only */}
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: "1.5rem", padding: "1.25rem 1.75rem" }}>
                    <p style={{ fontSize: "0.78rem", color: "var(--stone)", fontWeight: 500 }}>Status Member</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(196,113,58,0.1)", border: "1px solid rgba(196,113,58,0.25)", padding: "0.3rem 0.85rem" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <p style={{ fontSize: "0.72rem", color: "var(--copper)", fontWeight: 600, letterSpacing: "0.08em" }}>{USER.tier}</p>
                      </div>
                      <Link href="/dashboard/rewards" style={{ fontSize: "0.7rem", color: "var(--stone)", borderBottom: "1px dotted var(--stone-light)", paddingBottom: "1px" }}>
                        Lihat rewards →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Edit actions */}
                {editMode && (
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => { setEditMode(false); setFormData({ name: USER.name, email: USER.email, phone: USER.phone, gender: USER.gender, birthdate: USER.birthdate }); }}
                      style={{ padding: "0.7rem 1.75rem", background: "transparent", border: "1px solid var(--stone-light)", color: "var(--charcoal)", fontFamily: "var(--font-body)", fontSize: "0.78rem", letterSpacing: "0.08em", cursor: "pointer" }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      style={{ padding: "0.7rem 1.75rem", background: "var(--copper)", border: "none", color: "var(--white)", fontFamily: "var(--font-body)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer" }}
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ════ SECTION: ALAMAT ════ */}
            {activeSection === "alamat" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.25rem" }}>Pengiriman</p>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 300, color: "var(--charcoal)" }}>
                      Daftar Alamat
                    </h2>
                  </div>
                  <button
                    onClick={() => setAddNewAddress(true)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.6rem 1.25rem", background: "var(--charcoal)", border: "none",
                      color: "var(--cream)", fontFamily: "var(--font-body)",
                      fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em",
                      textTransform: "uppercase", cursor: "pointer",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Tambah Alamat
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {ADDRESSES.map(addr => (
                    <div
                      key={addr.id}
                      style={{
                        background: "var(--white)",
                        border: `1px solid ${addr.isPrimary ? "var(--copper)" : "var(--stone-light)"}`,
                        padding: "1.5rem 1.75rem",
                        position: "relative",
                      }}
                    >
                      {addr.isPrimary && (
                        <span style={{
                          position: "absolute", top: "1.25rem", right: "1.25rem",
                          background: "rgba(196,113,58,0.1)", border: "1px solid rgba(196,113,58,0.25)",
                          color: "var(--copper)", fontSize: "0.62rem", fontWeight: 600,
                          letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.65rem",
                        }}>
                          Utama
                        </span>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--charcoal)" }}>{addr.label}</p>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--charcoal)", marginBottom: "0.2rem" }}>{addr.recipient}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--stone)", marginBottom: "0.2rem" }}>{addr.phone}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--stone)", lineHeight: 1.6 }}>
                        {addr.address}<br />
                        {addr.city}, {addr.province} {addr.postal}
                      </p>
                      <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--stone-light)" }}>
                        <button
                          onClick={() => setEditAddress(addr.id)}
                          style={{ fontSize: "0.72rem", color: "var(--charcoal)", fontWeight: 500, letterSpacing: "0.08em", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        {!addr.isPrimary && (
                          <>
                            <span style={{ color: "var(--stone-light)" }}>|</span>
                            <button style={{ fontSize: "0.72rem", color: "var(--copper)", fontWeight: 500, letterSpacing: "0.08em", background: "none", border: "none", cursor: "pointer" }}>
                              Jadikan Utama
                            </button>
                            <span style={{ color: "var(--stone-light)" }}>|</span>
                            <button style={{ fontSize: "0.72rem", color: "#DC2626", fontWeight: 500, letterSpacing: "0.08em", background: "none", border: "none", cursor: "pointer" }}>
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add address hint */}
                {!addNewAddress && (
                  <button
                    onClick={() => setAddNewAddress(true)}
                    style={{
                      width: "100%", marginTop: "1rem", padding: "1.5rem",
                      background: "transparent", border: "1px dashed var(--stone-light)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                      color: "var(--stone)", fontFamily: "var(--font-body)", fontSize: "0.8rem", cursor: "pointer",
                      transition: "border-color 0.2s ease, color 0.2s ease",
                    }}
                    onMouseEnter={e => { (e.currentTarget).style.borderColor = "var(--copper)"; (e.currentTarget).style.color = "var(--copper)"; }}
                    onMouseLeave={e => { (e.currentTarget).style.borderColor = "var(--stone-light)"; (e.currentTarget).style.color = "var(--stone)"; }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Tambahkan Alamat Baru
                  </button>
                )}
              </div>
            )}

            {/* ════ SECTION: KEAMANAN ════ */}
            {activeSection === "keamanan" && (
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.25rem" }}>Akun Anda</p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 300, color: "var(--charcoal)" }}>
                    Keamanan Akun
                  </h2>
                </div>

                {/* Password section */}
                <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)", marginBottom: "1rem" }}>
                  <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid var(--stone-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--charcoal)", marginBottom: "0.15rem" }}>Kata Sandi</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--stone)" }}>Terakhir diubah 90 hari yang lalu</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(f => !f)}
                      style={{ padding: "0.55rem 1.1rem", background: "var(--bone)", border: "1px solid var(--stone-light)", color: "var(--charcoal)", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.08em", cursor: "pointer" }}
                    >
                      {showPasswordForm ? "Batal" : "Ubah Kata Sandi"}
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div style={{ padding: "1.5rem 1.75rem" }}>
                      {[
                        { id: "pw-current", label: "Kata Sandi Saat Ini", placeholder: "Masukkan kata sandi lama" },
                        { id: "pw-new", label: "Kata Sandi Baru", placeholder: "Minimal 8 karakter" },
                        { id: "pw-confirm", label: "Konfirmasi Kata Sandi Baru", placeholder: "Ulangi kata sandi baru" },
                      ].map((f, i, arr) => (
                        <div key={f.id} style={{ marginBottom: i < arr.length - 1 ? "1rem" : "1.5rem" }}>
                          <label htmlFor={f.id} style={{ display: "block", fontSize: "0.75rem", color: "var(--stone)", marginBottom: "0.4rem", letterSpacing: "0.06em" }}>
                            {f.label}
                          </label>
                          <input
                            id={f.id}
                            type="password"
                            placeholder={f.placeholder}
                            style={{
                              width: "100%", maxWidth: "400px", padding: "0.7rem 1rem",
                              border: "1px solid var(--stone-light)", background: "var(--bone)",
                              fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--charcoal)", outline: "none",
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = "var(--copper)")}
                            onBlur={e => (e.currentTarget.style.borderColor = "var(--stone-light)")}
                          />
                        </div>
                      ))}
                      <button style={{ padding: "0.7rem 2rem", background: "var(--copper)", border: "none", color: "var(--white)", fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer" }}>
                        Simpan Kata Sandi
                      </button>
                    </div>
                  )}
                </div>

                {/* Two-factor */}
                <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)", marginBottom: "1rem" }}>
                  <div style={{ padding: "1.5rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--charcoal)", marginBottom: "0.15rem" }}>Autentikasi Dua Faktor</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--stone)" }}>Tambah lapisan keamanan ekstra ke akun Anda</p>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.68rem", padding: "0.25rem 0.75rem", background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)", fontWeight: 500 }}>
                      Nonaktif
                    </span>
                  </div>
                </div>

                {/* Sessions */}
                <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)", marginBottom: "2rem" }}>
                  <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--stone-light)" }}>
                    <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--charcoal)" }}>Sesi Aktif</p>
                  </div>
                  {[
                    { device: "Chrome – Windows 11", location: "Jakarta, Indonesia", time: "Sekarang", current: true },
                    { device: "Safari – iPhone 15", location: "Jakarta, Indonesia", time: "2 jam yang lalu", current: false },
                  ].map((s, i, arr) => (
                    <div key={i} style={{ padding: "1rem 1.75rem", borderBottom: i < arr.length - 1 ? "1px solid var(--stone-light)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: s.current ? "rgba(22,163,74,0.08)" : "var(--bone)", border: `1px solid ${s.current ? "rgba(22,163,74,0.2)" : "var(--stone-light)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.current ? "#16A34A" : "var(--stone)"} strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: "0.82rem", color: "var(--charcoal)", fontWeight: 500, marginBottom: "0.1rem" }}>{s.device}</p>
                          <p style={{ fontSize: "0.7rem", color: "var(--stone)" }}>{s.location} · {s.time}</p>
                        </div>
                      </div>
                      {s.current ? (
                        <span style={{ fontSize: "0.65rem", color: "#16A34A", fontWeight: 600, letterSpacing: "0.08em" }}>Sesi Ini</span>
                      ) : (
                        <button style={{ fontSize: "0.7rem", color: "#DC2626", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>Keluar</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Danger zone */}
                <div style={{ border: "1px solid rgba(220,38,38,0.25)", background: "rgba(220,38,38,0.03)" }}>
                  <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid rgba(220,38,38,0.15)" }}>
                    <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#DC2626" }}>Zona Berbahaya</p>
                  </div>
                  <div style={{ padding: "1.25rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "0.85rem", color: "var(--charcoal)", fontWeight: 500, marginBottom: "0.2rem" }}>Hapus Akun</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--stone)" }}>Tindakan ini permanen dan tidak dapat dibatalkan.</p>
                    </div>
                    <button style={{ padding: "0.55rem 1.25rem", background: "transparent", border: "1px solid rgba(220,38,38,0.4)", color: "#DC2626", fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.08em", cursor: "pointer" }}>
                      Hapus Akun
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ════ SECTION: NOTIFIKASI ════ */}
            {activeSection === "notifikasi" && (
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.25rem" }}>Preferensi</p>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 300, color: "var(--charcoal)" }}>
                    Pengaturan Notifikasi
                  </h2>
                </div>

                <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)", marginBottom: "1rem" }}>
                  <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--stone-light)" }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--stone)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Email & Push</p>
                  </div>
                  {([
                    { key: "order" as const, label: "Update Pesanan", desc: "Konfirmasi, pengiriman, dan status pesanan Anda" },
                    { key: "promo" as const, label: "Promosi & Penawaran", desc: "Diskon eksklusif dan penawaran terbatas" },
                    { key: "restock" as const, label: "Restock Wishlist", desc: "Beri tahu saya saat produk di wishlist tersedia kembali" },
                    { key: "newsletter" as const, label: "Newsletter Maison", desc: "Inspirasi dekorasi, tips desain interior, dan konten eksklusif" },
                  ] as const).map((n, i, arr) => (
                    <div
                      key={n.key}
                      style={{
                        padding: "1.25rem 1.75rem",
                        borderBottom: i < arr.length - 1 ? "1px solid var(--stone-light)" : "none",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--charcoal)", marginBottom: "0.15rem" }}>{n.label}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--stone)" }}>{n.desc}</p>
                      </div>
                      {/* Toggle */}
                      <button
                        id={`notif-toggle-${n.key}`}
                        role="switch"
                        aria-checked={notifs[n.key]}
                        onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                        style={{
                          width: "44px", height: "24px", borderRadius: "12px",
                          background: notifs[n.key] ? "var(--copper)" : "var(--stone-light)",
                          border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
                          transition: "background 0.25s ease",
                        }}
                      >
                        <span style={{
                          position: "absolute", top: "3px",
                          left: notifs[n.key] ? "23px" : "3px",
                          width: "18px", height: "18px", borderRadius: "50%",
                          background: "var(--white)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          transition: "left 0.25s ease",
                        }} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* SMS */}
                <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)" }}>
                  <div style={{ padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--stone-light)" }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--stone)", letterSpacing: "0.1em", textTransform: "uppercase" }}>SMS</p>
                  </div>
                  <div style={{ padding: "1.25rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--charcoal)", marginBottom: "0.15rem" }}>Notifikasi SMS</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--stone)" }}>Terima pembaruan penting melalui pesan teks</p>
                    </div>
                    <button
                      id="notif-toggle-sms"
                      role="switch"
                      aria-checked={notifs.sms}
                      onClick={() => setNotifs(prev => ({ ...prev, sms: !prev.sms }))}
                      style={{
                        width: "44px", height: "24px", borderRadius: "12px",
                        background: notifs.sms ? "var(--copper)" : "var(--stone-light)",
                        border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
                        transition: "background 0.25s ease",
                      }}
                    >
                      <span style={{
                        position: "absolute", top: "3px",
                        left: notifs.sms ? "23px" : "3px",
                        width: "18px", height: "18px", borderRadius: "50%",
                        background: "var(--white)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 0.25s ease",
                      }} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
                  <button style={{ padding: "0.7rem 2rem", background: "var(--copper)", border: "none", color: "var(--white)", fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer" }}>
                    Simpan Preferensi
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style jsx global>{`
        .profile-layout { grid-template-columns: 240px 1fr !important; }
        @media (max-width: 900px) {
          .profile-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
