import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Centripetal Force Calculator | PhysicsLab",
  description: "Find the centripetal force holding an object in a circle, given mass, velocity, and radius. Also outputs acceleration. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/centripetal-force",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Centripetal Force Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Find the centripetal force holding an object in a circle, given mass, velocity, and radius. Also outputs acceleration.",
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
      "name": "Centripetal Force Calculator",
      "item": "https://physicslab.app/calculators/centripetal-force"
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
