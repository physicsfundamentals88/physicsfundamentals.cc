import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Pressure & Density Calculator | Physics Fundamentals",
  description: "Find the pressure exerted by a force over an area or calculate the density of a substance. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/pressure-density",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Pressure & Density Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Find the pressure exerted by a force over an area or calculate the density of a substance.",
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
      "name": "Pressure & Density Calculator",
      "item": "https://physicsfundamentals.cc/calculators/pressure-density"
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

