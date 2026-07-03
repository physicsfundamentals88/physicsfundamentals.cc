import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Ideal Gas Law Calculator | Physics Fundamentals",
  description: "Solver for the equation PV = nRT. Input any three variables to instantly find the fourth. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/ideal-gas-law",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Ideal Gas Law Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Solver for the equation PV = nRT. Input any three variables to instantly find the fourth.",
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
      "name": "Ideal Gas Law Calculator",
      "item": "https://physicsfundamentals.cc/calculators/ideal-gas-law"
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

