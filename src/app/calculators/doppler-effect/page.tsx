import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Doppler Effect Calculator | Physics Fundamentals",
  description: "Find the observed frequency of sound waves when the source or observer are moving relative to each other. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/doppler-effect",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Doppler Effect Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Find the observed frequency of sound waves when the source or observer are moving relative to each other.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://physicsfundamentals.cc"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Calculators",
      "item": "https://physicsfundamentals.cc/calculators"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Doppler Effect Calculator",
      "item": "https://physicsfundamentals.cc/calculators/doppler-effect"
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Client />
    </>
  );
}

