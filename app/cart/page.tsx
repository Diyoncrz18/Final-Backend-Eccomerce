"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavbarUser from "../components/NavbarUser";
import { addCartItem, addToWishlist, clearServerCart, fetchProducts, getCart, getImageUrl, getStoredUser, isAuthenticated, removeCartItem, updateCartItemQuantity, validateVoucher } from "../../services/api";

/* ─────────── Types ─────────── */
interface PageCartItem {
  id: number;
  productId: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
  img: string;
  imageUrl?: string;
  sku: string;
  stock: number;
  category: string;
}

interface RecommendationItem {
  id: number;
  name: string;
  price: number;
  img: string;
  imageUrl?: string;
  rating: number;
}

interface ProductRecommendationSource {
  id?: number;
  name?: string;
  price?: number;
  imageUrl?: string;
  rating?: number;
}

function mapCartItem(item: {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  variant: string;
  price: number;
  quantity: number;
  stock: number;
}): PageCartItem {
  return {
    id: item.id,
    productId: item.productId,
    name: item.productName,
    variant: item.variant,
    price: item.price,
    qty: item.quantity,
    img: item.productImage,
    imageUrl: item.productImage,
    sku: `SKU-${item.productId}`,
    stock: item.stock,
    category: "Furniture",
  };
}

async function saveCartItemToWishlist(item: PageCartItem) {
  return addToWishlist(item.productId || item.id);
}

interface AppliedPromo {
  code: string;
  discountType: string;
  discountValue: number;
}

