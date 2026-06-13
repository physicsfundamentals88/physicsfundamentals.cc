import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import SimulationsClient from "./SimulationsClient";

export const metadata: Metadata = {
  title: "Interactive Physics Simulations",
  description: "Manipulate variables, run experiments, and learn orbital mechanics, gravity, and kinematics visually with our real-time interactive physics simulators.",
  alternates: {
    canonical: "/simulations",
  },
};

export default function SimulationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1e]">
      <Navbar />
      <SimulationsClient />
      <Footer />
    </div>
  );
}
