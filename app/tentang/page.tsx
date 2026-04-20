"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarUser from "../components/NavbarUser";

const USER = { name: "Budi Santoso", email: "budi@email.com", tier: "Gold Member", points: 2450 };

const VALUES = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: "Kualitas Tanpa Kompromi",
    desc: "Setiap produk melewati inspeksi ketat oleh tim quality control kami sebelum sampai ke tangan Anda. Kami tidak mengirimkan sesuatu yang tidak akan kami letakkan di rumah kami sendiri.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    title: "Desain yang Bermakna",
    desc: "Kami percaya bahwa rumah adalah ekspresi paling jujur dari diri Anda. Setiap koleksi kami dirancang untuk mencerminkan kepribadian, bukan sekadar mengikuti tren.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 22c-4.97 0-9-2.24-9-5v-4c0-2.76 4.03-5 9-5s9 2.24 9 5v4c0 2.76-4.03 5-9 5z"/><ellipse cx="12" cy="8" rx="9" ry="5"/></svg>,
    title: "Keberlanjutan",
    desc: "Mulai 2024, 80% material kami bersumber dari pemasok bersertifikat ramah lingkungan. Kami berkomitmen untuk mencapai rantai pasokan 100% berkelanjutan pada 2030.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: "Komunitas Pengrajin",
    desc: "Kami bermitra dengan lebih dari 120 pengrajin lokal di Jawa, Bali, dan Sumatera. Setiap pembelian Anda mendukung mata pencaharian dan pelestarian kerajinan tradisional Indonesia.",
  },
];

const TIMELINE = [
  { year: "2018", title: "Didirikan di Bandung", desc: "Maison lahir dari hasrat dua desainer interior akan produk rumah berkualitas yang sulit ditemukan di pasar lokal." },
  { year: "2019", title: "Toko Pertama Dibuka", desc: "Showroom pertama dibuka di Dago, Bandung, dengan koleksi perdana 42 produk pilihan." },
  { year: "2021", title: "Ekspansi ke Jakarta", desc: "Showroom kedua hadir di Kemang, Jakarta Selatan, melayani lebih dari 500 pelanggan di bulan pertama." },
  { year: "2023", title: "Maison Online Diluncurkan", desc: "Platform digital kami hadir, menjangkau pelanggan di seluruh Indonesia dengan pengiriman white-glove service." },
  { year: "2024", title: "10.000+ Pelanggan", desc: "Mencapai milestone 10.000 pelanggan setia dan meluncurkan program loyalty Maison Member." },
  { year: "2025", title: "Koleksi Eksklusif", desc: "Late Spring Collection — koleksi terbesar dengan 50+ produk terinspirasi estetika Japandi dan Mediterania." },
];

const STATS = [
  { num: "10,000+", label: "Pelanggan Setia" },
  { num: "500+", label: "Produk Dikurasi" },
  { num: "120+", label: "Pengrajin Mitra" },
  { num: "7", label: "Tahun Berpengalaman" },
];

const PRESS = [
  { name: "Kompas Lifestyle", quote: "\"Maison mendefinisikan ulang standar interior premium Indonesia.\"" },
  { name: "Interior+ Magazine", quote: "\"Koleksi yang mampu menyeimbangkan fungsi dan estetika dengan sempurna.\"" },
  { name: "Forbes Indonesia", quote: "\"Salah satu brand lokal paling menjanjikan di segmen home living.\"" },
];

