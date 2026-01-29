"use client";

import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/overview", label: "Overview" },
      { href: "/features", label: "Features" },
      { href: "/tutorials", label: "Tutorials" },
      { href: "/pricing", label: "Pricing" },
      { href: "/releases", label: "Releases" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
      { href: "/news", label: "News" },
      { href: "/media-kit", label: "Media kit" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/help", label: "Help center" },
      { href: "/tutorials", label: "Tutorials" },
      { href: "/support", label: "Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
      { href: "/licenses", label: "Licenses" },
      { href: "/releases", label: "Releases" },
    ],
  },
];

export function FooterNav() {
  return (
    <nav
      className="grid grid-cols-2 gap-8 sm:grid-cols-4"
      aria-label="Footer navigation"
    >
      {COLUMNS.map((col) => (
        <div key={col.title}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            {col.title}
          </h3>
          <ul className="flex list-none flex-col gap-3">
            {col.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-base text-[#a0aec0] no-underline transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
