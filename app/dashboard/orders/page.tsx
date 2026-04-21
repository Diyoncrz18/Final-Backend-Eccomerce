"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarUser from "../../components/NavbarUser";
import { getMyOrders, getAuthToken } from "../../../services/api";

function getStoredUser() {
  if (typeof window === 'undefined') return { name: "Guest", email: "", tier: "Bronze", points: 0 };
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : { name: "Guest", email: "", tier: "Bronze", points: 0 };
}

/* ─────────── Types ─────────── */
type OrderStatus = "menunggu" | "dikemas" | "dikirim" | "selesai" | "dibatalkan";

interface OrderItem { id: number; name: string; variant: string; qty: number; price: number; img: string }
interface Order {
  id: string; date: string; status: OrderStatus; items: OrderItem[];
  total: number; shipping: number; trackingNo?: string; estimasi?: string; courier?: string;
  cancelReason?: string;
}

/* ─────────── Default Data ─────────── */
const ORDER_MOCK: Order[] = [];

const ORDERS = ORDER_MOCK;
    id: "MSN-20250328-004", date: "28 Mar 2025", status: "selesai",
    items: [
      { id: 5, name: "Oak Dining Table", variant: "Natural Oak", qty: 1, price: 9800000, img: "/product-table.png" },
    ],
    total: 9800000, shipping: 0,
  },
  {
    id: "MSN-20250312-005", date: "12 Mar 2025", status: "dibatalkan",
    cancelReason: "Pembayaran tidak berhasil dalam 24 jam",
    items: [
      { id: 3, name: "Velvet Accent Chair", variant: "Dusty Rose", qty: 1, price: 5040000, img: "/product-velvet-chair.png" },
    ],
    total: 5040000, shipping: 0,
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  menunggu:    { label: "Menunggu Pembayaran", color: "#B45309", bg: "rgba(180,83,9,0.08)" },
  dikemas:     { label: "Sedang Dikemas",      color: "#0369A1", bg: "rgba(3,105,161,0.08)" },
  dikirim:     { label: "Dalam Pengiriman",    color: "#0369A1", bg: "rgba(3,105,161,0.08)" },
  selesai:     { label: "Selesai",             color: "#16A34A", bg: "rgba(22,163,74,0.08)" },
  dibatalkan:  { label: "Dibatalkan",          color: "#DC2626", bg: "rgba(220,38,38,0.08)" },
};

const TRACKING_STEPS = [
  { key: "menunggu", label: "Pesanan Dibuat" },
  { key: "dikemas",  label: "Sedang Dikemas" },
  { key: "dikirim",  label: "Dikirim" },
  { key: "selesai",  label: "Selesai" },
];

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "0.25rem 0.75rem",
      color: cfg.color, background: cfg.bg,
      display: "inline-flex", alignItems: "center", gap: "0.35rem",
    }}>
      {status === "dikirim" && (
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.color, animation: "pulse 1.5s infinite" }} />
      )}
      {cfg.label}
    </span>
  );
}

