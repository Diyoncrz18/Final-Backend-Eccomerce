"use client";
import { AdminTopbar, AdminPageHeader } from "../components";
import { useRouter } from "next/navigation";

export default function AdminRewardsRedirect() {
  return (
    <>
      <AdminTopbar breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Rewards & Poin" }]} />
      <div style={{ padding: "2rem" }}>
        <AdminPageHeader tag="Rewards" title="Rewards & Poin" subtitle="Konfigurasi sistem poin tersedia di modul Voucher & Rewards" />
        <div style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 300, color: "#1A1714", marginBottom: "1rem" }}>
            Modul ini telah digabungkan dengan Voucher
          </div>
          <p style={{ fontSize: "0.85rem", color: "#8A8078", marginBottom: "1.5rem" }}>
            Konfigurasi opsi penukaran poin dan earn ways tersedia di halaman Voucher & Rewards.
          </p>
          <a href="/admin/voucher" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.75rem 1.75rem", background: "#C4713A", color: "#fff",
            textDecoration: "none", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.1em",
          }}>
            Buka Voucher & Rewards →
          </a>
        </div>
      </div>
    </>
  );
}
