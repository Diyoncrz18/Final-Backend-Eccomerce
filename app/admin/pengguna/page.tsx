"use client";
import { useEffect, useMemo, useState } from "react";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn, AdminSearch, formatRp } from "../components";
import { fetchAdminUsers, updateAdminUser, type AdminUser } from "../../../services/api";

type Tier = "ADMIN" | "REGULAR" | "GOLD" | "PLATINUM";

interface PageUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  tier: Tier;
  points: number;
  totalOrders: number;
  totalSpend: number;
  joinDate: string;
  isActive: boolean;
  roles: string[];
}

const TIER_CONFIG: Record<Tier, { color: string; bg: string }> = {
  ADMIN: { color: "#1A1714", bg: "rgba(26,23,20,0.08)" },
  REGULAR: { color: "#6B6560", bg: "rgba(107,101,96,0.08)" },
  GOLD: { color: "#B45309", bg: "rgba(180,83,9,0.08)" },
  PLATINUM: { color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
};

const FILTER_TABS: { key: "semua" | Tier; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "ADMIN", label: "Admin" },
  { key: "REGULAR", label: "Regular" },
  { key: "GOLD", label: "Gold" },
  { key: "PLATINUM", label: "Platinum" },
];

function normalizeTier(tier: string): Tier {
  return ["ADMIN", "REGULAR", "GOLD", "PLATINUM"].includes(tier) ? tier as Tier : "REGULAR";
}

