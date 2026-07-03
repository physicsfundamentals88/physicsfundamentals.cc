import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Kinetic Energy Calculator | Physics Fundamentals",
  description: "Compute kinetic energy from mass and velocity, or find the required velocity and mass for a target energy level. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/kinetic-energy",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kinetic Energy Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Compute kinetic energy from mass and velocity, or find the required velocity and mass for a target energy level.",
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
      "name": "Kinetic Energy Calculator",
      "item": "https://physicsfundamentals.cc/calculators/kinetic-energy"
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

