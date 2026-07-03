import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Gravitational Potential Energy Calculator | Physics Fundamentals",
  description: "Find the potential energy of an object at a certain height above the ground using U = mgh. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/gravitational-potential-energy",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Gravitational Potential Energy Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Find the potential energy of an object at a certain height above the ground using U = mgh.",
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
      "name": "Gravitational Potential Energy Calculator",
      "item": "https://physicsfundamentals.cc/calculators/gravitational-potential-energy"
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

