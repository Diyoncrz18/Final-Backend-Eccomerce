"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarUser from "../components/NavbarUser";
import { fetchCategories, getImageUrl, getStoredUser } from "../../services/api";

interface Inspiration {
  title: string;
  subtitle: string;
  img: string;
  imageUrl: string;
  tag: string;
}

interface Room {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  count: number;
  img: string;
  imageUrl: string;
}

interface ApiCategory {
  id?: number | string;
  name?: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

const INSPIRATIONS: Inspiration[] = [
  { title: "Japandi Minimalism", subtitle: "Perpaduan Jepang & Skandinavia", img: "/hero-living.png", imageUrl: "/hero-living.png", tag: "Tren 2025" },
  { title: "Warm Earthy Tones", subtitle: "Nuansa Bumi yang Hangat", img: "/hero-bedroom.png", imageUrl: "/hero-bedroom.png", tag: "Editor's Pick" },
  { title: "Modern Mediterranean", subtitle: "Estetika Mediterania Kontemporer", img: "/hero-living.png", imageUrl: "/hero-living.png", tag: "Koleksi Baru" },
];

export default function RuanganPage() {
  const user = getStoredUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [hoveredInspir, setHoveredInspir] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const raw = await fetchCategories();
        if (!active) return;
        const categories: ApiCategory[] = Array.isArray(raw) ? raw : [];
        const mapped: Room[] = categories.map((cat, idx) => ({
          id: cat.id != null ? String(cat.id) : String(idx),
          name: cat.name || "Kategori",
          nameEn: cat.name || "Category",
          desc: cat.description || "Temukan furnitur terbaik untuk ruangan Anda.",
          count: Number(cat.productCount ?? 0),
          img: cat.imageUrl || "/hero-living.png",
          imageUrl: cat.imageUrl || "/hero-living.png",
        }));
        setRooms(mapped);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadData();
    return () => { active = false; };
  }, []);

  const totalProducts = rooms.reduce((s, r) => s + r.count, 0);
  const totalRooms = rooms.length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={user} />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          height: "420px",
          background: "var(--charcoal)",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Image src="/hero-bedroom.png" alt="Ruangan" fill style={{ objectFit: "cover", opacity: 0.3 }} priority />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(26,23,20,0.9) 0%, rgba(26,23,20,0.4) 60%, transparent 100%)",
        }} />
        <div className="container-main" style={{ position: "relative", paddingBottom: "3.5rem" }}>
          <p style={{ fontSize: "0.7rem", color: "rgba(245,240,232,0.45)", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Beranda</Link>
            {" / "}
            <span style={{ color: "var(--copper)" }}>Ruangan</span>
          </p>
          <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>
            Jelajahi Per Ruangan
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            fontWeight: 300, color: "var(--cream)", lineHeight: 1.1, marginBottom: "1rem",
          }}>
            Setiap Ruangan,<br />
            <em style={{ fontStyle: "italic" }}>Cerminan Jiwa</em>
          </h1>
          <p style={{ fontSize: "0.88rem", color: "rgba(245,240,232,0.55)", maxWidth: "480px", lineHeight: 1.7 }}>
            Temukan produk yang dikurasi khusus untuk setiap sudut rumah Anda — dari ruang tamu hingga teras.
          </p>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)" }}>
        <div className="container-main">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="stats-grid">
            {[
              { num: loading ? "…" : `${totalProducts}+`, label: "Produk Tersedia" },
              { num: loading ? "…" : String(totalRooms), label: "Kategori Ruangan" },
              { num: String(INSPIRATIONS.length), label: "Gaya Desain" },
            ].map(s => (
              <div key={s.label} style={{ padding: "1.75rem", textAlign: "center", borderRight: "1px solid var(--stone-light)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, color: "var(--copper)", lineHeight: 1 }}>
                  {s.num}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--stone)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.25rem" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>

        {/* ── Room Categories ── */}
        <section style={{ marginBottom: "5rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>Kategori</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", fontWeight: 300, color: "var(--charcoal)" }}>
              Pilih Ruangan Anda
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="rooms-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i}`} style={{
                  border: "1px solid var(--stone-light)",
                  background: "var(--white)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    aspectRatio: "3/2", background: "var(--bone)",
                    animation: "pulse 1.6s ease-in-out infinite",
                  }} />
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ height: "12px", background: "var(--bone)", marginBottom: "0.6rem", width: "60%" }} />
                    <div style={{ height: "10px", background: "var(--bone)", marginBottom: "0.4rem", width: "100%" }} />
                    <div style={{ height: "10px", background: "var(--bone)", width: "80%" }} />
                  </div>
                </div>
              ))
            ) : rooms.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                padding: "4rem 2rem", textAlign: "center",
                background: "var(--white)", border: "1px solid var(--stone-light)",
              }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.5rem" }}>
                  Belum Ada Kategori
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--stone)" }}>
                  Silakan kembali lagi nanti.
                </p>
              </div>
            ) : rooms.map(room => (
              <Link
                key={room.id}
                href={`/koleksi?kategori=${encodeURIComponent(room.name.toLowerCase())}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <div style={{
                  overflow: "hidden",
                  border: "1px solid var(--stone-light)",
                  transition: "box-shadow 0.35s ease, transform 0.35s ease",
                  boxShadow: hoveredRoom === room.id ? "0 16px 48px rgba(42,38,32,0.15)" : "none",
                  transform: hoveredRoom === room.id ? "translateY(-5px)" : "none",
                }}>
                  {/* Image */}
                  <div style={{ position: "relative", aspectRatio: "3/2", overflow: "hidden", background: "var(--charcoal)" }}>
                    <Image src={getImageUrl(room.imageUrl || room.img)} alt={room.name} fill style={{
                      objectFit: "cover",
                      opacity: 0.75,
                      transition: "transform 0.6s ease, opacity 0.3s ease",
                      transform: hoveredRoom === room.id ? "scale(1.06)" : "scale(1)",
                    }} />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(26,23,20,0.75) 0%, rgba(26,23,20,0.1) 60%, transparent 100%)",
                    }} />
                    {/* Overlay content */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem" }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--copper)", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                        {room.nameEn}
                      </p>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1.15 }}>
                        {room.name}
                      </h3>
                    </div>
                    {/* Product count badge */}
                    <div style={{
                      position: "absolute", top: "1rem", right: "1rem",
                      background: "rgba(250,248,245,0.15)", backdropFilter: "blur(8px)",
                      border: "1px solid rgba(245,240,232,0.2)",
                      padding: "0.3rem 0.8rem",
                    }}>
                      <span style={{ fontSize: "0.68rem", color: "var(--cream)", letterSpacing: "0.08em" }}>
                        {room.count} produk
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{
                    padding: "1.5rem 1.5rem 1.25rem",
                    background: "var(--white)",
                    borderTop: `3px solid ${hoveredRoom === room.id ? "var(--copper)" : "transparent"}`,
                    transition: "border-color 0.3s ease",
                  }}>
                    <p style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", lineHeight: 1.7, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {room.desc}
                    </p>
                    <p style={{
                      fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "var(--copper)",
                      display: "flex", alignItems: "center", gap: "0.35rem",
                      opacity: hoveredRoom === room.id ? 1 : 0.6,
                      transition: "opacity 0.2s ease",
                    }}>
                      Jelajahi
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Style Inspirations ── */}
        <section>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>Editorial</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", fontWeight: 300, color: "var(--charcoal)" }}>
                Inspirasi Gaya
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }} className="inspir-grid">
            {INSPIRATIONS.map((item, i) => (
              <Link
                key={i}
                href={`/koleksi?style=${item.title}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setHoveredInspir(i)}
                onMouseLeave={() => setHoveredInspir(null)}
              >
                <div style={{
                  position: "relative", aspectRatio: "3/4", overflow: "hidden",
                  transition: "box-shadow 0.3s ease",
                  boxShadow: hoveredInspir === i ? "0 12px 40px rgba(42,38,32,0.15)" : "none",
                }}>
                  <Image src={getImageUrl(item.img)} alt={item.title} fill style={{
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                    transform: hoveredInspir === i ? "scale(1.06)" : "scale(1)",
                  }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(26,23,20,0.8) 0%, rgba(26,23,20,0.1) 50%, transparent 100%)",
                  }} />
                  <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                    <span style={{
                      background: "var(--copper)", color: "var(--cream)",
                      fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em",
                      textTransform: "uppercase", padding: "0.25rem 0.75rem",
                    }}>
                      {item.tag}
                    </span>
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.75rem 1.5rem" }}>
                    <p style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.6)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                      {item.subtitle}
                    </p>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1.2 }}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .rooms-grid { grid-template-columns: repeat(3, 1fr) !important; }
        .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        .inspir-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (max-width: 1024px) {
          .rooms-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .inspir-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .rooms-grid, .inspir-grid, .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
