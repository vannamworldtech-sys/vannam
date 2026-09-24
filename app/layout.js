import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["600", "700"],
  display: "swap",
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL("https://vannamworld.in"),
  title: {
    default: "Vannam World Preschool | Best Montessori, STEAM & Daycare Playschool",
    template: "%s | Vannam World Preschool",
  },
  description: "Award-winning Montessori & STEAM preschool featuring 1:6 teacher ratios, organic chef nutrition, 4K encrypted parent live stream, and nurturing early learning programs.",
  keywords: [
    "best preschool near me",
    "top playschool",
    "Montessori preschool",
    "STEAM early childhood education",
    "daycare for toddlers",
    "kindergarten admissions 2026",
    "nursery school enrollment",
    "safe preschool with live camera streaming",
    "organic food playschool",
    "preschool admissions",
    "early child development center"
  ],
  authors: [{ name: "Vannam World Preschool", url: "https://vannamworld.in" }],
  creator: "Vannam World Preschool",
  publisher: "Vannam World Preschool",
  applicationName: "Vannam World Preschool",
  category: "Education",
  classification: "Preschool, Kindergarten, Early Childhood Education",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Vannam World Preschool | Award-Winning Early Childhood & Montessori Education",
    description: "Nurturing curious young minds with STEAM Montessori curricula, certified teachers, organic chef meals, and real-time parent portal app.",
    url: "https://vannamworld.in",
    siteName: "Vannam World Preschool",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vannam World Preschool | Creative, Safe & Joyful Playschool",
    description: "Montessori STEAM learning, organic chef meals, certified teachers, and secure parent login portal.",
    creator: "@VannamWorld",
    site: "@VannamWorld",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://vannamworld.in",
  },
  verification: {
    google: "google-site-verification-token",
  },
};

export const viewport = {
  themeColor: "#0F2963",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  // Comprehensive Schema.org Graph combining Preschool, FAQ, Breadcrumbs, and Site Navigation
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "Preschool", "ChildCare"],
        "@id": "https://vannamworld.in/#organization",
        "name": "Vannam World Preschool",
        "alternateName": ["Vannam Preschool", "Vannam Playschool", "Vannam World Daycare"],
        "url": "https://vannamworld.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vannamworld.in/favicon.ico",
          "caption": "Vannam World Preschool Logo"
        },
        "image": "https://vannamworld.in/favicon.ico",
        "description": "Leading Montessori and STEAM preschool delivering progressive early childhood education with certified teachers, 4K live streaming, and organic chef nutrition.",
        "telephone": "+91-78100-87310",
        "email": "admissions@vannamworld.in",
        "priceRange": "₹₹",
        "currenciesAccepted": "INR",
        "paymentAccepted": "Credit Card, Direct Debit, UPI, Online Banking",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Door no: 701, G-6 ground floor, Sullivan Street, Gandhi Park",
          "addressLocality": "Coimbatore",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 10.9954152,
          "longitude": 76.9507372
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Preschool Programs & Admissions",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Course",
                "name": "Toddler Discovery Program (1.5 - 2.5 yrs)",
                "description": "Sensory exploration, motor skills, social bonding, and potty training support."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Course",
                "name": "Playgroup Explorer (2.5 - 3.5 yrs)",
                "description": "Montessori discovery, language immersion, basic numeracy, and rhythmic play."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Course",
                "name": "Nursery Innovators (3.5 - 4.5 yrs)",
                "description": "STEAM foundations, phonics, environmental science, and emotional development."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Course",
                "name": "Kindergarten Preparatory (4.5 - 6.0 yrs)",
                "description": "Advanced literacy, logic, global citizenship, and elementary school readiness."
              }
            }
          ]
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "184",
          "bestRating": "5",
          "worstRating": "1"
        },
        "sameAs": [
          "https://facebook.com/vannamworldpreschool",
          "https://instagram.com/vannamworldpreschool",
          "https://youtube.com/vannamworldpreschool"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://vannamworld.in/#website",
        "url": "https://vannamworld.in",
        "name": "Vannam World Preschool",
        "publisher": {
          "@id": "https://vannamworld.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://vannamworld.in/programs?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://vannamworld.in/#navigation",
        "name": "Main Navigation",
        "hasPart": [
          {
            "@type": "WebPage",
            "name": "Programs",
            "description": "Toddler, Playgroup, Nursery, and Kindergarten STEAM & Montessori curriculum",
            "url": "https://vannamworld.in/programs"
          },
          {
            "@type": "WebPage",
            "name": "Admissions",
            "description": "Fee structure, enrollment schedule, and application process",
            "url": "https://vannamworld.in/admissions"
          },
          {
            "@type": "WebPage",
            "name": "About Us",
            "description": "Our educational philosophy, founder story, and certified educators",
            "url": "https://vannamworld.in/about"
          },
          {
            "@type": "WebPage",
            "name": "Safety & Care",
            "description": "4K live streaming, child-proof campus, and pediatric medical protocols",
            "url": "https://vannamworld.in/safety"
          },
          {
            "@type": "WebPage",
            "name": "Gallery",
            "description": "Campus facilities, classroom activities, outdoor play areas, and events",
            "url": "https://vannamworld.in/gallery"
          },
          {
            "@type": "WebPage",
            "name": "Contact & Visit",
            "description": "Schedule a campus tour, get directions, and call our admissions office",
            "url": "https://vannamworld.in/contact"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://vannamworld.in/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the teacher-to-child ratio at Vannam World Preschool?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We maintain an ultra-low teacher-to-child ratio: 1:4 for Toddlers, 1:6 for Playgroup, 1:8 for Nursery, and 1:10 for Kindergarten, alongside dedicated assistant caregivers in every classroom."
            }
          },
          {
            "@type": "Question",
            "name": "How does the secure parent live streaming work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our 4K encrypted live video feed is exclusively accessible to verified parents via the secure Parent Portal app between 8:00 AM and 6:00 PM on school days."
            }
          },
          {
            "@type": "Question",
            "name": "What curriculum framework does Vannam World Preschool follow?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We blend the internationally acclaimed Montessori method with Hands-on STEAM (Science, Tech, Engineering, Arts, Math) experiential learning."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${fredoka.variable} ${plusJakarta.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </head>
      <body className="font-sans bg-[#FFFDF8] bg-playful-dots text-[#0F2963] antialiased selection:bg-vannam-yellow/30 selection:text-vannam-orange relative min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
