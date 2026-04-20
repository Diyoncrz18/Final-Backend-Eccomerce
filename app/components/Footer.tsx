import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--charcoal)",
        color: "var(--stone-light)",
        padding: "var(--space-3xl) 0 var(--space-lg)",
      }}
      role="contentinfo"
    >
      <div className="container-main">
        {/* Top — Brand + Newsletter */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-2xl)",
            paddingBottom: "var(--space-2xl)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            alignItems: "end",
          }}
          className="footer-top"
        >
          {/* Brand */}
          <div>
            <p className="text-label" style={{ color: "var(--stone)", marginBottom: "1.5rem" }}>
              Crafted for the discerning home
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                fontWeight: 300,
                color: "var(--cream)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Maison
            </h2>
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "0.9rem",
                fontWeight: 300,
                color: "var(--stone)",
                maxWidth: "400px",
                lineHeight: 1.7,
              }}
            >
              Menghadirkan koleksi interior premium yang menggabungkan estetika
              kontemporer dengan keahlian artisanal tradisional.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-label" style={{ color: "var(--stone)", marginBottom: "1rem" }}>
              Newsletter
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                fontWeight: 300,
                color: "var(--cream)",
                marginBottom: "1.5rem",
                lineHeight: 1.3,
              }}
            >
              Dapatkan inspirasi desain & penawaran eksklusif
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{
                display: "flex",
                gap: "0",
              }}
              aria-label="Newsletter subscription form"
            >
              <input
                type="email"
                placeholder="Email Anda"
                id="newsletter-email"
                aria-label="Alamat email untuk newsletter"
                required
                style={{
                  flex: 1,
                  padding: "0.9rem 1.25rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRight: "none",
                  color: "var(--cream)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  fontWeight: 300,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                id="newsletter-submit"
                style={{
                  padding: "0.9rem 1.5rem",
                  background: "var(--copper)",
                  border: "none",
                  color: "var(--white)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.3s ease",
                }}
              >
                Daftar
              </button>
            </form>
          </div>
        </div>

        {/* Mid — Links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--space-lg)",
            padding: "var(--space-2xl) 0",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          className="footer-links"
        >
          {[
            {
              title: "Koleksi",
              links: ["Ruang Tamu", "Kamar Tidur", "Ruang Makan", "Dekorasi", "Pencahayaan"],
            },
            {
              title: "Layanan",
              links: ["Konsultasi Desain", "Pengiriman", "Pemasangan", "After Care", "Gift Card"],
            },
            {
              title: "Informasi",
              links: ["Tentang Kami", "Blog & Inspirasi", "Press", "Karir", "Kontak"],
            },
            {
              title: "Kebijakan",
              links: ["Syarat & Ketentuan", "Privasi", "Return Policy", "FAQ", "Cookie Policy"],
            },
          ].map((section) => (
            <div key={section.title}>
              <p className="text-label" style={{ color: "var(--stone)", marginBottom: "1.25rem" }}>
                {section.title}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(/ /g, "-")}`}
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 300,
                        color: "var(--stone)",
                        transition: "color 0.25s ease",
                        display: "inline-block",
                      }}
                      className="footer-link"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "var(--space-lg)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--stone-light)", opacity: 0.5 }}>
            © {year} Maison Interior. All rights reserved.
          </p>

          {/* Social */}
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            {[
              { name: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { name: "Pinterest", path: "M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
              { name: "TikTok", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
            ].map((social) => (
              <a
                key={social.name}
                href="#"
                aria-label={social.name}
                style={{
                  color: "var(--stone)",
                  transition: "color 0.25s ease",
                  display: "flex",
                }}
                className="social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .footer-link:hover { color: var(--cream) !important; }
        .social-link:hover { color: var(--cream) !important; }
        @media (max-width: 768px) {
          .footer-top { grid-template-columns: 1fr !important; }
          .footer-links { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .footer-links { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
