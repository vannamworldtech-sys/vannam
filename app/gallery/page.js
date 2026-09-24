export const metadata = {
  title: "Campus Photo Gallery & Memories | Vannam World Preschool",
  description: "Explore snapshots of classroom STEAM activities, outdoor agility, seasonal cultural celebrations, and happy childhood moments at Vannam World Preschool.",
  keywords: ["preschool gallery", "campus photos", "montessori activities", "preschool events", "kids activities coimbatore"],
  alternates: {
    canonical: "https://vannamworld.in/gallery",
  },
  openGraph: {
    title: "Campus Photo Gallery & Memories | Vannam World Preschool",
    description: "Explore snapshots of classroom STEAM activities, outdoor sports, and joyous learning moments at Vannam World Preschool.",
    url: "https://vannamworld.in/gallery",
  },
};

import GalleryClient from "./GalleryClient";

export default function GalleryPage() {
  return <GalleryClient />;
}
