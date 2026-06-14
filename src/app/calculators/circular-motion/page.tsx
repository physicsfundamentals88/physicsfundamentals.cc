import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Circular Motion Calculator | Physics Fundamentals",
  description: "Calculate angular velocity, linear velocity, and period for objects in uniform circular motion. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/circular-motion",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Circular Motion Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Calculate angular velocity, linear velocity, and period for objects in uniform circular motion.",
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
      "name": "Circular Motion Calculator",
      "item": "https://physicslab.app/calculators/circular-motion"
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
