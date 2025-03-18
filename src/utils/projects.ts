import BukuHijau from "@/assets/images/ProjectImages/BukuHijau.png";
import Sireklas from "@/assets/images/ProjectImages/Sireklas.png";
import Malindo from "@/assets/images/ProjectImages/Malindo.png";
import type { Project } from "./projectType"; // Import interface

export const projects: Project[] = [
  {
    title: "CareerMatch",
    year: "2024",
    tags: [
      "DotNet",
      "TailwindCSS",
      "MongoDB",
      "Prometheus",
      "Grafana",
      "React",
      "RabbitMQ",
      "CockroachDB",
      "Redis",
    ],
    repoLink: "https://github.com/CareerMatch",
    subtitle: "A Job Matching Platform Inspired by Tinder and Indeed",
    description:
      "A job-matching platform designed to connect job seekers with opportunities through an intuitive, swipe-based interface. Inspired by modern matchmaking apps, it streamlines the recruitment process by intelligently pairing candidates with roles that match their skills and preferences. The system also includes analytics and employer dashboards to enhance hiring efficiency.",
  },
  {
    title: "SIREKLAS (Sistem Reservasi Kelas) TOWER 2 ITS",
    year: "2023",
    tags: ["Laravel", "TailwindCSS", "MySQL"],
    image: Sireklas,
    subtitle: "A classroom reservation and monitoring system",
    description:
      "A class reservation system developed to improve room booking management in academic institutions. It allows students and faculty to reserve classrooms efficiently, reducing scheduling conflicts and optimizing space utilization. The system provides a seamless booking experience with real-time availability updates.",
  },
  {
    title: "MALINDO",
    year: "2022",
    tags: ["Laravel", "TailwindCSS", "MySQL"],
    image: Malindo,
    repoLink: "https://github.com/hobingantuk/MPPL-SawadiKap",
    subtitle: "Final Project of MPPL Course at ITS in my 5th semester",
    description:
      "A community-driven platform designed to facilitate learning of local languages rooted in Malay heritage, including Indonesian and Malaysian. It provides an interactive and accessible environment for users to engage with language resources, promoting cultural and linguistic exchange between speakers of both nations.",
  },
  {
    title: "Cerebrum Buku Hijau",
    year: "2022",
    tags: ["Laravel", "TailwindCSS", "MySQL"],
    image: BukuHijau,
    subtitle: "A digital management system for Buku Hijau",
    description:
      "A digital platform designed to streamline student assessment and training progress tracking. It provides a structured system for managing evaluations, allowing administrators and mentors to input grades and monitor student performance. By replacing manual paperwork with a digitalized evaluation process, it enhances accessibility and efficiency in academic progress tracking.",
  },
];
