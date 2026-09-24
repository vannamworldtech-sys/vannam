export const metadata = {
  title: "Contact Campus Branches & Book a Guided Tour | Vannam World Preschool",
  description: "Get in touch with Vannam World Preschool. Find campus locations in Rainbow Gardens, Meadow Green, and Sunbeam Bay, or book your guided campus walkthrough.",
  keywords: ["contact preschool", "playschool phone number", "preschool address", "schedule campus tour", "preschool location map"],
  alternates: {
    canonical: "https://vannamworld.in/contact",
  },
  openGraph: {
    title: "Contact & Campus Visits | Vannam World Preschool",
    description: "Connect with our admissions helpline or schedule an in-person tour across our 3 premium early education campuses.",
    url: "https://vannamworld.in/contact",
  },
};

import ContactClient from "./ContactClient";

export default function ContactPage() {
  return <ContactClient />;
}
