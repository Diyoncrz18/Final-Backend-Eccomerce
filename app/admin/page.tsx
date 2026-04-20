"use client";
import { AdminTopbar, AdminPageHeader, AdminStatCard, AdminTable, AdminTr, AdminTd, AdminBtn, OrderStatusBadge, formatRp } from "./components";

/* ─── Mock Data ─── */
const RECENT_ORDERS = [
  { id: "MSN-20250418-001", customer: "Budi Santoso", items: "Bouclé Armchair + Marble Side Table", total: 9760000, status: "dikirim", date: "18 Apr 2025" },
  { id: "MSN-20250415-002", customer: "Anisa Rahma", items: "Olive Linen Sofa", total: 12500000, status: "dikemas", date: "15 Apr 2025" },
  { id: "MSN-20250408-003", customer: "Reza Fauzi", items: "Ceramic Vase (2×) + Rattan Panel", total: 4800000, status: "selesai", date: "8 Apr 2025" },
  { id: "MSN-20250328-004", customer: "Dewi Sartika", items: "Oak Dining Table", total: 9800000, status: "selesai", date: "28 Mar 2025" },
  { id: "MSN-20250312-005", customer: "Citra Wulandari", items: "Velvet Accent Chair", total: 5040000, status: "dibatalkan", date: "12 Mar 2025" },
];

const LOW_STOCK = [
  { name: "Oak Dining Table", sku: "MSN-TABLE-005", stock: 2, cat: "Meja" },
  { name: "Marble Side Table", sku: "MSN-TABLE-004", stock: 3, cat: "Meja" },
  { name: "Olive Linen Sofa", sku: "MSN-SOFA-002", stock: 3, cat: "Kursi" },
];

const DAILY_SALES = [32, 48, 41, 67, 58, 82, 74, 91, 65, 78, 84, 96, 70, 88];

