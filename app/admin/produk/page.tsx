"use client";
import { useState } from "react";
import Link from "next/link";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn, AdminSearch, formatRp } from "../components";

/* ─── Types ─── */
interface Product {
  id: number; sku: string; name: string; category: string; collection: string;
  price: number; salePrice: number | null; stock: number;
  isActive: boolean; isNew: boolean; img: string; rating: number;
}

/* ─── Mock Data ─── */
const PRODUCTS: Product[] = [
  { id: 1, sku: "MSN-CHAIR-001", name: "Bouclé Armchair", category: "Kursi", collection: "Spring 2025", price: 6400000, salePrice: null, stock: 8, isActive: true, isNew: false, img: "/product-chair.png", rating: 4.9 },
  { id: 2, sku: "MSN-SOFA-002", name: "Olive Linen Sofa", category: "Kursi", collection: "Classic", price: 12500000, salePrice: null, stock: 3, isActive: true, isNew: false, img: "/product-sofa.png", rating: 4.8 },
  { id: 3, sku: "MSN-CHAIR-003", name: "Velvet Accent Chair", category: "Kursi", collection: "Sale", price: 7200000, salePrice: 5040000, stock: 5, isActive: true, isNew: false, img: "/product-velvet-chair.png", rating: 4.7 },
  { id: 4, sku: "MSN-TABLE-004", name: "Marble Side Table", category: "Meja", collection: "Stone Series", price: 4800000, salePrice: 3360000, stock: 3, isActive: true, isNew: false, img: "/product-marble-table.png", rating: 4.9 },
  { id: 5, sku: "MSN-TABLE-005", name: "Oak Dining Table", category: "Meja", collection: "Nordic", price: 9800000, salePrice: null, stock: 2, isActive: true, isNew: false, img: "/product-table.png", rating: 4.8 },
  { id: 6, sku: "MSN-TABLE-006", name: "Travertine Coffee Table", category: "Meja", collection: "Stone Series", price: 8900000, salePrice: null, stock: 6, isActive: true, isNew: true, img: "/product-table.png", rating: 4.6 },
  { id: 7, sku: "MSN-LAMP-007", name: "Rattan Pendant Lamp", category: "Lampu", collection: "Artisan", price: 2750000, salePrice: null, stock: 12, isActive: true, isNew: false, img: "/product-lamp.png", rating: 4.8 },
  { id: 8, sku: "MSN-LAMP-008", name: "Japandi Floor Lamp", category: "Lampu", collection: "Artisan", price: 1850000, salePrice: null, stock: 6, isActive: true, isNew: true, img: "/product-lamp.png", rating: 5.0 },
  { id: 9, sku: "MSN-DECO-009", name: "Ceramic Statement Vase", category: "Dekorasi", collection: "Wabi-Sabi", price: 1350000, salePrice: 945000, stock: 20, isActive: true, isNew: true, img: "/product-ceramic-vase.png", rating: 4.9 },
  { id: 10, sku: "MSN-DECO-010", name: "Wabi-Sabi Vase Set", category: "Dekorasi", collection: "Wabi-Sabi", price: 1100000, salePrice: null, stock: 15, isActive: true, isNew: false, img: "/product-ceramic-vase.png", rating: 4.7 },
  { id: 11, sku: "MSN-DECO-011", name: "Rattan Wall Panel", category: "Dekorasi", collection: "Artisan", price: 2100000, salePrice: 1470000, stock: 8, isActive: true, isNew: false, img: "/product-rattan-wall.png", rating: 4.8 },
  { id: 12, sku: "MSN-DECO-012", name: "Linen Throw Pillow Set", category: "Dekorasi", collection: "Classic", price: 680000, salePrice: null, stock: 30, isActive: false, isNew: false, img: "/product-ceramic-vase.png", rating: 4.7 },
];

const CATEGORIES = ["semua", "Kursi", "Meja", "Lampu", "Dekorasi", "Penyimpanan"];

