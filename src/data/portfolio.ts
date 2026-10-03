import { projects as sourceProjects } from "./projects";

export const portfolioData = {
  name: "Param Pambhar",
  title: "Full-stack developer",
  email: "parampambhar@gmail.com",
  github: "https://github.com/param004",
  linkedin: "https://linkedin.com/in/parampambhar",
  resumePath: "/resume.pdf",
  hero: {
    lines: ["Build Ideas", "Into Products", "in Motion"],
    rightMicrocopyTop: ["Full-stack", "Developer"],
    rightMicrocopyBottom: ["Five public", "projects"],
  },
  whyWorkWithMe: {
    subtitle: "I build end-to-end solutions from schema to deployment.",
    valueProps: [
      {
        icon: "Rocket",
        title: "End-to-end delivery",
        description:
          "From database schema and API design to frontend and deployment, I handle the complete stack.",
      },
      {
        icon: "Sparkles",
        title: "Modern tech stack",
        description:
          "React, Next.js, TypeScript, Node.js, MongoDB, and Three.js support fast, capable products.",
      },
      {
        icon: "Zap",
        title: "Public work",
        description:
          "Open repositories show real problem solving across commerce, marketplaces, and interactive 3D.",
      },
    ],
  },
  contact: {
    headline: "Let's build something",
    email: "parampambhar@gmail.com",
    github: "https://github.com/param004",
    linkedin: "https://linkedin.com/in/parampambhar",
    resumeLabel: "Download resume",
  },
  projects: sourceProjects.map((project) => ({
    ...project,
    tags: ({
      "pop-up-drain-assembly": ["WebGL", "Commerce"],
      movit: ["Logistics", "Marketplace"],
      "premier-products": ["Catalogue", "Admin"],
      "herb-veda": ["Commerce", "Healthcare"],
      codequest: ["Community", "State"],
    } as Record<string, [string, string]>)[project.slug],
    image: project.images[0]?.src,
    href: project.liveUrl || project.repoUrl,
  })),
};

export type PortfolioProject = (typeof portfolioData.projects)[number];
