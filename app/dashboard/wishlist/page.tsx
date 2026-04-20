"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarUser from "../../components/NavbarUser";

const USER = { name: "Budi Santoso", email: "budi@email.com", tier: "Gold Member", points: 2450 };

interface WishItem {
  id: number; name: string; category: string; price: number; origPrice?: number;
  img: string; rating: number; stock: number; addedDate: string;
}

const WISHLIST: WishItem[] = [
  { id: 2, name: "Olive Linen Sofa", category: "Kursi & Sofa", price: 12500000, img: "/product-sofa.png", rating: 4.8, stock: 3, addedDate: "18 Apr 2025" },
  { id: 5, name: "Oak Dining Table", category: "Meja", price: 9800000, img: "/product-table.png", rating: 4.8, stock: 2, addedDate: "15 Apr 2025" },
  { id: 6, name: "Rattan Pendant Lamp", category: "Lampu", price: 2750000, img: "/product-lamp.png", rating: 4.8, stock: 12, addedDate: "10 Apr 2025" },
  { id: 3, name: "Velvet Accent Chair", category: "Kursi & Sofa", price: 5040000, origPrice: 7200000, img: "/product-velvet-chair.png", rating: 4.7, stock: 5, addedDate: "5 Apr 2025" },
  { id: 7, name: "Ceramic Statement Vase", category: "Dekorasi", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9, stock: 20, addedDate: "2 Apr 2025" },
  { id: 11, name: "Rattan Wall Panel", category: "Dekorasi", price: 2100000, img: "/product-rattan-wall.png", rating: 4.8, stock: 8, addedDate: "28 Mar 2025" },
  { id: 4, name: "Marble Side Table", category: "Meja", price: 3360000, origPrice: 4800000, img: "/product-marble-table.png", rating: 4.9, stock: 3, addedDate: "20 Mar 2025" },
];

const RECOMMENDED = [
  { id: 1, name: "Bouclé Armchair", price: 6400000, img: "/product-chair.png", rating: 4.9 },
  { id: 2, name: "Olive Linen Sofa", price: 12500000, img: "/product-sofa.png", rating: 4.8 },
  { id: 7, name: "Ceramic Statement Vase", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9 },
  { id: 6, name: "Rattan Pendant Lamp", price: 2750000, img: "/product-lamp.png", rating: 4.8 },
];

