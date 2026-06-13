import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Escape Velocity Calculator | PhysicsLab",
  description: "Calculate the minimum speed an object needs to escape the gravitational pull of a celestial body. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/escape-velocity",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Escape Velocity Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Calculate the minimum speed an object needs to escape the gravitational pull of a celestial body.",
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
      "name": "Escape Velocity Calculator",
      "item": "https://physicslab.app/calculators/escape-velocity"
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
