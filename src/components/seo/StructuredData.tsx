import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";

export function StructuredData() {
  const organization = buildOrganizationJsonLd();
  const website = buildWebsiteJsonLd();
  const jsonLd = [organization, website];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
