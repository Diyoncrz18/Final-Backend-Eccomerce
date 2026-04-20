"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NavbarUser from "../components/NavbarUser";

/* ─────────────── Mock Data ─────────────── */
const USER = {
  name: "Budi Santoso",
  email: "budi@email.com",
  tier: "Gold Member",
  points: 2450,
  pointsNext: 5000,
  joinDate: "Maret 2024",
};

const ORDERS = [
  {
    id: "MSN-20250418",
    product: "Marble Side Table",
    status: "Dalam Pengiriman",
    statusCode: "shipping",
    date: "18 Apr 2025",
    img: "/product-marble-table.png",
    price: "Rp 4.800.000",
    eta: "21 Apr 2025",
  },
  {
    id: "MSN-20250409",
    product: "Velvet Accent Chair",
    status: "Selesai",
    statusCode: "done",
    date: "9 Apr 2025",
    img: "/product-velvet-chair.png",
    price: "Rp 7.200.000",
    eta: null,
  },
  {
    id: "MSN-20250401",
    product: "Rattan Wall Panel",
    status: "Selesai",
    statusCode: "done",
    date: "1 Apr 2025",
    img: "/product-rattan-wall.png",
    price: "Rp 2.100.000",
    eta: null,
  },
];

const WISHLIST = [
  { id: 1, name: "Olive Linen Sofa", price: "Rp 12.500.000", img: "/product-sofa.png", tag: "Terlaris" },
  { id: 2, name: "Travertine Coffee Table", price: "Rp 8.900.000", img: "/product-table.png", tag: null },
  { id: 3, name: "Ceramic Statement Vase", price: "Rp 1.350.000", img: "/product-ceramic-vase.png", tag: "Baru" },
  { id: 4, name: "Rattan Pendant Lamp", price: "Rp 2.750.000", img: "/product-lamp.png", tag: null },
];

const RECOMMENDATIONS = [
  { id: 1, name: "Bouclé Armchair", price: "Rp 6.400.000", img: "/product-chair.png", tag: "Best Seller", rating: 4.9 },
  { id: 2, name: "Oak Dining Table", price: "Rp 9.800.000", img: "/product-table.png", tag: null, rating: 4.8 },
  { id: 3, name: "Japandi Floor Lamp", price: "Rp 1.850.000", img: "/product-lamp.png", tag: "New", rating: 5.0 },
  { id: 4, name: "Linen Throw Pillow Set", price: "Rp 680.000", img: "/product-ceramic-vase.png", tag: null, rating: 4.7 },
  { id: 5, name: "Stone Side Table", price: "Rp 3.200.000", img: "/product-marble-table.png", tag: "Diskon 15%", rating: 4.8 },
  { id: 6, name: "Wabi-Sabi Vase Set", price: "Rp 1.100.000", img: "/product-rattan-wall.png", tag: null, rating: 4.9 },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string; step: number }> = {
  pending: { color: "#92400E", bg: "rgba(217,119,6,0.1)", dot: "#D97706", step: 1 },
  packing: { color: "#1D4ED8", bg: "rgba(59,130,246,0.1)", dot: "#3B82F6", step: 2 },
  shipping: { color: "#6D28D9", bg: "rgba(109,40,217,0.1)", dot: "#7C3AED", step: 3 },
  done: { color: "#065F46", bg: "rgba(16,185,129,0.1)", dot: "#10B981", step: 4 },
};

/* ─────────────── Helpers ─────────────── */
function greeting() {
  const h = new Date().getHours();
  if (h < 11) return ["Selamat Pagi"];
  if (h < 15) return ["Selamat Siang"];
  if (h < 18) return ["Selamat Sore"];
  return ["Selamat Malam"];
}

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(n) ? "var(--copper)" : "var(--stone-light)"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: "0.68rem", color: "var(--stone)", marginLeft: "3px" }}>{n.toFixed(1)}</span>
    </span>
  );
}

