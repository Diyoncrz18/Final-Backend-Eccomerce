"use client";
import { useState } from "react";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn } from "../components";

const VOUCHERS = [
  { id: 1, code: "MAISON25", type: "persen", value: 25, minOrder: 5000000, used: 12, limit: 50, expiry: "30 Apr 2025", isActive: true },
  { id: 2, code: "FREESHIP", type: "nominal", value: 100000, minOrder: 2000000, used: 38, limit: 100, expiry: "20 Apr 2025", isActive: true },
  { id: 3, code: "GOLD10", type: "persen", value: 10, minOrder: 0, used: 52, limit: 999, expiry: "31 Dec 2025", isActive: true },
  { id: 4, code: "FLASH30", type: "persen", value: 30, minOrder: 3000000, used: 50, limit: 50, expiry: "15 Apr 2025", isActive: false },
];

const REDEEM_OPTIONS = [
  { id: 1, title: "Voucher Diskon Rp 50.000", pts: 500, used: 34, isActive: true },
  { id: 2, title: "Voucher Gratis Ongkir", pts: 750, used: 28, isActive: true },
  { id: 3, title: "Diskon 10% (Katalog Baru)", pts: 1000, used: 15, isActive: true },
  { id: 4, title: "Voucher Diskon Rp 250.000", pts: 2000, used: 8, isActive: true },
  { id: 5, title: "Exclusive Gift Box", pts: 3500, used: 3, isActive: true },
  { id: 6, title: "Akses Early Sale (VIP)", pts: 5000, used: 1, isActive: false },
];

