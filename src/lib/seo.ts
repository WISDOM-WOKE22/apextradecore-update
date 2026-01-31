/**
 * Central SEO config and JSON-LD. Uses env vars; omits fields when not set.
 */

const SITE_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME?.trim() || "ApexTradeCore Investment";
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION?.trim() ||
  "Exclusive investment opportunities with flexible plans. Manage deposits, withdrawals, and track returns.";

/** Base URL for canonicals and OG. Set NEXT_PUBLIC_APP_URL in production. */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (typeof process.env.VERCEL_URL === "string")
    return `https://${process.env.VERCEL_URL}`;
  return "";
}

export function getSiteName(): string {
  return SITE_NAME;
}

export function getSiteDescription(): string {
  return SITE_DESCRIPTION;
}

/** Contact info from env. Only includes keys that are non-empty. */
export function getContactInfo(): {
  email?: string;
  phone?: string;
  address?: string;
} {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
  const address = process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim();
  return { ...(email && { email }), ...(phone && { phone }), ...(address && { address }) };
}

/** Default metadata for the site (title template, description, OG). */
export function getDefaultMetadata(): {
  metadataBase: URL | undefined;
  title: { default: string; template: string };
  description: string;
  openGraph: { siteName: string; type: string; locale: string };
} {
  const base = getBaseUrl();
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: `${SITE_NAME} | Financial Freedom`, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US" },
  };
}

/** Organization JSON-LD. Contact fields only when env is set. */
export function buildOrganizationJsonLd(): object {
  const contact = getContactInfo();
  const base = getBaseUrl();
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
  };
  if (base) org.url = base;
  if (contact.email) org.email = contact.email;
  if (contact.phone) org.telephone = contact.phone;
  if (contact.address) org.address = { "@type": "PostalAddress", streetAddress: contact.address };
  return org;
}

/** WebSite JSON-LD for sitelinks search box potential. */
export function buildWebsiteJsonLd(): object {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    ...(base && { url: base }),
  };
}
