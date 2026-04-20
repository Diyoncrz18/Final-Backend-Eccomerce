"use client";
import { useState } from "react";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn, AdminSearch, OrderStatusBadge, formatRp } from "../components";

/* ─── Types ─── */
type OrderStatus = "menunggu" | "dikemas" | "dikirim" | "selesai" | "dibatalkan";

interface Order {
  id: string; customer: string; email: string; items: string;
  total: number; status: OrderStatus; date: string;
  trackingNo?: string; courier?: string; estimasi?: string;
}

/* ─── Mock Data ─── */
const ORDERS: Order[] = [
  { id: "MSN-20250418-001", customer: "Budi Santoso", email: "budi@email.com", items: "Bouclé Armchair, Marble Side Table", total: 9760000, status: "dikirim", date: "18 Apr 2025", trackingNo: "JNE-7123456789", courier: "JNE Express", estimasi: "20–22 Apr 2025" },
  { id: "MSN-20250415-002", customer: "Anisa Rahma", email: "anisa@email.com", items: "Olive Linen Sofa", total: 12500000, status: "dikemas", date: "15 Apr 2025" },
  { id: "MSN-20250414-006", customer: "Yoga Prasetyo", email: "yoga@email.com", items: "Japandi Floor Lamp (2×)", total: 3700000, status: "menunggu", date: "14 Apr 2025" },
  { id: "MSN-20250408-003", customer: "Reza Fauzi", email: "reza@email.com", items: "Ceramic Statement Vase (2×), Rattan Wall Panel", total: 4800000, status: "selesai", date: "8 Apr 2025", trackingNo: "JNE-6099872341", courier: "JNE Express" },
  { id: "MSN-20250328-004", customer: "Dewi Sartika", email: "dewi@email.com", items: "Oak Dining Table", total: 9800000, status: "selesai", date: "28 Mar 2025", trackingNo: "SiCepat-4521897360", courier: "SiCepat" },
  { id: "MSN-20250320-007", customer: "Putri Handayani", email: "putri@email.com", items: "Travertine Coffee Table", total: 8900000, status: "selesai", date: "20 Mar 2025" },
  { id: "MSN-20250312-005", customer: "Citra Wulandari", email: "citra@email.com", items: "Velvet Accent Chair", total: 5040000, status: "dibatalkan", date: "12 Mar 2025" },
  { id: "MSN-20250308-008", customer: "Hendra Gunawan", email: "hendra@email.com", items: "Wabi-Sabi Vase Set, Rattan Pendant Lamp", total: 3850000, status: "dibatalkan", date: "8 Mar 2025" },
];

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "dikemas", label: "Dikemas" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
  { key: "dibatalkan", label: "Dibatalkan" },
];

