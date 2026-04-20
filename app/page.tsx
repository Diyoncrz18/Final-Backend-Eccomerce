"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ============================================================
   DATA
   ============================================================ */
const HERO_SLIDES = [
  {
    id: 0,
    image: "/hero-living.png",
    label: "Koleksi Utama",
    headline: ["Ruang", "yang Berbicara"],
    sub: "Living Collection 2025",
    cta: "Eksplorasi Koleksi",
    href: "#featured-products",
  },
  {
    id: 1,
    image: "/hero-bedroom.png",
    label: "Sanctuary Series",
    headline: ["Kamar", "Impian Anda"],
    sub: "Bedroom Collection",
    cta: "Lihat Koleksi",
    href: "#categories",
  },
  {
    id: 2,
    image: "/hero-dining.png",
    label: "Dining Edition",
    headline: ["Momen", "Bersama"],
    sub: "Dining Collection",
    cta: "Temukan Lebih",
    href: "#trust",
  },
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Boucle Cloud Sofa",
    category: "Ruang Tamu",
    price: 28_500_000,
    image: "/product-sofa.png",
    tag: "Terlaris",
    tagColor: "var(--copper)",
  },
  {
    id: "p2",
    name: "Rattan Glow Lamp",
    category: "Pencahayaan",
    price: 6_200_000,
    image: "/product-lamp.png",
    tag: "Baru",
    tagColor: "var(--charcoal)",
  },
  {
    id: "p3",
    name: "Travertine Side Table",
    category: "Meja",
    price: 12_800_000,
    image: "/product-table.png",
    tag: "Eksklusif",
    tagColor: "var(--copper-dark)",
  },
  {
    id: "p4",
    name: "Linen Curve Chair",
    category: "Kursi",
    price: 9_400_000,
    image: "/product-chair.png",
    tag: null,
    tagColor: "",
  },
];

const CATEGORIES = [
  { name: "Ruang Tamu", image: "/hero-living.png", count: 84 },
  { name: "Kamar Tidur", image: "/hero-bedroom.png", count: 67 },
  { name: "Ruang Makan", image: "/hero-dining.png", count: 42 },
];

const MARQUEE_ITEMS = [
  "Pengiriman Gratis se-Jawa",
  "Garansi 3 Tahun",
  "Konsultasi Desain Gratis",
  "Material Premium",
  "Handcrafted",
  "Cicilan 0%",
];

/* ============================================================
   UTILITY
   ============================================================ */
function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

/* ============================================================
   SECTION: HERO SLIDER
   ============================================================ */
