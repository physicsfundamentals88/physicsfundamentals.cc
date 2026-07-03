import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Projectile Motion Calculator | Physics Fundamentals",
  description: "Calculate max height, time of flight, range, and current trajectory position given an initial velocity and angle. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/projectile-motion",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Projectile Motion Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Calculate max height, time of flight, range, and current trajectory position given an initial velocity and angle.",
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
      "name": "Projectile Motion Calculator",
      "item": "https://physicsfundamentals.cc/calculators/projectile-motion"
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

