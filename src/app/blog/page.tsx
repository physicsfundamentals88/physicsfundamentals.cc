import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Physics Fundamentals Blog",
  description: "Read in-depth articles on physics fundamentals covering classical mechanics, electromagnetism, thermodynamics, waves, optics, and kinematics.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return <BlogClient initialArticles={[]} />;
}
