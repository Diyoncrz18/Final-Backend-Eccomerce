"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─── Shared Topbar Component ─── */
export function AdminTopbar({
  breadcrumb,
  action,
}: {
  breadcrumb: { label: string; href?: string }[];
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#FAF8F5",
        borderBottom: "1px solid #E4DDD3",
        padding: "0.85rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {breadcrumb.map((crumb, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8AFA0" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                style={{
                  fontSize: "0.78rem",
                  color: "#8A8078",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
              >
                {crumb.label}
              </Link>
            ) : (
              <span style={{ fontSize: "0.78rem", color: "#1A1714", fontWeight: 500 }}>
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      {action && <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>{action}</div>}
    </div>
  );
}

/* ─── Shared Page Header ─── */
export function AdminPageHeader({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <div
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#C4713A",
          marginBottom: "0.35rem",
        }}
      >
        {tag}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          fontWeight: 300,
          color: "#1A1714",
          lineHeight: 1.1,
          marginBottom: subtitle ? "0.5rem" : 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: "0.82rem", color: "#8A8078" }}>{subtitle}</p>
      )}
    </div>
  );
}

/* ─── Shared Stat Card ─── */
export function AdminStatCard({
  label,
  value,
  sub,
  subColor = "#C4713A",
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#FAF8F5",
        border: "1px solid #E4DDD3",
        padding: "1.25rem 1.5rem",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "rgba(196,113,58,0.1)",
          border: "1px solid rgba(196,113,58,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.85rem",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.8rem",
          fontWeight: 300,
          color: "#1A1714",
          lineHeight: 1,
          marginBottom: "0.25rem",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#6B6560", marginBottom: "0.25rem" }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: "0.68rem", color: subColor, fontWeight: 500 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ─── Status Badge ─── */
export function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    menunggu:   { label: "Menunggu",   color: "#B45309", bg: "rgba(180,83,9,0.08)" },
    dikemas:    { label: "Dikemas",    color: "#0369A1", bg: "rgba(3,105,161,0.08)" },
    dikirim:    { label: "Dikirim",    color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
    selesai:    { label: "Selesai",    color: "#16A34A", bg: "rgba(22,163,74,0.08)" },
    dibatalkan: { label: "Dibatalkan", color: "#DC2626", bg: "rgba(220,38,38,0.08)" },
  };
  const cfg = map[status] ?? { label: status, color: "#6B6560", bg: "rgba(107,101,96,0.08)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.25rem 0.75rem",
        fontSize: "0.68rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "capitalize",
        color: cfg.color,
        background: cfg.bg,
        whiteSpace: "nowrap",
      }}
    >
      {status === "dikirim" && (
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: cfg.color,
            animation: "pulse 1.5s infinite",
          }}
        />
      )}
      {cfg.label}
    </span>
  );
}

/* ─── Table Component ─── */
export function AdminTable({
  columns,
  children,
  action,
  title,
  empty,
}: {
  columns: string[];
  children: React.ReactNode;
  action?: React.ReactNode;
  title?: string;
  empty?: boolean;
}) {
  return (
    <div style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", overflow: "hidden" }}>
      {(title || action) && (
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #E4DDD3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {title && (
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.05rem",
                fontWeight: 300,
                color: "#1A1714",
              }}
            >
              {title}
            </span>
          )}
          {action}
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F4F0EA", borderBottom: "1px solid #E4DDD3" }}>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "0.75rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.62rem",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#8A8078",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Table Row ─── */
export function AdminTr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: "1px solid #E4DDD3",
        cursor: onClick ? "pointer" : undefined,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { if (onClick) (e.currentTarget as HTMLElement).style.background = "rgba(196,113,58,0.03)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
    >
      {children}
    </tr>
  );
}

/* ─── Table Cell ─── */
export function AdminTd({
  children,
  muted,
  bold,
}: {
  children: React.ReactNode;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <td
      style={{
        padding: "0.85rem 1.25rem",
        fontSize: "0.82rem",
        color: muted ? "#8A8078" : "#2A2620",
        fontWeight: bold ? 500 : 400,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </td>
  );
}

/* ─── Primary Button ─── */
export function AdminBtn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md";
  type?: "button" | "submit";
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "#C4713A", border: "1px solid #C4713A", color: "#fff" },
    outline: { background: "transparent", border: "1px solid #C4713A", color: "#C4713A" },
    ghost: { background: "transparent", border: "1px solid #E4DDD3", color: "#6B6560" },
    danger: { background: "transparent", border: "1px solid rgba(220,38,38,0.4)", color: "#DC2626" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: size === "sm" ? "0.4rem 0.9rem" : "0.65rem 1.4rem",
        fontFamily: "var(--font-body)",
        fontSize: size === "sm" ? "0.7rem" : "0.78rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}

/* ─── Search Input ─── */
export function AdminSearch({
  value,
  onChange,
  placeholder = "Cari...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#B8AFA0"
        strokeWidth="2"
        style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}
      >
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: "2.25rem",
          paddingRight: "0.85rem",
          paddingTop: "0.55rem",
          paddingBottom: "0.55rem",
          background: "#F4F0EA",
          border: "1px solid #E4DDD3",
          fontFamily: "var(--font-body)",
          fontSize: "0.8rem",
          color: "#1A1714",
          outline: "none",
          width: "220px",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#C4713A")}
        onBlur={(e) => (e.target.style.borderColor = "#E4DDD3")}
      />
    </div>
  );
}

export function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
