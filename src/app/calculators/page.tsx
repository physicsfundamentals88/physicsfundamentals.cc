import type { Metadata } from "next";
import CalculatorsClient from "./CalculatorsClient";

export const metadata: Metadata = {
  title: "Physics Calculators | PhysicsLab",
  description: "Free online physics calculators with step-by-step solutions for kinematics, classical mechanics, electromagnetism, waves, optics, and thermodynamics.",
  alternates: {
    canonical: "/calculators",
  },
};

export default function CalculatorsPage() {
  return <CalculatorsClient />;
}