export default function AdminProdukPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [activeStatus, setActiveStatus] = useState("semua");

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "semua" || p.category === activeCategory;
    const matchStatus = activeStatus === "semua" || (activeStatus === "aktif" ? p.isActive : !p.isActive);
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <>
      <AdminTopbar
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Produk" }]}
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

      <div style={{ padding: "2rem" }}>
        <AdminPageHeader
          tag="Katalog"
          title="Manajemen Produk"
          subtitle={`${PRODUCTS.length} produk tercatat · ${PRODUCTS.filter(p => p.isActive).length} aktif`}
        />

        {/* ── Filters ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {/* Category tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.6rem 1.1rem",
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${activeCategory === cat ? "#C4713A" : "transparent"}`,
                  color: activeCategory === cat ? "#C4713A" : "#6B6560",
                  fontSize: "0.78rem",
                  fontWeight: activeCategory === cat ? 500 : 400,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.04em",
                  marginBottom: "-1px",
                }}
              >
                {cat === "semua" ? "Semua" : cat}
              </button>
            ))}
          </div>

          {/* Search + status filter */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              style={{
                padding: "0.55rem 0.85rem",
                background: "#F4F0EA",
                border: "1px solid #E4DDD3",
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "#6B6560",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <AdminSearch value={search} onChange={setSearch} placeholder="Cari produk / SKU..." />
          </div>
        </div>

        {/* ── Table ── */}
        <AdminTable
          columns={["Produk", "SKU", "Kategori", "Harga", "Stok", "Status", "Rating", ""]}
        >
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "#B8AFA0", fontSize: "0.85rem" }}>
                Tidak ada produk ditemukan
              </td>
            </tr>
          ) : (
            filtered.map((p) => (
              <AdminTr key={p.id}>
                {/* Produk */}
                <AdminTd>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <div style={{ width: "44px", height: "44px", background: "#F4F0EA", flexShrink: 0, overflow: "hidden", border: "1px solid #E4DDD3" }}>
                      <img src={p.img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1A1714", marginBottom: "0.15rem" }}>{p.name}</div>
                      <div style={{ fontSize: "0.65rem", color: "#B8AFA0" }}>{p.collection}</div>
                      {p.isNew && (
                        <span style={{ fontSize: "0.55rem", background: "rgba(196,113,58,0.1)", color: "#C4713A", padding: "0.1rem 0.4rem", letterSpacing: "0.1em", fontWeight: 600 }}>BARU</span>
                      )}
                    </div>
                  </div>
                </AdminTd>
                <AdminTd muted>{p.sku}</AdminTd>
                <AdminTd>
                  <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.6rem", background: "#F4F0EA", color: "#6B6560", border: "1px solid #E4DDD3" }}>
                    {p.category}
                  </span>
                </AdminTd>
                {/* Harga */}
                <AdminTd>
                  <div>
                    {p.salePrice ? (
                      <>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#C4713A" }}>{formatRp(p.salePrice)}</div>
                        <div style={{ fontSize: "0.65rem", color: "#B8AFA0", textDecoration: "line-through" }}>{formatRp(p.price)}</div>
                      </>
                    ) : (
                      <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1A1714" }}>{formatRp(p.price)}</div>
                    )}
                  </div>
                </AdminTd>
                {/* Stok */}
                <AdminTd>
                  <span style={{ color: p.stock <= 3 ? "#DC2626" : "#16A34A", fontWeight: 600, fontSize: "0.85rem" }}>
                    {p.stock}
                  </span>
                  {p.stock <= 3 && (
                    <div style={{ fontSize: "0.6rem", color: "#DC2626" }}>Hampir habis</div>
                  )}
                </AdminTd>
                {/* Status */}
                <AdminTd>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    fontSize: "0.68rem", fontWeight: 600,
                    color: p.isActive ? "#16A34A" : "#8A8078",
                    background: p.isActive ? "rgba(22,163,74,0.08)" : "rgba(138,128,120,0.08)",
                    padding: "0.25rem 0.65rem",
                  }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: p.isActive ? "#16A34A" : "#B8AFA0" }} />
                    {p.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </AdminTd>
                {/* Rating */}
                <AdminTd>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#C4713A" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span style={{ fontSize: "0.8rem", color: "#1A1714" }}>{p.rating}</span>
                  </div>
                </AdminTd>
                {/* Actions */}
                <AdminTd>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <Link href={`/admin/produk/${p.id}/edit`} style={{ textDecoration: "none" }}>
                      <AdminBtn variant="ghost" size="sm">Edit</AdminBtn>
                    </Link>
                    <AdminBtn variant="danger" size="sm">Hapus</AdminBtn>
                  </div>
                </AdminTd>
              </AdminTr>
            ))
          )}
        </AdminTable>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#8A8078" }}>
            Menampilkan {filtered.length} dari {PRODUCTS.length} produk
          </span>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {[1, 2, 3].map((p) => (
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