function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((current + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const slide = HERO_SLIDES[current];

  return (
    <section
      id="hero"
      aria-label="Hero section"
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "640px",
        overflow: "hidden",
        background: "var(--charcoal)",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: transitioning ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        <Image
          src={slide.image}
          alt={slide.headline.join(" ")}
          fill
          style={{ objectFit: "cover" }}
          priority
          sizes="100vw"
        />
        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(26,23,20,0.72) 0%, rgba(26,23,20,0.3) 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="container-main"
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "clamp(3rem, 8vw, 7rem)",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? "translateY(20px)" : "translateY(0)",
            transition: "all 0.5s ease",
          }}
        >
          {/* Label */}
          <p
            className="text-label animate-fade-up"
            style={{
              color: "rgba(245,240,232,0.7)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ display: "inline-block", width: "2rem", height: "1px", background: "rgba(245,240,232,0.5)" }} />
            {slide.label}
          </p>

          {/* Headline */}
          <h1
            className="display-hero animate-fade-up delay-100"
            style={{ color: "var(--cream)", marginBottom: "1.75rem" }}
          >
            {slide.headline[0]}
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>{slide.headline[1]}</em>
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              color: "rgba(245,240,232,0.65)",
              marginBottom: "2.5rem",
              textTransform: "uppercase",
            }}
          >
            {slide.sub}
          </p>

          {/* CTA */}
          <div
            className="animate-fade-up delay-300"
            style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
          >
            <Link href={slide.href} className="btn-primary" id={`hero-cta-${slide.id}`}>
              <span>{slide.cta}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/koleksi"
              style={{
                color: "rgba(245,240,232,0.7)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(245,240,232,0.4)",
                paddingBottom: "2px",
                transition: "all 0.3s ease",
              }}
            >
              Semua Koleksi
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div
          style={{
            position: "absolute",
            right: "clamp(1.5rem, 5vw, 5rem)",
            bottom: "clamp(3rem, 8vw, 7rem)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              id={`hero-dot-${i}`}
              style={{
                width: i === current ? "2px" : "2px",
                height: i === current ? "2.5rem" : "1rem",
                background:
                  i === current ? "var(--cream)" : "rgba(245,240,232,0.35)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.4s ease",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "1.75rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            color: "rgba(245,240,232,0.5)",
          }}
        >
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Scroll</p>
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, rgba(245,240,232,0.5), transparent)",
              animation: "fadeIn 2s ease infinite alternate",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION: MARQUEE STRIP
   ============================================================ */
function MarqueeSection() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      style={{
        background: "var(--copper)",
        padding: "0.85rem 0",
        overflow: "hidden",
        position: "relative",
      }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--cream)",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {item}
            <span style={{ opacity: 0.5 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SECTION: FEATURED PRODUCTS
   ============================================================ */
function ProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  const [wished, setWished] = useState(false);

  return (
    <article
      className="product-card"
      style={{ cursor: "pointer" }}
      aria-label={product.name}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={750}
          className="product-card-img"
          style={{ display: "block" }}
        />

        {/* Tag badge */}
        {product.tag && (
          <span
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              padding: "0.3rem 0.75rem",
              background: product.tagColor,
              color: "var(--white)",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWished(!wished)}
          aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          id={`wishlist-${product.id}`}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            background: "rgba(250,248,245,0.9)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            transition: "all 0.25s ease",
            transform: wished ? "scale(1.1)" : "scale(1)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "var(--copper)" : "none"} stroke={wished ? "var(--copper)" : "var(--charcoal)"} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Hover overlay — Add to cart */}
        <div className="product-card-overlay">
          <button
            id={`add-cart-${product.id}`}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "var(--cream)",
              border: "none",
              color: "var(--charcoal)",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.25s ease",
            }}
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "1.25rem 1rem 1.5rem" }}>
        <p className="text-label" style={{ marginBottom: "0.4rem" }}>
          {product.category}
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 400,
            color: "var(--charcoal)",
            marginBottom: "0.6rem",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 400,
            color: "var(--copper)",
          }}
        >
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}

