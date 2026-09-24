export const metadata = {
  title: "Admissions & Online Enrollment (Academic Year 2026-27)",
  description: "Enroll your child at Vannam World Preschool. Simple 4-step admission process, campus tours, and online registration for Toddler, Playgroup, Nursery, and KG.",
  keywords: ["preschool admission", "playschool enrollment 2026", "register child preschool", "kindergarten admission form", "Montessori school admission"],
  alternates: {
    canonical: "https://vannamworld.in/admissions",
  },
  openGraph: {
    title: "Admissions Open 2026-27 | Vannam World Preschool",
    description: "Secure your child's seat today. 4-step seamless enrollment flow with campus tour booking.",
    url: "https://vannamworld.in/admissions",
  },
};

import AdmissionsClient from "./AdmissionsClient";

export default function AdmissionsPage() {
  return <AdmissionsClient />;
}