export default function AdminVoucherPage() {
  const [activeTab, setActiveTab] = useState<"voucher" | "rewards">("voucher");
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <AdminTopbar
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Voucher & Rewards" }]}
        action={
          <AdminBtn variant="primary" onClick={() => setShowForm(!showForm)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {activeTab === "voucher" ? "Buat Voucher" : "Tambah Opsi Tukar"}
          </AdminBtn>
        }
      />

      <div style={{ padding: "2rem" }}>
        <AdminPageHeader tag="Promosi" title="Voucher & Rewards" subtitle="Kelola kode promo, diskon, dan opsi penukaran poin" />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3", marginBottom: "1.75rem" }}>
          {[
            { key: "voucher", label: "Kode Voucher" },
            { key: "rewards", label: "Opsi Penukaran Poin" },
          ].map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)} style={{
              padding: "0.75rem 1.25rem", background: "none", border: "none",
              borderBottom: `2px solid ${activeTab === t.key ? "#C4713A" : "transparent"}`,
              color: activeTab === t.key ? "#C4713A" : "#6B6560",
              fontSize: "0.82rem", fontWeight: activeTab === t.key ? 500 : 400,
              fontFamily: "var(--font-body)", cursor: "pointer", marginBottom: "-1px",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Form inline (simplified) */}
        {showForm && (
          <div style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300, color: "#1A1714" }}>
                {activeTab === "voucher" ? "Buat Voucher Baru" : "Tambah Opsi Tukar"}
              </span>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8078" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 6-12 12M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {activeTab === "voucher" ? (
                <>
                  {[
                    { label: "Kode Voucher", placeholder: "Contoh: MAISON25" },
                    { label: "Nilai Diskon", placeholder: "Contoh: 25 (persen) atau 50000 (Rp)" },
                    { label: "Min. Belanja", placeholder: "Contoh: 5000000" },
                    { label: "Batas Penggunaan", placeholder: "Contoh: 100" },
                    { label: "Tanggal Kadaluarsa", placeholder: "YYYY-MM-DD" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, color: "#4A4640", marginBottom: "0.4rem" }}>{f.label}</label>
                      <input type="text" placeholder={f.placeholder} style={{
                        width: "100%", padding: "0.6rem 0.85rem",
                        background: "#F4F0EA", border: "1px solid #E4DDD3",
                        fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#1A1714", outline: "none",
                      }} />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { label: "Nama Reward", placeholder: "Contoh: Voucher Diskon Rp 50.000" },
                    { label: "Poin Diperlukan", placeholder: "Contoh: 500" },
                    { label: "Deskripsi", placeholder: "Deskripsi singkat reward" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, color: "#4A4640", marginBottom: "0.4rem" }}>{f.label}</label>
                      <input type="text" placeholder={f.placeholder} style={{
                        width: "100%", padding: "0.6rem 0.85rem",
                        background: "#F4F0EA", border: "1px solid #E4DDD3",
                        fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#1A1714", outline: "none",
                      }} />
                    </div>
                  ))}
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
              <AdminBtn variant="ghost" onClick={() => setShowForm(false)}>Batal</AdminBtn>
              <AdminBtn variant="primary" onClick={() => { alert("Tersimpan!"); setShowForm(false); }}>Simpan</AdminBtn>
            </div>
          </div>
        )}

        {/* Voucher Table */}
        {activeTab === "voucher" && (
          <AdminTable columns={["Kode", "Tipe", "Nilai", "Min. Belanja", "Terpakai / Limit", "Kadaluarsa", "Status", "Aksi"]}>
            {VOUCHERS.map((v) => (
              <AdminTr key={v.id}>
                <AdminTd>
                  <span style={{ fontFamily: "monospace", fontSize: "0.88rem", fontWeight: 700, color: "#1A1714", letterSpacing: "0.08em" }}>
                    {v.code}
                  </span>
                </AdminTd>
                <AdminTd>
                  <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", background: "#F4F0EA", border: "1px solid #E4DDD3", color: "#6B6560" }}>
                    {v.type === "persen" ? "Persen %" : "Nominal Rp"}
                  </span>
                </AdminTd>
                <AdminTd bold>
                  {v.type === "persen" ? `${v.value}%` : `Rp ${v.value.toLocaleString("id-ID")}`}
                </AdminTd>
                <AdminTd muted>
                  {v.minOrder > 0 ? `Rp ${v.minOrder.toLocaleString("id-ID")}` : "Tanpa minimum"}
                </AdminTd>
                <AdminTd>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ flex: 1, height: "4px", background: "#F4F0EA", borderRadius: "2px", minWidth: "60px" }}>
                      <div style={{ height: "100%", width: `${(v.used / v.limit) * 100}%`, background: v.used >= v.limit ? "#DC2626" : "#C4713A", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#6B6560", whiteSpace: "nowrap" }}>
                      {v.used} / {v.limit}
                    </span>
                  </div>
                </AdminTd>
                <AdminTd muted>{v.expiry}</AdminTd>
                <AdminTd>
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", color: v.isActive ? "#16A34A" : "#DC2626", background: v.isActive ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)" }}>
                    {v.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </AdminTd>
                <AdminTd>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <AdminBtn variant="ghost" size="sm">Edit</AdminBtn>
                    <AdminBtn variant="danger" size="sm">{v.isActive ? "Nonaktifkan" : "Aktifkan"}</AdminBtn>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTable>
        )}

        {/* Rewards Table */}
        {activeTab === "rewards" && (
          <AdminTable columns={["Nama Reward", "Poin", "Ditukar", "Status", "Aksi"]}>
            {REDEEM_OPTIONS.map((r) => (
              <AdminTr key={r.id}>
                <AdminTd bold>{r.title}</AdminTd>
                <AdminTd>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#C4713A" }}>{r.pts.toLocaleString("id-ID")}</span>
                  <span style={{ fontSize: "0.65rem", color: "#B8AFA0", marginLeft: "0.25rem" }}>poin</span>
                </AdminTd>
                <AdminTd muted>{r.used} kali</AdminTd>
                <AdminTd>
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", color: r.isActive ? "#16A34A" : "#DC2626", background: r.isActive ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)" }}>
                    {r.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </AdminTd>
                <AdminTd>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <AdminBtn variant="ghost" size="sm">Edit</AdminBtn>
                    <AdminBtn variant="danger" size="sm">{r.isActive ? "Nonaktifkan" : "Aktifkan"}</AdminBtn>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </AdminTable>
        )}
      </div>
    </>
  );
}
