import type { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Roadmap | PhysicsLab",
  description: "View the official feature and content roadmap for PhysicsLab. Stay up to date with classical mechanics, electromagnetism, thermodynamics releases.",
  alternates: {
    canonical: "/roadmap",
  },
};

export default function RoadmapPage() {
  return <RoadmapClient />;
}
