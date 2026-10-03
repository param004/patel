export const profile = {
  name: "Param Pambhar",
  /** Kept short on purpose. The hero allows four text elements in total. */
  role: "Full-stack developer building 3D product experiences",
  /**
   * Written from the repository history, which is the only evidence
   * available. Every claim maps to a public repo.
   */
  bio: [
    "I build products end to end: schema, API, interface and deploy. Five of them are public, spanning two years of moving from Create React App to real-time WebGL in the browser.",
    "The work that separates the set is the drain assembly viewer, where a shopper takes a product apart instead of reading about it. The rest is the unglamorous half most portfolios skip: authentication, payments, admin tooling and file uploads.",
  ],
  github: "https://github.com/param004",
  /**
   * Intentionally empty until confirmed by hand. Git commit metadata
   * exposes a university address, and that should not reach a public
   * page without an explicit decision.
   */
  email: "",
  linkedin: "",
  resumeUrl: "",
  /** The arc the repository history actually shows. No invented dates. */
  timeline: [
    {
      year: 2026,
      title: "Real-time 3D in the browser",
      body: "Shipped an interactive Three.js product viewer using React Three Fiber with Tailwind 4 and React 19, the first WebGL work in the set.",
    },
    {
      year: 2026,
      title: "Marketplaces and OAuth",
      body: "Built a two-sided logistics marketplace with competing bids, three role dashboards, Google sign-in and server-generated PDF documents.",
    },
    {
      year: 2026,
      title: "Complete purchase flows",
      body: "Took an Ayurvedic storefront through cart, checkout, order confirmation, ratings and file upload on a seeded catalogue of thirteen products.",
    },
    {
      year: 2025,
      title: "Services layer and admin tooling",
      body: "Refactored an industrial catalogue around a dedicated services layer and built the admin console for products, orders and metrics over the same endpoints.",
    },
    {
      year: 2025,
      title: "Centralised state",
      body: "Modelled auth, questions and users as Redux Toolkit slices in a Q&A client, learning why shared state needs a single owner before over-applying it.",
    },
  ],
  /**
   * Grouped rather than one long list, so the section reads as three
   * capabilities instead of twenty loose pills.
   */
  capabilities: [
    {
      group: "Interface",
      items: [
        "React 18 and 19",
        "Next.js App Router",
        "Tailwind CSS 3 and 4",
        "GSAP ScrollTrigger",
        "React Three Fiber",
        "drei",
        "Three.js",
        "Motion",
      ],
    },
    {
      group: "Server",
      items: [
        "Express 4 and 5",
        "MongoDB and Mongoose",
        "JWT and bcrypt",
        "Google OAuth",
        "multer uploads",
        "pdfkit",
        "rate limiting",
        "helmet",
      ],
    },
    {
      group: "Practice",
      items: [
        "Vite and Create React App",
        "Railway, Vercel, Netlify",
        "Serverless HTTP",
        "REST design",
        "Admin consoles",
        "Ecommerce flows",
        "Redux Toolkit",
      ],
    },
  ],
} as const;