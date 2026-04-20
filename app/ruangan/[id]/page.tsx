"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import NavbarUser from "../../components/NavbarUser";

const USER = { name: "Budi Santoso", email: "budi@email.com", tier: "Gold Member", points: 2450 };

/* ─────────── Room Data ─────────── */
const ROOM_DATA: Record<string, {
  id: string; name: string; name_en: string; desc: string; longDesc: string;
  heroImg: string; count: number;
  tips: { title: string; body: string }[];
  styles: { label: string; desc: string }[];
  products: { id: number; name: string; price: number; img: string; rating: number; cat: string; isNew?: boolean; isBest?: boolean }[];
  relatedRooms: string[];
}> = {
  "ruang-tamu": {
    id: "ruang-tamu", name: "Ruang Tamu", name_en: "Living Room",
    heroImg: "/hero-living.png", count: 48,
    desc: "Ciptakan ruang yang hangat dan mengundang untuk berkumpul bersama keluarga.",
    longDesc: "Ruang tamu adalah jantung dari sebuah rumah — ruang pertama yang menyambut tamu dan tempat keluarga berkumpul. Setiap produk dalam kategori ini dipilih untuk menciptakan harmoni antara estetika dan kenyamanan.",
    tips: [
      { title: "Tentukan Focal Point", body: "Mulai dengan satu elemen utama — bisa berupa sofa statement, karya seni, atau fireplace. Semua furnitur lain sebaiknya mengarah ke fokus ini." },
      { title: "Aturan 3:1 Warna", body: "Gunakan 3 warna dominan dalam proporsi 60%–30%–10%. Misal: krem (60%), abu (30%), aksen tembaga (10%) untuk tampilan harmonis." },
      { title: "Lapisan Pencahayaan", body: "Kombinasikan ambient (lampu langit-langit), task (lampu baca), dan accent (lampu dekoratif) untuk menciptakan suasana yang fleksibel sesuai waktu." },
    ],
    styles: [
      { label: "Japandi", desc: "Minimalis, material alami, palet netral hangat" },
      { label: "Modern Organic", desc: "Bentuk organis, tekstur kain alami, sentuhan hijau" },
      { label: "Contemporary Classic", desc: "Elegan timeless, sentuhan mewah yang subtil" },
    ],
    products: [
      { id: 1, name: "Bouclé Armchair", price: 6400000, img: "/product-chair.png", rating: 4.9, cat: "Kursi", isBest: true },
      { id: 2, name: "Olive Linen Sofa", price: 12500000, img: "/product-sofa.png", rating: 4.8, cat: "Sofa" },
      { id: 5, name: "Oak Dining Table", price: 9800000, img: "/product-table.png", rating: 4.8, cat: "Meja" },
      { id: 6, name: "Rattan Pendant Lamp", price: 2750000, img: "/product-lamp.png", rating: 4.8, cat: "Lampu", isNew: true },
      { id: 4, name: "Marble Side Table", price: 3360000, img: "/product-marble-table.png", rating: 4.9, cat: "Meja", isBest: true },
      { id: 7, name: "Ceramic Statement Vase", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9, cat: "Dekorasi" },
      { id: 11, name: "Rattan Wall Panel", price: 2100000, img: "/product-rattan-wall.png", rating: 4.8, cat: "Dekorasi", isNew: true },
      { id: 3, name: "Velvet Accent Chair", price: 5040000, img: "/product-velvet-chair.png", rating: 4.7, cat: "Kursi" },
    ],
    relatedRooms: ["kamar-tidur", "ruang-makan", "dapur"],
  },
  "kamar-tidur": {
    id: "kamar-tidur", name: "Kamar Tidur", name_en: "Bedroom",
    heroImg: "/hero-bedroom.png", count: 35,
    desc: "Desain kamar tidur sebagai sanctuary personal Anda — tenang, elegan, dan restoratif.",
    longDesc: "Kamar tidur adalah ruang paling personal di rumah Anda. Di sinilah tubuh dan pikiran beristirahat, memulihkan diri. Koleksi kamar tidur kami dirancang untuk menciptakan suasana sanctuary — tenang, hangat, dan benar-benar milik Anda.",
    tips: [
      { title: "Pilih Kasur Terlebih Dahulu", body: "Kasur adalah investasi terbesar di kamar tidur. Pilih ukuran yang proporsional dengan ruangan — sisakan minimal 60cm di setiap sisi." },
      { title: "Pencahayaan Layered", body: "Hindari lampu overhead tunggal yang keras. Kombinasikan lampu tidur, floor lamp, dan dimmer untuk suasana yang lebih warm dan relaxing." },
      { title: "Minimalkan Visual Clutter", body: "Prinsip 'less is more' paling efektif di kamar tidur. Setiap benda harus punya tempat penyimpanan — gunakan nightstand dengan laci dan under-bed storage." },
    ],
    styles: [
      { label: "Hotel Luxe", desc: "Bedding berlapis, palet netral, sentuhan metalik" },
      { label: "Hygge Nordic", desc: "Tekstur lembut, cahaya hangat, keintiman nyaman" },
      { label: "Zen Minimalist", desc: "Ruang bernafas, material kayu, zero clutter" },
    ],
    products: [
      { id: 3, name: "Velvet Accent Chair", price: 5040000, img: "/product-velvet-chair.png", rating: 4.7, cat: "Kursi", isBest: true },
      { id: 6, name: "Rattan Pendant Lamp", price: 2750000, img: "/product-lamp.png", rating: 4.8, cat: "Lampu", isNew: true },
      { id: 7, name: "Ceramic Statement Vase", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9, cat: "Dekorasi" },
      { id: 4, name: "Marble Side Table", price: 3360000, img: "/product-marble-table.png", rating: 4.9, cat: "Meja Samping", isBest: true },
      { id: 11, name: "Rattan Wall Panel", price: 2100000, img: "/product-rattan-wall.png", rating: 4.8, cat: "Dekorasi" },
      { id: 1, name: "Bouclé Armchair", price: 6400000, img: "/product-chair.png", rating: 4.9, cat: "Kursi" },
    ],
    relatedRooms: ["ruang-tamu", "kamar-mandi", "teras"],
  },
  "ruang-makan": {
    id: "ruang-makan", name: "Ruang Makan", name_en: "Dining Room",
    heroImg: "/hero-living.png", count: 29,
    desc: "Jadikan momen makan bersama lebih berkesan dengan furnitur yang tepat dan estetik.",
    longDesc: "Ruang makan lebih dari sekadar tempat makan — ini adalah ruang ritual kebersamaan. Pilih meja yang mengundang percakapan, kursi yang nyaman untuk sesi makan panjang, dan pencahayaan yang menciptakan suasana hangat.",
    tips: [
      { title: "Ukuran Meja yang Tepat", body: "Sisakan minimal 90cm antara tepi meja dan dinding untuk kenyamanan duduk dan berdiri. Meja 120cm cocok untuk 4 orang, 180cm untuk 6–8 orang." },
      { title: "Tinggi Lampu Gantung", body: "Lampu gantung di atas meja makan sebaiknya berada 75–90cm di atas permukaan meja. Pilih diameter lampu sekitar 1/2 hingga 2/3 lebar meja." },
      { title: "Mix Chair & Bench", body: "Kombinasikan kursi individual di sisi pendek dan bench di sisi panjang untuk tampilan yang lebih dinamis dan kapasitas yang fleksibel." },
    ],
    styles: [
      { label: "Farmhouse Modern", desc: "Kayu solid, kursi mix material, nuansa rustic" },
      { label: "Sculptural Contemporary", desc: "Bentuk unik, marble top, kursi statement" },
      { label: "Tropical Organic", desc: "Rotan, bambu, tanaman hijau segar" },
    ],
    products: [
      { id: 5, name: "Oak Dining Table", price: 9800000, img: "/product-table.png", rating: 4.8, cat: "Meja Makan", isBest: true },
      { id: 1, name: "Bouclé Armchair", price: 6400000, img: "/product-chair.png", rating: 4.9, cat: "Kursi Makan" },
      { id: 4, name: "Marble Side Table", price: 3360000, img: "/product-marble-table.png", rating: 4.9, cat: "Meja Samping" },
      { id: 6, name: "Rattan Pendant Lamp", price: 2750000, img: "/product-lamp.png", rating: 4.8, cat: "Lampu", isNew: true },
      { id: 7, name: "Ceramic Statement Vase", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9, cat: "Dekorasi" },
    ],
    relatedRooms: ["ruang-tamu", "dapur", "teras"],
  },
  "dapur": {
    id: "dapur", name: "Dapur & Bar", name_en: "Kitchen & Bar",
    heroImg: "/hero-bedroom.png", count: 22,
    desc: "Transformasi dapur menjadi ruang kreatif yang fungsional sekaligus menawan.",
    longDesc: "Dapur modern bukan hanya tentang fungsionalitas — ini adalah ruang ekspresi kreatif. Dari coffee station minimalis hingga bar area yang mengundang, koleksi kami membantu menciptakan dapur yang indah sekaligus efisien.",
    tips: [
      { title: "Kitchen Triangle", body: "Posisikan kompor, wastafel, dan kulkas dalam segitiga kerja. Jarak ideal antar titik adalah 120–275cm untuk efisiensi gerak maksimal." },
      { title: "Open Shelving dengan Cermat", body: "Rak terbuka terlihat indah tapi butuh perawatan ekstra. Simpan barang yang sering dipakai dan estetik di sini, sisanya di lemari tertutup." },
      { title: "Pencahayaan Under Cabinet", body: "Lampu di bawah kabinet atas memberikan pencahayaan kerja yang optimal sekaligus menciptakan kedalaman visual yang menarik." },
    ],
    styles: [
      { label: "Industrial Chic", desc: "Material metal, beton, kayu gelap yang elegan" },
      { label: "Scandi Kitchen", desc: "Putih bersih, kayu terang, tanaman herba" },
      { label: "Warm Bistro", desc: "Kuningan, tile vintage, nuansa café Parisian" },
    ],
    products: [
      { id: 7, name: "Ceramic Statement Vase", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9, cat: "Dekorasi", isBest: true },
      { id: 4, name: "Marble Side Table", price: 3360000, img: "/product-marble-table.png", rating: 4.9, cat: "Meja Bar" },
      { id: 6, name: "Rattan Pendant Lamp", price: 2750000, img: "/product-lamp.png", rating: 4.8, cat: "Lampu", isNew: true },
      { id: 11, name: "Rattan Wall Panel", price: 2100000, img: "/product-rattan-wall.png", rating: 4.8, cat: "Dekorasi" },
    ],
    relatedRooms: ["ruang-makan", "ruang-tamu", "teras"],
  },
  "kamar-mandi": {
    id: "kamar-mandi", name: "Kamar Mandi", name_en: "Bathroom",
    heroImg: "/hero-living.png", count: 18,
    desc: "Ubah ritual harian menjadi pengalaman spa mewah di dalam rumah Anda.",
    longDesc: "Kamar mandi yang dirancang dengan baik adalah hadiah terbaik untuk diri sendiri. Setiap pagi dimulai dan diakhiri di sini. Koleksi kami menghadirkan material yang tahan kelembapan namun tetap terasa premium dan mewah.",
    tips: [
      { title: "Material Tahan Lembab", body: "Pilih aksesoris dari teak, travertine, atau stainless steel yang tahan terhadap kelembapan tinggi tanpa kehilangan keindahannya." },
      { title: "Rak vs Kabinet", body: "Rak terbuka ideal untuk handuk tergulung dan tanaman kecil. Kabinet tertutup untuk produk perawatan sehari-hari agar tampilan tetap bersih." },
      { title: "Difuser & Aromaterapi", body: "Tambahkan diffuser minyak esensial atau lilin aromaterapi untuk mengubah kamar mandi biasa menjadi pengalaman spa yang sesungguhnya." },
    ],
    styles: [
      { label: "Japanese Onsen", desc: "Batu alam, bambu, nuansa spa tradisional" },
      { label: "Coastal Luxe", desc: "Material putih bersih, sentuhan natural, terang" },
      { label: "Dark & Moody", desc: "Tile gelap, aksen kuningan, dramatis mewah" },
    ],
    products: [
      { id: 7, name: "Ceramic Statement Vase", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9, cat: "Dekorasi", isBest: true },
      { id: 11, name: "Rattan Wall Panel", price: 2100000, img: "/product-rattan-wall.png", rating: 4.8, cat: "Dekorasi Dinding", isNew: true },
      { id: 4, name: "Marble Side Table", price: 3360000, img: "/product-marble-table.png", rating: 4.9, cat: "Meja" },
      { id: 6, name: "Rattan Pendant Lamp", price: 2750000, img: "/product-lamp.png", rating: 4.8, cat: "Lampu" },
    ],
    relatedRooms: ["kamar-tidur", "teras", "ruang-tamu"],
  },
  "teras": {
    id: "teras", name: "Teras & Outdoor", name_en: "Terrace & Outdoor",
    heroImg: "/hero-bedroom.png", count: 15,
    desc: "Perpanjang estetika interior ke ruang luar dengan koleksi outdoor pilihan kami.",
    longDesc: "Ruang outdoor adalah ekstensi alami dari hunian Anda. Dengan material yang tepat dan perawatan yang minimal, teras dan taman bisa menjadi ruang favorit yang dinikmati sepanjang tahun.",
    tips: [
      { title: "Material Outdoor Grade", body: "Pilih material yang dirancang khusus untuk luar ruangan seperti teak grade A, aluminium powder-coated, atau wicker sintetis berkualitas tinggi." },
      { title: "Zona Outdoor yang Jelas", body: "Bagi ruang outdoor menjadi zona: area duduk santai, area makan, dan taman. Gunakan karpet outdoor atau perbedaan material lantai sebagai pemisah visual." },
      { title: "Pencahayaan Malam", body: "Solar garden light, string lights, atau lantern memberikan kemudahan tanpa instalasi listrik sekaligus menciptakan suasana magis di malam hari." },
    ],
    styles: [
      { label: "Tropical Paradise", desc: "Rotan, tanaman hijau lebat, nuansa Bali resort" },
      { label: "Modern Terrace", desc: "Beton, metal, tanaman minimalis dalam pot geometric" },
      { label: "Mediterranean Garden", desc: "Keramik berwarna, tanaman herba, nuansa Mediterania" },
    ],
    products: [
      { id: 11, name: "Rattan Wall Panel", price: 2100000, img: "/product-rattan-wall.png", rating: 4.8, cat: "Dekorasi", isBest: true },
      { id: 1, name: "Bouclé Armchair", price: 6400000, img: "/product-chair.png", rating: 4.9, cat: "Kursi" },
      { id: 6, name: "Rattan Pendant Lamp", price: 2750000, img: "/product-lamp.png", rating: 4.8, cat: "Lampu", isNew: true },
      { id: 7, name: "Ceramic Statement Vase", price: 1350000, img: "/product-ceramic-vase.png", rating: 4.9, cat: "Dekorasi" },
    ],
    relatedRooms: ["ruang-tamu", "ruang-makan", "kamar-mandi"],
  },
};

