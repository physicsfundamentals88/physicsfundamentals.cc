import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

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
    default: "Physics Fundamentals – Learn Physics from Basics to Advanced Concepts",
    template: "%s | Physics Fundamentals",
  },
  description:
    "Master physics with easy-to-understand notes, formulas, tutorials, solved examples, and in-depth guides on mechanics, waves, thermodynamics, electricity, optics, and modern physics.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/favicon.png",
  },
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
  authors: [{ name: "Physics Fundamentals Team" }],
  creator: "Physics Fundamentals",
  metadataBase: new URL("https://physicsfundamentals.cc"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://physicsfundamentals.cc",
    title: "Physics Fundamentals – Learn Physics from Basics to Advanced Concepts",
    description:
      "Master physics with easy-to-understand notes, formulas, tutorials, solved examples, and in-depth guides on mechanics, waves, thermodynamics, electricity, optics, and modern physics.",
    siteName: "Physics Fundamentals",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Physics Fundamentals – Learn Physics from Basics to Advanced Concepts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Physics Fundamentals – Learn Physics from Basics to Advanced Concepts",
    description:
      "Master physics with easy-to-understand notes, formulas, tutorials, solved examples, and in-depth guides on mechanics, waves, thermodynamics, electricity, optics, and modern physics.",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1220",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Physics Fundamentals",
  url: "https://physicsfundamentals.cc",
  description:
    "Master physics with easy-to-understand notes, formulas, tutorials, solved examples, and in-depth guides on mechanics, waves, thermodynamics, electricity, optics, and modern physics.",
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
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${instrumentSerif.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b1220] text-[#e2e8f0]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
