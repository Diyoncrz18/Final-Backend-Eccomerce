"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminTopbar, AdminPageHeader, AdminBtn } from "../components";
import { fetchRewardsConfig, fetchStoreSettings, updateRewardsConfig, updateStoreSettings } from "../../../services/api";

type SettingValue = string | number | boolean | null;
type SettingsMap = Record<string, SettingValue>;
type FieldKind = "text" | "number" | "boolean";

type SettingField = {
  key: string;
  label: string;
  desc?: string;
  kind: FieldKind;
};

const STORE_FIELDS: SettingField[] = [
  { key: "storeName", label: "Nama Toko", kind: "text" },
  { key: "storeEmail", label: "Email Kontak", kind: "text" },
  { key: "storePhone", label: "Nomor Telepon", kind: "text" },
  { key: "storeAddress", label: "Alamat Toko", kind: "text" },
  { key: "shippingFreeMin", label: "Minimum Gratis Ongkir", kind: "number" },
  { key: "shippingCost", label: "Ongkos Kirim Default", kind: "number" },
  { key: "taxRate", label: "Pajak", desc: "Contoh 0.11 untuk 11%", kind: "number" },
  { key: "whatsappNumber", label: "Nomor WhatsApp", kind: "text" },
  { key: "instagramUrl", label: "Instagram", kind: "text" },
  { key: "facebookUrl", label: "Facebook", kind: "text" },
  { key: "tokopediaUrl", label: "Tokopedia", kind: "text" },
  { key: "shopeeUrl", label: "Shopee", kind: "text" },
];

const REWARD_FIELDS: SettingField[] = [
  { key: "pointsPerRupiah", label: "Poin per Rupiah", kind: "number" },
  { key: "pointsToRupiahRatio", label: "Rasio Poin ke Rupiah", kind: "number" },
  { key: "welcomePoints", label: "Poin Selamat Datang", kind: "number" },
  { key: "birthdayPoints", label: "Bonus Poin Ulang Tahun", kind: "number" },
  { key: "referralPoints", label: "Poin Referral", kind: "number" },
];

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FAF8F5", border: "1px solid #E4DDD3", marginBottom: "1.25rem" }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #E4DDD3" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 300, color: "#1A1714" }}>{title}</span>
      </div>
      <div style={{ padding: "1.25rem 1.5rem" }}>{children}</div>
    </div>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", padding: "0.85rem 0", borderBottom: "1px solid rgba(228,221,211,0.5)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1A1714", marginBottom: "0.15rem" }}>{label}</div>
        {desc && <div style={{ fontSize: "0.72rem", color: "#8A8078" }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

export default function AdminPengaturanPage() {
  const [storeSettings, setStoreSettings] = useState<SettingsMap>({});
  const [rewardSettings, setRewardSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const [store, rewards] = await Promise.all([fetchStoreSettings(), fetchRewardsConfig()]);
      setStoreSettings(toSettingsMap(store));
      setRewardSettings(toSettingsMap(rewards));
      setLoading(false);
    }

    loadSettings();
  }, []);

  const storeFields = useMemo(() => fieldsFromDatabase(STORE_FIELDS, storeSettings), [storeSettings]);
  const rewardFields = useMemo(() => fieldsFromDatabase(REWARD_FIELDS, rewardSettings), [rewardSettings]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const [storeResult, rewardResult] = await Promise.all([
      updateStoreSettings(storeSettings),
      updateRewardsConfig(rewardSettings),
    ]);
    setSaving(false);

    if (storeResult?.success === false || rewardResult?.success === false) {
      setMessage("Sebagian pengaturan gagal disimpan. Pastikan akun admin masih login.");
      return;
    }

    const updatedStore = toResponseSettings(storeResult);
    const updatedRewards = toResponseSettings(rewardResult);
    if (updatedStore) setStoreSettings(updatedStore);
    if (updatedRewards) setRewardSettings(updatedRewards);
    setMessage("Pengaturan berhasil disimpan ke database.");
  };

  return (
    <>
      <AdminTopbar
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Pengaturan" }]}
        action={<AdminBtn variant="primary" onClick={handleSave}>{saving ? "Menyimpan..." : "Simpan Perubahan"}</AdminBtn>}
      />

      <div style={{ padding: "2rem", maxWidth: "860px" }}>
        <AdminPageHeader
          tag="Konfigurasi"
          title="Pengaturan Toko"
          subtitle={loading ? "Memuat pengaturan dari database..." : "Kelola konfigurasi dari tabel app_settings"}
        />

        {message && (
          <div style={{ border: "1px solid #E4DDD3", background: "#FAF8F5", color: message.includes("gagal") ? "#DC2626" : "#16A34A", padding: "0.85rem 1rem", marginBottom: "1rem", fontSize: "0.8rem" }}>
            {message}
          </div>
        )}

        <SettingSection title="Informasi Toko">
          {loading ? (
            <EmptyState text="Memuat pengaturan toko..." />
          ) : storeFields.length === 0 ? (
            <EmptyState text="Belum ada pengaturan toko di database." />
          ) : (
            storeFields.map((field) => (
              <SettingRow key={field.key} label={field.label} desc={field.desc}>
                <SettingControl
                  field={field}
                  value={storeSettings[field.key]}
                  onChange={(value) => setStoreSettings((current) => ({ ...current, [field.key]: value }))}
                />
              </SettingRow>
            ))
          )}
        </SettingSection>

        <SettingSection title="Sistem Poin & Rewards">
          {loading ? (
            <EmptyState text="Memuat konfigurasi rewards..." />
          ) : rewardFields.length === 0 ? (
            <EmptyState text="Belum ada konfigurasi rewards di database." />
          ) : (
            rewardFields.map((field) => (
              <SettingRow key={field.key} label={field.label} desc={field.desc}>
                <SettingControl
                  field={field}
                  value={rewardSettings[field.key]}
                  onChange={(value) => setRewardSettings((current) => ({ ...current, [field.key]: value }))}
                />
              </SettingRow>
            ))
          )}
        </SettingSection>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <AdminBtn variant="primary" onClick={handleSave}>{saving ? "Menyimpan..." : "Simpan Semua Perubahan"}</AdminBtn>
        </div>
      </div>
    </>
  );
}

