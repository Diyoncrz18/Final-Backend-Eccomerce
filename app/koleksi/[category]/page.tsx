"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavbarUser from "../../components/NavbarUser";
import { fetchProducts, fetchCategories, getStoredUser, getImageUrl } from "../../../services/api";

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "ruang-tamu": "Ruang Tamu",
  "kamar-tidur": "Kamar Tidur",
  "ruang-makan": "Ruang Makan",
  "kursi": "Kursi",
  "meja": "Meja",
  "lampu": "Lampu",
  "dekorasi": "Dekorasi",
  "penyimpanan": "Penyimpanan",
};

const SORTS = ["Terbaru", "Harga: Rendah ke Tinggi", "Harga: Tinggi ke Rendah", "Paling Populer"];

interface KoleksiProduct {
  id: number;
  name: string;
  img?: string;
  imageUrl?: string;
  tag?: string;
  new?: boolean;
  price?: number;
  salePrice?: number | null;
  memberPrice?: number;
  rating?: number;
  category?: { id?: number; name?: string };
}

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= Math.round(n) ? "var(--copper)" : "var(--stone-light)"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: "0.65rem", color: "var(--stone)", marginLeft: "3px" }}>{n.toFixed(1)}</span>
    </span>
  );
}

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  description?: string;
}

