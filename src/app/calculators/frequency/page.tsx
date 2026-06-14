import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Frequency Calculator | Physics Fundamentals",
  description: "Convert between frequency, period, and angular frequency for oscillating systems. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/frequency",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Frequency Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Convert between frequency, period, and angular frequency for oscillating systems.",
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
      "name": "Frequency Calculator",
      "item": "https://physicslab.app/calculators/frequency"
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
