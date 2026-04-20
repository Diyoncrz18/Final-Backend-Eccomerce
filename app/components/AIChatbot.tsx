"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ──────────────────────────────────────
   PRODUCT CATALOG (Mock — ganti dengan API nanti)
──────────────────────────────────────── */
const PRODUCTS = [
  { id: 1, name: "Bouclé Armchair", category: "Kursi", price: 6400000, img: "/product-chair.png", href: "/product/1", keywords: ["kursi", "chair", "duduk", "ruang tamu", "santai", "bouclé", "tekstur"] },
  { id: 2, name: "Olive Linen Sofa", category: "Kursi", price: 12500000, img: "/product-sofa.png", href: "/product/2", keywords: ["sofa", "kursi panjang", "ruang tamu", "linen", "keluarga", "kumpul"] },
  { id: 3, name: "Velvet Accent Chair", category: "Kursi", price: 5040000, img: "/product-velvet-chair.png", href: "/product/3", keywords: ["kursi", "beludru", "velvet", "aksen", "pojok", "kamar"] },
  { id: 4, name: "Marble Side Table", category: "Meja", price: 3360000, img: "/product-marble-table.png", href: "/product/4", keywords: ["meja", "marmer", "samping", "sudut", "dekorasi", "mewah"] },
  { id: 5, name: "Oak Dining Table", category: "Meja", price: 9800000, img: "/product-table.png", href: "/product/5", keywords: ["meja makan", "kayu", "oak", "dining", "keluarga", "makan"] },
  { id: 6, name: "Rattan Pendant Lamp", category: "Lampu", price: 2750000, img: "/product-lamp.png", href: "/product/7", keywords: ["lampu", "rotan", "gantung", "pendant", "anyaman", "alami"] },
  { id: 7, name: "Japandi Floor Lamp", category: "Lampu", price: 1850000, img: "/product-lamp.png", href: "/product/8", keywords: ["lampu", "lantai", "japandi", "minimalis", "sudut", "kamar"] },
  { id: 8, name: "Ceramic Statement Vase", category: "Dekorasi", price: 945000, img: "/product-ceramic-vase.png", href: "/product/9", keywords: ["vas", "keramik", "dekorasi", "bunga", "meja", "cantik"] },
  { id: 9, name: "Rattan Wall Panel", category: "Dekorasi", price: 1470000, img: "/product-rattan-wall.png", href: "/product/11", keywords: ["panel", "rotan", "dinding", "wallart", "dekorasi", "alami"] },
];

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  products?: typeof PRODUCTS;
  timestamp: Date;
}

