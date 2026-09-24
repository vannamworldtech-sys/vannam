export const metadata = {
  title: "Academic Programs & Montessori STEAM Curriculum | Ages 1.5 - 6",
  description: "Explore our age-tailored early learning programs: Toddler Discovery, Playgroup Explorer, Nursery Innovators, and Kindergarten Prep. Learn through play with certified educators.",
  keywords: ["preschool programs", "Montessori curriculum", "STEAM for kids", "toddler classes", "nursery school syllabus", "kindergarten preparation"],
  alternates: {
    canonical: "https://vannamworld.in/programs",
  },
  openGraph: {
    title: "Preschool Programs & Curriculum | Vannam World Preschool",
    description: "Montessori & STEAM-based programs crafted for ages 1.5 to 6 years with 1:6 teacher ratios.",
    url: "https://vannamworld.in/programs",
  },
};

import ProgramsClient from "./ProgramsClient";

export default function ProgramsPage() {
  return <ProgramsClient />;
}
