import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Coulomb's Law Calculator | Physics Fundamentals",
  description: "Determine the electrostatic force between two point charges separated by a specific distance in a vacuum. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/coulombs-law",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Coulomb's Law Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Determine the electrostatic force between two point charges separated by a specific distance in a vacuum.",
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
      "name": "Coulomb's Law Calculator",
      "item": "https://physicslab.app/calculators/coulombs-law"
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
