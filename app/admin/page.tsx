"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AdminTopbar,
  AdminPageHeader,
  AdminStatCard,
  AdminTable,
  AdminTr,
  AdminTd,
  AdminBtn,
  OrderStatusBadge,
  formatRp,
} from "./components";
import { AdminUser, fetchAdminOrders, fetchAdminUsers, fetchProducts } from "../../services/api";

type AdminOrder = {
  id: number;
  orderNumber: string;
  customer: string;
  email: string;
  items: string;
  total: number;
  status: string;
  createdAt: string;
  createdDate: Date | null;
};

type AdminProduct = {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  isActive: boolean;
};

const TIER_COLORS: Record<string, string> = {
  REGULAR: "#8A8078",
  GOLD: "#C4713A",
  PLATINUM: "#1A1714",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const [ordersData, usersData, productsData] = await Promise.all([
        fetchAdminOrders(0, 100),
        fetchAdminUsers(0, 100),
        fetchProducts(0, 100),
      ]);

      setOrders(ordersData.map(normalizeOrder));
      setUsers(usersData);
      setProducts(productsData.map(normalizeProduct));
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const activeProducts = products.filter((product) => product.isActive);
  const activeMembers = users.filter((user) => user.isActive && !user.roles.includes("ROLE_ADMIN"));
  const pendingOrders = orders.filter((order) => order.status === "menunggu");
  const lowStock = activeProducts
    .filter((product) => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const totalRevenue = orders
    .filter((order) => order.status !== "dibatalkan")
    .reduce((sum, order) => sum + order.total, 0);

  const recentOrders = [...orders]
    .sort((a, b) => (b.createdDate?.getTime() ?? 0) - (a.createdDate?.getTime() ?? 0))
    .slice(0, 5);

  const salesTrend = useMemo(() => buildSalesTrend(orders), [orders]);
  const tierDistribution = useMemo(() => buildTierDistribution(activeMembers), [activeMembers]);

  return (
    <>
      <AdminTopbar
        breadcrumb={[{ label: "Admin" }, { label: "Overview" }]}
        action={
          <Link href="/admin/produk/tambah" style={{ textDecoration: "none" }}>
            <AdminBtn variant="primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah Produk
            </AdminBtn>
          </Link>
        }
      />

      <div style={{ padding: "2rem", flex: 1 }}>
        <AdminPageHeader
          tag={`Data per ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
          title="Dashboard Penjualan"
          subtitle={loading ? "Memuat data dari database..." : "Ringkasan performa toko Maison dari database"}
        />

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}
          className="admin-stats-grid"
        >
          <AdminStatCard
            label="Pendapatan Tercatat"
            value={formatShortCurrency(totalRevenue)}
            sub={`${orders.length} pesanan dari database`}
            icon={<RevIcon />}
          />
          <AdminStatCard
            label="Total Pesanan"
            value={orders.length.toLocaleString("id-ID")}
            sub={`${pendingOrders.length} perlu diproses`}
            icon={<OrdIcon />}
          />
          <AdminStatCard
            label="Member Aktif"
            value={activeMembers.length.toLocaleString("id-ID")}
            sub={`${users.length} akun tercatat`}
            icon={<UsrIcon />}
          />
          <AdminStatCard
            label="Produk Aktif"
            value={activeProducts.length.toLocaleString("id-ID")}
            sub={`${lowStock.length} stok hampir habis`}
            subColor={lowStock.length > 0 ? "#DC2626" : "#16A34A"}
            icon={<ProdIcon />}
          />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem", marginBottom: "2rem" }}
          className="admin-chart-grid"
        >
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
              <div style={{ fontSize: "0.72rem", color: "#8A8078", textAlign: "right" }}>
                Total {formatRp(salesTrend.reduce((sum, item) => sum + item.total, 0))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
              {salesTrend.map((item, index) => {
                const max = Math.max(1, ...salesTrend.map((day) => day.total));
                const pct = item.total > 0 ? (item.total / max) * 100 : 4;
                const isLast = index === salesTrend.length - 1;
                return (
                  <div key={item.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    {isLast && (
                      <div style={{ fontSize: "0.55rem", color: "#C4713A", background: "rgba(196,113,58,0.1)", padding: "0.1rem 0.35rem", whiteSpace: "nowrap" }}>
                        {formatShortCurrency(item.total)}
                      </div>
                    )}
                    <div
                      title={formatRp(item.total)}
                      style={{
                        width: "100%",
                        height: `${pct}%`,
                        background: isLast ? "#C4713A" : "rgba(196,113,58,0.25)",
                        borderRadius: "1px 1px 0 0",
                        minHeight: "4px",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "0.5rem" }}>
              {salesTrend.map((item) => (
                <div key={item.key} style={{ flex: 1, fontSize: "0.5rem", color: "#B8AFA0", textAlign: "center" }}>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #E4DDD3", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 300, color: "#1A1714", flex: 1 }}>
                Stok Hampir Habis
              </span>
              <span style={{ fontSize: "0.62rem", background: "rgba(220,38,38,0.1)", color: "#DC2626", padding: "0.15rem 0.55rem", fontWeight: 600 }}>
                {lowStock.length} Produk
              </span>
            </div>
            {lowStock.length === 0 ? (
              <div style={{ padding: "2rem 1.25rem", color: "#8A8078", fontSize: "0.8rem" }}>
                Tidak ada produk aktif dengan stok rendah.
              </div>
            ) : (
              lowStock.map((product) => (
                <div key={product.id} style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(228,221,211,0.5)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", color: "#1A1714", fontWeight: 500, marginBottom: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#B8AFA0" }}>{product.sku} - {product.category}</div>
                    <div style={{ height: "3px", background: "rgba(220,38,38,0.1)", marginTop: "0.5rem", borderRadius: "2px" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, (product.stock / 20) * 100)}%`, background: "#DC2626", borderRadius: "2px" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", fontWeight: 300, color: "#DC2626", flexShrink: 0 }}>
                    {product.stock}
                  </span>
                </div>
              ))
            )}
            <div style={{ padding: "0.85rem 1.25rem" }}>
              <Link href="/admin/produk" style={{ textDecoration: "none" }}>
                <AdminBtn variant="ghost" size="sm">Lihat Semua Produk</AdminBtn>
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }} className="admin-tier-grid">
          {tierDistribution.map((tier) => (
            <div key={tier.key} style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8078" }}>
                  {tier.label}
                </span>
                <span style={{ fontSize: "0.65rem", color: tier.color, fontWeight: 600 }}>{tier.pct}%</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 300, color: "#1A1714", marginBottom: "0.75rem" }}>
                {tier.count.toLocaleString("id-ID")}
              </div>
              <div style={{ height: "4px", background: "rgba(228,221,211,0.8)", borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${tier.pct}%`, background: tier.color, borderRadius: "2px", transition: "width 0.5s ease" }} />
              </div>
            </div>
          ))}
        </div>

        <AdminTable
          title="Pesanan Terbaru"
          columns={["No. Pesanan", "Pelanggan", "Produk", "Total", "Tanggal", "Status", ""]}
          action={
            <Link href="/admin/pesanan" style={{ textDecoration: "none" }}>
              <AdminBtn variant="ghost" size="sm">Lihat Semua Pesanan</AdminBtn>
            </Link>
          }
        >
          {recentOrders.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#8A8078", fontSize: "0.85rem" }}>
                Belum ada pesanan di database.
              </td>
            </tr>
          ) : (
            recentOrders.map((order) => (
              <AdminTr key={order.id}>
                <AdminTd bold>{order.orderNumber}</AdminTd>
                <AdminTd>{order.customer}</AdminTd>
                <AdminTd muted>{order.items}</AdminTd>
                <AdminTd bold>{formatRp(order.total)}</AdminTd>
                <AdminTd muted>{order.createdAt}</AdminTd>
                <AdminTd><OrderStatusBadge status={order.status} /></AdminTd>
                <AdminTd>
                  <Link href="/admin/pesanan" style={{ textDecoration: "none" }}>
                    <AdminBtn variant="ghost" size="sm">Detail</AdminBtn>
                  </Link>
                </AdminTd>
              </AdminTr>
            ))
          )}
        </AdminTable>
      </div>

      <style jsx global>{`
        .admin-stats-grid { grid-template-columns: repeat(4, 1fr); }
        .admin-chart-grid { grid-template-columns: 1fr 340px; }
        .admin-tier-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 1200px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-chart-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 760px) {
          .admin-tier-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .admin-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

function normalizeOrder(value: unknown): AdminOrder {
  const order = asRecord(value);
  const user = asRecord(order.user);
  const createdDate = parseDate(order.createdAt);

  return {
    id: toNumber(order.id),
    orderNumber: toText(order.orderNumber, `ORD-${toNumber(order.id)}`),
    customer: toText(user.fullName ?? order.customerName ?? order.customer, "Pelanggan"),
    email: toText(user.email ?? order.userEmail, "-"),
    items: summarizeOrderItems(order.orderItems),
    total: toNumber(order.total),
    status: toText(order.status, "MENUNGGU").toLowerCase(),
    createdAt: createdDate ? createdDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-",
    createdDate,
  };
}

function normalizeProduct(value: unknown): AdminProduct {
  const product = asRecord(value);
  const category = asRecord(product.category);

  return {
    id: toNumber(product.id),
    sku: toText(product.sku, `PRD-${toNumber(product.id)}`),
    name: toText(product.name, "Produk"),
    category: toText(category.name ?? product.category, "Tanpa kategori"),
    stock: toNumber(product.stock),
    isActive: product.isActive !== false,
  };
}

function summarizeOrderItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return "-";

  return value
    .map((entry) => {
      const item = asRecord(entry);
      const product = asRecord(item.product);
      const name = toText(product.name, "Produk");
      const quantity = toNumber(item.quantity);
      return quantity > 1 ? `${name} (${quantity}x)` : name;
    })
    .join(", ");
}

function buildSalesTrend(orders: AdminOrder[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - index));
    const key = date.toISOString().slice(0, 10);
    const total = orders
      .filter((order) => order.createdDate && order.createdDate.toISOString().slice(0, 10) === key && order.status !== "dibatalkan")
      .reduce((sum, order) => sum + order.total, 0);

    return {
      key,
      label: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      total,
    };
  });
}

function buildTierDistribution(users: AdminUser[]) {
  const total = Math.max(1, users.length);
  return ["REGULAR", "GOLD", "PLATINUM"].map((tier) => {
    const count = users.filter((user) => user.tier === tier).length;
    return {
      key: tier,
      label: tier.charAt(0) + tier.slice(1).toLowerCase(),
      count,
      pct: Math.round((count / total) * 100),
      color: TIER_COLORS[tier],
    };
  });
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

function formatShortCurrency(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  }

  return formatRp(value);
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