function TrackingBar({ status }: { status: OrderStatus }) {
  if (status === "dibatalkan" || status === "menunggu") return null;
  const activeIdx = TRACKING_STEPS.findIndex(s => s.key === status);

  return (
    <div style={{ padding: "1rem 0 0.25rem 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {TRACKING_STEPS.map((step, i) => {
          const done = i <= activeIdx;
          const isLast = i === TRACKING_STEPS.length - 1;
          return (
            <div key={step.key} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
              {/* Circle */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  background: done ? "var(--copper)" : "var(--stone-light)",
                  border: `2px solid ${done ? "var(--copper)" : "var(--stone-light)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s ease",
                }}>
                  {done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <p style={{ fontSize: "0.62rem", color: done ? "var(--copper)" : "var(--stone)", whiteSpace: "nowrap", fontWeight: done ? 500 : 400 }}>
                  {step.label}
                </p>
              </div>
              {/* Line */}
              {!isLast && (
                <div style={{ flex: 1, height: "2px", background: i < activeIdx ? "var(--copper)" : "var(--stone-light)", margin: "0 0.25rem", marginBottom: "1.1rem", transition: "background 0.3s ease" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── Page ─────────── */
export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<"semua" | OrderStatus>("semua");
  const [expandedTracking, setExpandedTracking] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(ORDER_MOCK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = getAuthToken();
        if (token) {
          const data = await getMyOrders(0, 20);
          if (data && data.length > 0) {
            setOrders(data.map((o: any) => ({
              id: o.orderNumber,
              date: new Date(o.createdAt).toLocaleDateString("id-ID"),
              status: o.status?.toLowerCase() || "menunggu",
              items: o.items?.map((item: any, idx: number) => ({
                id: idx,
                name: item.productName || "Product",
                variant: item.variant || "-",
                qty: item.quantity || 1,
                price: item.price || 0,
                img: item.productImage || "/product-chair.png"
              })) || [],
              total: o.total || 0,
              shipping: o.shippingCost || 0,
              trackingNo: o.trackingNumber,
              courier: o.courier,
              estimasi: o.estimatedDelivery
            })));
          }
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filters: { key: "semua" | OrderStatus; label: string; count: number }[] = [
    { key: "semua",      label: "Semua",              count: orders.length },
    { key: "dikirim",    label: "Dikirim",             count: orders.filter(o => o.status === "dikirim").length },
    { key: "dikemas",    label: "Dikemas",             count: orders.filter(o => o.status === "dikemas").length },
    { key: "selesai",    label: "Selesai",             count: orders.filter(o => o.status === "selesai").length },
    { key: "dibatalkan", label: "Dibatalkan",          count: orders.filter(o => o.status === "dibatalkan").length },
  ];

  const filtered = activeFilter === "semua" ? orders : orders.filter(o => o.status === activeFilter);

  const totalSelesai = orders.filter(o => o.status === "selesai").reduce((s, o) => s + o.total, 0);
  const totalAktif   = orders.filter(o => o.status === "dikirim" || o.status === "dikemas").length;
  const totalDone    = orders.filter(o => o.status === "selesai").length;

  const STAT_CARDS = [
    {
      label: "Total Pesanan",
      val: orders.length,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      label: "Sedang Aktif",
      val: totalAktif,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="1"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
    },
    {
      label: "Selesai",
      val: totalDone,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: "Total Belanja",
      val: formatRp(totalSelesai),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={USER} />

      {/* ── Header ── */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)", paddingTop: "72px" }}>
        <div className="container-main" style={{ padding: "2rem var(--container-px, 2rem)" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--stone)", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Dashboard</Link>
            {" / "}
            <span style={{ color: "var(--charcoal)" }}>Pesanan Saya</span>
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
            Pesanan Saya
          </h1>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2.5rem" }} className="orders-stats">
          {STAT_CARDS.map(s => (
            <div key={s.label} style={{ background: "var(--white)", border: "1px solid var(--stone-light)", padding: "1.5rem" }}>
              {/* Icon with subtle ring */}
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "rgba(196,113,58,0.08)",
                border: "1px solid rgba(196,113,58,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1rem",
              }}>
                {s.icon}
              </div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: typeof s.val === "number" ? "1.85rem" : "1.05rem",
                fontWeight: 300, color: "var(--charcoal)", lineHeight: 1, marginBottom: "0.3rem",
              }}>
                {s.val}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--stone)", letterSpacing: "0.08em" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filter Tabs ── */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--stone-light)", marginBottom: "1.75rem", overflowX: "auto" }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "0.85rem 1.5rem", background: "none", border: "none",
                borderBottom: `2px solid ${activeFilter === f.key ? "var(--copper)" : "transparent"}`,
                marginBottom: "-1px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "var(--font-body)", fontSize: "0.82rem",
                color: activeFilter === f.key ? "var(--copper)" : "var(--charcoal-soft)",
                fontWeight: activeFilter === f.key ? 600 : 400,
                transition: "color 0.2s ease", whiteSpace: "nowrap",
              }}>
              {f.label}
              {f.count > 0 && (
                <span style={{
                  background: activeFilter === f.key ? "var(--copper)" : "var(--stone-light)",
                  color: activeFilter === f.key ? "var(--white)" : "var(--stone)",
                  borderRadius: "99px", fontSize: "0.62rem", fontWeight: 700,
                  padding: "0.1rem 0.5rem", minWidth: "20px", textAlign: "center",
                }}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Order Cards ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--white)", border: "1px solid var(--stone-light)" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.18)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.5rem" }}>
              Tidak Ada Pesanan
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--stone)" }}>Pesanan dengan status ini belum ada.</p>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              const isExpanded = expandedTracking === order.id;
              return (
                <div key={order.id} style={{ background: "var(--white)", border: "1px solid var(--stone-light)", overflow: "hidden" }}>
                  {/* Order Header */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1rem 1.5rem", borderBottom: "1px solid var(--stone-light)",
                    background: "var(--bone)", flexWrap: "wrap", gap: "0.75rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontSize: "0.62rem", color: "var(--stone)", letterSpacing: "0.1em", marginBottom: "0.15rem" }}>ID PESANAN</p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 600, color: "var(--charcoal)", letterSpacing: "0.04em" }}>
                          {order.id}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.62rem", color: "var(--stone)", letterSpacing: "0.1em", marginBottom: "0.15rem" }}>TANGGAL</p>
                        <p style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)" }}>{order.date}</p>
                      </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Items */}
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--stone-light)" }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: "1rem",
                        paddingBottom: i < order.items.length - 1 ? "1rem" : 0,
                        marginBottom: i < order.items.length - 1 ? "1rem" : 0,
                        borderBottom: i < order.items.length - 1 ? "1px solid rgba(184,175,160,0.2)" : "none",
                      }}>
                        <Link href={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                          <div style={{ width: "68px", height: "68px", position: "relative", overflow: "hidden", background: "var(--bone)", border: "1px solid var(--stone-light)" }}>
                            <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} />
                          </div>
                        </Link>
                        <div style={{ flex: 1 }}>
                          <Link href={`/product/${item.id}`}>
                            <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.2rem" }}>
                              {item.name}
                            </p>
                          </Link>
                          <p style={{ fontSize: "0.75rem", color: "var(--stone)", marginBottom: "0.2rem" }}>
                            {item.variant} · {item.qty} unit
                          </p>
                          <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--charcoal)" }}>
                            {formatRp(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Tracking bar */}
                    {(order.status === "dikirim" || order.status === "dikemas" || order.status === "selesai") && (
                      <div style={{ marginTop: "1.25rem" }}>
                        {isExpanded && <TrackingBar status={order.status} />}
                        {order.status === "dikirim" && order.trackingNo && isExpanded && (
                          <div style={{
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            background: "rgba(3,105,161,0.05)", border: "1px solid rgba(3,105,161,0.15)",
                            padding: "0.75rem 1rem", marginTop: "0.75rem",
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="1.5">
                              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                            </svg>
                            <div>
                              <p style={{ fontSize: "0.72rem", color: "#0369A1", fontWeight: 600 }}>
                                {order.courier} · {order.trackingNo}
                              </p>
                              <p style={{ fontSize: "0.68rem", color: "var(--stone)" }}>Estimasi tiba: {order.estimasi}</p>
                            </div>
                            <button style={{
                              marginLeft: "auto", padding: "0.35rem 0.85rem",
                              background: "#0369A1", border: "none", color: "white",
                              fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em",
                              cursor: "pointer",
                            }}>
                              Salin No. Resi
                            </button>
                          </div>
                        )}
                        {order.status === "dikemas" && isExpanded && (
                          <div style={{
                            background: "rgba(3,105,161,0.05)", border: "1px solid rgba(3,105,161,0.15)",
                            padding: "0.75rem 1rem", marginTop: "0.75rem",
                          }}>
                            <p style={{ fontSize: "0.75rem", color: "#0369A1" }}>
                              Pesanan Anda sedang dikemas oleh tim gudang kami. Estimasi pengiriman dalam 1–2 hari kerja.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {order.status === "dibatalkan" && order.cancelReason && (
                      <div style={{
                        background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.15)",
                        padding: "0.75rem 1rem", marginTop: "0.75rem",
                        display: "flex", gap: "0.6rem",
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: "1px" }}>
                          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        <p style={{ fontSize: "0.75rem", color: "#DC2626" }}>Alasan: {order.cancelReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "1rem 1.5rem", flexWrap: "wrap", gap: "0.75rem",
                  }}>
                    {/* Total */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <div>
                        <p style={{ fontSize: "0.65rem", color: "var(--stone)", letterSpacing: "0.1em", marginBottom: "0.1rem" }}>TOTAL</p>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 300, color: "var(--charcoal)" }}>
                          {formatRp(order.total + order.shipping)}
                        </p>
                      </div>
                      {order.shipping === 0 && (
                        <span style={{ fontSize: "0.62rem", color: "#16A34A", background: "rgba(22,163,74,0.08)", padding: "0.2rem 0.6rem" }}>
                          Gratis Ongkir
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      {(order.status === "dikirim" || order.status === "dikemas") && (
                        <button onClick={() => setExpandedTracking(isExpanded ? null : order.id)}
                          style={{
                            padding: "0.6rem 1.25rem", background: "none",
                            border: "1px solid var(--stone-light)",
                            fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500,
                            letterSpacing: "0.08em", textTransform: "uppercase",
                            color: "var(--charcoal)", cursor: "pointer", transition: "all 0.2s ease",
                          }}
                          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--charcoal)")}
                          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone-light)")}>
                          {isExpanded ? "Sembunyikan" : "Lacak Pesanan"}
                        </button>
                      )}
                      {order.status === "selesai" && (
                        <button style={{
                          padding: "0.6rem 1.25rem", background: "none",
                          border: "1px solid var(--stone-light)",
                          fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500,
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          color: "var(--charcoal)", cursor: "pointer", transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--charcoal)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone-light)")}>
                          Tulis Ulasan
                        </button>
                      )}
                      <Link href="/koleksi" style={{
                        padding: "0.6rem 1.25rem",
                        background: order.status === "dibatalkan" ? "var(--charcoal)" : "var(--copper)",
                        border: "none", color: "var(--cream)",
                        fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        cursor: "pointer", transition: "opacity 0.2s ease", display: "inline-block",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}>
                        {order.status === "dibatalkan" ? "Beli Lagi" : "Detail"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .orders-stats { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 768px) {
          .orders-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
