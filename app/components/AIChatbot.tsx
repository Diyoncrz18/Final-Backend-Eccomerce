"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { sendChatMessage, type ChatProduct, type ChatMessageDTO } from "@/services/api";

/* ──────────────────────────────────────
   UI product shape (mapped from backend ChatProduct)
──────────────────────────────────────── */
interface UIProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  priceOriginal?: number; // shown with strikethrough when sale
  img: string;
  href: string;
  isNew?: boolean;
}

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  products?: UIProduct[];
  timestamp: Date;
}

/* Map backend ChatProduct → UIProduct used by ChatProductCard */
function mapProduct(p: ChatProduct): UIProduct {
  const onSale = p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price;
  return {
    id: p.id,
    name: p.name,
    category: p.category?.name ?? "Produk",
    price: onSale ? (p.salePrice as number) : p.price,
    priceOriginal: onSale ? p.price : undefined,
    img: p.imageUrl && p.imageUrl.length > 0 ? p.imageUrl : "/product-chair.png",
    href: `/product/${p.id}`,
    isNew: Boolean(p.isNew),
  };
}

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

/* ──────────────────────────────────────
   PRODUCT CARD in Chat
──────────────────────────────────────── */
function ChatProductCard({ product }: { product: UIProduct }) {
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
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span>{product.category}</span>
            {product.isNew && (
              <span
                style={{
                  fontSize: "0.55rem",
                  background: "#1A1714",
                  color: "#FAF8F5",
                  padding: "0.05rem 0.35rem",
                  letterSpacing: "0.12em",
                  borderRadius: "2px",
                }}
              >
                BARU
              </span>
            )}
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
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.45rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#6B6560", fontWeight: 500 }}>
              {formatRp(product.price)}
            </span>
            {product.priceOriginal && (
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "#B8AFA0",
                  textDecoration: "line-through",
                }}
              >
                {formatRp(product.priceOriginal)}
              </span>
            )}
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
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    // Snapshot history BEFORE appending the new user message
    const history: ChatMessageDTO[] = messages
      .filter((m) => m.id !== "welcome" && m.id !== "welcome-new")
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const response = await sendChatMessage(trimmed, history);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: response.text,
        products: response.products.map(mapProduct),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Maaf, asisten saya sedang mengalami kendala. Silakan coba lagi sesaat.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setTyping(false);
    }
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
