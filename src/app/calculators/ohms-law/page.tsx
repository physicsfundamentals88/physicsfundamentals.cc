import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Ohm's Law Calculator | PhysicsLab",
  description: "Easily calculate voltage, current, or resistance. Finds missing values based on identical formulas. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/ohms-law",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Ohm's Law Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Easily calculate voltage, current, or resistance. Finds missing values based on identical formulas.",
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
      "item": "https://physicslab.app"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Calculators",
      "item": "https://physicslab.app/calculators"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Ohm's Law Calculator",
      "item": "https://physicslab.app/calculators/ohms-law"
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