export default function TentangPage() {
  const [activeValue, setActiveValue] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={USER} />

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: "560px",
          background: "var(--charcoal)",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Image src="/hero-living.png" alt="Tentang Maison" fill style={{ objectFit: "cover", opacity: 0.25 }} priority />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(26,23,20,0.95) 0%, rgba(26,23,20,0.4) 50%, transparent 100%)",
        }} />
        {/* Decorative element */}
        <div style={{
          position: "absolute", top: "30%", right: "8%",
          fontFamily: "var(--font-display)", fontSize: "clamp(8rem, 18vw, 16rem)",
          fontWeight: 300, color: "rgba(245,240,232,0.04)", letterSpacing: "0.1em",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
        }}>
          M
        </div>

        <div className="container-main" style={{ position: "relative", paddingBottom: "5rem" }}>
          <p style={{ fontSize: "0.7rem", color: "rgba(245,240,232,0.45)", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Beranda</Link>
            {" / "}
            <span style={{ color: "var(--copper)" }}>Tentang</span>
          </p>
          <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.75rem" }}>
            Cerita Kami
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            fontWeight: 300, color: "var(--cream)", lineHeight: 1, marginBottom: "1.5rem",
          }}>
            Rumah Anda,<br />
            <em style={{ fontStyle: "italic" }}>Inspirasi Kami.</em>
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(245,240,232,0.55)", maxWidth: "560px", lineHeight: 1.8, fontWeight: 300 }}>
            Kami membangun Maison dengan satu keyakinan: setiap orang berhak tinggal di ruang yang indah, bermakna, dan terasa seperti rumah yang sesungguhnya.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)" }}>
        <div className="container-main">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="about-stats">
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: "2.5rem 1.5rem", textAlign: "center",
                borderRight: i < 3 ? "1px solid var(--stone-light)" : "none",
              }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, color: "var(--copper)", lineHeight: 1, marginBottom: "0.4rem" }}>
                  {s.num}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--stone)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>

        {/* ── Brand Story ── */}
        <section style={{ marginBottom: "7rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="story-grid">
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.75rem" }}>Asal Usul</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 3rem)", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.15, marginBottom: "1.75rem" }}>
                Lahir dari Kebutuhan,<br />Tumbuh dari Cinta
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--charcoal-soft)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
                Maison dimulai pada 2018 oleh dua sahabat lama — seorang arsitek dan seorang fotografer — yang frustrasi tidak bisa menemukan furnitur berkualitas dengan desain yang sesungguhnya mereka cintai di pasar Indonesia.
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--charcoal-soft)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
                Kami memulai dengan 42 produk, satu showroom kecil di Bandung, dan sebuah janji: tidak akan pernah mengorbankan kualitas demi margin. Tujuh tahun kemudian, janji itu masih kami pegang.
              </p>
              <p style={{ fontSize: "0.9rem", color: "var(--charcoal-soft)", lineHeight: 1.9 }}>
                Hari ini, Maison hadir di Jakarta, Bandung, dan platform digital — melayani lebih dari 10.000 pelanggan yang percaya bahwa belajar hidup lebih indah dimulai dari rumah.
              </p>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
                <Image src="/hero-bedroom.png" alt="Maison Story" fill style={{ objectFit: "cover" }} />
              </div>
              {/* Floating quote */}
              <div style={{
                position: "absolute", bottom: "-2rem", left: "-2rem",
                background: "var(--bone)", border: "1px solid var(--stone-light)",
                padding: "1.5rem", maxWidth: "260px",
                boxShadow: "0 8px 32px rgba(42,38,32,0.1)",
              }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontStyle: "italic", color: "var(--charcoal)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                  "Kami tidak menjual furnitur. Kami menjual rumah yang lebih baik."
                </p>
                <p style={{ fontSize: "0.7rem", color: "var(--copper)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  — Andi Pratama, Co-Founder
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section style={{ marginBottom: "7rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.75rem" }}>Prinsip Kami</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 3rem)", fontWeight: 300, color: "var(--charcoal)" }}>
              Yang Kami Percaya
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }} className="values-grid">
            {VALUES.map((v, i) => (
              <div
                key={i}
                style={{
                  background: "var(--white)",
                  border: `1px solid ${activeValue === i ? "var(--copper)" : "var(--stone-light)"}`,
                  padding: "2rem 2.25rem",
                  cursor: "default",
                  transition: "all 0.3s ease",
                  boxShadow: activeValue === i ? "0 8px 28px rgba(196,113,58,0.1)" : "none",
                }}
                onMouseEnter={() => setActiveValue(i)}
                onMouseLeave={() => setActiveValue(null)}
              >
                <span style={{ display: "block", color: "var(--copper)", lineHeight: 0, marginBottom: "1.25rem" }}>
                  {v.icon}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.75rem" }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)", lineHeight: 1.8 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline ── */}
        <section style={{ marginBottom: "7rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.75rem" }}>Perjalanan</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 3rem)", fontWeight: 300, color: "var(--charcoal)" }}>
              Sejarah Maison
            </h2>
          </div>

          <div style={{ position: "relative" }}>
            {/* Center line */}
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px",
              background: "var(--stone-light)", transform: "translateX(-50%)",
            }} className="hidden-mobile" />

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 1fr",
                    gap: "2rem",
                    alignItems: "center",
                    marginBottom: "3rem",
                  }}
                  className="timeline-row"
                >
                  {/* Left */}
                  <div style={{ textAlign: i % 2 === 0 ? "right" : "left", gridColumn: i % 2 === 0 ? 1 : 3 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.4rem" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", lineHeight: 1.7 }}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Center year */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", gridColumn: 2 }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "50%",
                      background: "var(--copper)", display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 1,
                    }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--white)", letterSpacing: "0.05em" }}>
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {/* Right (placeholder for alternating layout) */}
                  <div style={{ gridColumn: i % 2 === 0 ? 3 : 1 }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Press ── */}
        <section style={{ marginBottom: "7rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.75rem" }}>Liputan</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 3rem)", fontWeight: 300, color: "var(--charcoal)" }}>
              Kata Media Tentang Kami
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="press-grid">
            {PRESS.map(p => (
              <div key={p.name} style={{
                background: "var(--white)", border: "1px solid var(--stone-light)",
                padding: "2rem 1.75rem",
              }}>
                {/* Quote mark */}
                <p style={{ fontFamily: "var(--font-display)", fontSize: "4rem", color: "var(--copper)", lineHeight: 0.5, marginBottom: "1.25rem", opacity: 0.4 }}>
                  "
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontStyle: "italic", color: "var(--charcoal)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  {p.quote.replace(/"/g, "")}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "28px", height: "1px", background: "var(--copper)" }} />
                  <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--charcoal-soft)" }}>
                    {p.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section>
          <div style={{
            background: "var(--charcoal)", padding: "5rem 4rem",
            display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem",
            alignItems: "center", position: "relative", overflow: "hidden",
          }} className="cta-grid">
            <div style={{
              position: "absolute", right: "-5%", top: "-30%",
              width: "350px", height: "350px", borderRadius: "50%",
              background: "rgba(196,113,58,0.08)", pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 3rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.15, marginBottom: "1rem" }}>
                Siap Mendekorasi<br />
                <em style={{ fontStyle: "italic", color: "var(--copper)" }}>Rumah Impian</em> Anda?
              </h2>
              <p style={{ fontSize: "0.88rem", color: "rgba(245,240,232,0.55)", lineHeight: 1.7 }}>
                Mulai perjalanan Anda bersama Maison — dari koleksi furnitur hingga konsultasi desain gratis.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative" }}>
              <Link href="/koleksi" style={{
                display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "0.5rem",
                background: "var(--copper)", color: "var(--cream)", padding: "1rem 2rem",
                fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
                letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "#a8561e")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--copper)")}
              >
                Jelajahi Koleksi
              </Link>
              <Link href="/dashboard/consult" style={{
                display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "0.5rem",
                background: "transparent", color: "rgba(245,240,232,0.6)",
                border: "1px solid rgba(245,240,232,0.2)", padding: "1rem 2rem",
                fontFamily: "var(--font-body)", fontSize: "0.78rem",
                letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--copper)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--copper)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,240,232,0.2)";
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.6)";
              }}
              >
                Konsultasi Gratis
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .about-stats { grid-template-columns: repeat(4, 1fr) !important; }
        .story-grid  { grid-template-columns: 1fr 1fr !important; }
        .values-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .timeline-row { grid-template-columns: 1fr 80px 1fr !important; }
        .press-grid  { grid-template-columns: repeat(3, 1fr) !important; }
        .cta-grid    { grid-template-columns: 1fr auto !important; }
        @media (max-width: 1024px) {
          .press-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .story-grid  { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .timeline-row { grid-template-columns: 1fr !important; }
          .press-grid  { grid-template-columns: 1fr !important; }
          .cta-grid    { grid-template-columns: 1fr !important; }
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
