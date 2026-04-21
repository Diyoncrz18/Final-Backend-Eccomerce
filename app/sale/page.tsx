"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarUser from "../components/NavbarUser";
import { fetchProducts } from "../../services/api";

function getStoredUser() {
  if (typeof window === 'undefined') return { name: "Guest", email: "", tier: "Bronze", points: 0 };
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : { name: "Guest", email: "", tier: "Bronze", points: 0 };
}

// Sale ends: 3 days from now
const SALE_END = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, SALE_END.getTime() - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({ d, h, m, s });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {[
        { val: pad(time.d), label: "Hari" },
        { val: pad(time.h), label: "Jam" },
        { val: pad(time.m), label: "Menit" },
        { val: pad(time.s), label: "Detik" },
      ].map((t, i) => (
        <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              background: "rgba(245,240,232,0.12)",
              border: "1px solid rgba(245,240,232,0.2)",
              padding: "0.5rem 0.85rem",
              minWidth: "52px",
            }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1 }}>
                {t.val}
              </p>
            </div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,240,232,0.45)", marginTop: "0.3rem" }}>
              {t.label}
            </p>
          </div>
          {i < 3 && <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "rgba(245,240,232,0.4)", marginBottom: "1.2rem" }}>:</p>}
        </div>
      ))}
    </div>
  );
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function SalePage() {
  const user = getStoredUser();
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(0, 20);
        const saleProducts = data.filter((p: any) => p.salePrice);
        setProducts(saleProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          orig: Number(p.price),
          sale: Number(p.salePrice),
          disc: Math.round((1 - Number(p.salePrice) / Number(p.price)) * 100),
          img: p.imageUrl || "/product-chair.png",
          cat: p.category?.name || "Furniture",
          rating: Number(p.rating) || 4.5,
          stock: p.stock || 0,
        })));
      } catch (error) {
        console.error("Failed to load sale products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filters = ["semua", "kursi", "meja", "lampu", "dekorasi"];
  const filtered = products.filter(p =>
    activeFilter === "semua" || p.cat.toLowerCase() === activeFilter
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={user} />

      {/* ── Hero Banner ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1714 0%, #2d1f0e 60%, #1a1714 100%)",
          paddingTop: "8rem",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(196,113,58,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-5%", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(196,113,58,0.05)", pointerEvents: "none" }} />

        <div className="container-main" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "center" }} className="sale-hero-grid">
            <div>
              <p style={{ fontSize: "0.7rem", color: "rgba(245,240,232,0.45)", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>
                <Link href="/dashboard" style={{ color: "inherit" }}>Beranda</Link>
                {" / "}
                <span style={{ color: "var(--copper)" }}>Sale</span>
              </p>

              {/* Sale badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
                <span style={{
                  background: "var(--copper)", color: "var(--white)",
                  padding: "0.35rem 1rem", fontSize: "0.68rem", fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                }}>
                  Hingga 30% Off
                </span>
                <span style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.5)", letterSpacing: "0.1em" }}>
                  Stok Terbatas
                </span>
              </div>

              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 300, color: "var(--cream)", lineHeight: 1, marginBottom: "1.25rem",
              }}>
                End of Season
                <br />
                <em style={{ fontStyle: "italic", color: "var(--copper)" }}>Sale</em>
              </h1>

              <p style={{ fontSize: "0.9rem", color: "rgba(245,240,232,0.55)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "480px" }}>
                Dapatkan furnitur dan dekorasi pilihan Maison dengan harga spesial. Koleksi premium, kualitas tetap prima.
              </p>

              <Link
                href="#sale-products"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.6rem",
                  background: "var(--copper)", color: "var(--cream)",
                  padding: "1rem 2rem", fontFamily: "var(--font-body)",
                  fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.15em",
                  textTransform: "uppercase", transition: "background 0.3s ease",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "#a8561e")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--copper)")}
              >
                Belanja Sekarang
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Countdown */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--copper)", marginBottom: "1.25rem" }}>
                Sale Berakhir Dalam
              </p>
              <Countdown />
            </div>
          </div>
        </div>
      </section>

      {/* ── Member Exclusive Strip ── */}
      <div style={{
        background: "linear-gradient(90deg, var(--copper-dark), var(--copper))",
        padding: "0.85rem 0",
      }}>
        <div className="container-main">
          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--cream)", letterSpacing: "0.1em" }}>
            ✦ Member Gold & Platinum mendapatkan tambahan diskon <strong>5%</strong> untuk semua item sale ✦
          </p>
        </div>
      </div>

      {/* ── Flash Sale ── */}
      <section style={{ background: "var(--charcoal)", padding: "4rem 0" }}>
        <div className="container-main">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <p className="text-label" style={{ color: "var(--copper)" }}>Flash Sale</p>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--cream)" }}>
                Penawaran Kilat
              </h2>
            </div>
            <span style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.45)", border: "1px solid rgba(245,240,232,0.15)", padding: "0.35rem 0.85rem" }}>
              Stok sangat terbatas
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }} className="flash-grid">
            {(products.length > 0 ? products.slice(0, 4) : []).map(item => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setHovered(item.id * 10)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{
                  background: "rgba(245,240,232,0.05)",
                  border: "1px solid rgba(245,240,232,0.1)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  transform: hovered === item.id * 10 ? "translateY(-4px)" : "none",
                  boxShadow: hovered === item.id * 10 ? "0 12px 32px rgba(0,0,0,0.3)" : "none",
                }}>
                  <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover", opacity: 0.85 }} />
                    {/* Discount badge */}
                    <div style={{
                      position: "absolute", top: "0.75rem", left: "0.75rem",
                      background: "var(--copper)", color: "var(--white)",
                      fontSize: "0.72rem", fontWeight: 700, padding: "0.3rem 0.75rem",
                    }}>
                      -{item.disc}%
                    </div>
                    {/* Stock warning */}
                    {item.stock <= 3 && (
                      <div style={{
                        position: "absolute", bottom: "0.75rem", left: "0.75rem",
                        background: "rgba(220,38,38,0.9)", color: "white",
                        fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em",
                        padding: "0.2rem 0.6rem",
                      }}>
                        Sisa {item.stock}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--cream)", marginBottom: "0.5rem" }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.35)", textDecoration: "line-through", marginBottom: "0.15rem" }}>
                      {formatRp(item.orig)}
                    </p>
                    <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--copper)" }}>
                      {formatRp(item.sale)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Sale Products ── */}
      <div id="sale-products" style={{ background: "var(--bone)" }}>
        <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
          {/* Filter */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem" }}>
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>Semua Produk Sale</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
                Pilihan Terbaik
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "0.5rem 1.25rem",
                  background: activeFilter === f ? "var(--charcoal)" : "var(--white)",
                  border: "1px solid var(--stone-light)",
                  color: activeFilter === f ? "var(--cream)" : "var(--charcoal-soft)",
                  fontFamily: "var(--font-body)", fontSize: "0.75rem",
                  letterSpacing: "0.08em", textTransform: "capitalize",
                  cursor: "pointer", transition: "all 0.2s ease",
                  fontWeight: activeFilter === f ? 500 : 400,
                }}
              >
                {f === "semua" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="sale-grid">
            {filtered.map(item => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{
                  background: "var(--white)", border: "1px solid var(--stone-light)", overflow: "hidden",
                  transition: "all 0.3s ease",
                  transform: hovered === item.id ? "translateY(-4px)" : "none",
                  boxShadow: hovered === item.id ? "0 12px 36px rgba(42,38,32,0.12)" : "none",
                }}>
                  <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "var(--bone)" }}>
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} />
                    <div style={{
                      position: "absolute", top: "0.75rem", left: "0.75rem",
                      background: "var(--copper)", color: "var(--white)",
                      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em",
                      padding: "0.25rem 0.65rem",
                    }}>
                      -{item.disc}%
                    </div>
                    {item.stock <= 3 && (
                      <div style={{
                        position: "absolute", bottom: "0.75rem", left: "0.75rem",
                        background: "rgba(220,38,38,0.9)", color: "white",
                        fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em",
                        padding: "0.2rem 0.6rem",
                      }}>
                        Sisa {item.stock}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1rem 1.1rem" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.35rem" }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "var(--stone)", textDecoration: "line-through", marginBottom: "0.15rem" }}>
                      {formatRp(item.orig)}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--copper)" }}>
                        {formatRp(item.sale)}
                      </p>
                      <span style={{ fontSize: "0.68rem", color: "var(--stone)" }}>{item.cat}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .sale-hero-grid { grid-template-columns: 1fr auto !important; }
        .flash-grid { grid-template-columns: repeat(4, 1fr) !important; }
        .sale-grid { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 1024px) {
          .flash-grid, .sale-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .sale-hero-grid { grid-template-columns: 1fr !important; }
          .flash-grid, .sale-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .flash-grid, .sale-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
