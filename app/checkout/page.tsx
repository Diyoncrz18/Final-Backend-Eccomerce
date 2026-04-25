"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavbarUser from "../components/NavbarUser";
import { clearServerCart, createOrder, getCart, getImageUrl, getStoredUser, isAuthenticated, type CartItem } from "../../services/api";

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function itemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = getStoredUser();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [customerNote, setCustomerNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCheckout() {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      const cart = await getCart();
      setItems(cart.items);
      setLoading(false);
    }

    void loadCheckout();
  }, [router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 5000000 ? 0 : 150000;
  const memberDiscount = Math.round(subtotal * 0.05);
  const total = subtotal + shippingFee - memberDiscount;

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Keranjang masih kosong.");
      return;
    }
    if (!shippingAddress.trim()) {
      setError("Alamat pengiriman wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError("");

    const note = [
      `Metode pembayaran: ${paymentMethod}`,
      customerNote.trim(),
    ].filter(Boolean).join("\n");

    const result = await createOrder({
      shippingAddress: shippingAddress.trim(),
      billingAddress: shippingAddress.trim(),
      customerNote: note,
      tax: 0,
      shippingFee,
      discount: memberDiscount,
      orderItems: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    if (!result.success) {
      setError(result.message || "Checkout gagal diproses.");
      setSubmitting(false);
      return;
    }

    await clearServerCart();
    router.push("/dashboard/orders");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bone)" }}>
      <NavbarUser user={user} />

      <div style={{ background: "var(--white)", borderBottom: "1px solid var(--stone-light)", paddingTop: "72px" }}>
        <div className="container-main" style={{ padding: "2rem var(--container-px, 2rem)" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--stone)", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            <Link href="/cart" style={{ color: "inherit" }}>Keranjang</Link>
            {" / "}
            <span style={{ color: "var(--charcoal)" }}>Checkout</span>
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300, color: "var(--charcoal)" }}>
            Checkout
          </h1>
        </div>
      </div>

      <main className="container-main checkout-layout" style={{ paddingTop: "3rem", paddingBottom: "5rem", display: "grid", gridTemplateColumns: "1fr 380px", gap: "2.5rem", alignItems: "start" }}>
        {loading ? (
          <div style={{ gridColumn: "1 / -1", background: "var(--white)", border: "1px solid var(--stone-light)", padding: "3rem", textAlign: "center", color: "var(--stone)" }}>
            Memuat checkout...
          </div>
        ) : items.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", background: "var(--white)", border: "1px solid var(--stone-light)", padding: "3rem", textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.75rem" }}>
              Keranjang Kosong
            </h2>
            <Link href="/koleksi" style={{ color: "var(--copper)", fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <>
            <section style={{ background: "var(--white)", border: "1px solid var(--stone-light)" }}>
              <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid var(--stone-light)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 300, color: "var(--charcoal)" }}>
                  Data Pengiriman
                </p>
              </div>

              <div style={{ padding: "1.75rem", display: "grid", gap: "1.25rem" }}>
                <label style={{ display: "grid", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--charcoal)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Alamat Lengkap</span>
                  <textarea
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    rows={5}
                    placeholder="Nama penerima, nomor telepon, jalan, kota, provinsi, kode pos"
                    style={{ width: "100%", resize: "vertical", padding: "0.95rem 1rem", border: "1px solid var(--stone-light)", background: "var(--bone)", color: "var(--charcoal)", fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.7, outline: "none" }}
                  />
                </label>

                <label style={{ display: "grid", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--charcoal)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Metode Pembayaran</span>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    style={{ width: "100%", padding: "0.95rem 1rem", border: "1px solid var(--stone-light)", background: "var(--bone)", color: "var(--charcoal)", fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none" }}
                  >
                    <option>Transfer Bank</option>
                    <option>Virtual Account</option>
                    <option>COD</option>
                    <option>E-Wallet</option>
                  </select>
                </label>

                <label style={{ display: "grid", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--charcoal)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Catatan</span>
                  <textarea
                    value={customerNote}
                    onChange={e => setCustomerNote(e.target.value)}
                    rows={3}
                    placeholder="Opsional"
                    style={{ width: "100%", resize: "vertical", padding: "0.95rem 1rem", border: "1px solid var(--stone-light)", background: "var(--bone)", color: "var(--charcoal)", fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.7, outline: "none" }}
                  />
                </label>

                {error && (
                  <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.18)", color: "#B91C1C", padding: "0.85rem 1rem", fontSize: "0.84rem" }}>
                    {error}
                  </div>
                )}
              </div>
            </section>

            <aside style={{ position: "sticky", top: "90px", background: "var(--white)", border: "1px solid var(--stone-light)" }}>
              <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid var(--stone-light)", background: "var(--charcoal)" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 300, color: "var(--cream)" }}>
                  Ringkasan
                </p>
              </div>

              <div style={{ padding: "1.5rem 1.75rem" }}>
                <div style={{ display: "grid", gap: "1rem", marginBottom: "1.25rem" }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: "0.85rem", alignItems: "center" }}>
                      <div style={{ width: "64px", height: "64px", position: "relative", background: "var(--bone)", border: "1px solid var(--stone-light)", overflow: "hidden" }}>
                        <Image src={getImageUrl(item.productImage)} alt={item.productName} fill style={{ objectFit: "cover" }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.98rem", fontWeight: 300, color: "var(--charcoal)", lineHeight: 1.25 }}>
                          {item.productName}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--stone)", marginTop: "0.2rem" }}>
                          {item.quantity} x {formatRp(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gap: "0.75rem", borderTop: "1px solid var(--stone-light)", paddingTop: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--charcoal-soft)" }}>Subtotal ({itemCount(items)} item)</span>
                    <strong style={{ color: "var(--charcoal)" }}>{formatRp(subtotal)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--charcoal-soft)" }}>Ongkos Kirim</span>
                    <strong style={{ color: shippingFee === 0 ? "var(--copper)" : "var(--charcoal)" }}>{shippingFee === 0 ? "Gratis" : formatRp(shippingFee)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--charcoal-soft)" }}>Diskon Member</span>
                    <strong style={{ color: "var(--copper)" }}>-{formatRp(memberDiscount)}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "1.25rem 0", paddingTop: "1.25rem", borderTop: "2px solid var(--charcoal)" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--charcoal)" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 300, color: "var(--charcoal)" }}>{formatRp(total)}</span>
                </div>

                <button
                  onClick={() => void handleCheckout()}
                  disabled={submitting}
                  style={{ width: "100%", padding: "1.1rem", border: "none", background: submitting ? "var(--stone)" : "var(--charcoal)", color: "var(--cream)", fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Memproses..." : "Buat Pesanan"}
                </button>
              </div>
            </aside>
          </>
        )}
      </main>

      <style jsx global>{`
        @media (max-width: 1000px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
