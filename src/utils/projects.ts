import BukuHijau from "../images/ProjectImages/BukuHijau.png";
import Sireklas from "../images/ProjectImages/SIREKLAS.png";
import Malindo from "../images/ProjectImages/Malindo.png";
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
      "This project was developed to digitalize the manual process of recording Buku Hijau data in universities. It helps students and lecturers track academic progress and research activities.",
  },
  {
    title: "SIREKLAS(Sistem Reservasi Kelas) TOWER 2 ITS",
    year: "2023",
    tags: ["Laravel", "TailwindCSS", "MySQL"],
    image: Sireklas,
    subtitle: "A digital management system for Buku Hijau",
    description:
      "This project was developed to digitalize the manual process of recording Buku Hijau data in universities. It helps students and lecturers track academic progress and research activities.",
  },
  {
    title: "MALINDO",
    year: "2022",
    tags: ["Laravel", "TailwindCSS", "MySQL"],
    image: Malindo,
    repoLink: "https://github.com/hobingantuk/MPPL-SawadiKap",
    subtitle: "Final Project of MPPL Course at ITS in my 5th semester",
    description:
      "A Community Platform that is made for learning some local languages in Melayu roots (Indonesia & Malaysia).",
  },
  {
    title: "Cerebrum Buku Hijau",
    year: "2022",
    tags: ["Laravel", "TailwindCSS", "MySQL"],
    image: BukuHijau,
    subtitle: "A digital management system for Buku Hijau",
    description:
      "This project was developed to digitalize the manual process of recording Buku Hijau data in universities. It helps students and lecturers track academic progress and research activities.",
  },
];