function mapUser(user: AdminUser): PageUser {
  return {
    id: user.id,
    name: user.name || "Unknown",
    email: user.email || "",
    phone: user.phone || "",
    tier: normalizeTier(user.tier),
    points: Number(user.rewardPoints || 0),
    totalOrders: Number(user.totalOrders || 0),
    totalSpend: Number(user.totalSpent || 0),
    joinDate: user.joinDate ? new Date(user.joinDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-",
    isActive: user.isActive,
    roles: user.roles || [],
  };
}

function initials(name: string) {
  const value = name.trim();
  if (!value) return "U";
  return value.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function PointAdjustModal({
  user,
  onClose,
  onSaved,
}: {
  user: PageUser;
  onClose: () => void;
  onSaved: (user: PageUser) => void;
}) {
  const [type, setType] = useState<"tambah" | "kurangi">("tambah");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const savePoints = async () => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Jumlah poin harus lebih dari 0.");
      return;
    }

    setSaving(true);
    setError("");
    const nextPoints = type === "tambah"
      ? user.points + parsed
      : Math.max(0, user.points - parsed);

    const result = await updateAdminUser(user.id, { rewardPoints: nextPoints });
    setSaving(false);

    if (!result.success || !result.user) {
      setError(result.message || "Poin gagal diperbarui.");
      return;
    }

    onSaved(mapUser(result.user));
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#FAF8F5", maxWidth: "440px", width: "100%", border: "1px solid #E4DDD3", padding: "2rem", boxShadow: "0 20px 60px rgba(26,23,20,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.16em", color: "#C4713A", textTransform: "uppercase", marginBottom: "0.25rem" }}>Rewards</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 300, color: "#1A1714" }}>Adjust Poin - {user.name}</h3>
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
          {(["tambah", "kurangi"] as const).map((item) => (
            <button key={item} onClick={() => setType(item)} style={{
              flex: 1,
              padding: "0.65rem",
              background: type === item ? (item === "tambah" ? "#16A34A" : "#DC2626") : "transparent",
              border: `1px solid ${type === item ? (item === "tambah" ? "#16A34A" : "#DC2626") : "#E4DDD3"}`,
              color: type === item ? "#fff" : "#6B6560",
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              cursor: "pointer",
              textTransform: "capitalize",
            }}>
              {item === "tambah" ? "+ Tambah Poin" : "- Kurangi Poin"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, color: "#4A4640", marginBottom: "0.4rem" }}>Jumlah Poin</label>
          <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Contoh: 500"
            style={{ width: "100%", padding: "0.65rem 0.85rem", background: "#F4F0EA", border: "1px solid #E4DDD3", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#1A1714", outline: "none" }}
          />
        </div>

        {error && <p style={{ fontSize: "0.74rem", color: "#DC2626", marginBottom: "1rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <AdminBtn variant="ghost" onClick={onClose}>Batal</AdminBtn>
          <AdminBtn variant="primary" onClick={() => void savePoints()}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </AdminBtn>
        </div>
      </div>
    </div>
  );
}

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<PageUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTier, setActiveTier] = useState<"semua" | Tier>("semua");
  const [pointUser, setPointUser] = useState<PageUser | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    const data = await fetchAdminUsers(0, 200);
    setUsers(data.map(mapUser));
    setLoading(false);
    if (data.length === 0) {
      setError("Belum ada data pengguna atau token admin tidak valid.");
    }
  };

  useEffect(() => {
    let cancelled = false;

    void fetchAdminUsers(0, 200)
      .then((data) => {
        if (cancelled) return;
        setUsers(data.map(mapUser));
        if (data.length === 0) {
          setError("Belum ada data pengguna atau token admin tidak valid.");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError("Data pengguna gagal dimuat. Pastikan akun admin masih login.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => users.filter((user) => {
    const keyword = search.toLowerCase();
    const matchSearch = user.name.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword);
    const matchTier = activeTier === "semua" || user.tier === activeTier;
    return matchSearch && matchTier;
  }), [activeTier, search, users]);

  const tierCounts = useMemo(() => FILTER_TABS.reduce((acc, tab) => {
    acc[tab.key] = tab.key === "semua" ? users.length : users.filter((user) => user.tier === tab.key).length;
    return acc;
  }, {} as Record<string, number>), [users]);

  const updateUserInList = (updated: PageUser) => {
    setUsers(prev => prev.map(user => user.id === updated.id ? updated : user));
  };

  const toggleActive = async (user: PageUser) => {
    const result = await updateAdminUser(user.id, { isActive: !user.isActive });
    if (result.success && result.user) {
      updateUserInList(mapUser(result.user));
    }
  };

  return (
    <>
      {pointUser && <PointAdjustModal user={pointUser} onClose={() => setPointUser(null)} onSaved={updateUserInList} />}

      <AdminTopbar
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Pengguna" }]}
        action={
          <AdminBtn variant="ghost" onClick={() => void loadUsers()}>
            Refresh Data
          </AdminBtn>
        }
      />

      <div style={{ padding: "2rem" }}>
        <AdminPageHeader
          tag="Anggota"
          title="Manajemen Pengguna"
          subtitle={`${users.length} pengguna dari database - ${users.filter(user => user.isActive).length} aktif`}
        />

        {error && (
          <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.18)", color: "#B91C1C", padding: "0.85rem 1rem", marginBottom: "1rem", fontSize: "0.82rem" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }} className="admin-user-tier-grid">
          {(["ADMIN", "REGULAR", "GOLD", "PLATINUM"] as Tier[]).map((tier) => (
            <div key={tier} style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "1.25rem 1.5rem", cursor: "pointer", borderLeft: activeTier === tier ? `3px solid ${TIER_CONFIG[tier].color}` : "3px solid transparent" }}
              onClick={() => setActiveTier(activeTier === tier ? "semua" : tier)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: TIER_CONFIG[tier].color, fontWeight: 600 }}>{tier}</div>
                <span style={{ fontSize: "0.62rem", padding: "0.15rem 0.5rem", background: TIER_CONFIG[tier].bg, color: TIER_CONFIG[tier].color, fontWeight: 600 }}>
                  {tierCounts[tier] || 0}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 300, color: "#1A1714" }}>
                {users.filter(user => user.tier === tier).reduce((sum, user) => sum + user.totalSpend, 0).toLocaleString("id-ID", { notation: "compact", maximumFractionDigits: 1 })}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#B8AFA0", marginTop: "0.2rem" }}>Total belanja (Rp)</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3", flexWrap: "wrap" }}>
            {FILTER_TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTier(tab.key)} style={{
                padding: "0.65rem 1.1rem",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTier === tab.key ? "#C4713A" : "transparent"}`,
                color: activeTier === tab.key ? "#C4713A" : "#6B6560",
                fontSize: "0.78rem",
                fontWeight: activeTier === tab.key ? 500 : 400,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "-1px",
                whiteSpace: "nowrap",
              }}>
                {tab.label}
                <span style={{ marginLeft: "0.4rem", fontSize: "0.6rem", color: activeTier === tab.key ? "#C4713A" : "#B8AFA0" }}>
                  ({tierCounts[tab.key] || 0})
                </span>
              </button>
            ))}
          </div>
          <AdminSearch value={search} onChange={setSearch} placeholder="Cari nama / email..." />
        </div>

        {loading ? (
          <div style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "3rem", textAlign: "center", color: "#8A8078" }}>
            Memuat data pengguna...
          </div>
        ) : (
          <AdminTable columns={["Pengguna", "Tier", "Role", "Poin", "Total Pesanan", "Total Belanja", "Bergabung", "Status", "Aksi"]}>
            {filtered.map((user) => (
              <AdminTr key={user.id}>
                <AdminTd>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "36px", height: "36px", background: "#1A1714", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#C4713A", fontWeight: 700, flexShrink: 0 }}>
                      {initials(user.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: "#1A1714", fontSize: "0.85rem" }}>{user.name}</div>
                      <div style={{ fontSize: "0.65rem", color: "#B8AFA0" }}>{user.email}</div>
                    </div>
                  </div>
                </AdminTd>
                <AdminTd>
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "0.25rem 0.7rem", color: TIER_CONFIG[user.tier].color, background: TIER_CONFIG[user.tier].bg }}>
                    {user.tier}
                  </span>
                </AdminTd>
                <AdminTd muted>{user.roles.join(", ") || "-"}</AdminTd>
                <AdminTd bold>{user.points.toLocaleString("id-ID")}</AdminTd>
                <AdminTd>{user.totalOrders}</AdminTd>
                <AdminTd bold>{formatRp(user.totalSpend)}</AdminTd>
                <AdminTd muted>{user.joinDate}</AdminTd>
                <AdminTd>
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", color: user.isActive ? "#16A34A" : "#DC2626", background: user.isActive ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)" }}>
                    {user.isActive ? "Aktif" : "Diblokir"}
                  </span>
                </AdminTd>
                <AdminTd>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <AdminBtn variant="ghost" size="sm" onClick={() => setPointUser(user)}>Poin</AdminBtn>
                    <AdminBtn variant={user.isActive ? "danger" : "outline"} size="sm" onClick={() => void toggleActive(user)}>
                      {user.isActive ? "Blokir" : "Aktifkan"}
                    </AdminBtn>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: "3rem", textAlign: "center", color: "#B8AFA0", fontSize: "0.85rem" }}>
                  Tidak ada pengguna ditemukan
                </td>
              </tr>
            )}
          </AdminTable>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#8A8078" }}>Menampilkan {filtered.length} dari {users.length} pengguna</span>
        </div>
      </div>

      <style jsx global>{`
        .admin-user-tier-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1100px) { .admin-user-tier-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .admin-user-tier-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
