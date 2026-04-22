"use client";
import { useState, useEffect } from "react";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn, AdminSearch } from "../components";
import { fetchAdminReviews } from "../../../services/api";

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  approved: { color: "#16A34A", bg: "rgba(22,163,74,0.08)" },
  pending:  { color: "#B45309", bg: "rgba(180,83,9,0.08)" },
  flagged:  { color: "#DC2626", bg: "rgba(220,38,38,0.08)" },
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

export default function AdminUlasanPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("semua");

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await fetchAdminReviews(0, 50);
        setReviews(data.map((r: any) => ({
          id: r.id,
          product: r.product?.name || "Unknown Product",
          customer: r.user?.name || "Anonymous",
          rating: r.rating,
          text: r.comment || "",
          verified: r.verified || false,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("id-ID") : "-",
          status: r.isApproved ? "approved" : "pending",
        })));
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const filtered = reviews.filter((r: any) => {
    const matchSearch = r.product.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "semua" || r.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const counts = { semua: reviews.length, pending: reviews.filter((r: any) => r.status === "pending").length, approved: reviews.filter((r: any) => r.status === "approved").length, flagged: reviews.filter((r: any) => r.status === "flagged").length };

  return (
    <>
      <AdminTopbar breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Ulasan" }]} />

      <div style={{ padding: "2rem" }}>
        <AdminPageHeader tag="Review" title="Manajemen Ulasan" subtitle={`${counts.pending} ulasan menunggu moderasi · ${counts.flagged} dilaporkan`} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3" }}>
            {[
              { key: "semua", label: "Semua" },
              { key: "pending", label: "Menunggu" },
              { key: "approved", label: "Disetujui" },
              { key: "flagged", label: "Dilaporkan" },
            ].map((t) => (
              <button key={t.key} onClick={() => setActiveFilter(t.key)} style={{
                padding: "0.65rem 1.1rem", background: "none", border: "none",
                borderBottom: `2px solid ${activeFilter === t.key ? "#C4713A" : "transparent"}`,
                color: activeFilter === t.key ? "#C4713A" : "#6B6560",
                fontSize: "0.78rem", fontWeight: activeFilter === t.key ? 500 : 400,
                fontFamily: "var(--font-body)", cursor: "pointer", marginBottom: "-1px",
                display: "flex", alignItems: "center", gap: "0.35rem",
              }}>
                {t.label}
                {(counts as any)[t.key] > 0 && (
                  <span style={{ fontSize: "0.6rem", background: (t.key === "flagged" && (counts as any)[t.key] > 0) ? "rgba(220,38,38,0.1)" : "#F4F0EA", color: t.key === "flagged" ? "#DC2626" : "#8A8078", padding: "0.05rem 0.4rem", borderRadius: "99px", border: "1px solid #E4DDD3" }}>
                    {(counts as any)[t.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <AdminSearch value={search} onChange={setSearch} placeholder="Cari produk / pelanggan..." />
        </div>

        <AdminTable columns={["Produk", "Pelanggan", "Rating", "Ulasan", "Terverifikasi", "Tanggal", "Status", "Aksi"]}>
          {filtered.map((r) => (
            <AdminTr key={r.id}>
              <AdminTd bold>{r.product}</AdminTd>
              <AdminTd>{r.customer}</AdminTd>
              <AdminTd><Stars n={r.rating} /></AdminTd>
              <AdminTd>
                <div style={{ maxWidth: "240px", fontSize: "0.78rem", color: "#4A4640", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.text}
                </div>
              </AdminTd>
              <AdminTd>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.55rem", color: r.verified ? "#16A34A" : "#8A8078", background: r.verified ? "rgba(22,163,74,0.08)" : "#F4F0EA" }}>
                  {r.verified ? "✓ Terverifikasi" : "Belum"}
                </span>
              </AdminTd>
              <AdminTd muted>{r.date}</AdminTd>
              <AdminTd>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", color: STATUS_COLORS[r.status].color, background: STATUS_COLORS[r.status].bg, textTransform: "capitalize" }}>
                  {r.status === "approved" ? "Disetujui" : r.status === "pending" ? "Menunggu" : "Dilaporkan"}
                </span>
              </AdminTd>
              <AdminTd>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {r.status === "pending" && <AdminBtn variant="outline" size="sm" onClick={() => alert("Ulasan disetujui!")}>Setujui</AdminBtn>}
                  {!r.verified && <AdminBtn variant="ghost" size="sm" onClick={() => alert("Terverifikasi!")}>Verifikasi</AdminBtn>}
                  <AdminBtn variant="danger" size="sm" onClick={() => alert("Ulasan dihapus!")}>Hapus</AdminBtn>
                </div>
              </AdminTd>
            </AdminTr>
          ))}
        </AdminTable>
      </div>
    </>
  );
}