function SettingControl({
  field,
  value,
  onChange,
}: {
  field: SettingField;
  value: SettingValue;
  onChange: (value: SettingValue) => void;
}) {
  if (field.kind === "boolean") {
    const checked = value === true || value === "true";
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: "44px",
          height: "24px",
          background: checked ? "#C4713A" : "#E4DDD3",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <span style={{ position: "absolute", top: "2px", left: checked ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
      </button>
    );
  }

  return (
    <input
      type={field.kind === "number" ? "number" : "text"}
      value={value === null || value === undefined ? "" : String(value)}
      onChange={(event) => onChange(field.kind === "number" ? Number(event.target.value || 0) : event.target.value)}
      style={{
        padding: "0.55rem 0.85rem",
        background: "#F4F0EA",
        border: "1px solid #E4DDD3",
        fontFamily: "var(--font-body)",
        fontSize: "0.82rem",
        color: "#1A1714",
        outline: "none",
        minWidth: "220px",
      }}
    />
  );
}

function EmptyState({ text }: { text: string }) {
  return <div style={{ padding: "1rem 0", color: "#8A8078", fontSize: "0.82rem" }}>{text}</div>;
}

function toSettingsMap(value: unknown): SettingsMap {
  if (typeof value !== "object" || value === null) return {};
  return Object.entries(value as Record<string, unknown>).reduce<SettingsMap>((acc, [key, item]) => {
    if (typeof item === "string" || typeof item === "number" || typeof item === "boolean" || item === null) {
      acc[key] = item;
    }
    return acc;
  }, {});
}

function toResponseSettings(value: unknown): SettingsMap | null {
  if (typeof value !== "object" || value === null) return null;
  const response = value as Record<string, unknown>;
  return response.settings ? toSettingsMap(response.settings) : null;
}

function fieldsFromDatabase(knownFields: SettingField[], settings: SettingsMap) {
  const knownByKey = new Map(knownFields.map((field) => [field.key, field]));
  return Object.keys(settings).map((key) => knownByKey.get(key) ?? {
    key,
    label: humanizeKey(key),
    kind: inferFieldKind(settings[key]),
  });
}

function inferFieldKind(value: SettingValue): FieldKind {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  return "text";
}

function humanizeKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}
