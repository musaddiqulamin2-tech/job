import mongoose from "mongoose";
import Job from "../src/app/lib/models/Job.js";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

const jobs = [
  {
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Mumbai, India",
    salary: "₹5 - ₹8 LPA",
    type: "Full Time",
    category: "Technology",
    tagColor: "teal",
    description:
      "We are looking for a passionate Frontend Developer to build beautiful, responsive web applications using modern JavaScript frameworks.",
    requirements: [
      "2+ years experience with React or Next.js",
      "Strong knowledge of JavaScript, HTML, CSS",
      "Experience with REST APIs and modern frontend tooling",
      "Good understanding of responsive design",
    ],
    responsibilities: [
      "Build and maintain responsive web interfaces",
      "Collaborate with designers and backend developers",
      "Optimize applications for performance and scalability",
      "Write clean, maintainable, and testable code",
    ],
    experience: "2 - 4 Years",
    posted: "2 days ago",
    featured: true,
  },
  {
    title: "Backend Developer",
    company: "Software World",
    location: "Bangalore, India",
    salary: "₹6 - ₹10 LPA",
    type: "Full Time",
    category: "Technology",
    tagColor: "blue",
    description:
      "Join our team to design and build scalable backend systems powering our products for millions of users.",
    requirements: [
      "3+ years experience with Node.js or Python",
      "Experience with MongoDB, PostgreSQL, or MySQL",
      "Knowledge of microservices architecture",
      "Understanding of API design and best practices",
    ],
    responsibilities: [
      "Design and develop server-side logic",
      "Integrate with frontend components",
      "Ensure high performance and responsiveness",
      "Write and maintain API documentation",
    ],
    experience: "3 - 5 Years",
    posted: "1 day ago",
    featured: true,
  },
  {
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Delhi, India",
    salary: "₹4 - ₹7 LPA",
    type: "Full Time",
    category: "Design",
    tagColor: "indigo",
    description:
      "We need a creative UI/UX Designer who can craft intuitive and beautiful user experiences across web and mobile.",
    requirements: [
      "Strong portfolio demonstrating UI/UX design skills",
      "Proficiency with Figma, Sketch, or Adobe XD",
      "Understanding of design systems and color theory",
      "Knowledge of user research and usability testing",
    ],
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research and usability testing",
      "Collaborate with developers to ensure design fidelity",
      "Maintain and evolve our design system",
    ],
    experience: "1 - 3 Years",
    posted: "3 hours ago",
  },
  {
    title: "Product Manager",
    company: "Innovate Tech",
    location: "Hyderabad, India",
    salary: "₹10 - ₹15 LPA",
    type: "Full Time",
    category: "Management",
    tagColor: "amber",
    description:
      "Own the product vision and roadmap for our core platform, working closely with engineering, design, and business teams.",
    requirements: [
      "4+ years experience in product management",
      "Strong analytical and problem-solving skills",
      "Excellent communication and stakeholder management",
      "Experience with Agile/Scrum methodologies",
    ],
    responsibilities: [
      "Define product strategy and roadmap",
      "Gather and prioritize product requirements",
      "Work with engineering to deliver features",
      "Analyze metrics to drive product decisions",
    ],
    experience: "4 - 7 Years",
    posted: "5 days ago",
  },
  {
    title: "Data Analyst",
    company: "DataCorp",
    location: "Pune, India",
    salary: "₹5 - ₹9 LPA",
    type: "Full Time",
    category: "Data Science",
    tagColor: "sky",
    description:
      "Transform raw data into actionable insights that drive business decisions. Work with SQL, Python, and BI tools.",
    requirements: [
      "2+ years experience in data analysis",
      "Proficiency in SQL and Python",
      "Experience with Power BI or Tableau",
      "Strong statistical knowledge",
    ],
    responsibilities: [
      "Analyze data to identify trends and patterns",
      "Build dashboards and reports",
      "Present insights to stakeholders",
      "Collaborate with data engineering teams",
    ],
    experience: "2 - 4 Years",
    posted: "4 days ago",
  },
  {
    title: "DevOps Engineer",
    company: "CloudNine",
    location: "Remote",
    salary: "₹8 - ₹14 LPA",
    type: "Remote",
    category: "Engineering",
    tagColor: "emerald",
    description:
      "Build and maintain our CI/CD pipelines and cloud infrastructure. Strong focus on automation and reliability.",
    requirements: [
      "3+ years experience in DevOps or SRE",
      "Experience with AWS, GCP, or Azure",
      "Knowledge of Docker and Kubernetes",
      "Proficiency with CI/CD tools (Jenkins, GitHub Actions)",
    ],
    responsibilities: [
      "Manage cloud infrastructure",
      "Build and maintain CI/CD pipelines",
      "Automate deployment processes",
      "Monitor system health and uptime",
    ],
    experience: "3 - 6 Years",
    posted: "1 day ago",
    featured: true,
  },
  {
    title: "Digital Marketing Specialist",
    company: "GrowthHub",
    location: "Gurugram, India",
    salary: "₹4 - ₹7 LPA",
    type: "Full Time",
    category: "Marketing",
    tagColor: "purple",
    description:
      "Drive growth through SEO, content marketing, and paid campaigns. Own the digital marketing strategy end-to-end.",
    requirements: [
      "2+ years experience in digital marketing",
      "Experience with Google Ads and SEO tools",
      "Strong copywriting skills",
      "Knowledge of analytics platforms",
    ],
    responsibilities: [
      "Plan and execute digital campaigns",
      "Optimize content for SEO",
      "Manage social media channels",
      "Track and report on campaign performance",
    ],
    experience: "2 - 4 Years",
    posted: "3 days ago",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Job.deleteMany({});
    console.log("Cleared existing jobs");

    const result = await Job.insertMany(jobs);
    console.log(`Inserted ${result.length} jobs`);
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

seed();
