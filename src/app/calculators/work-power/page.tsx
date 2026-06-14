import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Work & Power Calculator | Physics Fundamentals",
  description: "Calculate mechanical work from force and distance, and power by dividing work by time taken. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/work-power",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Work & Power Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Calculate mechanical work from force and distance, and power by dividing work by time taken.",
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
      "name": "Work & Power Calculator",
      "item": "https://physicslab.app/calculators/work-power"
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