function formatRp(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function Stars({ n }: { n: number }) {
  return <span style={{ display: "flex", gap: "2px" }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= Math.round(n) ? "var(--copper)" : "var(--stone-light)"} stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </span>;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>(WISHLIST);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredRec, setHoveredRec] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("terbaru");
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const addToCart = (id: number) => {
    setAddedToCart(prev => new Set([...prev, id]));
    setTimeout(() => setAddedToCart(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    }), 2000);
  };

  const sorted = [...items].sort((a, b) => {
    if (sortBy === "harga-asc") return a.price - b.price;
    if (sortBy === "harga-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // terbaru = original order
  });

  const totalValue = items.reduce((s, i) => s + i.price, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={USER} />

      {/* ── Header ── */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)", paddingTop: "72px" }}>
        <div className="container-main" style={{ padding: "2rem var(--container-px, 2rem)" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--stone)", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Dashboard</Link>
            {" / "}
            <span style={{ color: "var(--charcoal)" }}>Wishlist</span>
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
                Wishlist Saya
              </h1>
              <p style={{ fontSize: "0.82rem", color: "var(--stone)", marginTop: "0.25rem" }}>
                {items.length} produk tersimpan · Total nilai {formatRp(totalValue)}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => items.forEach(i => addToCart(i.id))}
                style={{
                  padding: "0.75rem 1.75rem",
                  background: "var(--charcoal)", border: "none", color: "var(--cream)",
                  fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
                  letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--copper)")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--charcoal)")}>
                Tambah Semua ke Keranjang
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>

        {items.length === 0 ? (
          /* ── Empty State ── */
          <div style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--white)", border: "1px solid var(--stone-light)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1.25rem", opacity: 0.3 }}>♡</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.75rem" }}>
              Wishlist Masih Kosong
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--stone)", marginBottom: "2rem", maxWidth: "360px", margin: "0 auto 2rem" }}>
              Simpan produk yang Anda sukai untuk dibeli nanti.
            </p>
            <Link href="/koleksi" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "var(--charcoal)", color: "var(--cream)",
              padding: "0.9rem 2.5rem", fontFamily: "var(--font-body)",
              fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              Jelajahi Koleksi
            </Link>
          </div>
        ) : (
          <>
            {/* Sort + count bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <p style={{ fontSize: "0.82rem", color: "var(--stone)" }}>
                Menampilkan <strong style={{ color: "var(--charcoal)" }}>{sorted.length}</strong> produk
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", color: "var(--stone)" }}>Urutkan:</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{
                    padding: "0.45rem 0.85rem", border: "1px solid var(--stone-light)",
                    background: "var(--white)", fontFamily: "var(--font-body)",
                    fontSize: "0.78rem", color: "var(--charcoal)", cursor: "pointer",
                  }}>
                  <option value="terbaru">Terbaru Ditambahkan</option>
                  <option value="harga-asc">Harga: Terendah</option>
                  <option value="harga-desc">Harga: Tertinggi</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="wishlist-grid">
              {sorted.map(item => {
                const isInCart = addedToCart.has(item.id);
                return (
                  <div key={item.id}
                    style={{
                      background: "var(--white)", border: "1px solid var(--stone-light)",
                      overflow: "hidden", position: "relative",
                      transition: "box-shadow 0.3s ease, transform 0.3s ease",
                      boxShadow: hovered === item.id ? "0 12px 36px rgba(42,38,32,0.12)" : "none",
                      transform: hovered === item.id ? "translateY(-3px)" : "none",
                    }}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}>
                    {/* Remove button */}
                    <button onClick={() => removeItem(item.id)}
                      style={{
                        position: "absolute", top: "0.6rem", right: "0.6rem", zIndex: 5,
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: "rgba(250,248,245,0.92)", backdropFilter: "blur(4px)",
                        border: "1px solid rgba(184,175,160,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "background 0.2s ease",
                        opacity: hovered === item.id ? 1 : 0,
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.1)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(250,248,245,0.92)")}
                      aria-label="Hapus dari wishlist">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>

                    {/* Discount badge */}
                    {item.origPrice && (
                      <div style={{
                        position: "absolute", top: "0.6rem", left: "0.6rem", zIndex: 5,
                        background: "var(--copper)", color: "white",
                        fontSize: "0.58rem", fontWeight: 700, padding: "0.2rem 0.55rem",
                      }}>
                        -{Math.round((1 - item.price / item.origPrice) * 100)}%
                      </div>
                    )}

                    {/* Image */}
                    <Link href={`/product/${item.id}`} style={{ display: "block" }}>
                      <div style={{ aspectRatio: "1/1", position: "relative", overflow: "hidden", background: "var(--bone)" }}>
                        <Image src={item.img} alt={item.name} fill
                          style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hovered === item.id ? "scale(1.04)" : "scale(1)" }} />
                        {/* Low stock */}
                        {item.stock <= 3 && (
                          <div style={{
                            position: "absolute", bottom: "0.75rem", left: "0.75rem",
                            background: "rgba(220,38,38,0.9)", color: "white",
                            fontSize: "0.6rem", fontWeight: 600, padding: "0.2rem 0.6rem",
                          }}>
                            Sisa {item.stock}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div style={{ padding: "1rem" }}>
                      <p style={{ fontSize: "0.65rem", color: "var(--copper)", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
                        {item.category}
                      </p>
                      <Link href={`/product/${item.id}`}>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.3, marginBottom: "0.4rem" }}>
                          {item.name}
                        </p>
                      </Link>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--charcoal)" }}>
                          {formatRp(item.price)}
                        </p>
                        {item.origPrice && (
                          <p style={{ fontSize: "0.75rem", color: "var(--stone)", textDecoration: "line-through" }}>
                            {formatRp(item.origPrice)}
                          </p>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
                        <Stars n={item.rating} />
                        <p style={{ fontSize: "0.65rem", color: "var(--stone)" }}>Ditambah {item.addedDate}</p>
                      </div>
                      <button onClick={() => addToCart(item.id)}
                        style={{
                          width: "100%", padding: "0.65rem",
                          background: isInCart ? "#16A34A" : "var(--charcoal)",
                          border: "none", color: "var(--cream)",
                          fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 500,
                          letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                          transition: "background 0.25s ease",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                        }}>
                        {isInCart ? (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Ditambahkan</>
                        ) : "Tambah ke Keranjang"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear all */}
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={() => setItems([])}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "0.78rem", color: "var(--stone)", letterSpacing: "0.06em",
                  fontFamily: "var(--font-body)", transition: "color 0.2s ease",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#DC2626")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--stone)")}>
                Kosongkan Wishlist
              </button>
            </div>
          </>
        )}

        {/* ── Recommendations ── */}
        <section style={{ marginTop: "4rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem" }}>
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.4rem" }}>Rekomendasi</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 300, color: "var(--charcoal)" }}>
                Mungkin Anda Suka
              </h2>
            </div>
            <Link href="/koleksi" style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--charcoal-soft)", borderBottom: "1px solid var(--stone-light)", paddingBottom: "2px" }}>
              Lihat Semua
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="rec-grid">
            {RECOMMENDED.map(r => (
              <Link key={r.id} href={`/product/${r.id}`} style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setHoveredRec(r.id)} onMouseLeave={() => setHoveredRec(null)}>
                <div style={{
                  background: "var(--white)", border: "1px solid var(--stone-light)", overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  transform: hoveredRec === r.id ? "translateY(-3px)" : "none",
                  boxShadow: hoveredRec === r.id ? "0 8px 28px rgba(42,38,32,0.1)" : "none",
                }}>
                  <div style={{ aspectRatio: "4/3", position: "relative", background: "var(--bone)", overflow: "hidden" }}>
                    <Image src={r.img} alt={r.name} fill style={{ objectFit: "cover", transform: hoveredRec === r.id ? "scale(1.04)" : "scale(1)", transition: "transform 0.5s ease" }} />
                  </div>
                  <div style={{ padding: "0.9rem 1rem" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.35rem" }}>{r.name}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--charcoal)" }}>{formatRp(r.price)}</p>
                      <Stars n={r.rating} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .wishlist-grid { grid-template-columns: repeat(4, 1fr) !important; }
        .rec-grid      { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 1024px) {
          .wishlist-grid, .rec-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .wishlist-grid, .rec-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
