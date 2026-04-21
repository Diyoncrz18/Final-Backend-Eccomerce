"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import NavbarUser from "../../components/NavbarUser";
import { getAuthToken, getCurrentUser } from "../../../services/api";

const DEFAULT_USER = { name: "Budi Santoso", email: "budi@email.com", tier: "Gold Member", points: 2450 };

function getStoredUser() {
  if (typeof window === 'undefined') return DEFAULT_USER;
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : DEFAULT_USER;
}

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

const POINT_HISTORY = [
  { date: "18 Apr 2025", desc: "Pembelian MSN-20250418-001", type: "earn", pts: 976 },
  { date: "15 Apr 2025", desc: "Pembelian MSN-20250415-002", type: "earn", pts: 1250 },
  { date: "10 Apr 2025", desc: "Penukaran Diskon 10%",       type: "redeem", pts: -500 },
  { date: "8 Apr 2025",  desc: "Pembelian MSN-20250408-003", type: "earn", pts: 480 },
  { date: "28 Mar 2025", desc: "Pembelian MSN-20250328-004", type: "earn", pts: 980 },
  { date: "15 Mar 2025", desc: "Bonus Ulang Tahun Member",   type: "bonus", pts: 300 },
  { date: "5 Mar 2025",  desc: "Penukaran Gratis Ongkir",    type: "redeem", pts: -150 },
];

