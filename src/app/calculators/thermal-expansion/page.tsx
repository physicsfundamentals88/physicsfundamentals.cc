import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Thermal Expansion Calculator | Physics Fundamentals",
  description: "Predict the change in length for a solid material when its temperature changes, given the expansion coefficient. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/thermal-expansion",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Thermal Expansion Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Predict the change in length for a solid material when its temperature changes, given the expansion coefficient.",
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
      "name": "Thermal Expansion Calculator",
      "item": "https://physicsfundamentals.cc/calculators/thermal-expansion"
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

