import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Newton's Second Law Calculator | Physics Fundamentals",
  description: "Calculate force, mass, or acceleration using F = ma. Supports unit conversions. Free online physics calculator with step-by-step solutions.",
  alternates: {
    canonical: "/calculators/newtons-second-law",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Newton's Second Law Calculator",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "description": "Calculate force, mass, or acceleration using F = ma. Supports unit conversions.",
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
      "name": "Newton's Second Law Calculator",
      "item": "https://physicslab.app/calculators/newtons-second-law"
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
