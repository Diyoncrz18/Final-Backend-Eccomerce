"use client";
import { useState } from "react";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn, AdminSearch, formatRp } from "../components";

type Tier = "Regular" | "Gold" | "Platinum";

interface User {
  id: number; name: string; email: string; phone: string;
  tier: Tier; points: number; totalOrders: number;
  totalSpend: number; joinDate: string; isActive: boolean;
}

const USERS: User[] = [
  { id: 1, name: "Budi Santoso", email: "budi@email.com", phone: "0812-3456-7890", tier: "Gold", points: 2450, totalOrders: 5, totalSpend: 41900000, joinDate: "Jan 2024", isActive: true },
  { id: 2, name: "Anisa Rahma", email: "anisa@email.com", phone: "0856-7890-1234", tier: "Platinum", points: 8200, totalOrders: 12, totalSpend: 142000000, joinDate: "Mar 2023", isActive: true },
  { id: 3, name: "Reza Fauzi", email: "reza@email.com", phone: "0821-4567-8901", tier: "Gold", points: 1850, totalOrders: 4, totalSpend: 28700000, joinDate: "Jun 2024", isActive: true },
  { id: 4, name: "Dewi Sartika", email: "dewi@email.com", phone: "0878-9012-3456", tier: "Regular", points: 480, totalOrders: 2, totalSpend: 14600000, joinDate: "Sep 2024", isActive: true },
  { id: 5, name: "Citra Wulandari", email: "citra@email.com", phone: "0813-5678-9012", tier: "Regular", points: 120, totalOrders: 1, totalSpend: 5040000, joinDate: "Nov 2024", isActive: false },
  { id: 6, name: "Hendra Gunawan", email: "hendra@email.com", phone: "0822-6789-0123", tier: "Platinum", points: 12400, totalOrders: 18, totalSpend: 218000000, joinDate: "Feb 2023", isActive: true },
  { id: 7, name: "Putri Handayani", email: "putri@email.com", phone: "0857-0123-4567", tier: "Gold", points: 3100, totalOrders: 7, totalSpend: 58400000, joinDate: "May 2024", isActive: true },
];

