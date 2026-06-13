import type { Metadata } from "next";
import { Inter, DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PhysicsLab – Interactive Physics Simulations & Visual Learning",
    template: "%s | PhysicsLab",
  },
  description:
    "Explore gravity, pendulums, collisions, waves, and orbital mechanics through beautiful interactive simulations. Learn physics visually, at your own pace.",
  keywords: [
    "physics simulations",
    "interactive physics",
    "learn physics",
    "gravity simulator",
    "pendulum lab",
    "wave interference",
    "orbital mechanics",
    "educational physics platform",
  ],
  authors: [{ name: "PhysicsLab Team" }],
  creator: "PhysicsLab",
  metadataBase: new URL("https://physicslab.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://physicslab.app",
    title: "PhysicsLab – Interactive Physics Simulations & Visual Learning",
    description:
      "Explore gravity, pendulums, collisions, waves, and orbital mechanics through beautiful interactive simulations.",
    siteName: "PhysicsLab",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PhysicsLab – Visual Physics Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhysicsLab – Interactive Physics Simulations",
    description:
      "Learn physics through real-time interactive simulations. Gravity, waves, orbital mechanics & more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "PhysicsLab",
  url: "https://physicslab.app",
  description:
    "An interactive physics learning platform with real-time simulations covering gravity, pendulums, collisions, waves, and orbital mechanics.",
  educationalCredentialAwarded: "Physics Knowledge",
  teaches: [
    "Gravity",
    "Pendulum Motion",
    "Elastic Collisions",
    "Wave Interference",
    "Orbital Mechanics",
    "Newtonian Physics",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${instrumentSerif.variable} antialiased`}>
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b1220] text-[#e2e8f0]">
        {children}
      </body>
    </html>
  );
}
