import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Physics Fundamentals",
  description: "Learn about the mission, team, and principles behind Physics Fundamentals. Dedicated to making physics free and accessible to students globally.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