const TIER_CONFIG: Record<Tier, { color: string; bg: string }> = {
  Regular: { color: "#6B6560", bg: "rgba(107,101,96,0.08)" },
  Gold: { color: "#B45309", bg: "rgba(180,83,9,0.08)" },
  Platinum: { color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
};

function PointAdjustModal({ user, onClose }: { user: User; onClose: () => void }) {
  const [type, setType] = useState<"tambah" | "kurangi">("tambah");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#FAF8F5", maxWidth: "440px", width: "100%", border: "1px solid #E4DDD3", padding: "2rem", boxShadow: "0 20px 60px rgba(26,23,20,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.16em", color: "#C4713A", textTransform: "uppercase", marginBottom: "0.25rem" }}>Rewards</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, color: "#1A1714" }}>Adjust Poin — {user.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8078" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m18 6-12 12M6 6l12 12"/></svg>
          </button>
        </div>

        <div style={{ padding: "0.75rem 1rem", background: "#F4F0EA", border: "1px solid #E4DDD3", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.78rem", color: "#6B6560" }}>Poin Saat Ini</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#C4713A" }}>{user.points.toLocaleString("id-ID")} poin</span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {(["tambah", "kurangi"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)} style={{
              flex: 1, padding: "0.65rem",
              background: type === t ? (t === "tambah" ? "#16A34A" : "#DC2626") : "transparent",
              border: `1px solid ${type === t ? (t === "tambah" ? "#16A34A" : "#DC2626") : "#E4DDD3"}`,
              color: type === t ? "#fff" : "#6B6560",
              fontFamily: "var(--font-body)", fontSize: "0.78rem", cursor: "pointer",
              textTransform: "capitalize",
            }}>
              {t === "tambah" ? "+ Tambah Poin" : "- Kurangi Poin"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, color: "#4A4640", marginBottom: "0.4rem" }}>Jumlah Poin</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Contoh: 500"
            style={{ width: "100%", padding: "0.65rem 0.85rem", background: "#F4F0EA", border: "1px solid #E4DDD3", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#1A1714", outline: "none" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, color: "#4A4640", marginBottom: "0.4rem" }}>Alasan (opsional)</label>
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Contoh: Bonus ulang tahun"
            style={{ width: "100%", padding: "0.65rem 0.85rem", background: "#F4F0EA", border: "1px solid #E4DDD3", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#1A1714", outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <AdminBtn variant="ghost" onClick={onClose}>Batal</AdminBtn>
          <AdminBtn variant="primary" onClick={() => { alert(`Poin ${type === "tambah" ? "ditambahkan" : "dikurangi"}: ${amount}`); onClose(); }}>
            Simpan Perubahan
          </AdminBtn>
        </div>
      </div>
    </div>
  );
}

export default function AdminPenggunaPage() {
  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState("semua");
  const [pointUser, setPointUser] = useState<User | null>(null);

  const filtered = USERS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = activeTier === "semua" || u.tier === activeTier;
    return matchSearch && matchTier;
  });

  const tierCounts = {
    semua: USERS.length,
    Regular: USERS.filter((u) => u.tier === "Regular").length,
    Gold: USERS.filter((u) => u.tier === "Gold").length,
    Platinum: USERS.filter((u) => u.tier === "Platinum").length,
  };

  return (
    <>
      {pointUser && <PointAdjustModal user={pointUser} onClose={() => setPointUser(null)} />}

      <AdminTopbar
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Pengguna" }]}
        action={
          <AdminBtn variant="ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Data
          </AdminBtn>
        }
      />

      <div style={{ padding: "2rem" }}>
        <AdminPageHeader
          tag="Anggota"
          title="Manajemen Pengguna"
          subtitle={`${USERS.length} pengguna terdaftar · ${USERS.filter(u => u.isActive).length} aktif`}
        />

        {/* Tier Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {(["Regular", "Gold", "Platinum"] as Tier[]).map((t) => (
            <div key={t} style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "1.25rem 1.5rem", cursor: "pointer", borderLeft: activeTier === t ? `3px solid ${TIER_CONFIG[t].color}` : "3px solid transparent" }}
              onClick={() => setActiveTier(activeTier === t ? "semua" : t)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: TIER_CONFIG[t].color, fontWeight: 600 }}>{t}</div>
                <span style={{ fontSize: "0.62rem", padding: "0.15rem 0.5rem", background: TIER_CONFIG[t].bg, color: TIER_CONFIG[t].color, fontWeight: 600 }}>
                  {tierCounts[t]}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 300, color: "#1A1714" }}>
                {USERS.filter(u => u.tier === t).reduce((sum, u) => sum + u.totalSpend, 0).toLocaleString("id-ID", { notation: "compact", maximumFractionDigits: 1 })}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#B8AFA0", marginTop: "0.2rem" }}>Total belanja (Rp)</div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3" }}>
            {["semua", "Regular", "Gold", "Platinum"].map((t) => (
              <button key={t} onClick={() => setActiveTier(t)} style={{
                padding: "0.65rem 1.1rem",
                background: "none", border: "none",
                borderBottom: `2px solid ${activeTier === t ? "#C4713A" : "transparent"}`,
                color: activeTier === t ? "#C4713A" : "#6B6560",
                fontSize: "0.78rem", fontWeight: activeTier === t ? 500 : 400,
                fontFamily: "var(--font-body)", cursor: "pointer", transition: "all 0.2s",
                marginBottom: "-1px", whiteSpace: "nowrap",
              }}>
                {t === "semua" ? "Semua" : t}
                <span style={{ marginLeft: "0.4rem", fontSize: "0.6rem", color: activeTier === t ? "#C4713A" : "#B8AFA0" }}>
                  ({(tierCounts as any)[t]})
                </span>
              </button>
            ))}
          </div>
          <AdminSearch value={search} onChange={setSearch} placeholder="Cari nama / email..." />
        </div>

        <AdminTable columns={["Pengguna", "Tier", "Poin", "Total Pesanan", "Total Belanja", "Bergabung", "Status", "Aksi"]}>
          {filtered.map((u) => (
            <AdminTr key={u.id}>
              <AdminTd>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "36px", height: "36px", background: "#1A1714",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", color: "#C4713A", fontWeight: 700, flexShrink: 0,
                  }}>
                    {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, color: "#1A1714", fontSize: "0.85rem" }}>{u.name}</div>
                    <div style={{ fontSize: "0.65rem", color: "#B8AFA0" }}>{u.email}</div>
                  </div>
                </div>
              </AdminTd>
              <AdminTd>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600,
                  padding: "0.25rem 0.7rem",
                  color: TIER_CONFIG[u.tier].color,
                  background: TIER_CONFIG[u.tier].bg,
                }}>
                  {u.tier}
                </span>
              </AdminTd>
              <AdminTd bold>{u.points.toLocaleString("id-ID")}</AdminTd>
              <AdminTd>{u.totalOrders}</AdminTd>
              <AdminTd bold>{formatRp(u.totalSpend)}</AdminTd>
              <AdminTd muted>{u.joinDate}</AdminTd>
              <AdminTd>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", color: u.isActive ? "#16A34A" : "#DC2626", background: u.isActive ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)" }}>
                  {u.isActive ? "Aktif" : "Diblokir"}
                </span>
              </AdminTd>
              <AdminTd>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <AdminBtn variant="ghost" size="sm" onClick={() => setPointUser(u)}>Poin</AdminBtn>
                  <AdminBtn variant={u.isActive ? "danger" : "outline"} size="sm">
                    {u.isActive ? "Blokir" : "Aktifkan"}
                  </AdminBtn>
                </div>
              </AdminTd>
            </AdminTr>
          ))}
        </AdminTable>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#8A8078" }}>Menampilkan {filtered.length} dari {USERS.length} pengguna</span>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {[1, 2].map((p) => (
              <button key={p} style={{ width: "32px", height: "32px", background: p === 1 ? "#1A1714" : "transparent", border: "1px solid #E4DDD3", color: p === 1 ? "#FAF8F5" : "#6B6560", fontSize: "0.78rem", cursor: "pointer", fontFamily: "var(--font-body)" }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
