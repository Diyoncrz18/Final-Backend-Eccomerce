"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import NavbarUser from "../../components/NavbarUser";
import { fetchProductById } from "../../../services/api";

/* ─────────── Types ─────────── */
interface Variant { label: string; hex: string; available: boolean }
interface ProductData {
  id: string; name: string; collection: string; category: string; categoryPath: string;
  price: number; salePrice: number | null; memberPrice: number;
  rating: number; reviewCount: number; stock: number; sku: string;
  images: string[];
  variants: Variant[];
  shortDesc: string; fullDesc: string;
  specs: { material: string; dimensions: string; weight: string; assembly: string; origin: string };
  shipping: string; warranty: string;
  tags: string[];
}

/* ─────────── Mock Data ─────────── */
const DEFAULT: ProductData = {
  id: "1",
  name: "Bouclé Armchair",
  collection: "Spring Collection 2025",
  category: "Kursi & Sofa",
  categoryPath: "/koleksi",
  price: 6400000,
  salePrice: null,
  memberPrice: 6080000,
  rating: 4.9,
  reviewCount: 47,
  stock: 8,
  sku: "MSN-CHAIR-001",
  images: ["/product-chair.png", "/hero-living.png", "/hero-bedroom.png", "/product-sofa.png"],
  variants: [
    { label: "Cream Bouclé", hex: "#F0E8D5", available: true },
    { label: "Sage Green", hex: "#8A9E8A", available: true },
    { label: "Charcoal Velvet", hex: "#2A2620", available: false },
  ],
  shortDesc: "Kursi bergaya mid-century modern dengan kain bouclé premium dan kaki kayu oak solid. Sentuhan hangat yang sempurna untuk ruang tamu Anda.",
  fullDesc: "Armchair Bouclé menghadirkan kenyamanan tak tertandingi dalam balutan estetika kontemporer. Kain bouclé bersertifikat OEKO-TEX terasa lembut di sentuhan sekaligus tahan lama, sementara rangka kayu oak solid memberikan kestabilan struktural selama puluhan tahun.\n\nDirancang bersama pengrajin Jepara terpilih, setiap jahitan dikerjakan dengan teliti untuk memastikan ketepatan pola dan kekuatan yang konsisten. Kursi ini adalah investasi jangka panjang — bukan sekadar dekorasi.",
  specs: {
    material: "Kain Bouclé 80% Wol 20% Poliester (OEKO-TEX® Certified) · Kaki Oak Solid dengan Natural Finishing",
    dimensions: "Lebar 78 cm × Kedalaman 80 cm × Tinggi 85 cm · Tinggi Dudukan 44 cm · Tinggi Sandaran 41 cm",
    weight: "18 kg",
    assembly: "Tidak diperlukan — sudah terakit penuh",
    origin: "Dibuat oleh pengrajin pilihan di Jepara, Jawa Tengah, Indonesia",
  },
  shipping: "Estimasi pengiriman 7–14 hari kerja. White Glove Delivery (pemasangan di rumah) tersedia di Jabodetabek dan Bandung.",
  warranty: "2 tahun garansi struktural untuk rangka dan kaki · 1 tahun garansi bahan kain terhadap cacat produksi.",
  tags: ["Kursi", "Bouclé", "Mid-Century", "Ruang Tamu", "Oak"],
};

