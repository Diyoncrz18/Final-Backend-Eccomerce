"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminTopbar, AdminPageHeader, AdminTable, AdminTr, AdminTd, AdminBtn, formatRp } from "../components";
import {
  AdminVoucherPayload,
  Voucher,
  createAdminVoucher,
  fetchAdminVouchers,
  setAdminVoucherActive,
  updateAdminVoucher,
} from "../../../services/api";

type AdminVoucherTab = "voucher" | "rewards";

type VoucherFormState = {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: string;
  pointsCost: string;
  minOrderValue: string;
  usageLimit: string;
  validUntil: string;
  isActive: boolean;
};

const initialForm: VoucherFormState = {
  code: "",
  discountType: "FIXED",
  discountValue: "",
  pointsCost: "0",
  minOrderValue: "0",
  usageLimit: "100",
  validUntil: "",
  isActive: true,
};

function toDateInput(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatDiscount(voucher: Voucher) {
  return voucher.discountType === "PERCENT"
    ? `${voucher.discountValue}%`
    : formatRp(voucher.discountValue);
}

function toPayload(form: VoucherFormState): AdminVoucherPayload {
  return {
    code: form.code.trim().toUpperCase(),
    discountType: form.discountType,
    discountValue: Number(form.discountValue || 0),
    pointsCost: Number(form.pointsCost || 0),
    minOrderValue: Number(form.minOrderValue || 0),
    usageLimit: Number(form.usageLimit || 0),
    validUntil: form.validUntil,
    isActive: form.isActive,
  };
}

function formFromVoucher(voucher: Voucher): VoucherFormState {
  return {
    code: voucher.code,
    discountType: voucher.discountType,
    discountValue: String(voucher.discountValue),
    pointsCost: String(voucher.pointsCost),
    minOrderValue: String(voucher.minOrderValue),
    usageLimit: String(voucher.usageLimit),
    validUntil: toDateInput(voucher.validUntil),
    isActive: voucher.isActive,
  };
}

export default function AdminVoucherPage() {
  const [activeTab, setActiveTab] = useState<AdminVoucherTab>("voucher");
  const [showForm, setShowForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [form, setForm] = useState<VoucherFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    void fetchAdminVouchers()
      .then((data) => {
        if (cancelled) return;
        setVouchers(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Voucher gagal dimuat. Pastikan akun admin masih login.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const rewardVouchers = useMemo(() => vouchers.filter((voucher) => voucher.pointsCost > 0), [vouchers]);
  const visibleRows = activeTab === "rewards" ? rewardVouchers : vouchers;

  const handleNew = () => {
    setEditingVoucher(null);
    setForm({ ...initialForm, pointsCost: activeTab === "rewards" ? "500" : "0" });
    setShowForm(true);
    setError("");
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setForm(formFromVoucher(voucher));
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const payload = toPayload(form);
    if (!payload.code || payload.discountValue <= 0 || !payload.validUntil || payload.usageLimit <= 0) {
      setError("Kode, nilai diskon, tanggal kadaluarsa, dan limit wajib diisi.");
      return;
    }

    setSubmitting(true);
    const result = editingVoucher
      ? await updateAdminVoucher(editingVoucher.id, payload)
      : await createAdminVoucher(payload);
    setSubmitting(false);

    if (!result.success || !result.voucher) {
      setError(result.message || "Voucher gagal disimpan.");
      return;
    }

    const savedVoucher = result.voucher;
    setVouchers((current) => {
      if (editingVoucher) {
        return current.map((item) => (item.id === savedVoucher.id ? savedVoucher : item));
      }
      return [savedVoucher, ...current];
    });
    setShowForm(false);
    setEditingVoucher(null);
    setForm(initialForm);
  };

  const handleToggleStatus = async (voucher: Voucher) => {
    const result = await setAdminVoucherActive(voucher.id, !voucher.isActive);
    if (!result.success || !result.voucher) {
      setError(result.message || "Status voucher gagal diperbarui.");
      return;
    }

    const savedVoucher = result.voucher;
    setVouchers((current) => current.map((item) => (item.id === voucher.id ? savedVoucher : item)));
  };

  return (
    <>
      <AdminTopbar
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Voucher & Rewards" }]}
        action={
          <AdminBtn variant="primary" onClick={handleNew}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {activeTab === "voucher" ? "Buat Voucher" : "Tambah Reward"}
          </AdminBtn>
        }
      />

      <div style={{ padding: "2rem" }}>
        <AdminPageHeader
          tag="Promosi"
          title="Voucher & Rewards"
          subtitle={`${vouchers.length} voucher tercatat dari database`}
        />

        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E4DDD3", marginBottom: "1.75rem" }}>
          {[
            { key: "voucher", label: "Kode Voucher", count: vouchers.length },
            { key: "rewards", label: "Opsi Penukaran Poin", count: rewardVouchers.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as AdminVoucherTab)}
              style={{
                padding: "0.75rem 1.25rem",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.key ? "#C4713A" : "transparent"}`,
                color: activeTab === tab.key ? "#C4713A" : "#6B6560",
                fontSize: "0.82rem",
                fontWeight: activeTab === tab.key ? 500 : 400,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                marginBottom: "-1px",
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {error && (
          <div style={{ border: "1px solid rgba(220,38,38,0.25)", background: "rgba(220,38,38,0.06)", color: "#DC2626", padding: "0.85rem 1rem", marginBottom: "1rem", fontSize: "0.8rem" }}>
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300, color: "#1A1714" }}>
                {editingVoucher ? `Edit ${editingVoucher.code}` : activeTab === "voucher" ? "Buat Voucher Baru" : "Tambah Reward Voucher"}
              </span>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8078" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 6-12 12M6 6l12 12"/></svg>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }} className="admin-voucher-form-grid">
              <FormField label="Kode Voucher">
                <input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="MAISON25" style={inputStyle} />
              </FormField>
              <FormField label="Tipe Diskon">
                <select value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value as "PERCENT" | "FIXED" })} style={inputStyle}>
                  <option value="FIXED">Nominal Rupiah</option>
                  <option value="PERCENT">Persen</option>
                </select>
              </FormField>
              <FormField label="Nilai Diskon">
                <input type="number" min="0" value={form.discountValue} onChange={(event) => setForm({ ...form, discountValue: event.target.value })} placeholder="50000" style={inputStyle} />
              </FormField>
              <FormField label="Poin Tukar">
                <input type="number" min="0" value={form.pointsCost} onChange={(event) => setForm({ ...form, pointsCost: event.target.value })} placeholder="0" style={inputStyle} />
              </FormField>
              <FormField label="Min. Belanja">
                <input type="number" min="0" value={form.minOrderValue} onChange={(event) => setForm({ ...form, minOrderValue: event.target.value })} placeholder="0" style={inputStyle} />
              </FormField>
              <FormField label="Batas Penggunaan">
                <input type="number" min="1" value={form.usageLimit} onChange={(event) => setForm({ ...form, usageLimit: event.target.value })} placeholder="100" style={inputStyle} />
              </FormField>
              <FormField label="Tanggal Kadaluarsa">
                <input type="date" value={form.validUntil} onChange={(event) => setForm({ ...form, validUntil: event.target.value })} style={inputStyle} />
              </FormField>
              <FormField label="Status">
                <select value={form.isActive ? "true" : "false"} onChange={(event) => setForm({ ...form, isActive: event.target.value === "true" })} style={inputStyle}>
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </FormField>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
              <AdminBtn variant="ghost" onClick={() => setShowForm(false)}>Batal</AdminBtn>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.65rem 1.4rem",
                  border: "1px solid #C4713A",
                  background: submitting ? "#A45F31" : "#C4713A",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  cursor: submitting ? "wait" : "pointer",
                }}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        )}

        <AdminTable
          columns={activeTab === "voucher"
            ? ["Kode", "Tipe", "Nilai", "Min. Belanja", "Terpakai / Limit", "Kadaluarsa", "Status", "Aksi"]
            : ["Reward", "Poin", "Nilai", "Ditukar", "Kadaluarsa", "Status", "Aksi"]}
        >
          {loading ? (
            <tr>
              <td colSpan={activeTab === "voucher" ? 8 : 7} style={{ padding: "3rem", textAlign: "center", color: "#8A8078", fontSize: "0.85rem" }}>
                Memuat data voucher dari database...
              </td>
            </tr>
          ) : visibleRows.length === 0 ? (
            <tr>
              <td colSpan={activeTab === "voucher" ? 8 : 7} style={{ padding: "3rem", textAlign: "center", color: "#8A8078", fontSize: "0.85rem" }}>
                Belum ada data {activeTab === "voucher" ? "voucher" : "reward"} di database.
              </td>
            </tr>
          ) : activeTab === "voucher" ? (
            visibleRows.map((voucher) => (
              <VoucherRow
                key={voucher.id}
                voucher={voucher}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
            ))
          ) : (
            visibleRows.map((voucher) => (
              <RewardRow
                key={voucher.id}
                voucher={voucher}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </AdminTable>
      </div>

      <style jsx global>{`
        .admin-voucher-form-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        @media (max-width: 1100px) {
          .admin-voucher-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .admin-voucher-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

function VoucherRow({
  voucher,
  onEdit,
  onToggleStatus,
}: {
  voucher: Voucher;
  onEdit: (voucher: Voucher) => void;
  onToggleStatus: (voucher: Voucher) => void;
}) {
  const usagePct = voucher.usageLimit > 0 ? Math.min(100, (voucher.usedCount / voucher.usageLimit) * 100) : 0;

  return (
    <AdminTr>
      <AdminTd>
        <span style={{ fontFamily: "monospace", fontSize: "0.88rem", fontWeight: 700, color: "#1A1714", letterSpacing: "0.08em" }}>
          {voucher.code}
        </span>
      </AdminTd>
      <AdminTd>
        <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", background: "#F4F0EA", border: "1px solid #E4DDD3", color: "#6B6560" }}>
          {voucher.discountType === "PERCENT" ? "Persen %" : "Nominal Rp"}
        </span>
      </AdminTd>
      <AdminTd bold>{formatDiscount(voucher)}</AdminTd>
      <AdminTd muted>{voucher.minOrderValue > 0 ? formatRp(voucher.minOrderValue) : "Tanpa minimum"}</AdminTd>
      <AdminTd>
        <UsageBar used={voucher.usedCount} limit={voucher.usageLimit} pct={usagePct} />
      </AdminTd>
      <AdminTd muted>{formatDate(voucher.validUntil)}</AdminTd>
      <AdminTd><StatusPill active={voucher.isActive} /></AdminTd>
      <AdminTd>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <AdminBtn variant="ghost" size="sm" onClick={() => onEdit(voucher)}>Edit</AdminBtn>
          <AdminBtn variant="danger" size="sm" onClick={() => onToggleStatus(voucher)}>
            {voucher.isActive ? "Nonaktifkan" : "Aktifkan"}
          </AdminBtn>
        </div>
      </AdminTd>
    </AdminTr>
  );
}

function RewardRow({
  voucher,
  onEdit,
  onToggleStatus,
}: {
  voucher: Voucher;
  onEdit: (voucher: Voucher) => void;
  onToggleStatus: (voucher: Voucher) => void;
}) {
  return (
    <AdminTr>
      <AdminTd bold>{voucher.code}</AdminTd>
      <AdminTd>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#C4713A" }}>
          {voucher.pointsCost.toLocaleString("id-ID")}
        </span>
        <span style={{ fontSize: "0.65rem", color: "#B8AFA0", marginLeft: "0.25rem" }}>poin</span>
      </AdminTd>
      <AdminTd bold>{formatDiscount(voucher)}</AdminTd>
      <AdminTd muted>{voucher.usedCount} kali</AdminTd>
      <AdminTd muted>{formatDate(voucher.validUntil)}</AdminTd>
      <AdminTd><StatusPill active={voucher.isActive} /></AdminTd>
      <AdminTd>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <AdminBtn variant="ghost" size="sm" onClick={() => onEdit(voucher)}>Edit</AdminBtn>
          <AdminBtn variant="danger" size="sm" onClick={() => onToggleStatus(voucher)}>
            {voucher.isActive ? "Nonaktifkan" : "Aktifkan"}
          </AdminBtn>
        </div>
      </AdminTd>
    </AdminTr>
  );
}

function UsageBar({ used, limit, pct }: { used: number; limit: number; pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ flex: 1, height: "4px", background: "#F4F0EA", borderRadius: "2px", minWidth: "60px" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? "#DC2626" : "#C4713A", borderRadius: "2px" }} />
      </div>
      <span style={{ fontSize: "0.72rem", color: "#6B6560", whiteSpace: "nowrap" }}>
        {used} / {limit || "-"}
      </span>
    </div>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", color: active ? "#16A34A" : "#DC2626", background: active ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)" }}>
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 500, color: "#4A4640", marginBottom: "0.4rem" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.85rem",
  background: "#F4F0EA",
  border: "1px solid #E4DDD3",
  fontFamily: "var(--font-body)",
  fontSize: "0.82rem",
  color: "#1A1714",
  outline: "none",
  boxSizing: "border-box",
};