/* ─────────────── Main Page ─────────────── */
export default function DashboardPage() {
  const [greet, emoji] = greeting();
  const [activeTab, setActiveTab] = useState<"semua" | "aktif" | "selesai">("semua");
  const [wishHover, setWishHover] = useState<number | null>(null);
  const [recHover, setRecHover] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const ordersFiltered = ORDERS.filter((o) =>
    activeTab === "semua" ? true
      : activeTab === "aktif" ? o.statusCode === "shipping" || o.statusCode === "packing"
        : o.statusCode === "done"
  );

  const pct = Math.round((USER.points / USER.pointsNext) * 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bone)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <NavbarUser user={USER} />

      {/* ═══════════════ 1. HERO GREETING ═══════════════ */}
      <section
        style={{
          background: "var(--charcoal)",
          paddingTop: "8rem",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(196,113,58,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 40% 60% at 10% 30%, rgba(196,113,58,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "3rem",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left: Greeting */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  fontWeight: 400,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--copper)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>{emoji}</span>
                {greet}
              </p>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 300,
                  color: "var(--cream)",
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                }}
              >
                Halo,{" "}
                <em style={{ fontStyle: "italic", color: "var(--copper)" }}>
                  {USER.name.split(" ")[0]}
                </em>
                <br />
                <span style={{ fontSize: "0.65em", color: "rgba(245,240,232,0.55)", fontStyle: "normal" }}>
                  apa yang ingin Anda temukan hari ini?
                </span>
              </h1>

              {/* Quick search bar */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  maxWidth: "520px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "rgba(245,240,232,0.08)",
                    border: "1px solid rgba(245,240,232,0.15)",
                    padding: "0.9rem 1.25rem",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(245,240,232,0.4)" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari furnitur, dekorasi, ruangan..."
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--cream)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.88rem",
                    }}
                    id="dashboard-search"
                  />
                </div>
                <button
                  style={{
                    background: "var(--copper)",
                    border: "none",
                    color: "var(--white)",
                    padding: "0.9rem 1.5rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Cari
                </button>
              </div>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                  marginTop: "1rem",
                }}
              >
                {["Ruang Tamu", "Kamar Tidur", "Meja Marmer", "Kursi Linen", "Dekorasi"].map((tag) => (
                  <button
                    key={tag}
                    style={{
                      background: "rgba(245,240,232,0.07)",
                      border: "1px solid rgba(245,240,232,0.15)",
                      color: "rgba(245,240,232,0.65)",
                      padding: "0.35rem 0.85rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(196,113,58,0.2)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--copper)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--copper)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,240,232,0.07)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(245,240,232,0.65)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,240,232,0.15)";
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Member Card */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(196,113,58,0.25) 0%, rgba(26,23,20,0.4) 100%)",
                border: "1px solid rgba(196,113,58,0.3)",
                padding: "2rem",
                backdropFilter: "blur(12px)",
                minWidth: "260px",
                position: "relative",
                overflow: "hidden",
              }}
              className="hidden-mobile"
            >
              {/* Card shimmer */}
              <div
                style={{
                  position: "absolute",
                  top: "-40%",
                  right: "-20%",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "rgba(196,113,58,0.1)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--copper)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Maison Member
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.35rem",
                    color: "var(--cream)",
                    fontWeight: 300,
                    marginBottom: "0.25rem",
                  }}
                >
                  {USER.tier}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "rgba(245,240,232,0.5)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Member sejak {USER.joinDate}
                </p>

                <div style={{ marginBottom: "1.25rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "2rem",
                          color: "var(--cream)",
                          fontWeight: 300,
                          lineHeight: 1,
                        }}
                      >
                        {USER.points.toLocaleString()}
                      </p>
                      <p
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--copper)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        Poin
                      </p>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.45)" }}>
                      / {USER.pointsNext.toLocaleString()} Platinum
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: "3px",
                      background: "rgba(245,240,232,0.12)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "linear-gradient(90deg, var(--copper-dark), var(--copper))",
                        borderRadius: "2px",
                        transition: "width 1s var(--ease-smooth)",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(245,240,232,0.35)",
                      marginTop: "0.35rem",
                      textAlign: "right",
                    }}
                  >
                    {USER.pointsNext - USER.points} poin lagi ke Platinum
                  </p>
                </div>

                <Link
                  href="/dashboard/rewards"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--copper)",
                    transition: "gap 0.2s ease",
                  }}
                >
                  Tukar Poin
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 2. QUICK ACTIONS ═══════════════ */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)" }}>
        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
            }}
            className="quick-actions-grid"
          >
            {[
              { label: "Pesanan Saya", count: "3 Aktif", href: "/dashboard/orders", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 3H8v4h8V3z" /></svg> },
              { label: "Wishlist", count: "4 Produk", href: "/dashboard/wishlist", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> },
              { label: "Poin Saya", count: "2.450 Poin", href: "/dashboard/rewards", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg> },
              { label: "Konsultasi", count: "Gratis 1x", href: "/dashboard/consult", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
            ].map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                id={`quick-action-${i}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "1.75rem 1rem",
                  borderRight: i < 3 ? "1px solid var(--stone-light)" : "none",
                  color: "var(--charcoal)",
                  transition: "background 0.25s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--bone)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}
              >
                <span style={{ color: "var(--copper)", lineHeight: 0 }}>{item.icon}</span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--charcoal)",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {item.label}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--copper)", fontWeight: 400 }}>
                    {item.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>

        {/* ═══════════════ 3. ORDER TRACKING ═══════════════ */}
        <section style={{ marginBottom: "5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.35rem" }}>
                Aktivitas Belanja
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  fontWeight: 300,
                  color: "var(--charcoal)",
                }}
              >
                Pesanan Anda
              </h2>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 0,
                border: "1px solid var(--stone-light)",
                background: "var(--white)",
              }}
            >
              {(["semua", "aktif", "selesai"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0.55rem 1.1rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "capitalize",
                    background: activeTab === tab ? "var(--charcoal)" : "transparent",
                    color: activeTab === tab ? "var(--cream)" : "var(--charcoal-soft)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {ordersFiltered.length === 0 ? (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  background: "var(--white)",
                  border: "1px solid var(--stone-light)",
                  color: "var(--stone)",
                }}
              >
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                  Tidak ada pesanan
                </p>
                <p style={{ fontSize: "0.82rem" }}>Mulai belanja untuk melihat pesanan di sini.</p>
              </div>
            ) : (
              ordersFiltered.map((order) => {
                const cfg = STATUS_CONFIG[order.statusCode] || STATUS_CONFIG.done;
                return (
                  <div
                    key={order.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "56px 1fr auto",
                      gap: "1.25rem",
                      alignItems: "center",
                      background: "var(--white)",
                      border: "1px solid var(--stone-light)",
                      padding: "1.25rem 1.5rem",
                      transition: "box-shadow 0.25s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(42,38,32,0.08)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")}
                  >
                    {/* Image */}
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        background: "var(--bone)",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <Image src={order.img} alt={order.product} fill style={{ objectFit: "cover" }} />
                    </div>

                    {/* Info */}
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.05rem",
                          color: "var(--charcoal)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {order.product}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--stone)", marginBottom: "0.5rem" }}>
                        {order.id} · {order.date} · {order.price}
                      </p>

                      {/* Status pill */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.25rem 0.75rem",
                          background: cfg.bg,
                          borderRadius: "99px",
                          fontSize: "0.68rem",
                          fontWeight: 500,
                          color: cfg.color,
                          letterSpacing: "0.06em",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: cfg.dot,
                            flexShrink: 0,
                            animation: order.statusCode === "shipping" ? "pulse 2s ease infinite" : "none",
                          }}
                        />
                        {order.status}
                        {order.eta && (
                          <span style={{ opacity: 0.7, fontWeight: 400 }}>· ETA {order.eta}</span>
                        )}
                      </span>
                    </div>

                    {/* Action */}
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--charcoal-soft)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        whiteSpace: "nowrap",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--copper)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--charcoal-soft)")}
                    >
                      Detail
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <Link
              href="/dashboard/orders"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--charcoal-soft)",
                fontWeight: 500,
                borderBottom: "1px solid var(--stone-light)",
                paddingBottom: "2px",
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
            >
              Lihat Semua Pesanan
            </Link>
          </div>
        </section>

        {/* ═══════════════ 4. REKOMENDASI ═══════════════ */}
        <section style={{ marginBottom: "5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.35rem" }}>
                Dipilih Khusus Untuk Anda
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  fontWeight: 300,
                  color: "var(--charcoal)",
                }}
              >
                Rekomendasi Hari Ini
              </h2>
            </div>
            <Link
              href="/koleksi"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--charcoal-soft)",
                fontWeight: 500,
                borderBottom: "1px solid var(--stone-light)",
                paddingBottom: "2px",
              }}
              className="hidden-mobile"
            >
              Lihat Semua
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.25rem",
            }}
            className="product-grid"
          >
            {RECOMMENDATIONS.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setRecHover(item.id)}
                onMouseLeave={() => setRecHover(null)}
              >
                <div
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--stone-light)",
                    overflow: "hidden",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    boxShadow: recHover === item.id ? "0 12px 40px rgba(42,38,32,0.12)" : "none",
                    transform: recHover === item.id ? "translateY(-3px)" : "none",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      aspectRatio: "4/3",
                      position: "relative",
                      background: "var(--bone)",
                      overflow: "hidden",
                    }}
                  >
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover", transition: "transform 0.5s ease" }} />

                    {/* Tags */}
                    {item.tag && (
                      <span
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          left: "0.75rem",
                          background: item.tag.includes("Diskon") ? "var(--copper)" : "var(--charcoal)",
                          color: "var(--cream)",
                          fontSize: "0.62rem",
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "0.25rem 0.65rem",
                        }}
                      >
                        {item.tag}
                      </span>
                    )}

                    {/* Wishlist button */}
                    <button
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: "rgba(250,248,245,0.95)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: recHover === item.id ? 1 : 0,
                        transition: "opacity 0.2s ease",
                        lineHeight: 0,
                      }}
                      onClick={(e) => e.preventDefault()}
                      aria-label="Tambah ke wishlist"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    {/* Add to cart overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "1rem",
                        background: "linear-gradient(to top, rgba(42,38,32,0.9) 0%, transparent 100%)",
                        opacity: recHover === item.id ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={{
                          background: "var(--cream)",
                          border: "none",
                          color: "var(--charcoal)",
                          padding: "0.6rem 1.25rem",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                        }}
                        onClick={(e) => e.preventDefault()}
                      >
                        + Keranjang
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: "1rem 1.1rem" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        fontWeight: 300,
                        color: "var(--charcoal)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {item.name}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "0.35rem",
                      }}
                    >
                      <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--charcoal)" }}>
                        {item.price}
                      </p>
                      <Stars n={item.rating} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════ 5. WISHLIST PREVIEW ═══════════════ */}
        <section style={{ marginBottom: "5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.35rem" }}>
                Disimpan
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                  fontWeight: 300,
                  color: "var(--charcoal)",
                }}
              >
                Wishlist Saya
              </h2>
            </div>
            <Link
              href="/dashboard/wishlist"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--charcoal-soft)",
                fontWeight: 500,
                borderBottom: "1px solid var(--stone-light)",
                paddingBottom: "2px",
              }}
            >
              Lihat Semua ({WISHLIST.length})
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
            }}
            className="wishlist-grid"
          >
            {WISHLIST.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setWishHover(item.id)}
                onMouseLeave={() => setWishHover(null)}
              >
                <div
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--stone-light)",
                    overflow: "hidden",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    boxShadow: wishHover === item.id ? "0 8px 24px rgba(42,38,32,0.1)" : "none",
                    transform: wishHover === item.id ? "translateY(-2px)" : "none",
                  }}
                >
                  <div style={{ aspectRatio: "1/1", position: "relative", background: "var(--bone)", overflow: "hidden" }}>
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} />
                    {item.tag && (
                      <span
                        style={{
                          position: "absolute",
                          top: "0.6rem",
                          left: "0.6rem",
                          background: item.tag === "Baru" ? "var(--copper)" : "var(--charcoal)",
                          color: "var(--cream)",
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          padding: "0.2rem 0.55rem",
                        }}
                      >
                        {item.tag}
                      </span>
                    )}
                    {/* Remove from wishlist */}
                    <button
                      onClick={(e) => e.preventDefault()}
                      style={{
                        position: "absolute",
                        top: "0.6rem",
                        right: "0.6rem",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "rgba(250,248,245,0.95)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: wishHover === item.id ? 1 : 0,
                        transition: "opacity 0.2s ease",
                        lineHeight: 0,
                      }}
                      aria-label="Hapus dari wishlist"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding: "0.85rem 1rem" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--charcoal)", marginBottom: "0.15rem" }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--charcoal)" }}>
                      {item.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════ 6. EDITORIAL BANNER ═══════════════ */}
        <section style={{ marginBottom: "5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
            }}
            className="banner-grid"
          >
            {/* Left: Consultation Banner */}
            <div
              style={{
                background: "var(--charcoal)",
                padding: "3rem",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "260px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  right: "-15%",
                  width: "280px",
                  height: "280px",
                  borderRadius: "50%",
                  background: "rgba(196,113,58,0.08)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <p className="text-label" style={{ color: "var(--copper)", marginBottom: "1rem" }}>
                  Gratis Untuk Member Gold
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 300,
                    color: "var(--cream)",
                    marginBottom: "0.75rem",
                    lineHeight: 1.2,
                  }}
                >
                  Konsultasi Desain Interior Bersama Expert
                </h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(245,240,232,0.55)", lineHeight: 1.6 }}>
                  Dapatkan panduan eksklusif dari desainer interior kami.
                </p>
              </div>
              <Link
                href="/dashboard/consult"
                id="consult-banner-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "var(--copper)",
                  color: "var(--cream)",
                  padding: "0.85rem 1.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  alignSelf: "flex-start",
                  marginTop: "2rem",
                  transition: "background 0.25s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--copper-dark)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--copper)")}
              >
                Jadwalkan Sekarang
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right: New Arrivals */}
            <div
              style={{
                background: "var(--bone)",
                border: "1px solid var(--stone-light)",
                padding: "3rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "260px",
                position: "relative",
              }}
            >
              <div>
                <p className="text-label" style={{ color: "var(--copper)", marginBottom: "1rem" }}>
                  Koleksi Terbaru — April 2025
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    fontWeight: 300,
                    color: "var(--charcoal)",
                    marginBottom: "0.75rem",
                    lineHeight: 1.2,
                  }}
                >
                  Late Spring Collection Kini Tersedia
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", lineHeight: 1.6 }}>
                  50+ produk baru terinspirasi dari estetika Japandi dan Mediterania modern.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "2rem",
                  alignItems: "center",
                }}
              >
                <Link
                  href="/koleksi/new"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    background: "var(--charcoal)",
                    color: "var(--cream)",
                    padding: "0.85rem 1.75rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    transition: "background 0.25s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--copper)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--charcoal)")}
                >
                  Jelajahi Koleksi
                </Link>
                <p style={{ fontSize: "0.7rem", color: "var(--stone)" }}>Akses early untuk member</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 7. ACCOUNT NAVIGATION ═══════════════ */}
        <section>
          <div style={{ marginBottom: "2rem" }}>
            <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.35rem" }}>
              Kelola Akun
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                fontWeight: 300,
                color: "var(--charcoal)",
              }}
            >
              Pengaturan & Profil
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.75rem",
            }}
            className="account-grid"
          >
            {[
              {
                label: "Profil Saya", desc: "Data diri & preferensi", href: "/dashboard/profile", id: "acc-profile",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
              },
              {
                label: "Alamat", desc: "Kelola alamat pengiriman", href: "/dashboard/address", id: "acc-address",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
              },
              {
                label: "Keamanan", desc: "Password & verifikasi", href: "/dashboard/security", id: "acc-security",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
              },
              {
                label: "Notifikasi", desc: "Atur preferensi notifikasi", href: "/dashboard/notifications", id: "acc-notif",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                id={item.id}
                style={{
                  display: "block",
                  background: "var(--white)",
                  border: "1px solid var(--stone-light)",
                  padding: "1.5rem",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--copper)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(196,113,58,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--stone-light)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                }}
              >
                <span style={{ display: "block", color: "var(--copper)", lineHeight: 0, marginBottom: "1rem" }}>
                  {item.icon}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--charcoal)",
                    marginBottom: "0.2rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.label}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--stone)" }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════════ FOOTER (minimal) ═══════════════ */}
      <footer
        style={{
          background: "var(--charcoal)",
          padding: "2.5rem 0",
          borderTop: "1px solid rgba(245,240,232,0.08)",
        }}
      >
        <div
          className="container-main"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.35rem",
              color: "var(--cream)",
              letterSpacing: "0.25em",
              fontWeight: 300,
              textTransform: "uppercase",
            }}
          >
            Maison
          </Link>
          <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.35)", letterSpacing: "0.08em" }}>
            © 2025 Maison Interior · All rights reserved
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Tentang", "Kebijakan Privasi", "Syarat"].map((l) => (
              <Link
                key={l}
                href={`/${l.toLowerCase().replace(/ /g, "-")}`}
                style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.4)", letterSpacing: "0.08em", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--cream)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.4)")}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .hero-grid { grid-template-columns: 1fr auto !important; }
        .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        .wishlist-grid { grid-template-columns: repeat(4, 1fr) !important; }
        .account-grid { grid-template-columns: repeat(4, 1fr) !important; }
        .banner-grid { grid-template-columns: 1fr 1fr !important; }
        .quick-actions-grid { grid-template-columns: repeat(4, 1fr) !important; }

        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .account-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hidden-mobile { display: none !important; }
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .banner-grid { grid-template-columns: 1fr !important; }
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .account-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
