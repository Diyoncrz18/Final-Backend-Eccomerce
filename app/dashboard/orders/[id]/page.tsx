"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import NavbarUser from "../../../components/NavbarUser";
import {
  getOrderByNumber,
  cancelOrder,
  getStoredUser,
  getImageUrl,
  submitReview,
  getProductReviews,
} from "../../../../services/api";

/* ─────────── Types ─────────── */
type OrderStatus = "menunggu" | "dikemas" | "dikirim" | "selesai" | "dibatalkan";

interface ExistingReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface DetailItem {
  id: number;
  productId: number;
  name: string;
  imageUrl: string;
  category: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  salePrice: number;
  subtotal: number;
}

interface DetailOrder {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingAddress: string;
  billingAddress: string;
  customerNote: string;
  adminNote: string;
  items: DetailItem[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  menunggu:   { label: "Menunggu Pembayaran", color: "#B45309", bg: "rgba(180,83,9,0.08)",  border: "rgba(180,83,9,0.25)" },
  dikemas:    { label: "Sedang Dikemas",      color: "#0369A1", bg: "rgba(3,105,161,0.08)", border: "rgba(3,105,161,0.25)" },
  dikirim:    { label: "Dalam Pengiriman",    color: "#0369A1", bg: "rgba(3,105,161,0.08)", border: "rgba(3,105,161,0.25)" },
  selesai:    { label: "Selesai",             color: "#16A34A", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.25)" },
  dibatalkan: { label: "Dibatalkan",          color: "#DC2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.25)" },
};

const TRACKING_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "menunggu", label: "Dibuat" },
  { key: "dikemas",  label: "Dikemas" },
  { key: "dikirim",  label: "Dikirim" },
  { key: "selesai",  label: "Selesai" },
];

/* ─────────── Helpers ─────────── */
function formatRp(n: number) {
  return "Rp " + (Number.isFinite(n) ? n : 0).toLocaleString("id-ID");
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) +
      " · " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "-";
  }
}

function toOrderStatus(status?: string | null): OrderStatus {
  switch ((status || "").toUpperCase()) {
    case "DIKEMAS":    return "dikemas";
    case "DIKIRIM":    return "dikirim";
    case "SELESAI":    return "selesai";
    case "DIBATALKAN": return "dibatalkan";
    default:           return "menunggu";
  }
}

interface ApiProductShape {
  id?: number;
  name?: string;
  imageUrl?: string;
  sku?: string;
  category?: { name?: string };
}

interface ApiItemShape {
  id?: number;
  product?: ApiProductShape;
  quantity?: number;
  unitPrice?: number | string;
  salePrice?: number | string;
  subtotal?: number | string;
}

interface ApiOrderShape {
  id?: number;
  orderNumber?: string;
  status?: string;
  user?: { fullName?: string; email?: string; name?: string };
  subtotal?: number | string;
  tax?: number | string;
  shippingFee?: number | string;
  discount?: number | string;
  total?: number | string;
  shippingAddress?: string;
  billingAddress?: string;
  customerNote?: string;
  adminNote?: string;
  orderItems?: ApiItemShape[];
  createdAt?: string;
  updatedAt?: string;
}

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function mapDetailOrder(raw: unknown): DetailOrder | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as ApiOrderShape;
  if (!o.orderNumber && !o.id) return null;

  const items: DetailItem[] = Array.isArray(o.orderItems)
    ? o.orderItems.map((item, idx) => {
        const product = item.product || {};
        const salePrice = toNumber(item.salePrice);
        const unitPrice = toNumber(item.unitPrice);
        const effectivePrice = salePrice > 0 ? salePrice : unitPrice;
        const quantity = Number(item.quantity || 1);
        const subtotal = toNumber(item.subtotal) || effectivePrice * quantity;
        return {
          id: Number(item.id ?? idx),
          productId: Number(product.id ?? 0),
          name: product.name || "Produk",
          imageUrl: product.imageUrl || "",
          category: product.category?.name || "",
          sku: product.sku || "",
          quantity,
          unitPrice,
          salePrice,
          subtotal,
        };
      })
    : [];

  return {
    id: Number(o.id ?? 0),
    orderNumber: o.orderNumber || String(o.id ?? ""),
    status: toOrderStatus(o.status),
    customerName: o.user?.fullName || o.user?.name || "",
    customerEmail: o.user?.email || "",
    subtotal: toNumber(o.subtotal),
    tax: toNumber(o.tax),
    shippingFee: toNumber(o.shippingFee),
    discount: toNumber(o.discount),
    total: toNumber(o.total),
    shippingAddress: o.shippingAddress || "",
    billingAddress: o.billingAddress || "",
    customerNote: o.customerNote || "",
    adminNote: o.adminNote || "",
    items,
    createdAt: o.createdAt || "",
    updatedAt: o.updatedAt || "",
  };
}

