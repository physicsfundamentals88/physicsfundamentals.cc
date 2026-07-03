import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Capacitance Calculator | Physics Fundamentals",
  description: "Solve for capacitance, charge, or voltage in a capacitor using the formula C = Q/V. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/capacitance",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Capacitance Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Solve for capacitance, charge, or voltage in a capacitor using the formula C = Q/V.",
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
      "name": "Capacitance Calculator",
      "item": "https://physicsfundamentals.cc/calculators/capacitance"
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