const CATALOG: Record<string, Partial<ProductData>> = {
  "2": { name: "Olive Linen Sofa", price: 12500000, memberPrice: 11875000, sku: "MSN-SOFA-002", images: ["/product-sofa.png", "/hero-living.png", "/hero-bedroom.png", "/product-chair.png"], category: "Kursi & Sofa", collection: "Classic Collection", rating: 4.8, reviewCount: 32, stock: 3, variants: [{ label: "Olive Linen", hex: "#8A8A5A", available: true }, { label: "Sand Linen", hex: "#D4C4A0", available: true }] },
  "3": { name: "Velvet Accent Chair", price: 7200000, salePrice: 5040000, memberPrice: 4788000, sku: "MSN-CHAIR-003", images: ["/product-velvet-chair.png", "/hero-bedroom.png", "/hero-living.png", "/product-chair.png"], category: "Kursi & Sofa", collection: "Sale Collection", rating: 4.7, reviewCount: 28, stock: 5, variants: [{ label: "Dusty Rose", hex: "#C4908A", available: true }, { label: "Forest Green", hex: "#4A6B5A", available: true }, { label: "Midnight Blue", hex: "#1E2E4A", available: false }] },
  "4": { name: "Marble Side Table", price: 4800000, salePrice: 3360000, memberPrice: 3192000, sku: "MSN-TABLE-004", images: ["/product-marble-table.png", "/hero-living.png", "/product-table.png", "/hero-bedroom.png"], category: "Meja", collection: "Stone Series", rating: 4.9, reviewCount: 61, stock: 3, variants: [{ label: "White Carrara", hex: "#F0EEEC", available: true }, { label: "Grey Marquina", hex: "#4A4A4A", available: true }] },
  "5": { name: "Oak Dining Table", price: 9800000, memberPrice: 9310000, sku: "MSN-TABLE-005", images: ["/product-table.png", "/hero-living.png", "/hero-bedroom.png", "/product-marble-table.png"], category: "Meja", collection: "Nordic Series", rating: 4.8, reviewCount: 38, stock: 2 },
  "6": { name: "Rattan Pendant Lamp", price: 2750000, memberPrice: 2612500, sku: "MSN-LAMP-006", images: ["/product-lamp.png", "/hero-living.png", "/hero-bedroom.png", "/product-ceramic-vase.png"], category: "Lampu", collection: "Artisan Series", rating: 4.8, reviewCount: 55, stock: 12 },
  "7": { name: "Ceramic Statement Vase", price: 1350000, memberPrice: 1282500, sku: "MSN-DECO-007", images: ["/product-ceramic-vase.png", "/hero-bedroom.png", "/hero-living.png", "/product-rattan-wall.png"], category: "Dekorasi", collection: "Wabi-Sabi Series", rating: 4.9, reviewCount: 82, stock: 20 },
};

const REVIEWS = [
  { name: "Anisa R.", date: "12 Apr 2025", rating: 5, avatar: "AR", verified: true, text: "Kualitasnya luar biasa. Kain bouclé-nya sangat lembut dan tidak berbulu seperti kursi murah. Sudah 3 bulan dan masih terlihat seperti baru. Sangat puas dengan pembelian ini!" },
  { name: "Bagas P.", date: "28 Mar 2025", rating: 5, avatar: "BP", verified: true, text: "Pengirimannya cepat dan pengemasan sangat aman. Kursinya persis seperti foto, bahkan lebih bagus di kenyataan. Warna cream-nya sangat hangat dan cocok dengan interior rumah saya." },
  { name: "Dewi S.", date: "15 Mar 2025", rating: 4, avatar: "DS", verified: true, text: "Desainnya cantik dan elegan. Sedikit lebih kecil dari ekspektasi saya, tapi ukurannya sudah ada di deskripsi. Overall sangat happy dengan kualitas materialnya." },
  { name: "Reza F.", date: "2 Mar 2025", rating: 5, avatar: "RF", verified: false, text: "Worth every penny! Ini adalah furniture terbaik yang pernah saya beli. Oak-nya solid banget, tidak goyang sama sekali. Maison memang tidak mengecewakan." },
  { name: "Citra W.", date: "18 Feb 2025", rating: 5, avatar: "CW", verified: true, text: "Pelayanan customer service-nya responsif dan membantu dalam memilih warna yang tepat. Kursinya sangat nyaman untuk baca buku dan kerja dari rumah. Highly recommend!" },
];

const RELATED = [
  { id: "5", name: "Oak Dining Table", price: 9800000, img: "/product-table.png", rating: 4.8 },
  { id: "6", name: "Rattan Pendant Lamp", price: 2750000, img: "/product-lamp.png", rating: 4.8 },
  { id: "7", name: "Ceramic Statement Vase", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9 },
  { id: "2", name: "Olive Linen Sofa", price: 12500000, img: "/product-sofa.png", rating: 4.8 },
];

