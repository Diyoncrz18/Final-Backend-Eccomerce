"use client";

import { useEffect, useState } from "react";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn, AdminSearch, OrderStatusBadge, formatRp } from "../components";
import { fetchAdminOrders, updateOrderStatus } from "../../../services/api";

type OrderStatus = "menunggu" | "dikemas" | "dikirim" | "selesai" | "dibatalkan";

interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  userEmail: string;
  items: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  trackingNo?: string;
  courier?: string;
  estimasi?: string;
}

const STATUS_TABS: { key: OrderStatus | "semua"; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "dikemas", label: "Dikemas" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
  { key: "dibatalkan", label: "Dibatalkan" },
];

const STATUS_PIPELINE: OrderStatus[] = ["menunggu", "dikemas", "dikirim", "selesai"];

function TrackingModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [trackingNo, setTrackingNo] = useState(order.trackingNo ?? "");
  const [courier, setCourier] = useState(order.courier ?? "JNE Express");
  const [estimasi, setEstimasi] = useState(order.estimasi ?? "");

  return (
    <ModalShell onClose={onClose} eyebrow="Pengiriman" title="Input Nomor Resi">
      <div style={{ fontSize: "0.78rem", color: "#8A8078", marginBottom: "1.5rem", padding: "0.75rem 1rem", background: "#F4F0EA", border: "1px solid #E4DDD3" }}>
        {order.orderNumber} - {order.customer}
      </div>

      <FormField label="Ekspedisi/Kurir">
        <select value={courier} onChange={(event) => setCourier(event.target.value)} style={inputStyle}>
          {["JNE Express", "SiCepat", "J&T Express", "Anteraja", "Gosend"].map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </FormField>
      <FormField label="Nomor Resi">
        <input type="text" value={trackingNo} onChange={(event) => setTrackingNo(event.target.value)} placeholder="Contoh: JNE-7123456789" style={inputStyle} />
      </FormField>
      <FormField label="Estimasi Tiba">
        <input type="text" value={estimasi} onChange={(event) => setEstimasi(event.target.value)} placeholder="Contoh: 20-22 Apr 2026" style={inputStyle} />
      </FormField>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <AdminBtn variant="ghost" onClick={onClose}>Batal</AdminBtn>
        <AdminBtn variant="primary" onClick={onClose}>Simpan</AdminBtn>
      </div>
    </ModalShell>
  );
}

function StatusModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => Promise<void>;
}) {
  const currentIdx = STATUS_PIPELINE.indexOf(order.status);
  const nextStatus = currentIdx >= 0 ? STATUS_PIPELINE[currentIdx + 1] : undefined;

  return (
    <ModalShell onClose={onClose} eyebrow="Status Pesanan" title="Update Status">
      <div style={{ marginBottom: "1.5rem" }}>
        {STATUS_PIPELINE.map((status, index) => (
          <div key={status} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: index < STATUS_PIPELINE.length - 1 ? "0.5rem" : 0 }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: index <= currentIdx ? "#C4713A" : "#F4F0EA",
              border: `2px solid ${index <= currentIdx ? "#C4713A" : "#E4DDD3"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {index <= currentIdx ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E4DDD3" }} />
              )}
            </div>
            <span style={{ fontSize: "0.85rem", color: index <= currentIdx ? "#1A1714" : "#B8AFA0", fontWeight: index === currentIdx ? 500 : 400 }}>
              {labelStatus(status)}
              {index === currentIdx && <span style={{ fontSize: "0.65rem", color: "#C4713A", marginLeft: "0.5rem" }}>Sekarang</span>}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {nextStatus && (
          <AdminBtn variant="primary" onClick={() => onUpdateStatus(order.id, nextStatus)}>
            Update ke {labelStatus(nextStatus)}
          </AdminBtn>
        )}
        {order.status !== "dibatalkan" && order.status !== "selesai" && (
          <AdminBtn variant="danger" onClick={() => onUpdateStatus(order.id, "dibatalkan")}>Batalkan</AdminBtn>
        )}
        <AdminBtn variant="ghost" onClick={onClose}>Tutup</AdminBtn>
      </div>
    </ModalShell>
  );
}

export default function AdminPesananPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "semua">("semua");
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const data = await fetchAdminOrders(0, 100);
      setOrders(data.map(normalizeOrder));
      setLoading(false);
    }

    loadOrders();
  }, []);

  const filtered = orders.filter((order) => {
    const keyword = search.toLowerCase();
    const matchSearch =
      order.orderNumber.toLowerCase().includes(keyword) ||
      order.customer.toLowerCase().includes(keyword) ||
      order.userEmail.toLowerCase().includes(keyword);
    const matchStatus = activeStatus === "semua" || order.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab.key] = tab.key === "semua" ? orders.length : orders.filter((order) => order.status === tab.key).length;
    return acc;
  }, {} as Record<string, number>);

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    setError("");
    const result = await updateOrderStatus(orderId, status.toUpperCase());
    if (result?.success === false) {
      setError("Status pesanan gagal diperbarui.");
      return;
    }

    const normalized = normalizeOrder(result);
    setOrders((current) => current.map((order) => (order.id === orderId ? normalized : order)));
    setStatusOrder(null);
  };

  return (
    <>
      {trackingOrder && <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}
      {statusOrder && <StatusModal order={statusOrder} onClose={() => setStatusOrder(null)} onUpdateStatus={handleUpdateStatus} />}

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
          subtitle={loading ? "Memuat pesanan dari database..." : `${orders.length} pesanan total - ${counts.menunggu ?? 0} menunggu proses`}
        />

        {error && (
          <div style={{ border: "1px solid rgba(220,38,38,0.25)", background: "rgba(220,38,38,0.06)", color: "#DC2626", padding: "0.85rem 1rem", marginBottom: "1rem", fontSize: "0.8rem" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              style={{
                padding: "0.7rem 1.1rem",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeStatus === tab.key ? "#C4713A" : "transparent"}`,
                color: activeStatus === tab.key ? "#C4713A" : "#6B6560",
                fontSize: "0.78rem",
                fontWeight: activeStatus === tab.key ? 500 : 400,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                marginBottom: "-1px",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
              {(counts[tab.key] ?? 0) > 0 && (
                <span style={{ fontSize: "0.6rem", fontWeight: 600, background: activeStatus === tab.key ? "#C4713A" : "#F4F0EA", color: activeStatus === tab.key ? "#fff" : "#8A8078", padding: "0.05rem 0.4rem", borderRadius: "99px", border: `1px solid ${activeStatus === tab.key ? "#C4713A" : "#E4DDD3"}` }}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <AdminSearch value={search} onChange={setSearch} placeholder="Cari ID pesanan / pelanggan..." />
        </div>

        <AdminTable columns={["No. Pesanan", "Pelanggan", "Produk", "Total", "Tanggal", "Status", "Aksi"]}>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#8A8078", fontSize: "0.85rem" }}>
                Memuat data pesanan dari database...
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#8A8078", fontSize: "0.85rem" }}>
                Tidak ada pesanan ditemukan.
              </td>
            </tr>
          ) : (
            filtered.map((order) => (
              <AdminTr key={order.id}>
                <AdminTd bold>{order.orderNumber}</AdminTd>
                <AdminTd>
                  <div>
                    <div style={{ fontWeight: 500, color: "#1A1714", fontSize: "0.82rem" }}>{order.customer}</div>
                    <div style={{ fontSize: "0.65rem", color: "#B8AFA0" }}>{order.userEmail}</div>
                  </div>
                </AdminTd>
                <AdminTd muted>{order.items}</AdminTd>
                <AdminTd bold>{formatRp(order.total)}</AdminTd>
                <AdminTd muted>{order.createdAt}</AdminTd>
                <AdminTd><OrderStatusBadge status={order.status} /></AdminTd>
                <AdminTd>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <AdminBtn variant="ghost" size="sm" onClick={() => setStatusOrder(order)}>Status</AdminBtn>
                    {(order.status === "dikemas" || order.status === "dikirim") && (
                      <AdminBtn variant="outline" size="sm" onClick={() => setTrackingOrder(order)}>Resi</AdminBtn>
                    )}
                  </div>
                </AdminTd>
              </AdminTr>
            ))
          )}
        </AdminTable>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#8A8078" }}>
            Menampilkan {filtered.length} dari {orders.length} pesanan
          </span>
        </div>
      </div>
    </>
  );
}

function ModalShell({
  eyebrow,
  title,
  children,
  onClose,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#FAF8F5", maxWidth: "480px", width: "100%", border: "1px solid #E4DDD3", padding: "2rem", boxShadow: "0 20px 60px rgba(26,23,20,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.16em", color: "#C4713A", textTransform: "uppercase", marginBottom: "0.25rem" }}>{eyebrow}</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, color: "#1A1714" }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8078" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m18 6-12 12M6 6l12 12"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, color: "#4A4640", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>{label}</label>
      {children}
    </div>
  );
}

function normalizeOrder(value: unknown): Order {
  const order = asRecord(value);
  const user = asRecord(order.user);
  const createdAt = parseDate(order.createdAt);

  return {
    id: toNumber(order.id),
    orderNumber: toText(order.orderNumber, `ORD-${toNumber(order.id)}`),
    customer: toText(user.fullName ?? order.customerName ?? order.customer, "Pelanggan"),
    userEmail: toText(user.email ?? order.userEmail, "-"),
    items: summarizeOrderItems(order.orderItems),
    total: toNumber(order.total),
    status: normalizeStatus(order.status),
    createdAt: createdAt ? createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-",
    trackingNo: toText(order.trackingNo, ""),
    courier: toText(order.courier, ""),
    estimasi: toText(order.estimasi, ""),
  };
}

function summarizeOrderItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return "-";
  return value.map((entry) => {
    const item = asRecord(entry);
    const product = asRecord(item.product);
    const name = toText(product.name, "Produk");
    const quantity = toNumber(item.quantity);
    return quantity > 1 ? `${name} (${quantity}x)` : name;
  }).join(", ");
}

function normalizeStatus(value: unknown): OrderStatus {
  const status = toText(value, "MENUNGGU").toLowerCase();
  return STATUS_TABS.some((tab) => tab.key === status) && status !== "semua" ? status as OrderStatus : "menunggu";
}

function labelStatus(status: OrderStatus) {
  return STATUS_TABS.find((tab) => tab.key === status)?.label ?? status;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

function toText(value: unknown, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function parseDate(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  background: "#F4F0EA",
  border: "1px solid #E4DDD3",
  fontFamily: "var(--font-body)",
  fontSize: "0.85rem",
  color: "#1A1714",
  outline: "none",
};
