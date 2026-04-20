"use client";
import { useState } from "react";
import { AdminTopbar, AdminPageHeader, AdminBtn } from "../components";

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

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} style={{
      width: "44px", height: "24px", background: on ? "#C4713A" : "#E4DDD3",
      border: "none", borderRadius: "12px", cursor: "pointer",
      position: "relative", transition: "background 0.2s",
    }}>
      <span style={{
        position: "absolute", top: "2px", left: on ? "22px" : "2px",
        width: "20px", height: "20px", borderRadius: "50%", background: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }} />
    </button>
  );
}

function TextInput({ defaultValue, placeholder }: { defaultValue?: string; placeholder?: string }) {
  const [val, setVal] = useState(defaultValue ?? "");
  return (
    <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder}
      style={{
        padding: "0.55rem 0.85rem", background: "#F4F0EA",
        border: "1px solid #E4DDD3", fontFamily: "var(--font-body)",
        fontSize: "0.82rem", color: "#1A1714", outline: "none", minWidth: "220px",
      }}
    />
  );
}

export default function AdminPengaturanPage() {
  return (
    <>
      <AdminTopbar
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Pengaturan" }]}
        action={<AdminBtn variant="primary" onClick={() => alert("Pengaturan disimpan!")}>Simpan Perubahan</AdminBtn>}
      />

      <div style={{ padding: "2rem", maxWidth: "860px" }}>
        <AdminPageHeader tag="Konfigurasi" title="Pengaturan Toko" subtitle="Kelola konfigurasi umum platform Maison" />

        <SettingSection title="Informasi Toko">
          <SettingRow label="Nama Toko"><TextInput defaultValue="Maison" /></SettingRow>
          <SettingRow label="Deskripsi Toko" desc="Muncul di halaman About dan meta description"><TextInput defaultValue="Premium Interior Design & Furniture" /></SettingRow>
          <SettingRow label="Email Kontak"><TextInput defaultValue="hello@maison.id" /></SettingRow>
          <SettingRow label="Nomor Telepon"><TextInput defaultValue="+62 21 1234 5678" /></SettingRow>
        </SettingSection>

        <SettingSection title="Pengiriman & Ongkos Kirim">
          <SettingRow label="Gratis Ongkir (Regular)" desc="Min. belanja untuk pengiriman gratis member Regular">
            <TextInput defaultValue="3000000" />
          </SettingRow>
          <SettingRow label="Gratis Ongkir (Gold)" desc="Min. belanja untuk pengiriman gratis member Gold">
            <TextInput defaultValue="2000000" />
          </SettingRow>
          <SettingRow label="Gratis Ongkir (Platinum)" desc="Member Platinum selalu gratis ongkir">
            <Toggle defaultOn={true} />
          </SettingRow>
          <SettingRow label="White Glove Delivery" desc="Tersedia di Jabodetabek & Bandung">
            <Toggle defaultOn={true} />
          </SettingRow>
        </SettingSection>

        <SettingSection title="Sistem Poin & Rewards">
          <SettingRow label="Poin per Rp 10.000" desc="Jumlah poin yang didapatkan untuk setiap Rp 10.000 belanja">
            <TextInput defaultValue="1" />
          </SettingRow>
          <SettingRow label="Threshold Gold Tier" desc="Minimum poin untuk naik ke tier Gold">
            <TextInput defaultValue="1000" />
          </SettingRow>
          <SettingRow label="Threshold Platinum Tier" desc="Minimum poin untuk naik ke tier Platinum">
            <TextInput defaultValue="5000" />
          </SettingRow>
          <SettingRow label="Bonus Poin Ulang Tahun"><TextInput defaultValue="300" /></SettingRow>
          <SettingRow label="Poin per Referral Berhasil"><TextInput defaultValue="200" /></SettingRow>
          <SettingRow label="Poin per Ulasan Terverifikasi"><TextInput defaultValue="50" /></SettingRow>
        </SettingSection>

        <SettingSection title="Flash Sale & Promo">
          <SettingRow label="Flash Sale Aktif" desc="Menampilkan countdown dan banner sale di halaman utama">
            <Toggle defaultOn={true} />
          </SettingRow>
          <SettingRow label="Tanggal Berakhir Sale" desc="Countdown timer di halaman Sale">
            <TextInput defaultValue="2025-04-30" />
          </SettingRow>
          <SettingRow label="Diskon Member Gold & Platinum" desc="Tambahan diskon khusus member pada item sale">
            <TextInput defaultValue="5" placeholder="%" />
          </SettingRow>
        </SettingSection>

        <SettingSection title="Notifikasi & Email">
          <SettingRow label="Email Konfirmasi Pesanan" desc="Kirim email otomatis saat pesanan dibuat">
            <Toggle defaultOn={true} />
          </SettingRow>
          <SettingRow label="Email Update Status Pengiriman" desc="Kirim notifikasi saat status pesanan berubah">
            <Toggle defaultOn={true} />
          </SettingRow>
          <SettingRow label="Notifikasi Stok Hampir Habis" desc="Admin mendapat notifikasi jika stok ≤ 5">
            <Toggle defaultOn={true} />
          </SettingRow>
          <SettingRow label="Threshold Notifikasi Stok">
            <TextInput defaultValue="5" />
          </SettingRow>
        </SettingSection>

        <SettingSection title="SEO & Metadata">
          <SettingRow label="Meta Title Beranda"><TextInput defaultValue="Maison — Premium Interior Design" /></SettingRow>
          <SettingRow label="Meta Description"><TextInput defaultValue="Furnitur dan dekorasi premium untuk rumah impian Anda." /></SettingRow>
        </SettingSection>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <AdminBtn variant="ghost">Reset</AdminBtn>
          <AdminBtn variant="primary" onClick={() => alert("Pengaturan berhasil disimpan!")}>Simpan Semua Perubahan</AdminBtn>
        </div>
      </div>
    </>
  );
}