const USER = { name: "Budi Santoso", email: "budi@email.com", tier: "Gold Member", points: 2450 };

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(n) ? "var(--copper)" : "var(--stone-light)"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
      <span style={{ fontSize: "0.75rem", color: "var(--charcoal-soft)", minWidth: "14px", textAlign: "right" }}>{label}</span>
      <div style={{ flex: 1, height: "4px", background: "var(--stone-light)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--copper)", borderRadius: "2px", transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: "0.72rem", color: "var(--stone)", minWidth: "20px" }}>{count}</span>
    </div>
  );
}

/* ─────────── Page ─────────── */
export default function ProductPage() {
  const { id } = useParams() as { id: string };
  const override = CATALOG[id] ?? {};
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProductById(Number(id));
        if (data) {
          setProductData(data);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const product: ProductData = productData ? {
    id: String(productData.id),
    name: productData.name || "Unknown Product",
    collection: productData.collection?.name || "Maison Collection",
    category: productData.category?.name || "Furniture",
    categoryPath: "/koleksi",
    price: Number(productData.price) || 0,
    salePrice: productData.salePrice ? Number(productData.salePrice) : null,
    memberPrice: Number(productData.price) * 0.95 || 0,
    rating: Number(productData.rating) || 4.5,
    reviewCount: productData.reviewCount || 0,
    stock: productData.stock || 0,
    sku: productData.sku || "MSN-000",
    images: productData.imageUrl ? [productData.imageUrl] : ["/product-chair.png"],
    variants: [],
    shortDesc: productData.description || "",
    fullDesc: productData.description || "",
    specs: {
      material: productData.material || "-",
      dimensions: productData.dimensions || "-",
      weight: productData.weightKg ? `${productData.weightKg} kg` : "-",
      assembly: productData.assemblyRequired ? "Ya" : "Tidak",
      origin: "Indonesia",
    },
    shipping: "Estimasi pengiriman 7-14 hari kerja",
    warranty: productData.warrantyMonths ? `${productData.warrantyMonths} bulan garansi` : "1 tahun garansi",
    tags: [productData.category?.name || "Furniture"],
  } : { ...DEFAULT, ...override, id };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bone)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  const [activeImg, setActiveImg] = useState(0);
  const [imgZoom, setImgZoom] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [qty, setQty] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>("description");
  const [hoverRelated, setHoverRelated] = useState<string | null>(null);

  const displayPrice = product.salePrice ?? product.price;
  const ratingBreakdown = [
    { label: "5★", count: Math.round(product.reviewCount * 0.72) },
    { label: "4★", count: Math.round(product.reviewCount * 0.18) },
    { label: "3★", count: Math.round(product.reviewCount * 0.06) },
    { label: "2★", count: Math.round(product.reviewCount * 0.02) },
    { label: "1★", count: Math.round(product.reviewCount * 0.02) },
  ];

  const handleAddToCart = () => {
    setInCart(true);
    setTimeout(() => setInCart(false), 2500);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(prev => prev === key ? "" : key);
  };

  const accordions = [
    {
      key: "description",
      label: "Deskripsi Produk",
      content: (
        <div>
          <p style={{ fontSize: "0.88rem", color: "var(--charcoal-soft)", lineHeight: 1.9, marginBottom: "1rem" }}>
            {product.fullDesc.split("\n\n")[0]}
          </p>
          {product.fullDesc.split("\n\n")[1] && (
            <p style={{ fontSize: "0.88rem", color: "var(--charcoal-soft)", lineHeight: 1.9 }}>
              {product.fullDesc.split("\n\n")[1]}
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.25rem" }}>
            {product.tags.map(t => (
              <span key={t} style={{
                padding: "0.25rem 0.85rem", background: "var(--bone)",
                fontSize: "0.7rem", color: "var(--charcoal-soft)", letterSpacing: "0.07em",
                border: "1px solid var(--stone-light)",
              }}>{t}</span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "specs",
      label: "Spesifikasi",
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.6rem 1.5rem" }} className="specs-grid">
          {Object.entries({
            Material: product.specs.material,
            Dimensi: product.specs.dimensions,
            Berat: product.specs.weight,
            Perakitan: product.specs.assembly,
            "Asal Produk": product.specs.origin,
          }).map(([k, v]) => (
            <>
              <p key={k + "k"} style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--charcoal)", letterSpacing: "0.04em" }}>{k}</p>
              <p key={k + "v"} style={{ fontSize: "0.82rem", color: "var(--charcoal-soft)", lineHeight: 1.65 }}>{v}</p>
            </>
          ))}
        </div>
      ),
    },
    {
      key: "shipping",
      label: "Pengiriman & Garansi",
      content: (
        <div>
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            {[
              {
                label: "Gratis Ongkir", sub: "Ke seluruh Indonesia",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
              },
              {
                label: "White Glove", sub: "Pemasangan di rumah",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
              },
              {
                label: "Garansi 2 Tahun", sub: "Struktural & material",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
              },
              {
                label: "30 Hari Retur", sub: "Kondisi original",
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
              },
            ].map(b => (
              <div key={b.label} style={{
                flex: "1 1 160px", padding: "1rem", background: "var(--bone)",
                border: "1px solid var(--stone-light)", display: "flex", gap: "0.75rem", alignItems: "center",
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
                  background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {b.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: "0.15rem" }}>{b.label}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--stone)" }}>{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "3px" }}>
              <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <p style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)", lineHeight: 1.8 }}>
              <strong>Pengiriman:</strong> {product.shipping}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "3px" }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)", lineHeight: 1.8 }}>
              <strong>Garansi:</strong> {product.warranty}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={USER} />

      {/* ── Breadcrumb ── */}
      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)", paddingTop: "72px" }}>
        <div className="container-main" style={{ padding: "1rem var(--container-px)" }}>
          <p style={{ fontSize: "0.72rem", color: "var(--stone)", letterSpacing: "0.08em" }}>
            <Link href="/dashboard" style={{ color: "inherit", transition: "color 0.2s ease" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--copper)")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--stone)")}>
              Beranda
            </Link>
            {" / "}
            <Link href="/koleksi" style={{ color: "inherit" }}>Koleksi</Link>
            {" / "}
            <Link href={product.categoryPath} style={{ color: "inherit" }}>{product.category}</Link>
            {" / "}
            <span style={{ color: "var(--charcoal)" }}>{product.name}</span>
          </p>
        </div>
      </div>

      {/* ── Main Product Section ── */}
      <section style={{ background: "var(--white)" }}>
        <div className="container-main" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "flex-start" }} className="product-main-grid">

            {/* ── Left: Image Gallery ── */}
            <div>
              {/* Main Image */}
              <div
                style={{
                  position: "relative", aspectRatio: "1/1", overflow: "hidden",
                  background: "var(--bone)", marginBottom: "1rem",
                  cursor: imgZoom ? "zoom-out" : "zoom-in",
                }}
                onMouseEnter={() => setImgZoom(true)}
                onMouseLeave={() => setImgZoom(false)}
              >
                <Image
                  src={product.images[activeImg]}
                  alt={product.name}
                  fill
                  priority
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    transform: imgZoom ? "scale(1.08)" : "scale(1)",
                  }}
                />
                {/* Sale badge */}
                {product.salePrice && (
                  <div style={{
                    position: "absolute", top: "1.25rem", left: "1.25rem",
                    background: "var(--copper)", color: "var(--white)",
                    padding: "0.35rem 0.9rem", fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}>
                    SALE {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                  </div>
                )}
                {/* Zoom hint */}
                <div style={{
                  position: "absolute", bottom: "1rem", right: "1rem",
                  background: "rgba(250,248,245,0.9)", backdropFilter: "blur(6px)",
                  padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", gap: "0.4rem",
                  opacity: imgZoom ? 0 : 0.8, transition: "opacity 0.2s ease",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="2">
                    <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
                  </svg>
                  <span style={{ fontSize: "0.62rem", color: "var(--charcoal)", letterSpacing: "0.06em" }}>Zoom</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.6rem" }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      aspectRatio: "1/1", position: "relative", overflow: "hidden",
                      background: "var(--bone)", border: `2px solid ${activeImg === i ? "var(--copper)" : "transparent"}`,
                      cursor: "pointer", padding: 0, transition: "border-color 0.2s ease",
                    }}
                    aria-label={`Gambar ${i + 1}`}
                  >
                    <Image src={img} alt={`${product.name} ${i+1}`} fill style={{ objectFit: "cover", opacity: activeImg === i ? 1 : 0.65, transition: "opacity 0.2s ease" }} />
                  </button>
                ))}
              </div>

              {/* SKU */}
              <p style={{ fontSize: "0.68rem", color: "var(--stone)", marginTop: "1.25rem", letterSpacing: "0.1em" }}>
                SKU: {product.sku}
              </p>
            </div>

            {/* ── Right: Product Info ── */}
            <div style={{ position: "sticky", top: "90px" }}>
              {/* Collection tag */}
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--copper)", marginBottom: "0.6rem" }}>
                {product.collection}
              </p>

              {/* Product name */}
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.1, marginBottom: "1.1rem",
              }}>
                {product.name}
              </h1>

              {/* Rating row */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <Stars n={product.rating} />
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--charcoal)" }}>{product.rating.toFixed(1)}</span>
                <a href="#reviews" style={{ fontSize: "0.78rem", color: "var(--stone)", borderBottom: "1px solid var(--stone-light)", paddingBottom: "1px", transition: "color 0.2s ease" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--copper)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--stone)")}>
                  {product.reviewCount} ulasan
                </a>
                <span style={{ fontSize: "0.72rem", color: "var(--stone)", marginLeft: "auto" }}>
                  Stok: <strong style={{ color: product.stock <= 3 ? "#DC2626" : "var(--charcoal)" }}>{product.stock} tersedia</strong>
                </span>
              </div>

              {/* Price */}
              <div style={{ marginBottom: "1.5rem", borderTop: "1px solid var(--stone-light)", borderBottom: "1px solid var(--stone-light)", padding: "1.25rem 0" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, color: "var(--charcoal)" }}>
                    {formatRp(displayPrice)}
                  </p>
                  {product.salePrice && (
                    <p style={{ fontSize: "1rem", color: "var(--stone)", textDecoration: "line-through" }}>
                      {formatRp(product.price)}
                    </p>
                  )}
                </div>
                {/* Member price */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.6rem",
                  background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.2)",
                  padding: "0.4rem 0.85rem",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span style={{ fontSize: "0.72rem", color: "var(--copper)", fontWeight: 500, letterSpacing: "0.06em" }}>
                    Harga Member: <strong>{formatRp(product.memberPrice)}</strong>
                  </span>
                </div>
              </div>

              {/* Short description */}
              <p style={{ fontSize: "0.88rem", color: "var(--charcoal-soft)", lineHeight: 1.8, marginBottom: "1.75rem" }}>
                {product.shortDesc}
              </p>

              {/* Variant selector */}
              {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: "1.75rem" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--charcoal)", marginBottom: "0.75rem" }}>
                    Pilihan Warna / Material:{" "}
                    <span style={{ fontWeight: 400, color: "var(--copper)", textTransform: "none" }}>
                      {product.variants[selectedVariant]?.label}
                    </span>
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {product.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => v.available && setSelectedVariant(i)}
                        title={v.label + (v.available ? "" : " (Habis)")}
                        style={{
                          width: "38px", height: "38px", borderRadius: "50%",
                          background: v.hex,
                          border: `3px solid ${selectedVariant === i ? "var(--copper)" : "transparent"}`,
                          outline: `2px solid ${v.available ? "var(--stone-light)" : "var(--stone-light)"}`,
                          cursor: v.available ? "pointer" : "not-allowed",
                          opacity: v.available ? 1 : 0.4,
                          transition: "border-color 0.2s ease, transform 0.15s ease",
                          transform: selectedVariant === i ? "scale(1.15)" : "scale(1)",
                          position: "relative",
                        }}
                        aria-label={v.label}
                      >
                        {!v.available && (
                          <span style={{
                            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <div style={{ width: "120%", height: "1px", background: "rgba(100,100,100,0.5)", transform: "rotate(-45deg)" }} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--charcoal)", marginBottom: "0.75rem" }}>
                  Jumlah
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 0, width: "fit-content" }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{
                      width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--white)", border: "1px solid var(--stone-light)",
                      cursor: "pointer", fontSize: "1.25rem", color: "var(--charcoal)",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--bone)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--white)")}
                  >−</button>
                  <div style={{
                    width: "56px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--white)", borderTop: "1px solid var(--stone-light)", borderBottom: "1px solid var(--stone-light)",
                    fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 500, color: "var(--charcoal)",
                  }}>
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    style={{
                      width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--white)", border: "1px solid var(--stone-light)",
                      cursor: "pointer", fontSize: "1.25rem", color: "var(--charcoal)",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--bone)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--white)")}
                  >+</button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  id="add-to-cart-btn"
                  style={{
                    width: "100%", padding: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                    background: inCart ? "#198754" : "var(--charcoal)",
                    border: "none", color: "var(--cream)",
                    fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 500,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    cursor: "pointer", transition: "background 0.3s ease",
                  }}
                  onMouseEnter={e => !inCart && ((e.currentTarget as HTMLButtonElement).style.background = "var(--copper)")}
                  onMouseLeave={e => !inCart && ((e.currentTarget as HTMLButtonElement).style.background = "var(--charcoal)")}
                >
                  {inCart ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Berhasil Ditambahkan
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      Tambah ke Keranjang
                    </>
                  )}
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem" }}>
                  {/* Wishlist */}
                  <button
                    onClick={() => setInWishlist(!inWishlist)}
                    id="wishlist-btn"
                    style={{
                      padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                      background: inWishlist ? "rgba(196,113,58,0.08)" : "var(--white)",
                      border: `1px solid ${inWishlist ? "var(--copper)" : "var(--stone-light)"}`,
                      color: inWishlist ? "var(--copper)" : "var(--charcoal)",
                      fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      cursor: "pointer", transition: "all 0.25s ease",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24"
                      fill={inWishlist ? "var(--copper)" : "none"}
                      stroke={inWishlist ? "var(--copper)" : "currentColor"} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {inWishlist ? "Disimpan" : "Wishlist"}
                  </button>

                  {/* Share */}
                  <button
                    style={{
                      padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--white)", border: "1px solid var(--stone-light)",
                      color: "var(--charcoal-soft)", cursor: "pointer", transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--charcoal)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--charcoal)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--stone-light)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--charcoal-soft)";
                    }}
                    aria-label="Bagikan"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Delivery badges */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {[
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: "Gratis Ongkir", sub: "Seluruh Indonesia" },
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Garansi 2 Tahun", sub: "Struktural & material" },
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>, label: "White Glove", sub: "Pemasangan di rumah" },
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>, label: "30 Hari Retur", sub: "Kondisi original" },
                ].map(b => (
                  <div key={b.label} style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    padding: "0.75rem", background: "var(--bone)",
                    border: "1px solid var(--stone-light)",
                  }}>
                    <span style={{ color: "var(--copper)", lineHeight: 0 }}>{b.icon}</span>
                    <div>
                      <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--charcoal)", lineHeight: 1.2 }}>{b.label}</p>
                      <p style={{ fontSize: "0.65rem", color: "var(--stone)" }}>{b.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Accordion: Description / Specs / Shipping ── */}
      <section style={{ background: "var(--bone)", borderTop: "1px solid var(--stone-light)", borderBottom: "1px solid var(--stone-light)" }}>
        <div className="container-main" style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
          {accordions.map(acc => (
            <div key={acc.key} style={{ borderBottom: "1px solid var(--stone-light)" }}>
              <button
                onClick={() => toggleAccordion(acc.key)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "1.5rem 0", background: "none", border: "none",
                  fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: openAccordion === acc.key ? "var(--copper)" : "var(--charcoal)",
                  cursor: "pointer", transition: "color 0.2s ease",
                }}
              >
                {acc.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: openAccordion === acc.key ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease", flexShrink: 0 }}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openAccordion === acc.key && (
                <div style={{ paddingBottom: "2rem", animation: "fadeUp 0.2s ease both" }}>
                  {acc.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" style={{ background: "var(--white)" }}>
        <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "4rem", alignItems: "flex-start" }} className="reviews-grid">
            {/* Left: Rating summary */}
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>Ulasan Pembeli</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1 }}>
                {product.rating.toFixed(1)}
              </h2>
              <div style={{ margin: "0.6rem 0" }}><Stars n={product.rating} size={18} /></div>
              <p style={{ fontSize: "0.78rem", color: "var(--stone)", marginBottom: "1.75rem" }}>
                dari {product.reviewCount} ulasan terverifikasi
              </p>

              {ratingBreakdown.map(rb => (
                <RatingBar key={rb.label} label={rb.label} count={rb.count} total={product.reviewCount} />
              ))}

              <button style={{
                marginTop: "1.75rem", width: "100%", padding: "0.9rem",
                background: "var(--charcoal)", border: "none", color: "var(--cream)",
                fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
                letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--copper)")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--charcoal)")}>
                Tulis Ulasan
              </button>
            </div>

            {/* Right: Individual reviews */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {REVIEWS.map((rev, i) => (
                  <div key={i} style={{
                    padding: "1.5rem 1.75rem",
                    background: "var(--bone)", border: "1px solid var(--stone-light)",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                      {/* Avatar */}
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        background: "var(--charcoal)", color: "var(--cream)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.05em", flexShrink: 0,
                      }}>
                        {rev.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--charcoal)" }}>{rev.name}</p>
                          {rev.verified && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "0.25rem",
                              fontSize: "0.62rem", color: "#16A34A", letterSpacing: "0.06em",
                            }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="#16A34A" stroke="none">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Pembelian Terverifikasi
                            </span>
                          )}
                          <span style={{ fontSize: "0.72rem", color: "var(--stone)", marginLeft: "auto" }}>{rev.date}</span>
                        </div>
                        <Stars n={rev.rating} size={12} />
                      </div>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)", lineHeight: 1.8 }}>
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      <section style={{ background: "var(--bone)", borderTop: "1px solid var(--stone-light)" }}>
        <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.4rem" }}>Produk Serupa</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
                Anda Mungkin Juga Suka
              </h2>
            </div>
            <Link href="/koleksi" style={{
              fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--charcoal-soft)", fontWeight: 500,
              borderBottom: "1px solid var(--stone-light)", paddingBottom: "2px",
            }}>
              Lihat Semua
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="related-grid">
            {RELATED.map(item => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setHoverRelated(item.id)}
                onMouseLeave={() => setHoverRelated(null)}
              >
                <div style={{
                  background: "var(--white)", border: "1px solid var(--stone-light)", overflow: "hidden",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  boxShadow: hoverRelated === item.id ? "0 12px 36px rgba(42,38,32,0.12)" : "none",
                  transform: hoverRelated === item.id ? "translateY(-4px)" : "none",
                }}>
                  <div style={{ aspectRatio: "4/3", position: "relative", background: "var(--bone)", overflow: "hidden" }}>
                    <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hoverRelated === item.id ? "scale(1.04)" : "scale(1)" }} />
                  </div>
                  <div style={{ padding: "1rem 1.1rem" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.35rem" }}>
                      {item.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--charcoal)" }}>
                        {formatRp(item.price)}
                      </p>
                      <Stars n={item.rating} size={11} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .product-main-grid { grid-template-columns: 1fr 1fr !important; }
        .reviews-grid { grid-template-columns: 280px 1fr !important; }
        .related-grid { grid-template-columns: repeat(4, 1fr) !important; }
        .specs-grid   { grid-template-columns: 140px 1fr !important; }
        @media (max-width: 1024px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .product-main-grid { grid-template-columns: 1fr !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .specs-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