const REDEEM_SVG: Record<number, React.ReactNode> = {
  1: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  2: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  3: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  4: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  5: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  6: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

const EARN_SVG: React.ReactNode[] = [
  <svg key="shop" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  <svg key="star" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="users" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="gift" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
];

const EARN_WAYS = [
  { title: "Setiap Pembelian",    desc: "1 poin per Rp 10.000 belanja" },
  { title: "Tulis Ulasan",         desc: "+50 poin per ulasan terverifikasi" },
  { title: "Ajak Teman",           desc: "+200 poin per referral berhasil" },
  { title: "Bonus Ulang Tahun",    desc: "+300 poin di bulan ulang tahun Anda" },
];

const REDEEM_OPTIONS = [
  { id: 1, title: "Voucher Diskon Rp 50.000", desc: "Potongan harga langsung tanpa minimum belanja.", pts: 500 },
  { id: 2, title: "Voucher Gratis Ongkir",    desc: "Bebas ongkir hingga Rp 100.000 ke seluruh Indonesia.", pts: 750 },
  { id: 3, title: "Diskon 10% (Katalog Baru)",desc: "Berlaku khusus untuk produk koleksi terbaru.", pts: 1000 },
  { id: 4, title: "Voucher Diskon Rp 250.000",desc: "Potongan harga untuk pembelian minimal Rp 2.500.000.", pts: 2000 },
  { id: 5, title: "Exclusive Gift Box",        desc: "Set lilin aromaterapi & reed diffuser Maison.", pts: 3500 },
  { id: 6, title: "Akses Early Sale (VIP)",    desc: "Akses H-1 sebelum publik untuk promosi tahunan.", pts: 5000 },
];


const TIER_BENEFITS: Record<string, { regular: string; gold: string; platinum: string }[]> = {
  benefits: [
    { regular: "Kumpul poin dari pembelian",    gold: "✓",  platinum: "✓" },
    { regular: "Diskon member 5%",              gold: "–",  platinum: "✓" },
    { regular: "Diskon member 3%",              gold: "✓",  platinum: "–" },
    { regular: "Free ongkir min. Rp 2 juta",   gold: "–",  platinum: "✓" },
    { regular: "Free ongkir min. Rp 3 juta",   gold: "✓",  platinum: "–" },
    { regular: "Akses early sale",              gold: "✓",  platinum: "✓" },
    { regular: "Layanan prioritas",             gold: "–",  platinum: "✓" },
    { regular: "White Glove Delivery",          gold: "–",  platinum: "✓" },
    { regular: "Konsultasi desain gratis",      gold: "–",  platinum: "✓" },
  ],
};

const TIER_THRESHOLDS = [
  { name: "Regular", min: 0,    max: 999,   color: "#8A8A8A" },
  { name: "Gold",    min: 1000, max: 4999,  color: "#C4713A" },
  { name: "Platinum",min: 5000, max: 99999, color: "#4A6087" },
];

export default function RewardsPage() {
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [redeemed, setRedeemed] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<"semua" | "earn" | "redeem">("semua");
  const [user, setUser] = useState(getStoredUser());

  const currentPts  = user?.points || 0;
  const nextTier    = TIER_THRESHOLDS.find(t => currentPts < t.max && currentPts >= t.min);
  const nextTierObj = nextTier?.name === "Gold" ? TIER_THRESHOLDS[2] : null; // next = Platinum
  const ptsToNext   = nextTierObj ? nextTierObj.min - currentPts : 0;
  const progress    = Math.min(((currentPts - 1000) / (5000 - 1000)) * 100, 100); // Gold→Platinum

  const handleRedeem = (id: number, pts: number) => {
    if (pts > currentPts) return;
    setRedeeming(id);
    setTimeout(() => {
      setRedeeming(null);
      setRedeemed(prev => new Set([...prev, id]));
    }, 1200);
  };

  const filteredHistory = POINT_HISTORY.filter(h =>
    activeTab === "semua" ? true : h.type === (activeTab === "earn" ? "earn" : "redeem") || (activeTab === "earn" && h.type === "bonus")
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={user} />

      {/* ── Header ── */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)", paddingTop: "72px" }}>
        <div className="container-main" style={{ padding: "2rem var(--container-px, 2rem)" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--stone)", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Dashboard</Link>
            {" / "}
            <span style={{ color: "var(--charcoal)" }}>Poin & Reward</span>
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
            Poin & Reward
          </h1>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>

        {/* ── Member Card ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{
            background: "linear-gradient(135deg, #1a1714 0%, #2d1f0e 55%, #1a2635 100%)",
            padding: "2.5rem 3rem", position: "relative", overflow: "hidden",
          }} className="member-card">
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: "-40%", right: "5%", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(196,113,58,0.1)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-50%", left: "30%", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(196,113,58,0.06)", pointerEvents: "none" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", position: "relative" }} className="card-inner">
              {/* Left: identity */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <p style={{ fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--copper)", fontWeight: 600 }}>
                    Maison Member
                  </p>
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, color: "var(--cream)", marginBottom: "0.25rem" }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.5)", marginBottom: "2rem" }}>
                  Member sejak Maret 2024
                </p>
                {/* Tier badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(196,113,58,0.15)", border: "1px solid rgba(196,113,58,0.3)", padding: "0.5rem 1.25rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300, color: "var(--copper)" }}>
                    {user?.tier || "Bronze"}
                  </p>
                </div>
              </div>

              {/* Right: points */}
              <div>
                <p style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", marginBottom: "0.4rem" }}>
                  Saldo Poin
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1, marginBottom: "0.25rem" }}>
                  {currentPts.toLocaleString()}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--copper)", marginBottom: "1.5rem" }}>
                  ≈ {formatRp(currentPts * 10)} nilai diskon
                </p>

                {/* Progress to Platinum */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <p style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.5)" }}>Gold</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.5)" }}>Platinum (5.000 pts)</p>
                  </div>
                  <div style={{ height: "4px", background: "rgba(245,240,232,0.15)", borderRadius: "99px", overflow: "hidden", marginBottom: "0.4rem" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--copper-dark), var(--copper))", transition: "width 0.8s ease" }} />
                  </div>
                  <p style={{ fontSize: "0.68rem", color: "rgba(245,240,232,0.45)" }}>
                    {ptsToNext > 0 ? `${ptsToNext.toLocaleString()} poin lagi ke Platinum` : "Anda sudah Platinum! 🎉"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "flex-start" }} className="rewards-layout">

          {/* ── Left Column ── */}
          <div>
            {/* Earn Points */}
            <section style={{ marginBottom: "2.5rem" }}>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>Cara Kumpul Poin</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 300, color: "var(--charcoal)", marginBottom: "1.5rem" }}>
                Dapatkan Lebih Banyak Poin
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }} className="earn-grid">
                {EARN_WAYS.map((w, i) => (
                  <div key={w.title} style={{
                    background: "var(--white)", border: "1px solid var(--stone-light)",
                    padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start",
                  }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                      background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {EARN_SVG[i]}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--charcoal)", marginBottom: "0.2rem" }}>{w.title}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--stone)", lineHeight: 1.5 }}>{w.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Redeem Options */}
            <section style={{ marginBottom: "2.5rem" }}>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>Tukar Poin</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 300, color: "var(--charcoal)", marginBottom: "1.5rem" }}>
                Gunakan Poin Anda
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="redeem-grid">
                {REDEEM_OPTIONS.map(opt => {
                  const canAfford = currentPts >= opt.pts;
                  const isRedeemed = redeemed.has(opt.id);
                  const isLoading  = redeeming === opt.id;
                  return (
                    <div key={opt.id} style={{
                      background: "var(--white)", border: `1px solid ${isRedeemed ? "var(--copper)" : "var(--stone-light)"}`,
                      padding: "1.25rem", opacity: canAfford ? 1 : 0.5,
                      transition: "border-color 0.2s ease",
                    }}>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: "0.75rem",
                      }}>
                        {REDEEM_SVG[opt.id]}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--charcoal)", marginBottom: "0.2rem" }}>{opt.title}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--stone)", marginBottom: "0.75rem", lineHeight: 1.5 }}>{opt.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--copper)" }}>{opt.pts.toLocaleString()} Poin</p>
                      </div>
                      <button
                        disabled={!canAfford || isLoading}
                        onClick={() => handleRedeem(opt.id, opt.pts)}
                        style={{
                          width: "100%", padding: "0.55rem",
                          background: isRedeemed ? "#16A34A" : canAfford ? "var(--charcoal)" : "var(--stone-light)",
                          border: "none", color: "var(--cream)",
                          fontFamily: "var(--font-body)", fontSize: "0.68rem", fontWeight: 500,
                          letterSpacing: "0.1em", textTransform: "uppercase",
                          cursor: canAfford && !isRedeemed ? "pointer" : "not-allowed",
                          transition: "background 0.25s ease",
                        }}>
                        {isRedeemed ? "✓ Berhasil Ditukar" : isLoading ? "Memproses..." : canAfford ? "Tukar Sekarang" : "Poin Tidak Cukup"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Tier Benefits Table */}
            <section>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>Perbandingan Tier</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 300, color: "var(--charcoal)", marginBottom: "1.5rem" }}>
                Keuntungan Member
              </h2>
              <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)", overflow: "hidden" }}>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "var(--charcoal)" }}>
                  {["Benefit", "Regular", "Gold ★", "Platinum ◆"].map((h, i) => (
                    <div key={h} style={{
                      padding: "0.85rem 1rem",
                      borderRight: i < 3 ? "1px solid rgba(245,240,232,0.1)" : "none",
                      background: i === 2 ? "rgba(196,113,58,0.15)" : i === 3 ? "rgba(74,96,135,0.2)" : "none",
                    }}>
                      <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: i === 2 ? "var(--copper)" : i === 3 ? "#89A4C7" : "rgba(245,240,232,0.7)" }}>
                        {h}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Rows */}
                {TIER_BENEFITS.benefits.map((row, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    borderBottom: i < TIER_BENEFITS.benefits.length - 1 ? "1px solid var(--stone-light)" : "none",
                    background: i % 2 === 1 ? "var(--bone)" : "var(--white)",
                  }}>
                    <div style={{ padding: "0.75rem 1rem", borderRight: "1px solid var(--stone-light)" }}>
                      <p style={{ fontSize: "0.78rem", color: "var(--charcoal-soft)" }}>{row.regular}</p>
                    </div>
                    {[{ val: "✓", col: 1 }, { val: row.gold, col: 2 }, { val: row.platinum, col: 3 }].map((c, j) => (
                      <div key={j} style={{ padding: "0.75rem 1rem", textAlign: "center", borderRight: j < 2 ? "1px solid var(--stone-light)" : "none" }}>
                        <p style={{ fontSize: "0.85rem", color: c.val === "✓" ? "#16A34A" : c.val === "–" ? "var(--stone-light)" : "var(--charcoal-soft)", fontWeight: c.val === "✓" ? 700 : 400 }}>
                          {c.val}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right: History ── */}
          <div style={{ position: "sticky", top: "90px" }}>
            <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)" }}>
              {/* Header */}
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--stone-light)", background: "var(--charcoal)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300, color: "var(--cream)", marginBottom: "0.1rem" }}>
                  Riwayat Poin
                </p>
                <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.45)" }}>Transaksi 30 hari terakhir</p>
              </div>

              {/* Filter tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--stone-light)" }}>
                {(["semua", "earn", "redeem"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1, padding: "0.75rem 0", background: "none", border: "none",
                      borderBottom: `2px solid ${activeTab === tab ? "var(--copper)" : "transparent"}`,
                      fontSize: "0.72rem", fontWeight: activeTab === tab ? 600 : 400,
                      color: activeTab === tab ? "var(--copper)" : "var(--stone)",
                      cursor: "pointer", textTransform: "capitalize", letterSpacing: "0.06em",
                      transition: "color 0.2s ease",
                    }}>
                    {tab === "semua" ? "Semua" : tab === "earn" ? "Masuk" : "Keluar"}
                  </button>
                ))}
              </div>

              {/* Transactions */}
              <div>
                {filteredHistory.map((h, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
                    padding: "1rem 1.25rem",
                    borderBottom: i < filteredHistory.length - 1 ? "1px solid rgba(184,175,160,0.2)" : "none",
                  }}>
                    {/* Icon */}
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                      background: h.type === "redeem" ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {h.type === "redeem" ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                        </svg>
                      )}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.78rem", color: "var(--charcoal)", fontWeight: 500, marginBottom: "0.1rem" }}>{h.desc}</p>
                      <p style={{ fontSize: "0.68rem", color: "var(--stone)" }}>{h.date}</p>
                    </div>
                    {/* Points */}
                    <p style={{
                      fontSize: "0.9rem", fontWeight: 700,
                      color: h.type === "redeem" ? "#DC2626" : "#16A34A",
                      flexShrink: 0,
                    }}>
                      {h.pts > 0 ? "+" : ""}{h.pts.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Balance summary */}
              <div style={{ padding: "1rem 1.25rem", background: "var(--bone)", borderTop: "1px solid var(--stone-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "0.78rem", color: "var(--charcoal-soft)" }}>Saldo aktif</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 300, color: "var(--copper)" }}>
                      {currentPts.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .member-card { padding: 2.5rem 3rem !important; }
        .card-inner  { grid-template-columns: 1fr 1fr !important; }
        .rewards-layout { grid-template-columns: 1fr 340px !important; }
        .earn-grid   { grid-template-columns: repeat(2, 1fr) !important; }
        .redeem-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width: 1100px) {
          .rewards-layout { grid-template-columns: 1fr !important; }
          .redeem-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .card-inner  { grid-template-columns: 1fr !important; }
          .earn-grid   { grid-template-columns: 1fr !important; }
          .redeem-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .member-card { padding: 1.75rem !important; }
        }
      `}</style>
    </div>
  );
}