/* ──────────────────────────────────────
   AI Engine (Frontend rule-based + placeholder for real API)
──────────────────────────────────────── */
function getAIResponse(input: string): { text: string; products?: typeof PRODUCTS } {
  const q = input.toLowerCase();

  const matched = PRODUCTS.filter((p) =>
    p.keywords.some((k) => q.includes(k)) ||
    p.name.toLowerCase().split(" ").some((w) => q.includes(w)) ||
    p.category.toLowerCase().includes(q)
  );

  /* ── Greeting ── */
  if (/^(halo|hai|hi|hello|selamat|good)/.test(q)) {
    return {
      text: "Halo! Saya *Maison AI*, asisten desain interior Anda. Saya siap membantu Anda menemukan furnitur dan dekorasi sempurna. Ceritakan tentang ruangan atau gaya yang Anda inginkan! ✨",
    };
  }

  /* ── Budget ── */
  if (q.includes("murah") || q.includes("budget") || q.includes("terjangkau") || q.includes("harga")) {
    const budget = PRODUCTS.filter((p) => p.price < 3000000).slice(0, 3);
    return {
      text: "Ini rekomendasi produk terbaik dengan harga di bawah Rp 3.000.000 — kualitas premium, tetap sesuai anggaran Anda:",
      products: budget,
    };
  }

  /* ── Room-specific ── */
  if (q.includes("ruang tamu") || q.includes("living room") || q.includes("tamu")) {
    const living = PRODUCTS.filter((p) => [1, 2, 4, 6].includes(p.id));
    return {
      text: "Untuk ruang tamu yang elegan dan nyaman, saya rekomendasikan kombinasi berikut — pilih yang sesuai dengan estetika Anda:",
      products: living,
    };
  }

  if (q.includes("kamar") || q.includes("bedroom") || q.includes("tidur")) {
    const bedroom = PRODUCTS.filter((p) => [3, 7, 8].includes(p.id));
    return {
      text: "Untuk kamar tidur yang menjadi sanctuary pribadi Anda, pertimbangkan pilihan berikut:",
      products: bedroom,
    };
  }

  if (q.includes("dapur") || q.includes("makan") || q.includes("dining")) {
    const dining = PRODUCTS.filter((p) => [5, 4].includes(p.id));
    return {
      text: "Untuk ruang makan yang stylish dan fungsional, berikut rekomendasi saya:",
      products: dining,
    };
  }

  /* ── Style ── */
  if (q.includes("minimalis") || q.includes("japandi") || q.includes("modern")) {
    const minimal = PRODUCTS.filter((p) => [1, 7, 8, 9].includes(p.id));
    return {
      text: "Gaya minimalis Japandi sangat populer saat ini — clean lines, natural materials, dan ketenangan visual. Ini pilihan yang cocok:",
      products: minimal,
    };
  }

  if (q.includes("alami") || q.includes("natural") || q.includes("rotan") || q.includes("kayu")) {
    const natural = PRODUCTS.filter((p) => [5, 6, 9].includes(p.id));
    return {
      text: "Sentuhan alami membawa kehangatan dan ketenangan ke rumah. Koleksi berbahan rotan dan kayu kami:",
      products: natural,
    };
  }

  if (q.includes("mewah") || q.includes("luxury") || q.includes("premium") || q.includes("elegan")) {
    const luxury = PRODUCTS.filter((p) => [2, 4, 5].includes(p.id));
    return {
      text: "Untuk sentuhan kemewahan di setiap sudut rumah Anda, pilihan terbaik kami:",
      products: luxury,
    };
  }

  /* ── Specific category match ── */
  if (matched.length > 0) {
    return {
      text: `Saya menemukan ${matched.length} produk yang cocok dengan yang Anda cari:`,
      products: matched.slice(0, 3),
    };
  }

  /* ── Fallback ── */
  const random = PRODUCTS.sort(() => Math.random() - 0.5).slice(0, 3);
  return {
    text: "Ceritakan lebih lanjut tentang ruangan atau gaya yang Anda inginkan, dan saya akan memberikan rekomendasi yang lebih personal. Sementara itu, ini beberapa produk populer kami:",
    products: random,
  };
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

/* ──────────────────────────────────────
   PRODUCT CARD in Chat
──────────────────────────────────────── */
function ChatProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  return (
    <Link
      href={product.href}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.65rem",
          padding: "0.65rem",
          background: "#FAF8F5",
          border: "1px solid #E4DDD3",
          transition: "border-color 0.2s, transform 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "#C4713A";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "#E4DDD3";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* Image */}
        <div
          style={{
            width: "56px",
            height: "56px",
            flexShrink: 0,
            background: "#F4F0EA",
            overflow: "hidden",
          }}
        >
          <img
            src={product.img}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#C4713A",
              marginBottom: "0.15rem",
            }}
          >
            {product.category}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "#1A1714",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginBottom: "0.15rem",
            }}
          >
            {product.name}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#6B6560", fontWeight: 500 }}>
            {formatRp(product.price)}
          </div>
        </div>
        {/* Arrow */}
        <div style={{ display: "flex", alignItems: "center", color: "#C4713A" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────
   MESSAGE BUBBLE
──────────────────────────────────────── */
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  /* Parse *bold* text */
  const parsed = msg.text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: "0.5rem",
        marginBottom: "1rem",
        alignItems: "flex-start",
      }}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          style={{
            width: "28px",
            height: "28px",
            background: "linear-gradient(135deg, #C4713A, #8A4A1E)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5">
            <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
            <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
            <circle cx="19" cy="7" r="3" fill="#FAF8F5" stroke="none" />
            <line x1="19" y1="5" x2="19" y2="9" stroke="#C4713A" strokeWidth="1.5" />
            <line x1="17" y1="7" x2="21" y2="7" stroke="#C4713A" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* Text bubble */}
        <div
          style={{
            padding: "0.7rem 0.9rem",
            background: isUser ? "#1A1714" : "#FAF8F5",
            border: isUser ? "none" : "1px solid #E4DDD3",
            color: isUser ? "#FAF8F5" : "#2A2620",
            fontSize: "0.82rem",
            lineHeight: 1.65,
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            fontFamily: "var(--font-body)",
          }}
          dangerouslySetInnerHTML={{ __html: parsed }}
        />

        {/* Product recommendations */}
        {msg.products && msg.products.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {msg.products.map((p) => (
              <ChatProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          style={{
            fontSize: "0.58rem",
            color: "#B8AFA0",
            textAlign: isUser ? "right" : "left",
            paddingInline: "0.35rem",
          }}
        >
          {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   QUICK PROMPTS
──────────────────────────────────────── */
const QUICK_PROMPTS = [
  "Rekomendasi untuk ruang tamu",
  "Produk paling populer",
  "Furnitur budget di bawah 3 juta",
  "Gaya minimalis Japandi",
  "Dekorasi untuk kamar tidur",
];

/* ──────────────────────────────────────
   MAIN CHATBOT COMPONENT
──────────────────────────────────────── */
export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Halo! Saya *Maison AI*, asisten desain interior Anda. 🏠\n\nCeritakan tentang ruangan yang ingin Anda dekorasi, gaya yang Anda sukai, atau anggaran yang dimiliki — saya akan merekomendasikan produk yang tepat untuk Anda!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stop pulse after 5s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate AI thinking delay
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

    const response = getAIResponse(text);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      text: response.text,
      products: response.products,
      timestamp: new Date(),
    };

    setTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Chat Window ── */}
      <div
        style={{
          position: "fixed",
          bottom: "5.5rem",
          right: "1.5rem",
          width: open ? "380px" : "0",
          height: open ? "600px" : "0",
          background: "#FAF8F5",
          border: open ? "1px solid #E4DDD3" : "none",
          boxShadow: open ? "0 24px 64px rgba(26,23,20,0.18), 0 4px 16px rgba(26,23,20,0.08)" : "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          zIndex: 998,
          borderRadius: "2px",
          fontFamily: "var(--font-body)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#1A1714",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
          }}
        >
          {/* AI Avatar */}
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #C4713A, #8A4A1E)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5">
              <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
              <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
              <circle cx="19" cy="7" r="2.5" fill="#C4713A" stroke="none" />
              <line x1="19" y1="5.5" x2="19" y2="8.5" stroke="#FAF8F5" strokeWidth="1.2" />
              <line x1="17.5" y1="7" x2="20.5" y2="7" stroke="#FAF8F5" strokeWidth="1.2" />
            </svg>
          </div>

          {/* Name + Status */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 300,
                color: "#FAF8F5",
                fontStyle: "italic",
                lineHeight: 1,
                marginBottom: "0.2rem",
              }}
            >
              Maison AI
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#4ADE80",
                  animation: "ping 1.5s infinite",
                }}
              />
              <span style={{ fontSize: "0.62rem", color: "rgba(250,248,245,0.55)", letterSpacing: "0.08em" }}>
                Asisten Desain Interior
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button
              onClick={() => setMessages([{
                id: "welcome-new",
                role: "ai",
                text: "Percakapan baru dimulai. Ada yang bisa saya bantu?",
                timestamp: new Date(),
              }])}
              title="Percakapan baru"
              style={{
                background: "rgba(250,248,245,0.08)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(250,248,245,0.6)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(250,248,245,0.15)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(250,248,245,0.08)")}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </button>
            <button
              onClick={() => setOpen(false)}
              title="Tutup"
              style={{
                background: "rgba(250,248,245,0.08)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(250,248,245,0.6)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(250,248,245,0.15)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(250,248,245,0.08)")}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            background: "#F4F0EA",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: "linear-gradient(135deg, #C4713A, #8A4A1E)",
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5">
                  <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z" />
                  <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
                </svg>
              </div>
              <div style={{ padding: "0.6rem 0.9rem", background: "#FAF8F5", border: "1px solid #E4DDD3", borderRadius: "16px 16px 16px 4px", display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#C4713A", opacity: 0.6,
                    animation: `bounce 1s ${i * 0.15}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div
            style={{
              padding: "0.65rem 1rem",
              background: "#FAF8F5",
              borderTop: "1px solid #E4DDD3",
              display: "flex",
              gap: "0.4rem",
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                style={{
                  padding: "0.3rem 0.7rem",
                  background: "transparent",
                  border: "1px solid #E4DDD3",
                  color: "#6B6560",
                  fontSize: "0.68rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                  borderRadius: "99px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#C4713A";
                  (e.currentTarget as HTMLElement).style.color = "#C4713A";
                  (e.currentTarget as HTMLElement).style.background = "rgba(196,113,58,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#E4DDD3";
                  (e.currentTarget as HTMLElement).style.color = "#6B6560";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          style={{
            padding: "0.85rem 1rem",
            background: "#FAF8F5",
            borderTop: "1px solid #E4DDD3",
            display: "flex",
            gap: "0.6rem",
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya tentang produk, gaya, ruangan..."
            style={{
              flex: 1,
              padding: "0.65rem 0.9rem",
              background: "#F4F0EA",
              border: "1px solid #E4DDD3",
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              color: "#1A1714",
              outline: "none",
              resize: "none",
              borderRadius: "2px",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C4713A")}
            onBlur={(e) => (e.target.style.borderColor = "#E4DDD3")}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            style={{
              width: "38px",
              height: "38px",
              background: input.trim() && !typing ? "#C4713A" : "#E4DDD3",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() && !typing ? "pointer" : "not-allowed",
              transition: "background 0.2s, transform 0.15s",
              flexShrink: 0,
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => { if (input.trim() && !typing) (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Powered by */}
        <div style={{ padding: "0.4rem", textAlign: "center", background: "#FAF8F5", borderTop: "1px solid rgba(228,221,211,0.5)" }}>
          <span style={{ fontSize: "0.55rem", color: "#C8C0B8", letterSpacing: "0.1em" }}>
            POWERED BY MAISON AI · DESAIN INTERIOR CERDAS
          </span>
        </div>
      </div>

      {/* ── FAB Trigger Button ── */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Buka Maison AI Chat"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "56px",
          height: "56px",
          background: open ? "#1A1714" : "linear-gradient(135deg, #C4713A, #8A4A1E)",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(196,113,58,0.35), 0 2px 8px rgba(0,0,0,0.12)",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          zIndex: 999,
          transform: open ? "rotate(0deg)" : "rotate(0deg)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(196,113,58,0.45)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(196,113,58,0.35), 0 2px 8px rgba(0,0,0,0.12)"; }}
      >
        <div style={{ transition: "all 0.25s ease", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="2">
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="17" cy="9" r="3" fill="#FAF8F5" stroke="none" opacity="0.25" />
              <line x1="17" y1="7.5" x2="17" y2="10.5" stroke="#FAF8F5" strokeWidth="1.2" />
              <line x1="15.5" y1="9" x2="18.5" y2="9" stroke="#FAF8F5" strokeWidth="1.2" />
            </svg>
          )}
        </div>
      </button>

      {/* Pulse ring on FAB */}
      {pulse && !open && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "2px solid #C4713A",
            zIndex: 997,
            animation: "ripple 1.5s ease-out infinite",
            pointerEvents: "none",
          }}
        />
      )}



      <style jsx global>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes ping {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
