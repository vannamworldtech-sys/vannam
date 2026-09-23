import fs from 'fs';
import path from 'path';
import { getAcademicYear, getCurrentYear } from './academicYear.js';

// Store file path (in project directory)
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'vannam-store.json');

// Initial default seed state
const defaultStore = {
  homepage: {
    heroBadge: `Admissions Open ${getAcademicYear()}`,
    heroTitle: "Where Curiosity Meets Joyful Montessori Excellence",
    heroSubtitle: "Welcome to Vannam World Preschool — cultivating confident, creative, and compassionate early learners through scientifically rooted play and nurturing spaces.",
    heroHighlight: "7-Shade Developmental Play",
    stats: [
      { label: "Happy Children", value: "1,200+" },
      { label: "Certified Educators", value: "35+" },
      { label: "Student-Teacher Ratio", value: "8:1" },
      { label: "Safety & Hygiene Score", value: "100%" }
    ],
    primaryCta: { text: "Book Campus Tour", link: "#admissions" },
    secondaryCta: { text: "Explore Curriculum", link: "#programs" }
  },
  about: {
    title: "Nurturing Little Minds Since 2018",
    subtitle: "A modern child-first sanctuary where early childhood science meets boundless playful curiosity.",
    mission: "To provide a safe, joyful, and developmentally enriched environment where every child discovers their unique talents through exploratory learning.",
    vision: "To become the benchmark for early childhood education, raising resilient, empathetic, and innovative lifelong learners.",
    values: [
      { title: "Safety & Love First", desc: "Every child is cared for with uncompromising safety standards and genuine emotional warmth." },
      { title: "Holistic 7-Shade Growth", desc: "Balancing cognitive, sensory, artistic, physical, emotional, and social development." },
      { title: "Hands-on Montessori Tools", desc: "Encouraging self-discovery with tactile wooden apparatus and exploratory play kits." },
      { title: "Parent Partnership", desc: "Transparent daily communication and collaborative milestone tracking." }
    ]
  },
  programs: [
    {
      id: "toddler-playgroup",
      title: "Toddler Playgroup",
      ageGroup: "1.5 – 2.5 Years",
      timing: "9:00 AM – 12:00 PM",
      ratio: "6:1",
      fee: "₹45,000 / term",
      badge: "Most Popular",
      status: "published",
      order: 1,
      desc: "Sensory play, social initiation, motor skills stimulation, and language building through gentle songs and movement.",
      features: [
        "Sensory tactile sand and water stations",
        "Gentle social interaction circles",
        "Fine & gross motor skill activities",
        "Musical storytelling and rhythm play"
      ],
      icon: "Baby"
    },
    {
      id: "nursery-explorers",
      title: "Nursery Explorers",
      ageGroup: "2.5 – 3.5 Years",
      timing: "9:00 AM – 12:30 PM",
      ratio: "8:1",
      fee: "₹52,000 / term",
      badge: "Foundational",
      status: "published",
      order: 2,
      desc: "Structured Montessori apparatus exploration, early phonics, numeracy foundations, and creative art studio blocks.",
      features: [
        "Jolly Phonics foundation sounds",
        "Montessori math beads and rods",
        "Expressive messy art & clay studio",
        "Outdoor nature discovery walks"
      ],
      icon: "Sparkles"
    },
    {
      id: "kindergarten-1",
      title: "Junior Kindergarten (LKG)",
      ageGroup: "3.5 – 4.5 Years",
      timing: "9:00 AM – 1:00 PM",
      ratio: "10:1",
      fee: "₹58,000 / term",
      badge: "Core STEAM",
      status: "published",
      order: 3,
      desc: "Reading readiness, STEAM inquiry science experiments, bilingual story circles, and practical life skills.",
      features: [
        "Early emergent reading & blended words",
        "Junior STEAM laboratory experiments",
        "Role-play & socio-dramatic theatre",
        "Introduction to rhythm and percussion"
      ],
      icon: "BookOpen"
    },
    {
      id: "kindergarten-2",
      title: "Senior Kindergarten (UKG)",
      ageGroup: "4.5 – 5.5 Years",
      timing: "9:00 AM – 1:30 PM",
      ratio: "12:1",
      fee: "₹64,000 / term",
      badge: "School Readiness",
      status: "published",
      order: 4,
      desc: "Advanced phonics fluency, cognitive logic puzzles, mental math, leadership projects, and sports agility.",
      features: [
        "Fluency in reading & independent journaling",
        "Mental arithmetic & word problem solving",
        "Junior sports & athletic agility skills",
        "Seamless primary school transition syllabus"
      ],
      icon: "GraduationCap"
    },
    {
      id: "daycare-extended",
      title: "Daycare & Extended Care",
      ageGroup: "1.5 – 8 Years",
      timing: "12:00 PM – 6:30 PM",
      ratio: "5:1",
      fee: "₹18,000 / month",
      badge: "Flexible Hours",
      status: "published",
      order: 5,
      desc: "Safe after-school sanctuary with hygienic sleeping pods, hot organic meals, guided homework, and evening hobby clubs.",
      features: [
        "Nutritious chef-prepared evening meals",
        "Quiet restful sanitised nap pods",
        "Supervised homework & revision hours",
        "Chess, pottery, and freestyle dance"
      ],
      icon: "Heart"
    }
  ],
  facilities: [
    {
      id: "fac-smart-class",
      title: "Smart Classrooms",
      desc: "Interactive touch panels, ergonomic child-sized furniture, and anti-glare natural lighting.",
      tag: "Tech & Ergonomics",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
      icon: "Box",
      accent: "border-vannam-yellow/30",
      status: "active",
      order: 1
    },
    {
      id: "fac-agility-park",
      title: "Safe Agility Playground",
      desc: "Imported shock-absorbing rubber turf, padded climbing frames, and shaded sandbox areas.",
      tag: "100% Child-Safe",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
      icon: "Smile",
      accent: "border-vannam-green/30",
      status: "active",
      order: 2
    },
    {
      id: "fac-montessori-lab",
      title: "Montessori & STEAM Lab",
      desc: "Dedicated tactile learning room equipped with wooden counting rods, gears, and puzzles.",
      tag: "Hands-on Learning",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      icon: "Box",
      accent: "border-vannam-cyan/30",
      status: "active",
      order: 3
    },
    {
      id: "fac-library",
      title: "Children's Story Library",
      desc: "Cozy reading nooks filled with plush cushions, puppet stages, and over 1,200 picture books.",
      tag: "Literacy Hub",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      icon: "BookOpen",
      accent: "border-vannam-purple/30",
      status: "active",
      order: 4
    },
    {
      id: "fac-soft-play",
      title: "Indoor Soft Play Area",
      desc: "Temperature-controlled ball pit, foam obstacle blocks, and mini climbing walls.",
      tag: "All-Weather Play",
      image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80",
      icon: "Waves",
      accent: "border-vannam-red/30",
      status: "active",
      order: 5
    },
    {
      id: "fac-dining",
      title: "Organic Dining Kitchen",
      desc: "Licensed in-house chef preparing fresh, nutritionist-approved warm lunches and snacks daily.",
      tag: "Health & Nutrition",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
      icon: "ShieldCheck",
      accent: "border-vannam-yellow/30",
      status: "active",
      order: 6
    }
  ],
  classes: [
    {
      id: "class-pre-kg-a",
      name: "Pre-KG Explorers",
      grade: "Pre-KG",
      room: "Lotus Room 101",
      capacity: 12,
      teacherId: "priya-sharma",
      teacherName: "Mrs. Priya Sharma",
      academicYear: "2026-27"
    },
    {
      id: "class-lkg-a",
      name: "Junior Kindergarten STEAM",
      grade: "LKG",
      room: "Orchid Room 102",
      capacity: 15,
      teacherId: "ananya-deshmukh",
      teacherName: "Ms. Ananya Deshmukh",
      academicYear: "2026-27"
    },
    {
      id: "class-ukg-a",
      name: "Senior Kindergarten Champions",
      grade: "UKG",
      room: "Sunflower Room 103",
      capacity: 15,
      teacherId: "priya-sharma",
      teacherName: "Mrs. Priya Sharma",
      academicYear: "2026-27"
    }
  ],
  students: [
    {
      id: "std-1",
      studentId: "VW-2026-001",
      name: "Aarav Sharma",
      dob: "2023-04-15",
      gender: "Boy",
      classId: "class-pre-kg-a",
      className: "Pre-KG Explorers",
      teacherId: "priya-sharma",
      teacherName: "Mrs. Priya Sharma",
      parentName: "Deepak Sharma",
      parentEmail: "deepak.sharma@example.com",
      parentPhone: "+91 98401 23456",
      emergencyContact: "+91 98401 23456",
      bloodGroup: "B+",
      allergies: "None",
      status: "Active",
      enrollmentDate: "2026-06-01",
      photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80"
    },
    {
      id: "std-2",
      studentId: "VW-2026-002",
      name: "Ananya Ramesh",
      dob: "2023-08-22",
      gender: "Girl",
      classId: "class-pre-kg-a",
      className: "Pre-KG Explorers",
      teacherId: "priya-sharma",
      teacherName: "Mrs. Priya Sharma",
      parentName: "Ramesh Sundaram",
      parentEmail: "ramesh.s@example.com",
      parentPhone: "+91 98402 34567",
      emergencyContact: "+91 98402 34567",
      bloodGroup: "O+",
      allergies: "Peanut sensitivity",
      status: "Active",
      enrollmentDate: "2026-06-01",
      photo: "https://images.unsplash.com/photo-1595454223600-91fbdd7726b2?w=200&q=80"
    },
    {
      id: "std-3",
      studentId: "VW-2026-003",
      name: "Vihaan Karthik",
      dob: "2022-11-10",
      gender: "Boy",
      classId: "class-lkg-a",
      className: "Junior Kindergarten STEAM",
      teacherId: "ananya-deshmukh",
      teacherName: "Ms. Ananya Deshmukh",
      parentName: "Karthik Venkatesh",
      parentEmail: "karthik.v@example.com",
      parentPhone: "+91 98403 45678",
      emergencyContact: "+91 98403 45678",
      bloodGroup: "A+",
      allergies: "None",
      status: "Active",
      enrollmentDate: "2026-06-01",
      photo: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&q=80"
    }
  ],
  activities: [
    {
      id: "act-1",
      studentId: "std-1",
      studentName: "Aarav Sharma",
      classId: "class-pre-kg-a",
      className: "Pre-KG Explorers",
      teacherId: "priya-sharma",
      teacherName: "Mrs. Priya Sharma",
      title: "Sensory Finger Painting & Color Mixing",
      category: "Art & Sensory",
      description: "Aarav participated in the finger painting activity today. He created beautiful concentric color patterns using child-safe organic paints.",
      date: "2026-08-29",
      photos: [
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80",
        "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80"
      ],
      createdAt: "2026-08-29T04:30:00Z"
    },
    {
      id: "act-2",
      studentId: "std-2",
      studentName: "Ananya Ramesh",
      classId: "class-pre-kg-a",
      className: "Pre-KG Explorers",
      teacherId: "priya-sharma",
      teacherName: "Mrs. Priya Sharma",
      title: "Tactile Pink Tower Montessori Assembly",
      category: "Montessori Math",
      description: "Ananya accurately stacked 10 gradation cubes in descending size order, showing exceptional concentration and spatial judgment.",
      date: "2026-08-29",
      photos: [
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80"
      ],
      createdAt: "2026-08-29T05:15:00Z"
    },
    {
      id: "act-3",
      studentId: "std-3",
      studentName: "Vihaan Karthik",
      classId: "class-lkg-a",
      className: "Junior Kindergarten STEAM",
      teacherId: "ananya-deshmukh",
      teacherName: "Ms. Ananya Deshmukh",
      title: "Seed Germination & Leaf Examination",
      category: "Junior STEAM",
      description: "Vihaan used a tactile hand magnifier to observe sprouting organic mung beans and recorded root structures in his nature diary.",
      date: "2026-08-29",
      photos: [
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80"
      ],
      createdAt: "2026-08-29T06:00:00Z"
    }
  ],
  attendance: [
    {
      id: "att-1",
      studentId: "std-1",
      studentName: "Aarav Sharma",
      classId: "class-pre-kg-a",
      teacherId: "priya-sharma",
      date: "2026-08-29",
      status: "PRESENT",
      remarks: "Arrived on time full of energy"
    },
    {
      id: "att-2",
      studentId: "std-2",
      studentName: "Ananya Ramesh",
      classId: "class-pre-kg-a",
      teacherId: "priya-sharma",
      date: "2026-08-29",
      status: "PRESENT",
      remarks: "Active participant"
    },
    {
      id: "att-3",
      studentId: "std-3",
      studentName: "Vihaan Karthik",
      classId: "class-lkg-a",
      teacherId: "ananya-deshmukh",
      date: "2026-08-29",
      status: "PRESENT",
      remarks: "Prompt and cheerful"
    }
  ],
  homework: [
    {
      id: "hw-1",
      classId: "class-pre-kg-a",
      className: "Pre-KG Explorers",
      teacherId: "priya-sharma",
      teacherName: "Mrs. Priya Sharma",
      title: "Tactile Shape & Color Hunt",
      subject: "Cognitive Discovery",
      description: "Spot 3 yellow circular objects around the home with mommy or daddy and collect 2 soft leaves for tomorrow's craft collage.",
      dueDate: "2026-08-30",
      status: "ASSIGNED",
      materials: "Color chart Page 6, Craft pouch"
    },
    {
      id: "hw-2",
      classId: "class-lkg-a",
      className: "Junior Kindergarten STEAM",
      teacherId: "ananya-deshmukh",
      teacherName: "Ms. Ananya Deshmukh",
      title: "Phonics Sound 'S' and 'A' Tracing",
      subject: "Language & Phonics",
      description: "Trace letters S and A with beeswax crayons on the Montessori phonics card sheet and name 3 animals starting with each sound.",
      dueDate: "2026-08-30",
      status: "ASSIGNED",
      materials: "Jolly Phonics Workbook Section 1"
    }
  ],
  teachers: [
    {
      id: "clara-bennett",
      name: "Mrs. Clara Bennett",
      role: "Principal & Founder",
      experience: "14+ Years",
      qualifications: "M.Ed Early Childhood Education (14+ Yrs)",
      qual: "M.Ed Early Childhood Education (14+ Yrs)",
      shortQual: "M.Ed Early Ed",
      bio: "Passionate about creating nurturing environments where every child feels seen, loved, and inspired to explore.",
      intro: "Passionate about creating nurturing environments where every child feels seen, loved, and inspired to explore.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      badge: "Founder",
      badgeColor: "bg-vannam-yellow/10 text-vannam-orange",
      active: true,
      email: "clara.b@vannam.edu"
    },
    {
      id: "priya-patel",
      name: "Ms. Priya Patel",
      role: "Montessori Lead Educator",
      experience: "9+ Years",
      qualifications: "Certified Montessori Trainer & Child Psychologist",
      qual: "Certified Montessori Trainer & Child Psychologist",
      shortQual: "AMI Montessori",
      bio: "Specializes in tactile sensory learning and building early phonics confidence through playful discovery.",
      intro: "Specializes in tactile sensory learning and building early phonics confidence through playful discovery.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
      badge: "Montessori Lead",
      badgeColor: "bg-vannam-green/10 text-vannam-green",
      active: true,
      email: "priya.p@vannam.edu"
    },
    {
      id: "sarah-jenkins",
      name: "Mrs. Sarah Jenkins",
      role: "Playgroup & Toddler Lead",
      experience: "7+ Years",
      qualifications: "B.S. Child Development & Pediatric First Aid Certified",
      qual: "B.S. Child Development & Pediatric First Aid Certified",
      shortQual: "B.S. Child Dev",
      bio: "Loves introducing toddlers to their first group social experiences with gentle encouragement and hugs.",
      intro: "Loves introducing toddlers to their first group social experiences with gentle encouragement and hugs.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      badge: "Toddler Expert",
      badgeColor: "bg-vannam-red/10 text-vannam-red",
      active: true,
      email: "sarah.j@vannam.edu"
    },
    {
      id: "david-miller",
      name: "Mr. David Miller",
      role: "STEAM & Agility Coach",
      experience: "6+ Years",
      qualifications: "B.Ed Physical Education & LEGO Education Instructor",
      qual: "B.Ed Physical Education & LEGO Education Instructor",
      shortQual: "B.Ed Physical Ed",
      bio: "Inspires young minds through spatial building projects, balance tracks, and fun scientific experiments.",
      intro: "Inspires young minds through spatial building projects, balance tracks, and fun scientific experiments.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      badge: "STEAM Coach",
      badgeColor: "bg-vannam-cyan/10 text-vannam-cyan",
      active: true,
      email: "david.m@vannam.edu"
    }
  ],
  testimonials: [
    {
      id: "test-1787977666742",
      name: "jfdbz",
      parent: "jfdbz",
      relation: "KJSDb",
      child: "KJSDb",
      rating: 3,
      text: "SDcssdgrsg",
      quote: "SDcssdgrsg",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      status: "published"
    },
    {
      id: "test-ananya",
      name: "Dr. Ananya Sharma",
      parent: "Dr. Ananya Sharma",
      relation: "Aarav (Nursery)",
      child: "Aarav (Nursery)",
      rating: 5,
      text: "Vannam World Preschool transformed Aarav from a shy toddler into a confident, expressive reader. The live CCTV feed and daily digital updates give us total peace of mind while at work!",
      quote: "Vannam World Preschool transformed Aarav from a shy toddler into a confident, expressive reader. The live CCTV feed and daily digital updates give us total peace of mind while at work!",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      status: "published"
    },
    {
      id: "test-michael",
      name: "Michael & Jessica Vance",
      parent: "Michael & Jessica Vance",
      relation: "Emma (Playgroup)",
      child: "Emma (Playgroup)",
      rating: 5,
      text: "The safety protocols are remarkable. Every staff member knows our daughter by name, and the organic chef-cooked meals solved our picky eating habits completely!",
      quote: "The safety protocols are remarkable. Every staff member knows our daughter by name, and the organic chef-cooked meals solved our picky eating habits completely!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      status: "published"
    },
    {
      id: "test-rajesh",
      name: "Rajesh & Meera Patel",
      parent: "Rajesh & Meera Patel",
      relation: "Vihaan (UKG)",
      child: "Vihaan (UKG)",
      rating: 5,
      text: "The STEAM Lego lab and phonics program prepared Vihaan so well for Grade 1. He looks forward to school every single morning!",
      quote: "The STEAM Lego lab and phonics program prepared Vihaan so well for Grade 1. He looks forward to school every single morning!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      status: "published"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Montessori Math Exploration",
      category: "classroom",
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      caption: "Junior learners manipulating tactile wooden cylinders and bead bars.",
      featured: true,
      status: "published",
      uploadDate: "2026-08-10"
    },
    {
      id: "gal-2",
      title: "Outdoor Agility Race",
      category: "sports",
      url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
      src: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
      caption: "Shock-absorbing safe sprinting and obstacle runs.",
      featured: true,
      status: "published",
      uploadDate: "2026-08-12"
    },
    {
      id: "gal-3",
      title: "Annual Cultural Dance",
      category: "celebrations",
      url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
      src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
      caption: "Children cheering together during our cheerful performances.",
      featured: true,
      status: "published",
      uploadDate: "2026-08-14"
    },
    {
      id: "gal-4",
      title: "Botany Garden Walk",
      category: "outdoor",
      url: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80",
      src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80",
      caption: "Nurturing botanical curiosity in our organic butterfly garden.",
      featured: false,
      status: "published",
      uploadDate: "2026-08-15"
    },
    {
      id: "gal-5",
      title: "Finger Painting Workshop",
      category: "activities",
      url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
      src: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
      caption: "Finger painting, pottery, and recycled crafts.",
      featured: false,
      status: "published",
      uploadDate: "2026-08-16"
    },
    {
      id: "gal-6",
      title: "Grandparents Day Tea",
      category: "events",
      url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
      src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
      caption: "Cherishing generations together.",
      featured: false,
      status: "published",
      uploadDate: "2026-08-18"
    },
    {
      id: "gal-7",
      title: "Story Corner Reading",
      category: "classroom",
      url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      caption: "Interactive storybook circles with vocal expression.",
      featured: false,
      status: "published",
      uploadDate: "2026-08-19"
    },
    {
      id: "gal-8",
      title: "Little Scientists Lab",
      category: "activities",
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
      src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
      caption: "Hands-on junior STEAM experiments.",
      featured: false,
      status: "published",
      uploadDate: "2026-08-20"
    }
  ],
  announcements: [
    {
      id: "ann-1",
      title: `Admissions Open for Academic Year ${getAcademicYear()}`,
      message: "Limited seats available across Playgroup, Nursery, LKG & UKG. Book your campus walkthrough now for early bird fee waiver!",
      type: "admission",
      active: false,
      startDate: "2026-08-01",
      expiryDate: "2026-09-30",
      link: "#admissions",
      linkText: "Apply Online",
      bannerColor: "from-[#0F2963] via-[#00A8E8] to-[#F59E0B]"
    },
    {
      id: "ann-2",
      title: "Grand Weekend Open House & Child Sensory Camp",
      message: "Join us this Saturday from 10 AM to 1 PM for free developmental milestone screenings and fun pottery workshops.",
      type: "event",
      active: false,
      startDate: "2026-08-15",
      expiryDate: "2026-08-25",
      link: "#contact",
      linkText: "Reserve Free Pass",
      bannerColor: "from-amber-600 via-orange-500 to-amber-700"
    }
  ],
  enquiries: [
    {
      id: "enq-101",
      parentName: "Siddharth Verma",
      email: "siddharth.v@gmail.com",
      phone: "+91 98450 12345",
      childAge: "2.5 Years",
      program: "Nursery Explorers",
      message: "Looking for nursery admissions starting next month. Would love to schedule a morning campus tour.",
      status: "new",
      notes: [
        { author: "Admin", text: "Called on 15th Aug, parent prefers Saturday morning 11 AM tour.", date: "2026-08-15T11:30:00Z" }
      ],
      createdAt: "2026-08-15T09:12:00Z"
    },
    {
      id: "enq-102",
      parentName: "Ananya Iyer",
      email: "ananya.iyer@outlook.com",
      phone: "+91 98840 56789",
      childAge: "1.8 Years",
      program: "Toddler Playgroup",
      message: "Inquiring about student-teacher ratio and live CCTV access for working parents.",
      status: "contacted",
      notes: [
        { author: "Priya (Admin)", text: "Sent brochure and CCTV policy document via WhatsApp.", date: "2026-08-14T14:20:00Z" }
      ],
      createdAt: "2026-08-14T10:45:00Z"
    },
    {
      id: "enq-103",
      parentName: "Vikram Malhotra",
      email: "vikram.m@techcorp.in",
      phone: "+91 97110 33445",
      childAge: "4.5 Years",
      program: "Senior Kindergarten (UKG)",
      message: "Relocating from Mumbai. Need details regarding primary school transition partnerships.",
      status: "followup",
      notes: [
        { author: "Admin", text: "Follow up scheduled for Monday 18th Aug regarding ICSE/CBSE transition tie-ups.", date: "2026-08-13T16:00:00Z" }
      ],
      createdAt: "2026-08-13T15:20:00Z"
    },
    {
      id: "enq-104",
      parentName: "Sneha Reddy",
      email: "sneha.reddy@gmail.com",
      phone: "+91 99002 88990",
      childAge: "3 Years",
      program: "Daycare & Extended Care",
      message: "Need daycare support until 6:30 PM with nutritious dinner snack included.",
      status: "resolved",
      notes: [
        { author: "Admin", text: "Enrolled in Daycare block starting Sept 1st. Fee received.", date: "2026-08-12T18:00:00Z" }
      ],
      createdAt: "2026-08-12T08:30:00Z"
    }
  ],
  admissions: [
    {
      id: "adm-201",
      parentName: "Rohan & Sneha Kapoor",
      childName: "Vihaan Kapoor",
      childDob: "2023-04-12",
      email: "rohan.kapoor@gmail.com",
      phone: "+91 98200 44556",
      program: "Nursery Explorers",
      preferredDate: "2026-09-01",
      status: "under_review",
      notes: [
        { author: "Super Admin", text: "Application form submitted with birth certificate and immunization records verified.", date: "2026-08-16T10:00:00Z" }
      ],
      createdAt: "2026-08-16T09:15:00Z"
    },
    {
      id: "adm-202",
      parentName: "Dr. Lakshmi Narayanan",
      childName: "Aditi Narayanan",
      childDob: "2022-09-20",
      email: "dr.lakshmi@hospital.org",
      phone: "+91 94440 12890",
      program: "Junior Kindergarten (LKG)",
      preferredDate: "2026-08-25",
      status: "approved",
      notes: [
        { author: "Super Admin", text: "Interaction round completed with flying colors. Admission letter issued.", date: "2026-08-15T15:45:00Z" }
      ],
      createdAt: "2026-08-14T11:00:00Z"
    },
    {
      id: "adm-203",
      parentName: "Karthik Srinivasan",
      childName: "Diya Srinivasan",
      childDob: "2024-01-10",
      email: "karthik.s@fintech.co",
      phone: "+91 99401 77665",
      program: "Toddler Playgroup",
      preferredDate: "2026-10-01",
      status: "new",
      notes: [],
      createdAt: "2026-08-17T08:00:00Z"
    }
  ],
  settings: {
    branding: {
      siteName: "Vannam World Preschool",
      tagline: "Learning Through Every Shade of Play",
      logoUrl: "/logo.png",
      primaryColor: "#0F2963",
      secondaryColor: "#F59E0B",
      accentColor: "#00A8E8",
      supportPhone: "+91 78100 87310",
      supportEmail: "hello@vannamworld.edu"
    },
    contact: {
      phone: "+91 78100 87310",
      email: "admissions@vannamworld.edu",
      address: "Door no: 701, G-6 ground floor, Sullivan Street, Gandhi Park, Coimbatore - 641 001",
      mapsUrl: "https://maps.app.goo.gl/AYaRRh5jPhJiWCSw5",
      whatsapp: "+91 78100 87310",
      hours: "Monday – Friday: 8:30 AM – 6:30 PM | Saturday: 9:00 AM – 1:30 PM"
    },
    social: {
      instagram: "https://instagram.com/vannamworldpreschool",
      facebook: "https://facebook.com/vannamworld",
      youtube: "https://youtube.com/@vannamworldpreschool",
      linkedin: "https://linkedin.com/company/vannam-preschool"
    },
    seo: {
      metaTitle: "Vannam World Preschool | Best Montessori & Play School in Chennai",
      metaDescription: "Award-winning early childhood sanctuary offering 7-Shade developmental learning, certified Montessori apparatus, encrypted CCTV security, and joyful daycare.",
      keywords: "preschool, montessori school, play school chennai, daycare, early childhood education, kindergarten admissions",
      ogImage: "/hero-kids.jpg"
    },
    navigation: [
      { label: "Home", href: "/", active: true },
      { label: "About Us", href: "/about", active: true },
      { label: "Programs", href: "/programs", active: true },
      { label: "Admissions", href: "/admissions", active: true },
      { label: "Safety & Hygiene", href: "/safety", active: true },
      { label: "Contact", href: "/contact", active: true }
    ],
    footer: {
      copyright: `© ${getCurrentYear()} Vannam World Preschool. All Rights Reserved.`,
      description: "Empowering children to flourish through child-centric discovery, science-backed play environments, and holistic empathy."
    }
  },
  users: [
    {
      id: "usr-1",
      name: "Dr. Gayathri R. (Super Admin)",
      email: "admin@vannam.edu",
      password: "Admin@Vannam2026",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80",
      lastLogin: "2026-08-29T09:00:00Z"
    },
    {
      id: "usr-teacher-1",
      name: "Mrs. Priya Sharma",
      email: "teacher@vannam.edu",
      password: "Teacher@Vannam2026",
      role: "TEACHER",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80",
      teacherId: "priya-sharma",
      lastLogin: "2026-08-29T09:00:00Z"
    },
    {
      id: "usr-teacher-2",
      name: "Ms. Ananya Deshmukh",
      email: "ananya.d@vannam.edu",
      password: "Teacher@Vannam2026",
      role: "TEACHER",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80",
      teacherId: "ananya-deshmukh",
      lastLogin: "2026-08-28T14:30:00Z"
    },
    {
      id: "usr-2",
      name: "Vikram K. (Content Manager)",
      email: "content@vannam.edu",
      password: "Content@Vannam2026",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80",
      lastLogin: "2026-08-16T16:20:00Z"
    }
  ],
  auditLogs: [
    {
      id: "log-1",
      action: "System Initialized",
      userId: "usr-1",
      userName: "Dr. Gayathri R. (Super Admin)",
      resource: "System",
      details: "Management System initialized with verified school data and RBAC roles.",
      timestamp: "2026-08-29T09:00:00Z"
    }
  ]
};

