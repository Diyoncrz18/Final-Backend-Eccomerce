"use client";
import { useState, useEffect } from "react";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn, AdminSearch } from "../components";
import { fetchAdminReviews, deleteReview, updateReviewStatus } from "../../../services/api";

interface AdminReviewRow {
  id: number;
  productId: number;
  product: string;
  customer: string;
  rating: number;
  text: string;
  date: string;
  status: "approved" | "pending";
}

interface ApiReviewRecord {
  id?: number;
  productId?: number;
  productName?: string;
  product?: { name?: string; id?: number };
  userId?: number;
  userName?: string;
  user?: { name?: string; fullName?: string; email?: string };
  rating?: number;
  comment?: string;
  isApproved?: boolean;
  createdAt?: string;
}

const STATUS_COLORS: Record<"approved" | "pending", { color: string; bg: string }> = {
  approved: { color: "#16A34A", bg: "rgba(22,163,74,0.08)" },
  pending:  { color: "#B45309", bg: "rgba(180,83,9,0.08)" },
};

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= n ? "#C4713A" : "#E4DDD3"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function mapReview(raw: ApiReviewRecord): AdminReviewRow {
  return {
    id: Number(raw.id ?? 0),
    productId: Number(raw.productId ?? raw.product?.id ?? 0),
    product: raw.productName || raw.product?.name || "Produk Tidak Diketahui",
    customer: raw.userName || raw.user?.fullName || raw.user?.name || raw.user?.email || "Anonim",
    rating: Number(raw.rating ?? 0),
    text: raw.comment || "",
    date: raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
      : "-",
    status: raw.isApproved ? "approved" : "pending",
  };
}

export default function AdminUlasanPage() {
  const [reviews, setReviews] = useState<AdminReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"semua" | "pending" | "approved">("semua");
  const [toast, setToast] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const data = await fetchAdminReviews(0, 100);
        if (!active) return;
        const mapped: AdminReviewRow[] = Array.isArray(data)
          ? (data as ApiReviewRecord[]).map(mapReview)
          : [];
        setReviews(mapped);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        if (active) setLoading(false);
      }
    }
    void run();
    return () => { active = false; };
  }, [reloadKey]);

  const reloadReviews = () => setReloadKey(k => k + 1);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleApprove = async (id: number) => {
    setBusyId(id);
    try {
      const result = await updateReviewStatus(id, "approved");
      if (result?.success) {
        showToast("Ulasan disetujui");
        reloadReviews();
      } else {
        showToast("Gagal menyetujui ulasan");
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Hapus ulasan ini secara permanen?");
    if (!ok) return;
    setBusyId(id);
    try {
      const result = await deleteReview(id);
      if (result.success) {
        showToast("Ulasan dihapus");
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        showToast(result.message || "Gagal menghapus ulasan");
      }
    } finally {
      setBusyId(null);
    }
  };

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.product.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) || r.text.toLowerCase().includes(q);
    const matchFilter = activeFilter === "semua" || r.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const counts = {
    semua: reviews.length,
    pending: reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2)
    : "0.00";

  return (
    <>
      <AdminTopbar breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Ulasan" }]} />

      <div style={{ padding: "2rem" }}>
        <AdminPageHeader
          tag="Review"
          title="Manajemen Ulasan"
          subtitle={
            loading
              ? "Memuat ulasan..."
              : `${counts.semua} total ulasan · ${counts.pending} menunggu · rata-rata ★ ${averageRating}`
          }
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3" }}>
            {[
              { key: "semua", label: "Semua" },
              { key: "pending", label: "Menunggu" },
              { key: "approved", label: "Disetujui" },
            ].map((t) => {
              const key = t.key as "semua" | "pending" | "approved";
              const active = activeFilter === key;
              const count = counts[key];
              return (
                <button key={key} onClick={() => setActiveFilter(key)} style={{
                  padding: "0.65rem 1.1rem", background: "none", border: "none",
                  borderBottom: `2px solid ${active ? "#C4713A" : "transparent"}`,
                  color: active ? "#C4713A" : "#6B6560",
                  fontSize: "0.78rem", fontWeight: active ? 500 : 400,
                  fontFamily: "var(--font-body)", cursor: "pointer", marginBottom: "-1px",
                  display: "flex", alignItems: "center", gap: "0.35rem",
                }}>
                  {t.label}
                  {count > 0 && (
                    <span style={{
                      fontSize: "0.6rem",
                      background: "#F4F0EA",
                      color: "#8A8078",
                      padding: "0.05rem 0.4rem",
                      borderRadius: "99px",
                      border: "1px solid #E4DDD3",
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <AdminSearch value={search} onChange={setSearch} placeholder="Cari produk / pelanggan / isi ulasan..." />
        </div>

        {loading ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", background: "var(--white)", border: "1px solid #E4DDD3" }}>
            <p style={{ fontSize: "0.85rem", color: "#8A8078", letterSpacing: "0.08em" }}>Memuat ulasan...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", background: "var(--white)", border: "1px solid #E4DDD3" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4713A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, color: "#2A2620", marginBottom: "0.35rem" }}>
              Tidak Ada Ulasan
            </p>
            <p style={{ fontSize: "0.82rem", color: "#8A8078" }}>
              {search ? "Tidak ada ulasan yang cocok dengan pencarian." : "Belum ada ulasan dari pelanggan."}
            </p>
          </div>
        ) : (
          <AdminTable columns={["Produk", "Pelanggan", "Rating", "Ulasan", "Tanggal", "Status", "Aksi"]}>
            {filtered.map((r) => (
              <AdminTr key={r.id}>
                <AdminTd bold>{r.product}</AdminTd>
                <AdminTd>{r.customer}</AdminTd>
                <AdminTd><Stars n={r.rating} /></AdminTd>
                <AdminTd>
                  <div
                    title={r.text}
                    style={{ maxWidth: "280px", fontSize: "0.78rem", color: "#4A4640", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {r.text || <span style={{ color: "#A8A29E", fontStyle: "italic" }}>(tanpa komentar)</span>}
                  </div>
                </AdminTd>
                <AdminTd muted>{r.date}</AdminTd>
                <AdminTd>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem",
                    color: STATUS_COLORS[r.status].color,
                    background: STATUS_COLORS[r.status].bg,
                    textTransform: "capitalize",
                  }}>
                    {r.status === "approved" ? "Disetujui" : "Menunggu"}
                  </span>
                </AdminTd>
                <AdminTd>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {r.status === "pending" && (
                      <AdminBtn
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(r.id)}
                        disabled={busyId === r.id}
                      >
                        {busyId === r.id ? "..." : "Setujui"}
                      </AdminBtn>
                    )}
                    <AdminBtn
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(r.id)}
                      disabled={busyId === r.id}
                    >
                      {busyId === r.id ? "..." : "Hapus"}
                    </AdminBtn>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTable>
        )}
      </div>

      {toast && (
        <div style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 1000,
          background: "#2A2620", color: "#F4F0EA",
          padding: "0.75rem 1.25rem", fontSize: "0.82rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
