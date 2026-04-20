"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarUser from "../components/NavbarUser";

const USER = { name: "Budi Santoso", email: "budi@email.com", tier: "Gold Member", points: 2450 };

const ROOMS = [
  {
    id: "ruang-tamu",
    name: "Ruang Tamu",
    name_en: "Living Room",
    desc: "Ciptakan ruang yang hangat dan mengundang untuk berkumpul bersama keluarga.",
    count: 48,
    img: "/hero-living.png",
    accent: "rgba(196,113,58,0.15)",
    products: ["Bouclé Armchair", "Travertine Coffee Table", "Rattan Pendant Lamp"],
  },
  {
    id: "kamar-tidur",
    name: "Kamar Tidur",
    name_en: "Bedroom",
    desc: "Desain kamar tidur sebagai sanctuary personal Anda — tenang, elegan, dan restoratif.",
    count: 35,
    img: "/hero-bedroom.png",
    accent: "rgba(109,89,76,0.15)",
    products: ["Linen Throw Pillow Set", "Oak Bedside Table", "Japandi Floor Lamp"],
  },
  {
    id: "ruang-makan",
    name: "Ruang Makan",
    name_en: "Dining Room",
    desc: "Jadikan momen makan bersama lebih berkesan dengan furnitur yang tepat dan estetik.",
    count: 29,
    img: "/hero-living.png",
    accent: "rgba(42,38,32,0.1)",
    products: ["Oak Dining Table", "Velvet Dining Chair", "Ceramic Centerpiece"],
  },
  {
    id: "dapur",
    name: "Dapur & Bar",
    name_en: "Kitchen & Bar",
    desc: "Transformasi dapur menjadi ruang kreatif yang fungsional sekaligus menawan.",
    count: 22,
    img: "/hero-bedroom.png",
    accent: "rgba(196,113,58,0.1)",
    products: ["Marble Bar Stool", "Copper Pendant Light", "Ceramic Canister Set"],
  },
  {
    id: "kamar-mandi",
    name: "Kamar Mandi",
    name_en: "Bathroom",
    desc: "Ubah ritual harian menjadi pengalaman spa mewah di dalam rumah Anda.",
    count: 18,
    img: "/hero-living.png",
    accent: "rgba(109,89,76,0.12)",
    products: ["Travertine Soap Dish", "Bamboo Bath Mat", "Stone Diffuser"],
  },
  {
    id: "teras",
    name: "Teras & Outdoor",
    name_en: "Terrace & Outdoor",
    desc: "Perpanjang estetika interior ke ruang luar dengan koleksi outdoor pilihan kami.",
    count: 15,
    img: "/hero-bedroom.png",
    accent: "rgba(42,38,32,0.08)",
    products: ["Teak Lounge Chair", "Rattan Side Table", "Solar Garden Lamp"],
  },
];

const INSPIRATIONS = [
  { title: "Japandi Minimalism", subtitle: "Perpaduan Jepang & Skandinavia", img: "/hero-living.png", tag: "Tren 2025" },
  { title: "Warm Earthy Tones", subtitle: "Nuansa Bumi yang Hangat", img: "/hero-bedroom.png", tag: "Editor's Pick" },
  { title: "Modern Mediterranean", subtitle: "Estetika Mediterania Kontemporer", img: "/hero-living.png", tag: "Koleksi Baru" },
];

export default function RuanganPage() {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [hoveredInspir, setHoveredInspir] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={USER} />

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
              { num: "167+", label: "Produk Tersedia" },
              { num: "6", label: "Kategori Ruangan" },
              { num: "12", label: "Gaya Desain" },
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
            {ROOMS.map(room => (
              <Link
                key={room.id}
                href={`/ruangan/${room.id}`}
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
                    <Image src={room.img} alt={room.name} fill style={{
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
                        {room.name_en}
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
                    <p style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", lineHeight: 1.7, marginBottom: "1rem" }}>
                      {room.desc}
                    </p>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                      {room.products.map(p => (
                        <span key={p} style={{
                          padding: "0.2rem 0.65rem", background: "var(--bone)",
                          fontSize: "0.62rem", color: "var(--charcoal-soft)", letterSpacing: "0.06em",
                        }}>
                          {p}
                        </span>
                      ))}
                    </div>
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
                  <Image src={item.img} alt={item.title} fill style={{
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
