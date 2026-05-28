import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      name: "Student User",
      password
    }
  });

  const colleges = [
    {
      name: "IIT Madras",
      location: "Chennai, India",
      fees: 180000,
      rating: 4.9,
      overview: "One of India’s top engineering institutes, known for research, placements, and campus life.",
      courses: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
      rankCutoff: 2500
    },
    {
      name: "IIT Bombay",
      location: "Mumbai, India",
      fees: 190000,
      rating: 4.9,
      overview: "Premier technical university with top-tier BTech programs and strong industry connections.",
      courses: ["Computer Science", "Chemical Engineering", "Civil Engineering"],
      rankCutoff: 3000
    },
    {
      name: "IIT Delhi",
      location: "New Delhi, India",
      fees: 185000,
      rating: 4.9,
      overview: "Leading IIT with a powerful alumni network and exceptional BTech placements.",
      courses: ["Computer Science", "Electronics", "Information Technology"],
      rankCutoff: 2500
    },
    {
      name: "IIT Kanpur",
      location: "Kanpur, India",
      fees: 170000,
      rating: 4.8,
      overview: "Highly selective institute with strengths in engineering, research, and entrepreneurship.",
      courses: ["Computer Science", "Aerospace Engineering", "Materials Science"],
      rankCutoff: 3500
    },
    {
      name: "IIT Kharagpur",
      location: "Kharagpur, India",
      fees: 160000,
      rating: 4.7,
      overview: "Oldest IIT with a broad range of BTech specializations and strong campus tradition.",
      courses: ["Computer Science", "Biotechnology", "Mechanical Engineering"],
      rankCutoff: 5000
    },
    {
      name: "IIT Roorkee",
      location: "Roorkee, India",
      fees: 165000,
      rating: 4.7,
      overview: "Renowned technical university with excellent BTech programs and research labs.",
      courses: ["Civil Engineering", "Computer Science", "Environmental Engineering"],
      rankCutoff: 6000
    },
    {
      name: "BITS Pilani",
      location: "Pilani, India",
      fees: 220000,
      rating: 4.6,
      overview: "Top private institute with strong industry placement and global academic collaborations.",
      courses: ["Computer Science", "Electronics", "Data Science"],
      rankCutoff: 9000
    },
    {
      name: "IIIT Hyderabad",
      location: "Hyderabad, India",
      fees: 210000,
      rating: 4.7,
      overview: "Respected institute for IT, AI, and research-driven BTech programs.",
      courses: ["Computer Science", "Artificial Intelligence", "Data Science"],
      rankCutoff: 10000
    },
    {
      name: "IIIT Delhi",
      location: "New Delhi, India",
      fees: 200000,
      rating: 4.6,
      overview: "Highly regarded for computer science, cybersecurity, and electronics engineering.",
      courses: ["Computer Science", "Cyber Security", "Electronics"],
      rankCutoff: 12000
    },
    {
      name: "NIT Trichy",
      location: "Tiruchirappalli, India",
      fees: 120000,
      rating: 4.4,
      overview: "Consistently ranked among India’s top NITs with strong campus placements.",
      courses: ["Computer Science", "Electronics", "Civil Engineering"],
      rankCutoff: 14000
    },
    {
      name: "NIT Surathkal",
      location: "Surathkal, India",
      fees: 125000,
      rating: 4.4,
      overview: "Top NIT offering strong engineering programs and solid student support.",
      courses: ["Computer Science", "Mechanical Engineering", "Chemical Engineering"],
      rankCutoff: 15000
    },
    {
      name: "VIT Vellore",
      location: "Vellore, India",
      fees: 130000,
      rating: 4.3,
      overview: "Popular private technology institute with wide BTech specializations and campus amenities.",
      courses: ["Computer Science", "Information Technology", "Biomedical Engineering"],
      rankCutoff: 20000
    },
    {
      name: "SRM University",
      location: "Chennai, India",
      fees: 115000,
      rating: 4.1,
      overview: "Well-known private university with strong undergraduate engineering facilities.",
      courses: ["Computer Science", "Electronics", "Data Science"],
      rankCutoff: 25000
    },
    {
      name: "Amrita Vishwa Vidyapeetham",
      location: "Coimbatore, India",
      fees: 110000,
      rating: 4.2,
      overview: "Respected engineering university with a focus on research and student outcomes.",
      courses: ["Computer Science", "Mechanical Engineering", "Bioinformatics"],
      rankCutoff: 26000
    },
    {
      name: "Manipal Institute of Technology",
      location: "Manipal, India",
      fees: 125000,
      rating: 4.0,
      overview: "Private institute known for strong BTech programs and international exchange options.",
      courses: ["Computer Science", "Electronics", "Civil Engineering"],
      rankCutoff: 28000
    },
    {
      name: "JNTU Hyderabad",
      location: "Hyderabad, India",
      fees: 85000,
      rating: 3.8,
      overview: "Affordable public engineering university with good campus placement support.",
      courses: ["Computer Science", "Electrical Engineering", "Information Technology"],
      rankCutoff: 40000
    }
  ];

  for (const college of colleges) {
    await prisma.college.upsert({
      where: { name: college.name },
      update: {},
      create: college
    });
  }

  console.log("Seed data created for user and colleges.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