/* ─────────── Sub-components ─────────── */
function StatusPill({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.4rem",
      fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
      textTransform: "uppercase", padding: "0.35rem 0.85rem",
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {status === "dikirim" && (
        <span style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: cfg.color, animation: "pulse 1.5s infinite",
        }} />
      )}
      {cfg.label}
    </span>
  );
}

function TrackingTimeline({ status }: { status: OrderStatus }) {
  if (status === "dibatalkan") return null;
  const activeIdx = TRACKING_STEPS.findIndex(s => s.key === status);

  return (
    <div style={{ padding: "0.5rem 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {TRACKING_STEPS.map((step, i) => {
          const done = i <= activeIdx;
          const isCurrent = i === activeIdx;
          const isLast = i === TRACKING_STEPS.length - 1;
          return (
            <div key={step.key} style={{ display: "flex", alignItems: "flex-start", flex: isLast ? "0 0 auto" : 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem", minWidth: "70px" }}>
                <div style={{
                  width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                  background: done ? "var(--copper)" : "var(--white)",
                  border: `2px solid ${done ? "var(--copper)" : "var(--stone-light)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isCurrent ? "0 0 0 6px rgba(196,113,58,0.12)" : "none",
                  transition: "all 0.3s ease",
                }}>
                  {done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <p style={{
                  fontSize: "0.7rem", textAlign: "center",
                  color: done ? "var(--charcoal)" : "var(--stone)",
                  fontWeight: isCurrent ? 600 : done ? 500 : 400,
                  whiteSpace: "nowrap",
                }}>
                  {step.label}
                </p>
              </div>
              {!isLast && (
                <div style={{
                  flex: 1, height: "2px", marginTop: "12px",
                  background: i < activeIdx ? "var(--copper)" : "var(--stone-light)",
                  transition: "background 0.3s ease",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)" }}>
      <div style={{
        padding: "1rem 1.5rem", borderBottom: "1px solid var(--stone-light)",
        background: "var(--bone)",
      }}>
        <p style={{
          fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "var(--charcoal-soft)",
        }}>
          {title}
        </p>
      </div>
      <div style={{ padding: "1.5rem" }}>{children}</div>
    </div>
  );
}

/* ─────────── Page ─────────── */
export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const orderNumber = rawId ? decodeURIComponent(rawId) : "";

  const user = getStoredUser();
  const [order, setOrder] = useState<DetailOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);
  const [reviewsMap, setReviewsMap] = useState<Record<number, ExistingReview | null>>({});
  const [reviewDrafts, setReviewDrafts] = useState<Record<number, { rating: number; comment: string }>>({});
  const [submittingReview, setSubmittingReview] = useState<number | null>(null);
  const [editingReview, setEditingReview] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let active = true;
    async function load() {
      if (!orderNumber) {
        await Promise.resolve();
        if (!active) return;
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const data = await getOrderByNumber(orderNumber);
        if (!active) return;
        const mapped = mapDetailOrder(data);
        if (!mapped) {
          setNotFound(true);
          setOrder(null);
        } else {
          setOrder(mapped);
          setNotFound(false);
        }
      } catch (error) {
        console.error("Failed to load order detail:", error);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [orderNumber, reloadKey]);

  const handleCancel = async () => {
    if (!order) return;
    const confirmed = window.confirm("Batalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.");
    if (!confirmed) return;
    setCancelling(true);
    try {
      const result = await cancelOrder(order.id);
      if (result.success) {
        setToast("Pesanan berhasil dibatalkan");
        setReloadKey(k => k + 1);
      } else {
        setToast(result.message || "Gagal membatalkan pesanan");
      }
    } finally {
      setCancelling(false);
      setTimeout(() => setToast(""), 3200);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Disalin ke clipboard");
      setTimeout(() => setToast(""), 2000);
    } catch {
      setToast("Gagal menyalin");
      setTimeout(() => setToast(""), 2000);
    }
  };

  /* ── Load existing reviews for each product when order is completed ── */
  useEffect(() => {
    if (!order || order.status !== "selesai") return;
    let active = true;
    const currentUserId = user.id;
    async function loadReviews() {
      if (!order) return;
      const map: Record<number, ExistingReview | null> = {};
      await Promise.all(
        order.items
          .filter(it => it.productId > 0)
          .map(async item => {
            try {
              const res = await getProductReviews(item.productId);
              const mine = res.reviews.find(r => r.userId === currentUserId);
              map[item.productId] = mine
                ? { id: mine.id, rating: mine.rating, comment: mine.comment, createdAt: mine.createdAt }
                : null;
            } catch {
              map[item.productId] = null;
            }
          })
      );
      if (active) setReviewsMap(map);
    }
    void loadReviews();
    return () => { active = false; };
  }, [order, user.id]);

  /* ── Scroll to #review hash after order loads ── */
  useEffect(() => {
    if (!order || loading) return;
    if (typeof window !== "undefined" && window.location.hash === "#review") {
      const el = document.getElementById("review");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [order, loading]);

  const getDraft = (productId: number): { rating: number; comment: string } => {
    const draft = reviewDrafts[productId];
    if (draft) return draft;
    const existing = reviewsMap[productId];
    return { rating: existing?.rating ?? 0, comment: existing?.comment ?? "" };
  };

  const updateDraft = (productId: number, patch: Partial<{ rating: number; comment: string }>) => {
    setReviewDrafts(prev => {
      const current = prev[productId] ?? {
        rating: reviewsMap[productId]?.rating ?? 0,
        comment: reviewsMap[productId]?.comment ?? "",
      };
      return { ...prev, [productId]: { ...current, ...patch } };
    });
  };

  const handleSubmitReview = async (productId: number) => {
    const draft = getDraft(productId);
    if (!draft.rating || draft.rating < 1) {
      setToast("Pilih rating bintang terlebih dahulu");
      setTimeout(() => setToast(""), 2500);
      return;
    }
    setSubmittingReview(productId);
    try {
      const result = await submitReview(productId, draft.rating, draft.comment.trim());
      if (result.success) {
        setToast("Ulasan berhasil dikirim. Terima kasih!");
        try {
          const res = await getProductReviews(productId);
          const mine = res.reviews.find(r => r.userId === user.id);
          setReviewsMap(prev => ({
            ...prev,
            [productId]: mine
              ? { id: mine.id, rating: mine.rating, comment: mine.comment, createdAt: mine.createdAt }
              : null,
          }));
        } catch {
          // non-fatal refresh failure
        }
        setReviewDrafts(prev => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
        setEditingReview(prev => ({ ...prev, [productId]: false }));
      } else {
        setToast(result.message || "Gagal mengirim ulasan");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      setToast("Gagal mengirim ulasan");
    } finally {
      setSubmittingReview(null);
      setTimeout(() => setToast(""), 3200);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
        <NavbarUser user={user} />
        <div className="container-main" style={{ paddingTop: "140px", paddingBottom: "5rem", textAlign: "center" }}>
          <div style={{
            width: "48px", height: "48px", margin: "0 auto 1rem",
            border: "2px solid var(--stone-light)", borderTopColor: "var(--copper)",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "var(--stone)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
            Memuat detail pesanan...
          </p>
        </div>
        <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Not Found ── */
  if (notFound || !order) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
        <NavbarUser user={user} />
        <div className="container-main" style={{ paddingTop: "140px", paddingBottom: "5rem", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem",
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.5rem" }}>
            Pesanan Tidak Ditemukan
          </p>
          <p style={{ color: "var(--stone)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Pesanan {orderNumber ? `#${orderNumber}` : "ini"} tidak tersedia atau bukan milik Anda.
          </p>
          <Link href="/dashboard/orders" style={{
            display: "inline-block", padding: "0.75rem 2rem",
            background: "var(--copper)", color: "var(--cream)",
            fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Kembali ke Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const subtotalFromItems = order.items.reduce((s, it) => s + it.subtotal, 0);
  const displaySubtotal = order.subtotal > 0 ? order.subtotal : subtotalFromItems;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={user} />

      {/* ── Page Header ── */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)", paddingTop: "72px" }}>
        <div className="container-main" style={{ padding: "2rem var(--container-px, 2rem)" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--stone)", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Dashboard</Link>
            {" / "}
            <Link href="/dashboard/orders" style={{ color: "inherit" }}>Pesanan Saya</Link>
            {" / "}
            <span style={{ color: "var(--charcoal)" }}>#{order.orderNumber}</span>
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                onClick={() => router.back()}
                aria-label="Kembali"
                style={{
                  width: "40px", height: "40px", border: "1px solid var(--stone-light)",
                  background: "var(--white)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--charcoal)")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone-light)")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
              </button>
              <div>
                <h1 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
                  fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.1,
                }}>
                  Detail Pesanan
                </h1>
                <p style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", marginTop: "0.25rem", fontWeight: 500, letterSpacing: "0.04em" }}>
                  #{order.orderNumber}
                </p>
              </div>
            </div>
            <StatusPill status={order.status} />
          </div>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
        {/* ── Tracking Banner ── */}
        {order.status !== "dibatalkan" && (
          <div style={{
            background: "var(--white)", border: "1px solid var(--stone-light)",
            padding: "1.75rem 2rem", marginBottom: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--stone)", marginBottom: "0.3rem" }}>
                  Status Pesanan
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 300, color: "var(--charcoal)" }}>
                  {STATUS_CONFIG[order.status].label}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--stone)", marginBottom: "0.3rem" }}>
                  Terakhir Diperbarui
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)" }}>
                  {formatDateTime(order.updatedAt || order.createdAt)}
                </p>
              </div>
            </div>
            <TrackingTimeline status={order.status} />
          </div>
        )}

        {/* ── Cancelled banner ── */}
        {order.status === "dibatalkan" && (
          <div style={{
            background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)",
            padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
            display: "flex", gap: "0.85rem", alignItems: "flex-start",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: "2px" }}>
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <div>
              <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#DC2626", marginBottom: "0.15rem" }}>
                Pesanan Dibatalkan
              </p>
              {order.adminNote && (
                <p style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)" }}>{order.adminNote}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Two-column layout ── */}
        <div className="order-detail-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start",
        }}>
          {/* ── LEFT: Main content ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Items */}
            <InfoCard title={`Produk Dipesan · ${order.items.length} item`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {order.items.map((item, i) => {
                  const showStrike = item.salePrice > 0 && item.unitPrice > item.salePrice;
                  const activePrice = item.salePrice > 0 ? item.salePrice : item.unitPrice;
                  return (
                    <div key={item.id} style={{
                      display: "flex", gap: "1rem",
                      paddingBottom: i < order.items.length - 1 ? "1.25rem" : 0,
                      borderBottom: i < order.items.length - 1 ? "1px solid var(--stone-light)" : "none",
                    }}>
                      <Link href={item.productId ? `/product/${item.productId}` : "#"} style={{ flexShrink: 0 }}>
                        <div style={{
                          width: "84px", height: "84px", position: "relative", overflow: "hidden",
                          background: "var(--bone)", border: "1px solid var(--stone-light)",
                        }}>
                          <Image src={getImageUrl(item.imageUrl)} alt={item.name} fill sizes="84px" style={{ objectFit: "cover" }} />
                        </div>
                      </Link>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {item.category && (
                          <p style={{ fontSize: "0.65rem", color: "var(--stone)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                            {item.category}
                          </p>
                        )}
                        <Link href={item.productId ? `/product/${item.productId}` : "#"}>
                          <p style={{
                            fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300,
                            color: "var(--charcoal)", lineHeight: 1.3, marginBottom: "0.35rem",
                          }}>
                            {item.name}
                          </p>
                        </Link>
                        {item.sku && (
                          <p style={{ fontSize: "0.7rem", color: "var(--stone)", marginBottom: "0.4rem" }}>
                            SKU: {item.sku}
                          </p>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: "0.72rem", fontWeight: 500, color: "var(--charcoal-soft)",
                            background: "var(--bone)", padding: "0.2rem 0.6rem",
                            border: "1px solid var(--stone-light)",
                          }}>
                            {item.quantity} × {formatRp(activePrice)}
                          </span>
                          {showStrike && (
                            <span style={{ fontSize: "0.72rem", color: "var(--stone)", textDecoration: "line-through" }}>
                              {formatRp(item.unitPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: "120px" }}>
                        <p style={{ fontSize: "0.65rem", color: "var(--stone)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                          SUBTOTAL
                        </p>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 400, color: "var(--charcoal)" }}>
                          {formatRp(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfoCard>

            {/* Shipping Address */}
            <InfoCard title="Alamat Pengiriman">
              <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                <div style={{
                  width: "36px", height: "36px", flexShrink: 0, borderRadius: "50%",
                  background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.6">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  {order.customerName && (
                    <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: "0.25rem" }}>
                      {order.customerName}
                    </p>
                  )}
                  <p style={{ fontSize: "0.88rem", color: "var(--charcoal-soft)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {order.shippingAddress || "Alamat tidak tersedia"}
                  </p>
                  {order.customerEmail && (
                    <p style={{ fontSize: "0.78rem", color: "var(--stone)", marginTop: "0.4rem" }}>
                      {order.customerEmail}
                    </p>
                  )}
                </div>
              </div>
            </InfoCard>

            {/* Billing Address */}
            {order.billingAddress && order.billingAddress !== order.shippingAddress && (
              <InfoCard title="Alamat Penagihan">
                <p style={{ fontSize: "0.88rem", color: "var(--charcoal-soft)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {order.billingAddress}
                </p>
              </InfoCard>
            )}

            {/* Customer Note */}
            {order.customerNote && (
              <InfoCard title="Catatan Pembeli">
                <p style={{ fontSize: "0.88rem", color: "var(--charcoal-soft)", lineHeight: 1.6, fontStyle: "italic" }}>
                  &ldquo;{order.customerNote}&rdquo;
                </p>
              </InfoCard>
            )}

            {/* Review Section — only for completed orders */}
            {order.status === "selesai" && (
              <div id="review" style={{ scrollMarginTop: "96px" }}>
                <InfoCard title="Ulasan Produk">
                  <p style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    Bagikan pengalaman Anda dengan produk berikut. Ulasan akan tampil di halaman produk dan membantu pembeli lainnya.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {order.items.filter(it => it.productId > 0).map((item, i, arr) => {
                      const existing = reviewsMap[item.productId];
                      const isEditing = editingReview[item.productId] || !existing;
                      const draft = getDraft(item.productId);
                      const isSubmitting = submittingReview === item.productId;

                      return (
                        <div key={item.id} style={{
                          paddingBottom: i < arr.length - 1 ? "1.5rem" : 0,
                          borderBottom: i < arr.length - 1 ? "1px solid var(--stone-light)" : "none",
                        }}>
                          {/* Product header */}
                          <div style={{ display: "flex", gap: "0.85rem", alignItems: "center", marginBottom: "1rem" }}>
                            <div style={{
                              width: "52px", height: "52px", position: "relative", overflow: "hidden",
                              background: "var(--bone)", border: "1px solid var(--stone-light)", flexShrink: 0,
                            }}>
                              <Image src={getImageUrl(item.imageUrl)} alt={item.name} fill sizes="52px" style={{ objectFit: "cover" }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 400,
                                color: "var(--charcoal)", lineHeight: 1.3,
                              }}>
                                {item.name}
                              </p>
                              {existing && !editingReview[item.productId] && (
                                <p style={{ fontSize: "0.68rem", color: "#16A34A", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.2rem" }}>
                                  ✓ Sudah Diulas
                                </p>
                              )}
                            </div>
                            {existing && !editingReview[item.productId] && (
                              <button
                                onClick={() => setEditingReview(prev => ({ ...prev, [item.productId]: true }))}
                                style={{
                                  padding: "0.45rem 0.85rem", background: "none",
                                  border: "1px solid var(--stone-light)",
                                  fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.08em",
                                  textTransform: "uppercase", color: "var(--charcoal)", cursor: "pointer",
                                  transition: "border-color 0.2s ease",
                                }}
                                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--charcoal)")}
                                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone-light)")}
                              >
                                Edit
                              </button>
                            )}
                          </div>

                          {/* View mode: show existing review */}
                          {existing && !isEditing && (
                            <div style={{
                              background: "var(--bone)", border: "1px solid var(--stone-light)",
                              padding: "1rem 1.15rem",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                                <StarDisplay rating={existing.rating} />
                                <span style={{ fontSize: "0.72rem", color: "var(--stone)" }}>
                                  {formatDateTime(existing.createdAt)}
                                </span>
                              </div>
                              {existing.comment && (
                                <p style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)", lineHeight: 1.7 }}>
                                  {existing.comment}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Edit/Create mode: show form */}
                          {isEditing && (
                            <div>
                              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--charcoal-soft)", marginBottom: "0.5rem" }}>
                                Rating Anda
                              </p>
                              <StarPicker
                                value={draft.rating}
                                onChange={r => updateDraft(item.productId, { rating: r })}
                                disabled={isSubmitting}
                              />

                              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--charcoal-soft)", margin: "1.15rem 0 0.5rem" }}>
                                Ulasan (Opsional)
                              </p>
                              <textarea
                                value={draft.comment}
                                onChange={e => updateDraft(item.productId, { comment: e.target.value })}
                                placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                                rows={3}
                                disabled={isSubmitting}
                                maxLength={500}
                                style={{
                                  width: "100%", padding: "0.75rem 1rem",
                                  border: "1px solid var(--stone-light)",
                                  background: "var(--white)", color: "var(--charcoal)",
                                  fontFamily: "var(--font-body)", fontSize: "0.85rem",
                                  lineHeight: 1.6, resize: "vertical",
                                  outline: "none", transition: "border-color 0.2s ease",
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = "var(--copper)")}
                                onBlur={e => (e.currentTarget.style.borderColor = "var(--stone-light)")}
                              />
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
                                <span style={{ fontSize: "0.68rem", color: "var(--stone)" }}>
                                  {draft.comment.length}/500
                                </span>
                              </div>

                              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                                <button
                                  onClick={() => handleSubmitReview(item.productId)}
                                  disabled={isSubmitting || draft.rating < 1}
                                  style={{
                                    padding: "0.75rem 1.5rem",
                                    background: draft.rating < 1 ? "var(--stone-light)" : "var(--copper)",
                                    color: draft.rating < 1 ? "var(--stone)" : "var(--cream)",
                                    border: "none",
                                    fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500,
                                    letterSpacing: "0.1em", textTransform: "uppercase",
                                    cursor: draft.rating < 1 || isSubmitting ? "not-allowed" : "pointer",
                                    opacity: isSubmitting ? 0.7 : 1,
                                    transition: "opacity 0.2s ease",
                                  }}
                                >
                                  {isSubmitting ? "Mengirim..." : existing ? "Simpan Perubahan" : "Kirim Ulasan"}
                                </button>
                                {existing && (
                                  <button
                                    onClick={() => {
                                      setEditingReview(prev => ({ ...prev, [item.productId]: false }));
                                      setReviewDrafts(prev => {
                                        const next = { ...prev };
                                        delete next[item.productId];
                                        return next;
                                      });
                                    }}
                                    disabled={isSubmitting}
                                    style={{
                                      padding: "0.75rem 1.25rem",
                                      background: "none", border: "1px solid var(--stone-light)",
                                      color: "var(--charcoal-soft)",
                                      fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500,
                                      letterSpacing: "0.1em", textTransform: "uppercase",
                                      cursor: isSubmitting ? "not-allowed" : "pointer",
                                      transition: "border-color 0.2s ease",
                                    }}
                                  >
                                    Batal
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </InfoCard>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "96px" }} className="order-detail-sidebar">
            {/* Summary */}
            <InfoCard title="Ringkasan Pembayaran">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <SummaryRow label="Subtotal Produk" value={formatRp(displaySubtotal)} />
                {order.tax > 0 && <SummaryRow label="Pajak" value={formatRp(order.tax)} />}
                <SummaryRow
                  label="Ongkos Kirim"
                  value={order.shippingFee > 0 ? formatRp(order.shippingFee) : "Gratis"}
                  highlight={order.shippingFee === 0}
                />
                {order.discount > 0 && (
                  <SummaryRow label="Diskon" value={`− ${formatRp(order.discount)}`} discount />
                )}

                <div style={{ height: "1px", background: "var(--stone-light)", margin: "0.35rem 0" }} />

                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--charcoal)", letterSpacing: "0.04em" }}>
                    Total Pembayaran
                  </p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: 400, color: "var(--copper)" }}>
                    {formatRp(order.total)}
                  </p>
                </div>
              </div>
            </InfoCard>

            {/* Timeline info */}
            <InfoCard title="Informasi Pesanan">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", fontSize: "0.82rem" }}>
                <InfoRow label="Nomor Pesanan" value={order.orderNumber} action={
                  <button
                    onClick={() => handleCopy(order.orderNumber)}
                    style={{
                      background: "none", border: "none", padding: "0.15rem",
                      cursor: "pointer", color: "var(--copper)",
                      display: "flex", alignItems: "center",
                    }}
                    aria-label="Salin nomor pesanan"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </button>
                } />
                <InfoRow label="Tanggal Pesanan" value={formatDateTime(order.createdAt)} />
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <InfoRow label="Terakhir Diperbarui" value={formatDateTime(order.updatedAt)} />
                )}
                <InfoRow label="Jumlah Item" value={`${order.items.reduce((s, it) => s + it.quantity, 0)} unit`} />
              </div>
            </InfoCard>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {order.status === "menunggu" && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  style={{
                    padding: "0.85rem 1.5rem", background: "var(--white)",
                    border: "1px solid #DC2626", color: "#DC2626",
                    fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    cursor: cancelling ? "wait" : "pointer", opacity: cancelling ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { if (!cancelling) (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--white)"; }}
                >
                  {cancelling ? "Membatalkan..." : "Batalkan Pesanan"}
                </button>
              )}

              {order.status === "selesai" && (
                <a
                  href="#review"
                  onClick={e => {
                    e.preventDefault();
                    const el = document.getElementById("review");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    padding: "0.85rem 1.5rem", textAlign: "center",
                    background: "var(--white)", border: "1px solid var(--stone-light)",
                    color: "var(--charcoal)",
                    fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    transition: "border-color 0.2s ease", cursor: "pointer",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--charcoal)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--stone-light)")}
                >
                  Tulis Ulasan
                </a>
              )}

              <Link href="/koleksi" style={{
                padding: "0.85rem 1.5rem", textAlign: "center",
                background: "var(--copper)", border: "none", color: "var(--cream)",
                fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
                letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "opacity 0.2s ease",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.88")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >
                {order.status === "dibatalkan" ? "Beli Lagi" : "Lanjut Belanja"}
              </Link>

              <Link href="/dashboard/orders" style={{
                padding: "0.85rem 1.5rem", textAlign: "center",
                background: "none", border: "1px solid var(--stone-light)",
                color: "var(--charcoal-soft)",
                fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 400,
                letterSpacing: "0.08em", textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--charcoal)")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--stone-light)")}
              >
                Kembali ke Daftar Pesanan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
          background: "var(--charcoal)", color: "var(--cream)",
          padding: "0.85rem 1.5rem", fontSize: "0.82rem",
          boxShadow: "var(--shadow-md)", zIndex: 1000,
          animation: "slideUp 0.3s ease",
        }}>
          {toast}
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @media (max-width: 960px) {
          .order-detail-grid { grid-template-columns: 1fr !important; }
          .order-detail-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  );
}

/* ─────────── Local atoms ─────────── */
function SummaryRow({ label, value, highlight, discount }: { label: string; value: string; highlight?: boolean; discount?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }}>
      <span style={{ color: "var(--charcoal-soft)" }}>{label}</span>
      <span style={{
        fontWeight: 500,
        color: discount ? "#16A34A" : highlight ? "#16A34A" : "var(--charcoal)",
      }}>
        {value}
      </span>
    </div>
  );
}

function InfoRow({ label, value, action }: { label: string; value: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
      <span style={{ color: "var(--stone)", fontSize: "0.75rem", letterSpacing: "0.06em" }}>{label}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--charcoal)", fontWeight: 500, fontSize: "0.82rem", textAlign: "right" }}>
        {value}
        {action}
      </span>
    </div>
  );
}

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }} aria-label={`Rating ${rating} dari 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "var(--copper)" : "var(--stone-light)"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function StarPicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  const labels = ["Buruk", "Kurang", "Cukup", "Baik", "Sempurna"];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.85rem" }}>
      <div
        style={{ display: "inline-flex", gap: "4px" }}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onChange(i)}
            onMouseEnter={() => !disabled && setHover(i)}
            aria-label={`Rating ${i} bintang`}
            style={{
              background: "none", border: "none", padding: "2px",
              cursor: disabled ? "not-allowed" : "pointer",
              display: "inline-flex", transition: "transform 0.15s ease",
              transform: hover === i ? "scale(1.12)" : "scale(1)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24"
              fill={i <= active ? "var(--copper)" : "var(--stone-light)"} stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
      </div>
      {active > 0 && (
        <span style={{
          fontSize: "0.78rem", color: "var(--charcoal)", fontWeight: 500,
          letterSpacing: "0.04em",
        }}>
          {labels[active - 1]}
        </span>
      )}
    </div>
  );
}