// In-memory cache with file modification tracking
let memoryStore = null;
let lastMtime = 0;
let isInitialized = false;

// Ensure data directory and file exist (runs once on startup or when file missing)
function ensureStoreExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultStore, null, 2), 'utf-8');
      lastMtime = fs.statSync(DATA_FILE).mtimeMs;
      memoryStore = JSON.parse(JSON.stringify(defaultStore));
      isInitialized = true;
      return;
    }

    if (!isInitialized) {
      const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      let modified = false;
      for (const key of Object.keys(defaultStore)) {
        if (existing[key] === undefined) {
          existing[key] = defaultStore[key];
          modified = true;
        }
      }
      // Ensure admin & teacher are permanently present with proper roles
      if (existing.users) {
        let admin = existing.users.find(u => u.email === 'admin@vannam.edu');
        if (!admin) {
          const defaultAdmin = (defaultStore.users || []).find(u => u.email === 'admin@vannam.edu') || defaultStore.users[0];
          if (defaultAdmin) {
            existing.users.unshift(defaultAdmin);
            modified = true;
          }
        } else if (admin.role !== 'ADMIN') {
          admin.role = 'ADMIN';
          modified = true;
        }
        const teacher = existing.users.find(u => u.email === 'teacher@vannam.edu');
        if (!teacher) {
          const defaultTeacher = (defaultStore.users || []).find(u => u.email === 'teacher@vannam.edu');
          if (defaultTeacher) {
            existing.users.push(defaultTeacher);
            modified = true;
          }
        }
      }
      if (modified) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2), 'utf-8');
      }
      lastMtime = fs.statSync(DATA_FILE).mtimeMs;
      memoryStore = existing;
      isInitialized = true;
    }
  } catch (err) {
    console.error("Error creating store file, using in-memory store:", err);
  }
}