export default function KoleksiCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = use(params);
  const router = useRouter();
  const user = getStoredUser();
  const [activeSort, setActiveSort] = useState("Terbaru");
  const [sortOpen, setSortOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [products, setProducts] = useState<KoleksiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = CATEGORY_SLUG_MAP[categorySlug.toLowerCase()] || categorySlug;
  const currentCategory = categories.find(c => c.name.toLowerCase() === categorySlug.toLowerCase());
  const categoryId = currentCategory?.id;

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchCategories(),
          categoryId ? fetchProducts(0, 50, categoryId) : Promise.resolve([])
        ]);
        if (!active) return;
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadData();
    return () => { active = false; };
  }, [categoryId]);

  const formatPrice = (n: number) =>
    "Rp " + n.toLocaleString("id-ID").replace(/\./g, ".");

  const toggleWish = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const allCategories = [
    { id: "semua", label: "Semua" },
    ...categories.map(c => ({
      id: c.name.toLowerCase().replace(/\s+/g, "-"),
      label: c.name
    }))
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={user} />

      <section
        style={{
          position: "relative",
          height: "340px",
          background: "var(--charcoal)",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Image src="/hero-living.png" alt="Koleksi" fill style={{ objectFit: "cover", opacity: 0.35 }} priority />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(26,23,20,0.85) 0%, rgba(26,23,20,0.2) 60%, transparent 100%)",
          }}
        />
        <div className="container-main" style={{ position: "relative", paddingBottom: "3rem" }}>
          <p style={{ fontSize: "0.7rem", color: "rgba(245,240,232,0.45)", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
            <Link href="/koleksi" style={{ color: "inherit" }}>Koleksi</Link>
            {" / "}
            <span style={{ color: "var(--copper)" }}>{categoryName}</span>
          </p>
          <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>
            {categoryName}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              color: "var(--cream)",
              lineHeight: 1.1,
            }}
          >
            Koleksi <em style={{ fontStyle: "italic" }}>{categoryName}</em>
          </h1>
        </div>
      </section>

      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)", position: "sticky", top: "72px", zIndex: 40 }}>
        <div className="container-main">
          <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
            {allCategories.map(cat => (
              <Link
                key={cat.id}
                href={cat.id === "semua" ? "/koleksi" : `/koleksi/${cat.id}`}
                style={{
                  padding: "1.1rem 1.5rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.78rem",
                  fontWeight: categorySlug.toLowerCase() === cat.id.replace("semua", "") ? 600 : 400,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${categorySlug.toLowerCase() === cat.id.replace("semua", "") ? "var(--copper)" : "transparent"}`,
                  color: categorySlug.toLowerCase() === cat.id.replace("semua", "") ? "var(--copper)" : "var(--charcoal-soft)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main" style={{ padding: "2rem 1.5rem 4rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--stone)" }}>
            Menampilkan <strong style={{ color: "var(--charcoal)" }}>{products.length}</strong> produk
          </p>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--white)",
                border: "1px solid var(--stone-light)",
                padding: "0.6rem 1rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem",
                color: "var(--charcoal)",
                cursor: "pointer",
              }}
            >
              Urutkan: {activeSort}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {sortOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  background: "var(--white)",
                  border: "1px solid var(--stone-light)",
                  boxShadow: "0 8px 24px rgba(42,38,32,0.1)",
                  zIndex: 50,
                  minWidth: "220px",
                }}
              >
                {SORTS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setActiveSort(s); setSortOpen(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "0.75rem 1.25rem",
                      background: s === activeSort ? "var(--bone)" : "none",
                      border: "none",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: s === activeSort ? "var(--copper)" : "var(--charcoal)",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p>Memuat produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "1.1rem", color: "var(--charcoal-soft)" }}>Tidak ada produk dalam kategori ini.</p>
            <Link href="/koleksi" style={{ color: "var(--copper)", marginTop: "1rem", display: "inline-block" }}>
              Lihat semua produk
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="koleksi-grid">
            {products.map(item => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{
                  background: "var(--white)",
                  border: "1px solid var(--stone-light)",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  boxShadow: hovered === item.id ? "0 12px 40px rgba(42,38,32,0.12)" : "none",
                  transform: hovered === item.id ? "translateY(-4px)" : "none",
                }}>
                  <div style={{ aspectRatio: "4/3", position: "relative", background: "var(--bone)", overflow: "hidden" }}>
                    <Image src={getImageUrl(item.imageUrl || item.img)} alt={item.name} fill style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hovered === item.id ? "scale(1.04)" : "scale(1)" }} />
                    {(item.tag || item.new) && (
                      <span style={{
                        position: "absolute", top: "0.75rem", left: "0.75rem",
                        background: item.new ? "var(--copper)" : "var(--charcoal)",
                        color: "var(--cream)", fontSize: "0.58rem", fontWeight: 700,
                        letterSpacing: "0.14em", textTransform: "uppercase", padding: "0.25rem 0.65rem",
                      }}>
                        {item.new ? "Baru" : item.tag}
                      </span>
                    )}
                    <button
                      onClick={e => toggleWish(item.id, e)}
                      style={{
                        position: "absolute", top: "0.75rem", right: "0.75rem",
                        width: "34px", height: "34px", borderRadius: "50%",
                        background: "rgba(250,248,245,0.95)", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: hovered === item.id || wishlist.includes(item.id) ? 1 : 0,
                        transition: "opacity 0.2s ease", lineHeight: 0,
                      }}
                      aria-label="Wishlist"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24"
                        fill={wishlist.includes(item.id) ? "var(--copper)" : "none"}
                        stroke={wishlist.includes(item.id) ? "var(--copper)" : "var(--charcoal)"}
                        strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem",
                      background: "linear-gradient(to top, rgba(42,38,32,0.88) 0%, transparent 100%)",
                      opacity: hovered === item.id ? 1 : 0, transition: "opacity 0.3s ease",
                      display: "flex", justifyContent: "center",
                    }}>
                      <button
                        onClick={e => e.preventDefault()}
                        style={{
                          background: "var(--cream)", border: "none", color: "var(--charcoal)",
                          padding: "0.6rem 1.5rem", fontFamily: "var(--font-body)",
                          fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em",
                          textTransform: "uppercase", cursor: "pointer",
                        }}
                      >
                        + Keranjang
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: "1rem 1.1rem" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.3rem" }}>
                      {item.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.4rem" }}>
                      <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--charcoal)" }}>
                        {formatPrice(item.price ?? 0)}
                      </p>
                      <Stars n={item.rating ?? 0} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button style={{
            background: "transparent", border: "1px solid var(--charcoal)",
            color: "var(--charcoal)", padding: "0.9rem 2.5rem",
            fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
            letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
            transition: "all 0.3s ease",
          }}>
            Muat Lebih Banyak
          </button>
        </div>
      </div>

      <style jsx global>{`
        .koleksi-grid { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 1200px) { .koleksi-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 900px)  { .koleksi-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px)  { .koleksi-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}