function calculatePromoDiscount(promo: AppliedPromo | null, subtotal: number) {
  if (!promo) return 0;
  if (promo.discountType === "FIXED") {
    return Math.min(subtotal, Math.round(promo.discountValue));
  }
  return Math.round(subtotal * (promo.discountValue / 100));
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24"
          fill={i <= Math.round(n) ? "var(--copper)" : "var(--stone-light)"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

/* ─────────── Empty State ─────────── */
function EmptyCart() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "6rem 2rem", textAlign: "center",
    }}>
      <div style={{ marginBottom: "2rem", opacity: 0.25 }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="1">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.75rem" }}>
        Keranjang Anda Kosong
      </h2>
      <p style={{ fontSize: "0.9rem", color: "var(--stone)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "380px" }}>
        Temukan furnitur dan dekorasi impian Anda di koleksi Maison. Setiap produk dipilih dengan cermat untuk menciptakan rumah yang sempurna.
      </p>
      <Link href="/koleksi" style={{
        display: "inline-flex", alignItems: "center", gap: "0.6rem",
        background: "var(--charcoal)", color: "var(--cream)",
        padding: "1rem 2.5rem", fontFamily: "var(--font-body)",
        fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.15em",
        textTransform: "uppercase", transition: "background 0.3s ease",
      }}
        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--copper)")}
        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--charcoal)")}>
        Mulai Belanja
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

/* ─────────── Main Page ─────────── */
export default function CartPage() {
  const router = useRouter();
  const user = getStoredUser();
  const [items, setItems] = useState<PageCartItem[]>([]);

  const requireAuth = () => {
    if (isAuthenticated()) return true;
    router.push("/login");
    return false;
  };
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [wishlistSavingId, setWishlistSavingId] = useState<number | null>(null);
  const [clearingCart, setClearingCart] = useState(false);
  const [hoverRec, setHoverRec] = useState<number | null>(null);
  const [usePoints, setUsePoints] = useState(false);

  const loadCartFromServer = async () => {
    const cart = await getCart();
    setItems(cart.items.map(mapCartItem));
  };

  useEffect(() => {
    async function loadData() {
      try {
        if (!isAuthenticated()) {
          router.push("/login");
          return;
        }

        const [cart, products] = await Promise.all([
          getCart(),
          fetchProducts(0, 4),
        ]);

        setItems(cart.items.map(mapCartItem));
        if (products.length > 0) {
          setRecommendations((products as ProductRecommendationSource[]).map((p) => ({
            id: Number(p.id) || 0,
            name: p.name || "Produk",
            price: Number(p.price),
            img: p.imageUrl || "/product-chair.png",
            rating: Number(p.rating) || 4.5,
          })));
        }
      } catch (error) {
        console.error("Failed to load cart data:", error);
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [router]);

  /* Calculations */
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 5000000 ? 0 : 150000;
  const promoDisc = calculatePromoDiscount(appliedPromo, subtotal);
  const memberDisc = Math.round(subtotal * 0.05); // 5% gold member
  const pointsDisc = usePoints ? Math.min((user.points || 0) * 10, subtotal * 0.1) : 0; // 10 pts = Rp10, max 10%
  const total = subtotal + shipping - promoDisc - memberDisc - pointsDisc;
  const pointsEarned = Math.floor(total / 10000); // 1 point per Rp10,000

  /* Handlers */
  const updateQty = async (id: number, delta: number) => {
    const current = items.find(item => item.id === id);
    if (!current || updatingId === id) return;

    const nextQuantity = Math.max(1, Math.min(current.stock, current.qty + delta));
    if (nextQuantity === current.qty) return;

    setUpdatingId(id);
    setCartError("");
    setItems(prev => prev.map(item => item.id === id ? { ...item, qty: nextQuantity } : item));

    const result = await updateCartItemQuantity(id, nextQuantity);
    if (!result.success) {
      setCartError(result.message || "Jumlah produk gagal diperbarui.");
      await loadCartFromServer();
    } else if (result.item) {
      setItems(prev => prev.map(item => item.id === id ? mapCartItem(result.item!) : item));
    }
    setUpdatingId(null);
  };

  const removeItem = async (id: number) => {
    setRemovingId(id);
    setCartError("");

    const result = await removeCartItem(id);
    if (result.success) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setCartError(result.message || "Produk gagal dihapus dari keranjang.");
      await loadCartFromServer();
    }
    setRemovingId(null);
  };

  const clearCart = async () => {
    setClearingCart(true);
    setCartError("");

    const result = await clearServerCart();
    if (result.success) {
      setItems([]);
      setAppliedPromo(null);
      setPromoCode("");
    } else {
      setCartError(result.message || "Keranjang gagal dikosongkan.");
    }
    setClearingCart(false);
  };

  const saveToWishlist = async (item: PageCartItem) => {
    if (!requireAuth()) return;
    setWishlistSavingId(item.id);
    setCartError("");
    setCartMessage("");

    const result = await saveCartItemToWishlist(item);
    if (result.success) {
      setCartMessage(`${item.name} disimpan ke wishlist.`);
    } else {
      setCartError(result.message || "Produk gagal disimpan ke wishlist.");
    }
    setWishlistSavingId(null);
  };

  const addRecommendationToCart = async (item: RecommendationItem) => {
    if (!requireAuth()) return;
    setCartError("");
    setCartMessage("");

    const result = await addCartItem(item.id, 1, "Default");
    if (result.success) {
      await loadCartFromServer();
      setCartMessage(`${item.name} ditambahkan ke keranjang.`);
    } else {
      setCartError(result.message || "Produk gagal ditambahkan ke keranjang.");
    }
  };

  const applyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    setPromoLoading(true);
    const result = await validateVoucher(code, subtotal);
    setPromoLoading(false);

    if (result.valid) {
      const discountType = result.discountType || "PERCENT";
      const discountValue = Number(result.discountValue || 0);
      setAppliedPromo({ code, discountType, discountValue });
      setPromoSuccess(`Kode "${code}" berhasil diterapkan.`);
      setPromoError("");
    } else {
      setPromoError(result.message || "Kode promo tidak valid atau sudah kadaluarsa.");
      setPromoSuccess("");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoSuccess("");
    setPromoError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={user} />

      {/* ── Page Header ── */}
      <div style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--stone-light)",
        paddingTop: "72px",
      }}>
        <div className="container-main" style={{ padding: "2rem var(--container-px, 2rem)" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--stone)", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            <Link href="/dashboard" style={{ color: "inherit" }}>Beranda</Link>
            {" / "}
            <span style={{ color: "var(--charcoal)" }}>Keranjang</span>
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
              Keranjang Belanja
            </h1>
            {items.length > 0 && (
              <span style={{ fontSize: "0.82rem", color: "var(--stone)" }}>
                {items.reduce((s, i) => s + i.qty, 0)} item
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container-main" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        {cartError && (
          <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.18)", color: "#B91C1C", padding: "0.85rem 1rem", marginBottom: "1rem", fontSize: "0.84rem" }}>
            {cartError}
          </div>
        )}
        {cartMessage && (
          <div style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.18)", color: "#15803D", padding: "0.85rem 1rem", marginBottom: "1rem", fontSize: "0.84rem" }}>
            {cartMessage}
          </div>
        )}
        {loading ? (
          <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)", padding: "3rem", textAlign: "center", color: "var(--stone)" }}>
            Memuat keranjang...
          </div>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2.5rem", alignItems: "flex-start" }} className="cart-layout">

            {/* ═══════════ LEFT: Cart Items ═══════════ */}
            <div>
              {/* Column headers */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr auto auto",
                gap: "1rem", paddingBottom: "0.75rem",
                borderBottom: "2px solid var(--charcoal)",
                marginBottom: "0",
              }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--charcoal)" }}>Produk</p>
                <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--charcoal)", textAlign: "center", minWidth: "120px" }}>Jumlah</p>
                <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--charcoal)", textAlign: "right", minWidth: "120px" }}>Total</p>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item.id}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr auto auto",
                    gap: "1.5rem", alignItems: "center",
                    padding: "1.75rem 0",
                    borderBottom: "1px solid var(--stone-light)",
                    opacity: removingId === item.id ? 0 : 1,
                    transform: removingId === item.id ? "translateX(-12px)" : "none",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                  }}>
                  {/* Product info */}
                  <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                    {/* Image */}
                    <Link href={`/product/${item.productId}`} style={{ flexShrink: 0, display: "block" }}>
                      <div style={{ width: "100px", height: "100px", position: "relative", overflow: "hidden", background: "var(--bone)", border: "1px solid var(--stone-light)" }}>
                        <Image src={getImageUrl(item.imageUrl || item.img)} alt={item.name} fill style={{ objectFit: "cover" }} />
                      </div>
                    </Link>
                    {/* Details */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--copper)", marginBottom: "0.25rem" }}>
                        {item.category}
                      </p>
                      <Link href={`/product/${item.productId}`} style={{ display: "block", marginBottom: "0.3rem" }}>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.2 }}>
                          {item.name}
                        </p>
                      </Link>
                      <p style={{ fontSize: "0.75rem", color: "var(--stone)", marginBottom: "0.25rem" }}>
                        Variasi: <span style={{ color: "var(--charcoal-soft)" }}>{item.variant}</span>
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--stone)", marginBottom: "0.75rem" }}>
                        SKU: {item.sku}
                      </p>
                      {/* Unit price */}
                      <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--charcoal)" }}>
                        {formatRp(item.price)} / unit
                      </p>
                      {/* Remove + Wishlist */}
                      <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem" }}>
                        <button onClick={() => void removeItem(item.id)}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontSize: "0.72rem", color: "var(--stone)", letterSpacing: "0.06em",
                            display: "flex", alignItems: "center", gap: "0.3rem",
                            padding: 0, fontFamily: "var(--font-body)",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#DC2626")}
                          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--stone)")}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                          Hapus
                        </button>
                        <button
                          onClick={() => void saveToWishlist(item)}
                          disabled={wishlistSavingId === item.id}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontSize: "0.72rem", color: "var(--stone)", letterSpacing: "0.06em",
                            display: "flex", alignItems: "center", gap: "0.3rem",
                            padding: 0, fontFamily: "var(--font-body)",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--copper)")}
                          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--stone)")}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          {wishlistSavingId === item.id ? "Menyimpan..." : "Simpan ke Wishlist"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Qty picker */}
                  <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center" }}>
                    <button onClick={() => void updateQty(item.id, -1)}
                      disabled={updatingId === item.id || item.qty <= 1}
                      style={{
                        width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: "var(--white)", border: "1px solid var(--stone-light)",
                        cursor: updatingId === item.id || item.qty <= 1 ? "not-allowed" : "pointer", fontSize: "1.1rem", color: item.qty <= 1 ? "var(--stone-light)" : "var(--charcoal)",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--bone)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--white)")}>
                      −
                    </button>
                    <div style={{
                      width: "48px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--white)", borderTop: "1px solid var(--stone-light)", borderBottom: "1px solid var(--stone-light)",
                      fontSize: "0.9rem", fontWeight: 500, color: "var(--charcoal)",
                    }}>
                      {item.qty}
                    </div>
                    <button onClick={() => void updateQty(item.id, 1)}
                      style={{
                        width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: "var(--white)", border: "1px solid var(--stone-light)",
                        cursor: item.qty >= item.stock || updatingId === item.id ? "not-allowed" : "pointer",
                        fontSize: "1.1rem", color: item.qty >= item.stock ? "var(--stone-light)" : "var(--charcoal)",
                        transition: "background 0.2s ease",
                      }}
                      disabled={item.qty >= item.stock || updatingId === item.id}
                      onMouseEnter={e => item.qty < item.stock && ((e.currentTarget as HTMLButtonElement).style.background = "var(--bone)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--white)")}>
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <div style={{ textAlign: "right", minWidth: "120px" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300, color: "var(--charcoal)" }}>
                      {formatRp(item.price * item.qty)}
                    </p>
                    {item.qty > 1 && (
                      <p style={{ fontSize: "0.7rem", color: "var(--stone)", marginTop: "0.15rem" }}>
                        {item.qty} × {formatRp(item.price)}
                      </p>
                    )}
                    {item.stock <= 3 && (
                      <p style={{ fontSize: "0.65rem", color: "#DC2626", marginTop: "0.3rem" }}>
                        Sisa {item.stock} di stok
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.75rem" }}>
                <Link href="/koleksi"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--charcoal-soft)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--copper)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--charcoal-soft)")}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Lanjut Belanja
                </Link>
                <button onClick={() => void clearCart()}
                  disabled={clearingCart}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "0.75rem", color: "var(--stone)", letterSpacing: "0.06em",
                    fontFamily: "var(--font-body)", transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "#DC2626")}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--stone)")}>
                  {clearingCart ? "Mengosongkan..." : "Kosongkan Keranjang"}
                </button>
              </div>
            </div>

            {/* ═══════════ RIGHT: Order Summary ═══════════ */}
            <div style={{ position: "sticky", top: "90px" }}>
              <div style={{ background: "var(--white)", border: "1px solid var(--stone-light)" }}>
                {/* Header */}
                <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid var(--stone-light)", background: "var(--charcoal)" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 300, color: "var(--cream)" }}>
                    Ringkasan Pesanan
                  </p>
                </div>

                <div style={{ padding: "1.5rem 1.75rem" }}>
                  {/* Price breakdown */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)" }}>
                        Subtotal ({items.reduce((s, i) => s + i.qty, 0)} item)
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--charcoal)" }}>{formatRp(subtotal)}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)" }}>
                        Ongkos Kirim
                        {shipping === 0 && <span style={{ fontSize: "0.65rem", color: "var(--copper)", marginLeft: "0.4rem" }}>GRATIS</span>}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 500, color: shipping === 0 ? "var(--copper)" : "var(--charcoal)" }}>
                        {shipping === 0 ? "Gratis" : formatRp(shipping)}
                      </span>
                    </div>

                    {/* Member discount */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)" }}>Diskon Member</span>
                        <span style={{ fontSize: "0.62rem", color: "var(--copper)", marginLeft: "0.4rem" }}>Gold 5%</span>
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--copper)" }}>-{formatRp(memberDisc)}</span>
                    </div>

                    {/* Promo discount */}
                    {appliedPromo && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)" }}>Promo</span>
                          <span style={{
                            fontSize: "0.6rem", fontWeight: 700, color: "var(--white)",
                            background: "var(--copper)", padding: "0.1rem 0.45rem", letterSpacing: "0.08em",
                          }}>{appliedPromo.code}</span>
                          <button onClick={removePromo}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--stone)", lineHeight: 0, padding: 0 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--copper)" }}>-{formatRp(promoDisc)}</span>
                      </div>
                    )}

                    {/* Points */}
                    {usePoints && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--charcoal-soft)" }}>Tukar Poin</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--copper)" }}>-{formatRp(pointsDisc)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "baseline",
                    padding: "1.25rem 0",
                    borderTop: "2px solid var(--charcoal)", borderBottom: "1px solid var(--stone-light)",
                    marginBottom: "1.5rem",
                  }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--charcoal)" }}>Total</span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, color: "var(--charcoal)" }}>{formatRp(total)}</span>
                  </div>

                  {/* Points toggle */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.85rem 1rem", background: "var(--bone)",
                    border: "1px solid var(--stone-light)", marginBottom: "1rem",
                  }}>
                    <div>
                      <p style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--charcoal)", marginBottom: "0.15rem" }}>
                        Gunakan Poin ({(user.points || 0).toLocaleString()} pts)
                      </p>
                      <p style={{ fontSize: "0.68rem", color: "var(--stone)" }}>
                        Hemat hingga {formatRp(Math.min((user.points || 0) * 10, subtotal * 0.1))}
                      </p>
                    </div>
                    <button onClick={() => setUsePoints(!usePoints)}
                      style={{
                        width: "40px", height: "22px", borderRadius: "11px",
                        background: usePoints ? "var(--copper)" : "var(--stone-light)",
                        border: "none", cursor: "pointer", position: "relative",
                        transition: "background 0.25s ease", flexShrink: 0,
                      }}>
                      <span style={{
                        position: "absolute", top: "3px",
                        left: usePoints ? "21px" : "3px",
                        width: "16px", height: "16px", borderRadius: "50%",
                        background: "var(--white)",
                        transition: "left 0.25s ease",
                      }} />
                    </button>
                  </div>

                  {/* Promo code */}
                  {!appliedPromo && (
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="text"
                          value={promoCode}
                          onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); setPromoSuccess(""); }}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void applyPromo();
                            }
                          }}
                          placeholder="Kode promo..."
                          id="promo-input"
                          style={{
                            flex: 1, padding: "0.75rem 1rem",
                            border: `1px solid ${promoError ? "#DC2626" : "var(--stone-light)"}`,
                            background: "var(--white)", fontFamily: "var(--font-body)",
                            fontSize: "0.82rem", color: "var(--charcoal)",
                            outline: "none", letterSpacing: "0.08em",
                          }}
                        />
                        <button onClick={() => void applyPromo()}
                          disabled={promoLoading}
                          style={{
                            padding: "0.75rem 1rem", background: "var(--charcoal)", border: "none",
                            color: "var(--cream)", fontFamily: "var(--font-body)",
                            fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em",
                            textTransform: "uppercase", cursor: promoLoading ? "not-allowed" : "pointer",
                            transition: "background 0.2s ease", whiteSpace: "nowrap",
                          }}
                          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--copper)")}
                          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "var(--charcoal)")}>
                          {promoLoading ? "Cek..." : "Terapkan"}
                        </button>
                      </div>
                      {promoError && <p style={{ fontSize: "0.72rem", color: "#DC2626", marginTop: "0.4rem" }}>{promoError}</p>}
                    </div>
                  )}
                  {promoSuccess && <p style={{ fontSize: "0.72rem", color: "#16A34A", marginBottom: "1rem" }}>✓ {promoSuccess}</p>}

                  {/* Checkout button */}
                  <Link href="/checkout"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                      width: "100%", padding: "1.1rem",
                      background: "var(--charcoal)", color: "var(--cream)",
                      fontFamily: "var(--font-body)", fontSize: "0.82rem",
                      fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
                      transition: "background 0.3s ease",
                    }}
                    onClick={e => {
                      if (requireAuth()) return;
                      e.preventDefault();
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--copper)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--charcoal)")}>
                    Lanjut ke Pembayaran
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>

                  {/* Points earned info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", justifyContent: "center" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--copper)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <p style={{ fontSize: "0.72rem", color: "var(--stone)" }}>
                      Dapatkan <strong style={{ color: "var(--copper)" }}>{pointsEarned.toLocaleString()} poin</strong> dari pembelian ini
                    </p>
                  </div>

                  {/* Trust badges */}
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--stone-light)" }}>
                    {[
                      {
                        label: "Pembayaran Aman",
                        icon: (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        ),
                      },
                      {
                        label: "Gratis Ongkir",
                        icon: (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                            <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                          </svg>
                        ),
                      },
                      {
                        label: "30 Hari Retur",
                        icon: (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                          </svg>
                        ),
                      },
                    ].map(b => (
                      <div key={b.label} style={{ textAlign: "center", flex: 1 }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: "rgba(196,113,58,0.08)", border: "1px solid rgba(196,113,58,0.18)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          margin: "0 auto 0.4rem",
                        }}>
                          {b.icon}
                        </div>
                        <p style={{ fontSize: "0.6rem", color: "var(--stone)", lineHeight: 1.4 }}>{b.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Free shipping progress */}
              {subtotal < 5000000 && (
                <div style={{
                  background: "var(--white)", border: "1px solid var(--stone-light)",
                  padding: "1rem 1.25rem", marginTop: "0.75rem",
                }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--charcoal-soft)", marginBottom: "0.6rem" }}>
                    Tambah <strong style={{ color: "var(--charcoal)" }}>{formatRp(5000000 - subtotal)}</strong> lagi untuk gratis ongkir
                  </p>
                  <div style={{ height: "3px", background: "var(--stone-light)", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((subtotal / 5000000) * 100, 100)}%`, height: "100%", background: "var(--copper)", transition: "width 0.5s ease" }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Product Recommendations ── */}
      {items.length > 0 && (
        <section style={{ background: "var(--white)", borderTop: "1px solid var(--stone-light)" }}>
          <div className="container-main" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
              <div>
                <p className="text-label" style={{ color: "var(--copper)", marginBottom: "0.4rem" }}>Pelengkap Sempurna</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
                  Sering Dibeli Bersama
                </h2>
              </div>
              <Link href="/koleksi" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--charcoal-soft)", fontWeight: 500, borderBottom: "1px solid var(--stone-light)", paddingBottom: "2px" }}>
                Lihat Semua
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="rec-grid">
              {recommendations.map(item => (
                <Link key={item.id} href={`/product/${item.id}`}
                  style={{ display: "block", textDecoration: "none" }}
                  onMouseEnter={() => setHoverRec(item.id)}
                  onMouseLeave={() => setHoverRec(null)}>
                  <div style={{
                    background: "var(--bone)", border: "1px solid var(--stone-light)", overflow: "hidden",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    boxShadow: hoverRec === item.id ? "0 12px 36px rgba(42,38,32,0.12)" : "none",
                    transform: hoverRec === item.id ? "translateY(-4px)" : "none",
                  }}>
                    <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
                      <Image src={getImageUrl(item.imageUrl || item.img)} alt={item.name} fill style={{ objectFit: "cover", transition: "transform 0.5s ease", transform: hoverRec === item.id ? "scale(1.04)" : "scale(1)" }} />
                      <button onClick={e => {
                        e.preventDefault();
                        void addRecommendationToCart(item);
                      }}
                        style={{
                          position: "absolute", bottom: "0.75rem", left: "50%", transform: "translateX(-50%)",
                          background: "var(--cream)", border: "none", color: "var(--charcoal)",
                          padding: "0.55rem 1.25rem", fontFamily: "var(--font-body)",
                          fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                          cursor: "pointer", whiteSpace: "nowrap",
                          opacity: hoverRec === item.id ? 1 : 0, transition: "opacity 0.25s ease",
                        }}>
                        + Keranjang
                      </button>
                    </div>
                    <div style={{ padding: "0.85rem 1rem" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.35rem" }}>
                        {item.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--charcoal)" }}>{formatRp(item.price)}</p>
                        <Stars n={item.rating} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style jsx global>{`
        .cart-layout { grid-template-columns: 1fr 380px !important; }
        .rec-grid    { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 1100px) {
          .cart-layout { grid-template-columns: 1fr !important; }
          .rec-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .rec-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
