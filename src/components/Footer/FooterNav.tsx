"use client";

import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "#", label: "Overview" },
      { href: "/features", label: "Features" },
      { href: "#", label: "Tutorials" },
      { href: "#", label: "Pricing" },
      { href: "#", label: "Releases" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About us" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Press" },
      { href: "#", label: "News" },
      { href: "#", label: "Media kit" },
      { href: "#", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "#", label: "Blog" },
      { href: "#", label: "Newsletter" },
      { href: "#", label: "Help center" },
      { href: "#", label: "Tutorials" },
      { href: "#", label: "Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Terms" },
      { href: "#", label: "Privacy" },
      { href: "#", label: "Cookies" },
      { href: "#", label: "Licenses" },
      { href: "#", label: "Releases" },
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
