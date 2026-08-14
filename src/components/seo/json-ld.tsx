export function WebsiteJsonLd({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function PersonJsonLd({
  name,
  url,
  image,
  jobTitle,
  sameAs,
  knowsAbout,
}: {
  name: string;
  url: string;
  image?: string;
  jobTitle?: string[];
  sameAs?: string[];
  knowsAbout?: string[];
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    image,
    jobTitle,
    sameAs,
    knowsAbout,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
