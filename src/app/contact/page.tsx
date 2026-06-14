import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Physics Fundamentals",
  description: "Get in touch with the Physics Fundamentals team. Submit general inquiries, suggest content, report bugs, or request partnerships.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