const ALL_ROOMS: Record<string, { name: string; img: string }> = {
  "ruang-tamu":  { name: "Ruang Tamu",    img: "/hero-living.png" },
  "kamar-tidur": { name: "Kamar Tidur",   img: "/hero-bedroom.png" },
  "ruang-makan": { name: "Ruang Makan",   img: "/hero-living.png" },
  "dapur":       { name: "Dapur & Bar",   img: "/hero-bedroom.png" },
  "kamar-mandi": { name: "Kamar Mandi",   img: "/hero-living.png" },
  "teras":       { name: "Teras & Outdoor", img: "/hero-bedroom.png" },
};

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(n) ? "var(--copper)" : "var(--stone-light)"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

/* ─────────── Page ─────────── */
export default function RuanganDetailPage() {
  const { id } = useParams() as { id: string };
  const room = ROOM_DATA[id];
  if (!room) { notFound(); return null; }

  const [hoverProd, setHoverProd] = useState<number | null>(null);
  const [hoverRoom, setHoverRoom] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={USER} />

      {/* ── Cinematic Hero ── */}
      <section style={{ position: "relative", height: "520px", overflow: "hidden", background: "var(--charcoal)" }}>
        <Image src={room.heroImg} alt={room.name} fill priority style={{ objectFit: "cover", opacity: 0.28 }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(26,23,20,0.95) 0%, rgba(26,23,20,0.5) 50%, rgba(26,23,20,0.2) 100%)",
        }} />

        {/* Decorative room name watermark */}
        <div style={{
          position: "absolute", right: "-2%", top: "15%",
          fontFamily: "var(--font-display)", fontWeight: 300, letterSpacing: "0.08em",
          fontSize: "clamp(5rem, 14vw, 12rem)", color: "rgba(245,240,232,0.04)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none", textTransform: "uppercase",
        }}>
          {room.name_en.split(" ")[0]}
        </div>

        <div className="container-main" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "4rem" }}>
          {/* Breadcrumb */}
          <p style={{ fontSize: "0.7rem", color: "rgba(245,240,232,0.4)", letterSpacing: "0.12em", marginBottom: "1.25rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Beranda</Link>
            {" / "}
            <Link href="/ruangan" style={{ color: "inherit" }}>Ruangan</Link>
            {" / "}
            <span style={{ color: "var(--copper)" }}>{room.name}</span>
          </p>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--copper)", marginBottom: "0.6rem" }}>
                {room.name_en}
              </p>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 300, color: "var(--cream)", lineHeight: 1, marginBottom: "1.25rem",
              }}>
                {room.name}
              </h1>
              <p style={{ fontSize: "0.95rem", color: "rgba(245,240,232,0.55)", maxWidth: "500px", lineHeight: 1.75 }}>
                {room.longDesc}
              </p>
            </div>

            {/* Count badge */}
            <div style={{
              background: "rgba(245,240,232,0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(245,240,232,0.15)",
              padding: "1.25rem 1.75rem",
              textAlign: "center", flexShrink: 0,
            }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, color: "var(--copper)", lineHeight: 1 }}>
                {room.count}+
              </p>
              <p style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.45)", marginTop: "0.3rem" }}>
                Produk
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Design Styles Tab ── */}
      <div style={{ background: "var(--charcoal)", borderBottom: "1px solid rgba(245,240,232,0.1)" }}>
        <div className="container-main">
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {room.styles.map((s, i) => (
              <button key={s.label} onClick={() => setActiveStyle(i)}
                style={{
                  padding: "1.1rem 2rem", background: "none", border: "none",
                  borderBottom: `2px solid ${activeStyle === i ? "var(--copper)" : "transparent"}`,
                  cursor: "pointer", transition: "all 0.2s ease", whiteSpace: "nowrap",
                  fontFamily: "var(--font-body)",
                }}>
                <p style={{ fontSize: "0.78rem", fontWeight: activeStyle === i ? 600 : 400, color: activeStyle === i ? "var(--copper)" : "rgba(245,240,232,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {s.label}
                </p>
              </button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", padding: "0 0.5rem" }}>
              <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.35)", fontStyle: "italic" }}>
                {room.styles[activeStyle].desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products Section ── */}
      <section style={{ background: "var(--bone)" }}>
        <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
            <div>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.4rem" }}>Produk Pilihan</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
                Untuk {room.name} Anda
              </h2>
            </div>
            <Link href="/koleksi"
              style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--charcoal-soft)", fontWeight: 500, borderBottom: "1px solid var(--stone-light)", paddingBottom: "2px", transition: "color 0.2s ease" }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--copper)")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--charcoal-soft)")}>
              Semua Produk
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="prod-grid">
            {room.products.map(p => (
              <Link key={p.id} href={`/product/${p.id}`}
                style={{ display: "block", textDecoration: "none" }}
                onMouseEnter={() => setHoverProd(p.id)}
                onMouseLeave={() => setHoverProd(null)}>
                <div style={{
                  background: "var(--white)", border: "1px solid var(--stone-light)", overflow: "hidden",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  boxShadow: hoverProd === p.id ? "0 12px 36px rgba(42,38,32,0.12)" : "none",
                  transform: hoverProd === p.id ? "translateY(-4px)" : "none",
                }}>
                  <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "var(--bone)" }}>
                    <Image src={p.img} alt={p.name} fill style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hoverProd === p.id ? "scale(1.05)" : "scale(1)" }} />
                    {/* Badges */}
                    {p.isNew && (
                      <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "var(--charcoal)", color: "var(--cream)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", padding: "0.25rem 0.6rem" }}>NEW</div>
                    )}
                    {p.isBest && !p.isNew && (
                      <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "var(--copper)", color: "var(--white)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", padding: "0.25rem 0.6rem" }}>BEST</div>
                    )}
                    {/* Quick add hover */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "rgba(42,38,32,0.85)", backdropFilter: "blur(4px)",
                      padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: hoverProd === p.id ? 1 : 0, transition: "opacity 0.25s ease",
                    }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cream)" }}>
                        Lihat Detail
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "0.9rem 1rem" }}>
                    <p style={{ fontSize: "0.65rem", color: "var(--copper)", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{p.cat}</p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.4rem", lineHeight: 1.3 }}>{p.name}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--charcoal)" }}>{formatRp(p.price)}</p>
                      <Stars n={p.rating} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Design Tips ── */}
      <section style={{ background: "var(--white)", borderTop: "1px solid var(--stone-light)", borderBottom: "1px solid var(--stone-light)" }}>
        <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "4.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "5rem", alignItems: "flex-start" }} className="tips-layout">
            {/* Left: heading */}
            <div style={{ position: "sticky", top: "90px" }}>
              <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.5rem" }}>Tips Desain</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.15, marginBottom: "1.25rem" }}>
                Panduan Mendekorasi {room.name}
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)", lineHeight: 1.8 }}>
                Tips dari tim desainer interior Maison untuk memaksimalkan potensi estetika dan kenyamanan {room.name} Anda.
              </p>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/tentang"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em",
                    textTransform: "uppercase", color: "var(--copper)",
                    borderBottom: "1px solid rgba(196,113,58,0.3)", paddingBottom: "2px",
                  }}>
                  Konsultasi Gratis
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: tips */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {room.tips.map((tip, i) => (
                <div key={i} style={{
                  padding: "2rem 0",
                  borderBottom: i < room.tips.length - 1 ? "1px solid var(--stone-light)" : "none",
                  display: "grid", gridTemplateColumns: "40px 1fr", gap: "1.5rem", alignItems: "flex-start",
                }}>
                  {/* Number */}
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "var(--bone)", border: "1px solid var(--stone-light)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 300, color: "var(--copper)" }}>
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.5rem" }}>
                      {tip.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)", lineHeight: 1.85 }}>
                      {tip.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Rooms ── */}
      <section style={{ background: "var(--bone)" }}>
        <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.4rem" }}>Jelajahi Ruangan Lain</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
              Ruangan Terkait
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="related-grid">
            {room.relatedRooms.map(rid => {
              const r = ALL_ROOMS[rid];
              if (!r) return null;
              const rData = ROOM_DATA[rid];
              return (
                <Link key={rid} href={`/ruangan/${rid}`}
                  style={{ display: "block", textDecoration: "none" }}
                  onMouseEnter={() => setHoverRoom(rid)}
                  onMouseLeave={() => setHoverRoom(null)}>
                  <div style={{
                    position: "relative", aspectRatio: "4/3", overflow: "hidden",
                    transition: "box-shadow 0.3s ease",
                    boxShadow: hoverRoom === rid ? "0 12px 40px rgba(42,38,32,0.18)" : "none",
                  }}>
                    <Image src={r.img} alt={r.name} fill style={{ objectFit: "cover", opacity: 0.75, transition: "transform 0.5s ease, opacity 0.3s ease", transform: hoverRoom === rid ? "scale(1.05)" : "scale(1)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,23,20,0.8) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.25rem" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, color: "var(--cream)", marginBottom: "0.25rem" }}>
                        {r.name}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "rgba(245,240,232,0.5)", letterSpacing: "0.08em" }}>
                        {rData?.count}+ produk
                      </p>
                    </div>
                    {/* Hover CTA */}
                    <div style={{
                      position: "absolute", top: "1rem", right: "1rem",
                      background: "var(--copper)", color: "var(--white)",
                      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em",
                      padding: "0.3rem 0.85rem", textTransform: "uppercase",
                      opacity: hoverRoom === rid ? 1 : 0, transition: "opacity 0.25s ease",
                    }}>
                      Jelajahi
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Back to all rooms */}
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/ruangan"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                padding: "0.9rem 2.5rem",
                background: "var(--white)", border: "1px solid var(--stone-light)",
                fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 500,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--charcoal)", transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--charcoal)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--cream)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--charcoal)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--white)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--charcoal)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--stone-light)";
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Semua Ruangan
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .prod-grid    { grid-template-columns: repeat(4, 1fr) !important; }
        .tips-layout  { grid-template-columns: 300px 1fr !important; }
        .related-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width: 1024px) {
          .prod-grid    { grid-template-columns: repeat(3, 1fr) !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .prod-grid    { grid-template-columns: repeat(2, 1fr) !important; }
          .tips-layout  { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .prod-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
