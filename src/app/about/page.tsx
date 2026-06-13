import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | PhysicsLab",
  description: "Learn about the mission, team, and principles behind PhysicsLab. Dedicated to making physics fundamentals free and accessible to students globally.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