/* ─── Tracking Modal ─── */
function TrackingModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [trackingNo, setTrackingNo] = useState(order.trackingNo ?? "");
  const [courier, setCourier] = useState(order.courier ?? "JNE Express");
  const [estimasi, setEstimasi] = useState(order.estimasi ?? "");

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,23,20,0.55)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
    }}>
      <div style={{
        background: "#FAF8F5", maxWidth: "480px", width: "100%",
        border: "1px solid #E4DDD3", padding: "2rem",
        boxShadow: "0 20px 60px rgba(26,23,20,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.16em", color: "#C4713A", textTransform: "uppercase", marginBottom: "0.25rem" }}>Pengiriman</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, color: "#1A1714" }}>Input Nomor Resi</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8078" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m18 6-12 12M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ fontSize: "0.78rem", color: "#8A8078", marginBottom: "1.5rem", padding: "0.75rem 1rem", background: "#F4F0EA", border: "1px solid #E4DDD3" }}>
          {order.id} · {order.customer}
        </div>

        {[
          { label: "Ekspedisi/Kurir", key: "courier", val: courier, set: setCourier, type: "select",
            options: ["JNE Express", "SiCepat", "J&T Express", "Anteraja", "Gosend"] },
          { label: "Nomor Resi", key: "tracking", val: trackingNo, set: setTrackingNo, type: "text", placeholder: "Contoh: JNE-7123456789" },
          { label: "Estimasi Tiba", key: "estimasi", val: estimasi, set: setEstimasi, type: "text", placeholder: "Contoh: 20–22 Apr 2025" },
        ].map((f) => (
          <div key={f.key} style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, color: "#4A4640", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
              {f.label}
            </label>
            {f.type === "select" ? (
              <select value={f.val} onChange={(e) => f.set(e.target.value)} style={{
                width: "100%", padding: "0.65rem 0.85rem",
                background: "#F4F0EA", border: "1px solid #E4DDD3",
                fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#1A1714", outline: "none",
              }}>
                {(f as any).options.map((o: string) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                type="text" value={f.val} onChange={(e) => f.set(e.target.value)}
                placeholder={(f as any).placeholder}
                style={{
                  width: "100%", padding: "0.65rem 0.85rem",
                  background: "#F4F0EA", border: "1px solid #E4DDD3",
                  fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#1A1714",
                  outline: "none",
                }}
              />
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <AdminBtn variant="ghost" onClick={onClose}>Batal</AdminBtn>
          <AdminBtn variant="primary" onClick={() => { alert("Resi berhasil disimpan!"); onClose(); }}>
            Simpan & Update Status
          </AdminBtn>
        </div>
      </div>
    </div>
  );
}

/* ─── Status Update ─── */
function StatusModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const pipeline: OrderStatus[] = ["menunggu", "dikemas", "dikirim", "selesai"];
  const currentIdx = pipeline.indexOf(order.status as OrderStatus);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,23,20,0.55)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
    }}>
      <div style={{
        background: "#FAF8F5", maxWidth: "440px", width: "100%",
        border: "1px solid #E4DDD3", padding: "2rem",
        boxShadow: "0 20px 60px rgba(26,23,20,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.16em", color: "#C4713A", textTransform: "uppercase", marginBottom: "0.25rem" }}>Status Pesanan</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, color: "#1A1714" }}>Update Status</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8078" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m18 6-12 12M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          {pipeline.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: i < pipeline.length - 1 ? "0.5rem" : 0 }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: i <= currentIdx ? "#C4713A" : "#F4F0EA",
                border: `2px solid ${i <= currentIdx ? "#C4713A" : "#E4DDD3"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {i <= currentIdx ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E4DDD3" }} />
                )}
              </div>
              <span style={{ fontSize: "0.85rem", color: i <= currentIdx ? "#1A1714" : "#B8AFA0", fontWeight: i === currentIdx ? 500 : 400 }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
                {i === currentIdx && <span style={{ fontSize: "0.65rem", color: "#C4713A", marginLeft: "0.5rem" }}>← Sekarang</span>}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {currentIdx < pipeline.length - 1 && (
            <AdminBtn variant="primary" onClick={() => { alert(`Status diubah ke: ${pipeline[currentIdx + 1]}`); onClose(); }}>
              → {pipeline[currentIdx + 1].charAt(0).toUpperCase() + pipeline[currentIdx + 1].slice(1)}
            </AdminBtn>
          )}
          <AdminBtn variant="danger" onClick={() => { alert("Pesanan dibatalkan"); onClose(); }}>Batalkan</AdminBtn>
          <AdminBtn variant="ghost" onClick={onClose}>Tutup</AdminBtn>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AdminPesananPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("semua");
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);

  const filtered = ORDERS.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeStatus === "semua" || o.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "semua" ? ORDERS.length : ORDERS.filter((o) => o.status === t.key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {trackingOrder && <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}
      {statusOrder && <StatusModal order={statusOrder} onClose={() => setStatusOrder(null)} />}

      <AdminTopbar
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Pesanan" }]}
        action={
          <AdminBtn variant="ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </AdminBtn>
        }
      />

      <div style={{ padding: "2rem" }}>
        <AdminPageHeader
          tag="Transaksi"
          title="Manajemen Pesanan"
          subtitle={`${ORDERS.length} pesanan total · ${counts.menunggu} menunggu proses`}
        />

        {/* Status Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveStatus(t.key)}
              style={{
                padding: "0.7rem 1.1rem",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeStatus === t.key ? "#C4713A" : "transparent"}`,
                color: activeStatus === t.key ? "#C4713A" : "#6B6560",
                fontSize: "0.78rem",
                fontWeight: activeStatus === t.key ? 500 : 400,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "-1px",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
              {counts[t.key] > 0 && (
                <span style={{
                  fontSize: "0.6rem", fontWeight: 600,
                  background: activeStatus === t.key ? "#C4713A" : "#F4F0EA",
                  color: activeStatus === t.key ? "#fff" : "#8A8078",
                  padding: "0.05rem 0.4rem", borderRadius: "99px",
                  border: `1px solid ${activeStatus === t.key ? "#C4713A" : "#E4DDD3"}`,
                }}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <AdminSearch value={search} onChange={setSearch} placeholder="Cari ID pesanan / pelanggan..." />
        </div>

        {/* Table */}
        <AdminTable columns={["No. Pesanan", "Pelanggan", "Produk", "Total", "Tanggal", "Status", "Aksi"]}>
          {filtered.map((o) => (
            <AdminTr key={o.id}>
              <AdminTd bold>{o.id}</AdminTd>
              <AdminTd>
                <div>
                  <div style={{ fontWeight: 500, color: "#1A1714", fontSize: "0.82rem" }}>{o.customer}</div>
                  <div style={{ fontSize: "0.65rem", color: "#B8AFA0" }}>{o.email}</div>
                </div>
              </AdminTd>
              <AdminTd muted>{o.items}</AdminTd>
              <AdminTd bold>{formatRp(o.total)}</AdminTd>
              <AdminTd muted>{o.date}</AdminTd>
              <AdminTd><OrderStatusBadge status={o.status} /></AdminTd>
              <AdminTd>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <AdminBtn variant="ghost" size="sm" onClick={() => setStatusOrder(o)}>Status</AdminBtn>
                  {(o.status === "dikemas" || o.status === "dikirim") && (
                    <AdminBtn variant="outline" size="sm" onClick={() => setTrackingOrder(o)}>Resi</AdminBtn>
                  )}
                </div>
              </AdminTd>
            </AdminTr>
          ))}
        </AdminTable>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#8A8078" }}>
            Menampilkan {filtered.length} dari {ORDERS.length} pesanan
          </span>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {[1, 2].map((p) => (
              <button key={p} style={{
                width: "32px", height: "32px",
                background: p === 1 ? "#1A1714" : "transparent",
                border: "1px solid #E4DDD3",
                color: p === 1 ? "#FAF8F5" : "#6B6560",
                fontSize: "0.78rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