// Read store - ultra-fast cached return
export function getStore() {
  try {
    if (!isInitialized) {
      ensureStoreExists();
    }

    if (fs.existsSync(DATA_FILE)) {
      const currentMtime = fs.statSync(DATA_FILE).mtimeMs;
      // Fast path: file has not changed on disk, return cached memory store instantly!
      if (memoryStore && currentMtime === lastMtime) {
        return memoryStore;
      }
      // Re-read only if file was modified externally
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      memoryStore = parsed;
      lastMtime = currentMtime;
      return parsed;
    }
  } catch (err) {
    console.error("Error reading store from disk, falling back to memory:", err);
  }
  return memoryStore || defaultStore;
}

// Write store
export function saveStore(updatedStore, auditEntry = null) {
  try {
    if (auditEntry) {
      const newLog = {
        id: `log-${Date.now()}`,
        action: auditEntry.action || "Content Updated",
        userId: auditEntry.userId || "usr-1",
        userName: auditEntry.userName || "Administrator",
        resource: auditEntry.resource || "General",
        details: auditEntry.details || "Updated via Management Portal",
        timestamp: new Date().toISOString()
      };
      updatedStore.auditLogs = [newLog, ...(updatedStore.auditLogs || [])].slice(0, 100);
    }

    // Update memory immediately for instant read consistency
    memoryStore = updatedStore;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedStore, null, 2), 'utf-8');
    lastMtime = fs.statSync(DATA_FILE).mtimeMs;

    // Asynchronously replicate to Neon PostgreSQL in the background
    if (auditEntry?.resource) {
      import('./neonSync.js').then(m => m.syncResourceToNeon(auditEntry.resource, updatedStore)).catch(() => {});
    }

    return true;
  } catch (err) {
    console.error("Error writing store to disk, updating memory store:", err);
    memoryStore = updatedStore;
    return true;
  }
}

// Helper getter by key
export function getSection(key) {
  const store = getStore();
  return store[key] || defaultStore[key];
}

// Helper setter by key
export function updateSection(key, value, auditEntry = null) {
  const store = getStore();
  store[key] = value;
  saveStore(store, auditEntry);
  return store[key];
}