function FeaturedProductsSection() {
  return (
    <section
      id="featured-products"
      className="section"
      style={{ background: "var(--bone)" }}
      aria-labelledby="featured-heading"
    >
      <div className="container-main">
        {/* Heading */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "var(--space-xl)",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="text-label" style={{ marginBottom: "0.75rem" }}>Pilihan Terbaik</p>
            <h2 className="display-xl" id="featured-heading">
              Koleksi<br />
              <em style={{ fontStyle: "italic" }}>Terkurasi</em>
            </h2>
          </div>
          <Link href="#categories" className="btn-ghost" id="view-all-products">
            Lihat Kategori
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}
          className="products-grid"
        >
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px)  { .products-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ============================================================
   SECTION: EDITORIAL BANNER
   ============================================================ */
function EditorialBanner() {
  return (
    <section
      id="editorial"
      aria-labelledby="editorial-heading"
      style={{
        background: "var(--cream-deep)",
        overflow: "hidden",
      }}
    >
      <div
        className="container-main editorial-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "560px",
          alignItems: "stretch",
        }}
      >
        {/* Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "var(--space-3xl) var(--space-xl) var(--space-3xl) 0",
          }}
          className="editorial-text"
        >
          <p className="text-label" style={{ marginBottom: "1.5rem" }}>Filosofi Kami</p>
          <h2
            className="display-lg"
            id="editorial-heading"
            style={{ marginBottom: "1.75rem" }}
          >
            Ruang yang{" "}
            <em style={{ fontStyle: "italic", color: "var(--copper)" }}>menginspirasi</em>{" "}
            setiap hari
          </h2>
          <p
            className="text-body"
            style={{ marginBottom: "2.5rem", maxWidth: "400px" }}
          >
             Kami percaya bahwa interior yang baik bukan hanya soal estetika —
             ini tentang menciptakan ruang yang merefleksikan kepribadian Anda,
             mendukung gaya hidup, dan membuat setiap momen di rumah terasa
             bermakna.
          </p>
          <a href="#featured-products" className="btn-outline" id="editorial-cta" style={{ alignSelf: "flex-start" }}>
            Mulai Belanja
          </a>
        </div>

        {/* Image */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "400px",
          }}
          className="editorial-img"
        >
          <Image
            src="/hero-bedroom.png"
            alt="Filosofi desain Maison"
            fill
            style={{ objectFit: "cover" }}
            sizes="50vw"
          />
          {/* Accent number */}
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "2rem",
              fontFamily: "var(--font-display)",
              fontSize: "6rem",
              fontWeight: 300,
              color: "rgba(245,240,232,0.25)",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            12
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "2rem",
              color: "var(--cream)",
            }}
          >
            <p className="text-label" style={{ color: "rgba(245,240,232,0.7)" }}>
              Tahun Pengalaman
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .editorial-grid { grid-template-columns: 1fr !important; }
          .editorial-text { padding: var(--space-xl) 0 !important; }
          .editorial-img  { min-height: 320px !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   SECTION: CATEGORIES
   ============================================================ */
function CategoriesSection() {
  return (
    <section
      id="categories"
      className="section"
      style={{ background: "var(--white)" }}
      aria-labelledby="categories-heading"
    >
      <div className="container-main">
        <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <p className="text-label" style={{ marginBottom: "0.75rem" }}>Jelajahi</p>
          <h2 className="display-xl" id="categories-heading">
            Per{" "}
            <em style={{ fontStyle: "italic" }}>Ruangan</em>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
          className="categories-grid"
        >
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              href={`/koleksi/${cat.name.toLowerCase().replace(/ /g, "-")}`}
              id={`category-${i}`}
              style={{
                position: "relative",
                display: "block",
                overflow: "hidden",
                aspectRatio: i === 0 ? "3/4" : "4/5",
                cursor: "pointer",
              }}
              className="category-card"
              aria-label={`Kategori ${cat.name}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                style={{ objectFit: "cover", transition: "transform 0.7s ease" }}
                sizes="33vw"
                className="cat-img"
              />
              {/* overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(26,23,20,0.65) 0%, rgba(26,23,20,0.1) 50%, transparent 100%)",
                  transition: "opacity 0.4s ease",
                }}
              />
              {/* label */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.75rem",
                  left: "1.75rem",
                }}
              >
                <p
                  className="text-label"
                  style={{ color: "rgba(245,240,232,0.65)", marginBottom: "0.4rem" }}
                >
                  {cat.count} Produk
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.75rem",
                    fontWeight: 300,
                    color: "var(--cream)",
                  }}
                >
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .category-card:hover .cat-img { transform: scale(1.05); }
        @media (max-width: 768px) { .categories-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 1024px) and (min-width: 769px) { .categories-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

/* ============================================================
   SECTION: TRUST STRIP
   ============================================================ */
function TrustSection() {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M5 12h14M12 5l7 7-7 7" />
          <rect x="1" y="3" width="22" height="18" rx="2" />
        </svg>
      ),
      title: "Pengiriman Gratis",
      desc: "Seluruh Jawa & Bali",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Garansi 3 Tahun",
      desc: "Kualitas terjamin",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Konsultasi Gratis",
      desc: "Dengan desainer kami",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      title: "Cicilan 0%",
      desc: "Hingga 24 bulan",
    },
  ];

  return (
    <section
      id="trust"
      style={{
        background: "var(--charcoal)",
        padding: "var(--space-xl) 0",
      }}
      aria-label="Keunggulan Maison"
    >
      <div className="container-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
          }}
          className="trust-grid"
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "2.5rem 2rem",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <span style={{ color: "var(--copper)" }}>{f.icon}</span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    color: "var(--cream)",
                    marginBottom: "0.35rem",
                  }}
                >
                  {f.title}
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--stone)", fontWeight: 300 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) { .trust-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .trust-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ============================================================
   SECTION: TESTIMONIALS
   ============================================================ */
function TestimonialsSection() {
  const testimonials = [
    {
      id: "t1",
      name: "Anisa N.",
      loc: "Jakarta Selatan",
      rating: 5,
      text: "Boucle sofa yang kami beli benar-benar mengubah suasana ruang tamu kami. Kualitasnya luar biasa dan layanan konsultasi sangat membantu.",
    },
    {
      id: "t2",
      name: "Reza P.",
      loc: "Surabaya",
      rating: 5,
      text: "Pengiriman tepat waktu, kemasan aman, dan produk persis seperti di foto. Tim Maison sangat profesional dan ramah.",
    },
    {
      id: "t3",
      name: "Dewi S.",
      loc: "Bandung",
      rating: 5,
      text: "Saya sudah order dua kali dan tidak pernah kecewa. Desain yang timeless dan material premium membuat rumah saya terlihat seperti majalah desain.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="section"
      style={{ background: "var(--cream)" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="container-main">
        <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
          <p className="text-label" style={{ marginBottom: "0.75rem" }}>Dari Pelanggan Kami</p>
          <h2 className="display-xl" id="testimonials-heading">
            Cerita{" "}
            <em style={{ fontStyle: "italic" }}>Nyata</em>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
          className="testimonials-grid"
        >
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              style={{
                background: "var(--white)",
                padding: "2.5rem 2rem",
                boxShadow: "var(--shadow-card)",
                position: "relative",
              }}
            >
              {/* Quote mark */}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "5rem",
                  lineHeight: 1,
                  color: "var(--copper)",
                  opacity: 0.15,
                  position: "absolute",
                  top: "1rem",
                  left: "1.5rem",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                "
              </span>

              {/* Stars */}
              <div style={{ display: "flex", gap: "3px", marginBottom: "1.25rem" }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--copper)">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <p
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: "var(--charcoal-mid)",
                  marginBottom: "1.5rem",
                }}
              >
                {t.text}
              </p>

              <footer
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  borderTop: "1px solid var(--stone-light)",
                  paddingTop: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    background: "var(--cream-deep)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    color: "var(--charcoal-soft)",
                    fontWeight: 400,
                  }}
                  aria-hidden="true"
                >
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--charcoal)" }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--charcoal-soft)" }}>{t.loc}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

/* ============================================================
   SECTION: CTA FINAL
   ============================================================ */
function CtaSection() {
  return (
    <section
      id="cta-final"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "var(--space-3xl) 0",
        background: "var(--charcoal)",
      }}
      aria-labelledby="cta-heading"
    >
      {/* Background image */}
      <div
        style={{ position: "absolute", inset: 0, opacity: 0.2 }}
        aria-hidden="true"
      >
        <Image
          src="/hero-dining.png"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
        />
      </div>

      <div
        className="container-narrow"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <p className="text-label" style={{ color: "var(--copper-light)", marginBottom: "1.5rem" }}>
          Mulai Perjalanan Anda
        </p>
        <h2
          className="display-xl"
          id="cta-heading"
          style={{
            color: "var(--cream)",
            marginBottom: "1.75rem",
          }}
        >
          Wujudkan rumah{" "}
          <em style={{ fontStyle: "italic", color: "var(--copper-light)" }}>impian</em>{" "}
          Anda
        </h2>
        <p
          className="text-body"
          style={{
            color: "var(--stone)",
            marginBottom: "3rem",
            maxWidth: "480px",
            margin: "0 auto 3rem",
          }}
        >
          Bergabunglah dengan ribuan pelanggan yang telah mempercayakan
          transformasi interior rumah mereka kepada Maison.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/daftar" className="btn-primary" id="cta-register">
            <span>Daftar Gratis</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/koleksi" className="btn-outline" id="cta-explore" style={{ borderColor: "var(--stone)", color: "var(--cream)" }}>
            Eksplorasi Koleksi
          </Link>
        </div>

        {/* Social proof counts */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            justifyContent: "center",
            marginTop: "4rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { num: "12K+", label: "Pelanggan Bahagia" },
            { num: "4.9", label: "Rating Rata-rata" },
            { num: "1,200+", label: "Produk Premium" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  fontWeight: 300,
                  color: "var(--cream)",
                  lineHeight: 1,
                  marginBottom: "0.35rem",
                }}
              >
                {stat.num}
              </p>
              <p className="text-label" style={{ color: "var(--stone)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE ENTRY POINT
   ============================================================ */
export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        <HeroSection />
        <MarqueeSection />
        <FeaturedProductsSection />
        <EditorialBanner />
        <CategoriesSection />
        <TrustSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