export default function AdminDashboard() {
  return (
    <>
      <AdminTopbar
        breadcrumb={[{ label: "Admin" }, { label: "Overview" }]}
        action={
          <AdminBtn variant="primary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Produk
          </AdminBtn>
        }
      />

      <div style={{ padding: "2rem", flex: 1 }}>
        <AdminPageHeader
          tag={`Data per ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
          title="Dashboard Penjualan"
          subtitle="Ringkasan performa toko Maison secara real-time"
        />

        {/* ── Stats ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2rem",
          }}
          className="admin-stats-grid"
        >
          <AdminStatCard
            label="Pendapatan Bulan Ini"
            value="84,2 jt"
            sub="↑ +12.4% dari bulan lalu"
            icon={<RevIcon />}
          />
          <AdminStatCard
            label="Total Pesanan"
            value="247"
            sub="8 perlu diproses"
            icon={<OrdIcon />}
          />
          <AdminStatCard
            label="Member Aktif"
            value="1.842"
            sub="↑ 38 minggu ini"
            icon={<UsrIcon />}
          />
          <AdminStatCard
            label="Produk Aktif"
            value="52"
            sub="3 stok hampir habis"
            subColor="#DC2626"
            icon={<ProdIcon />}
          />
        </div>

        {/* ── Charts + Low Stock ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "1rem",
            marginBottom: "2rem",
          }}
          className="admin-chart-grid"
        >
          {/* Bar Chart */}
          <div style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#C4713A", marginBottom: "0.25rem" }}>
                  Tren Penjualan
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 300, color: "#1A1714" }}>
                  14 Hari Terakhir
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["7H", "14H", "30H"].map((t, i) => (
                  <button key={t} style={{
                    padding: "0.3rem 0.7rem",
                    fontSize: "0.68rem",
                    background: i === 1 ? "#1A1714" : "transparent",
                    color: i === 1 ? "#FAF8F5" : "#8A8078",
                    border: "1px solid #E4DDD3",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}>{t}</button>
                ))}
              </div>
            </div>
            {/* Bar chart visual */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
              {DAILY_SALES.map((v, i) => {
                const max = Math.max(...DAILY_SALES);
                const pct = (v / max) * 100;
                const isLast = i === DAILY_SALES.length - 1;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    {isLast && (
                      <div style={{
                        fontSize: "0.55rem",
                        color: "#C4713A",
                        background: "rgba(196,113,58,0.1)",
                        padding: "0.1rem 0.35rem",
                        whiteSpace: "nowrap",
                      }}>
                        84,2 jt
                      </div>
                    )}
                    <div
                      title={`${v} jt`}
                      style={{
                        width: "100%",
                        height: `${pct}%`,
                        background: isLast ? "#C4713A" : "rgba(196,113,58,0.25)",
                        borderRadius: "1px 1px 0 0",
                        transition: "background 0.2s",
                        cursor: "pointer",
                        minHeight: "4px",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {/* X labels */}
            <div style={{ display: "flex", gap: "6px", marginTop: "0.5rem" }}>
              {["7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"].map((d) => (
                <div key={d} style={{ flex: 1, fontSize: "0.5rem", color: "#B8AFA0", textAlign: "center" }}>Apr {d}</div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", overflow: "hidden" }}>
            <div style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #E4DDD3",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 300, color: "#1A1714", flex: 1 }}>
                Stok Hampir Habis
              </span>
              <span style={{ fontSize: "0.62rem", background: "rgba(220,38,38,0.1)", color: "#DC2626", padding: "0.15rem 0.55rem", fontWeight: 600 }}>
                {LOW_STOCK.length} Produk
              </span>
            </div>
            {LOW_STOCK.map((p) => (
              <div
                key={p.sku}
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid rgba(228,221,211,0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.82rem", color: "#1A1714", fontWeight: 500, marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#B8AFA0" }}>{p.sku} · {p.cat}</div>
                  {/* Progress */}
                  <div style={{ height: "3px", background: "rgba(220,38,38,0.1)", marginTop: "0.5rem", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: `${(p.stock / 20) * 100}%`, background: "#DC2626", borderRadius: "2px" }} />
                  </div>
                </div>
                <span style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: 300, color: "#DC2626", flexShrink: 0 }}>
                  {p.stock}
                </span>
              </div>
            ))}
            <div style={{ padding: "0.85rem 1.25rem" }}>
              <AdminBtn variant="ghost" size="sm">
                Lihat Semua Produk →
              </AdminBtn>
            </div>
          </div>
        </div>

        {/* ── Tier Distribution ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { tier: "Regular", count: 1204, pct: 65, color: "#8A8078" },
            { tier: "Gold", count: 520, pct: 28, color: "#C4713A" },
            { tier: "Platinum", count: 118, pct: 7, color: "#1A1714" },
          ].map((t) => (
            <div key={t.tier} style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8078" }}>
                  {t.tier}
                </span>
                <span style={{ fontSize: "0.65rem", color: t.color, fontWeight: 600 }}>{t.pct}%</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 300, color: "#1A1714", marginBottom: "0.75rem" }}>
                {t.count.toLocaleString("id-ID")}
              </div>
              <div style={{ height: "4px", background: "rgba(228,221,211,0.8)", borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${t.pct}%`, background: t.color, borderRadius: "2px", transition: "width 0.5s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Orders ── */}
        <AdminTable
          title="Pesanan Terbaru"
          columns={["No. Pesanan", "Pelanggan", "Produk", "Total", "Tanggal", "Status", ""]}
          action={
            <AdminBtn variant="ghost" size="sm">
              Lihat Semua Pesanan →
            </AdminBtn>
          }
        >
          {RECENT_ORDERS.map((o) => (
            <AdminTr key={o.id}>
              <AdminTd bold>{o.id}</AdminTd>
              <AdminTd>{o.customer}</AdminTd>
              <AdminTd muted>{o.items}</AdminTd>
              <AdminTd bold>{formatRp(o.total)}</AdminTd>
              <AdminTd muted>{o.date}</AdminTd>
              <AdminTd><OrderStatusBadge status={o.status} /></AdminTd>
              <AdminTd>
                <AdminBtn variant="ghost" size="sm">Detail</AdminBtn>
              </AdminTd>
            </AdminTr>
          ))}
        </AdminTable>
      </div>

      <style jsx global>{`
        .admin-stats-grid { grid-template-columns: repeat(4, 1fr); }
        .admin-chart-grid { grid-template-columns: 1fr 340px; }
        @media (max-width: 1200px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-chart-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .admin-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

function RevIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4713A" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
}
function OrdIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4713A" strokeWidth="1.5" strokeLinecap="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 3H8v4h8V3z" /></svg>;
}
function UsrIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4713A" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function ProdIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4713A" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
}
