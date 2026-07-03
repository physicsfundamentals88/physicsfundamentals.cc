import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Momentum Calculator | Physics Fundamentals",
  description: "Solve for momentum (p = mv) given mass and velocity, or calculate the impulse from a force over time. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/momentum",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Momentum Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Solve for momentum (p = mv) given mass and velocity, or calculate the impulse from a force over time.",
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
      "name": "Momentum Calculator",
      "item": "https://physicsfundamentals.cc/calculators/momentum"
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

