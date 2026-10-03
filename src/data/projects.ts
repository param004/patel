export type ProjectTier = "flagship" | "supporting" | "archive";

export type ProjectImage = {
  src: string;
  alt: string;
  /** Intrinsic aspect ratio as width/height, used to avoid layout shift. */
  ratio: number;
};

export type Project = {
  slug: string;
  title: string;
  /** Short label for tight spaces such as the pinned work rail. */
  kicker: string;
  year: number;
  tier: ProjectTier;
  /** One line. Max 20 words. */
  summary: string;
  role: string;
  stack: string[];
  /** Verifiable from the repository. Not invented. */
  highlights: string[];
  problem: string;
  approach: string;
  outcome: string;
  repoUrl: string;
  /** Empty until a live deployment is confirmed. Never fabricated. */
  liveUrl?: string;
  /** Where the app is configured to deploy. Not proof that it is deployed. */
  deployTarget?: string;
  images: ProjectImage[];
  featured: boolean;
};

/**
 * Every stack string below was read from the repository's own
 * package.json and file tree, not inferred. The five projects are
 * presented in tiers so the page does not read as five near-identical
 * shops: one 3D flagship, two distinct supporting builds, two archive
 * entries that prove range.
 */
export const projects: Project[] = [
  {
    slug: "pop-up-drain-assembly",
    title: "POP-UP Drain Assembly",
    kicker: "Interactive 3D storefront",
    year: 2026,
    tier: "flagship",
    featured: true,
    summary:
      "Product storefront built around an interactive WebGL viewer that lets a visitor take a drain assembly apart piece by piece.",
    role: "Sole developer, design through deployment",
    stack: [
      "React 19",
      "Three.js 0.186",
      "React Three Fiber 9",
      "drei 10",
      "Tailwind 4",
      "Vite 7",
      "Express 5",
      "MongoDB",
      "JWT",
    ],
    highlights: [
      "Exploded-view 3D viewer with per-part hotspots",
      "Cart, wishlist and checkout over a Mongoose API",
      "JWT auth with bcrypt hashing and helmet headers",
      "Rate limiting and email via nodemailer",
      "Single-process start script, bundled for deploy",
    ],
    problem:
      "A fittings brand wanted a storefront for a plumbing product whose appeal depends on how it is assembled. Photographs cannot show that, and a flat catalogue buries the one detail that sells the product.",
    approach:
      "I built a real-time Three.js scene in React Three Fiber where each component of the assembly is an addressable mesh. Hotspots tie each part to its spec. The same React tree carries the commerce flow so the 3D view and the cart never disagree about what is being sold.",
    outcome:
      "The flagship of the portfolio and the only project that uses WebGL. It is also the only one built on Tailwind 4 and React 19.",
    repoUrl: "https://github.com/param004/POP-UP-Drain-Assembly",
    deployTarget: "Railway",
    /**
     * No product photography ships with the repository, and a stand-in would
     * be a fabricated visual. This project renders a repo-stat panel instead,
     * which is real content and also keeps it from matching the photo cards.
     */
    images: [],
  },
  {
    slug: "movit",
    title: "Movit",
    kicker: "Logistics marketplace",
    year: 2026,
    tier: "supporting",
    featured: true,
    summary:
      "Two-sided marketplace where shippers post transport jobs and carriers bid on them, with three separate dashboards.",
    role: "Sole developer",
    stack: [
      "React 18",
      "Vite 6",
      "Express 4",
      "MongoDB",
      "Google OAuth",
      "pdfkit",
      "Netlify",
    ],
    highlights: [
      "Job, bid, city and profile data models",
      "Distinct shipper, carrier and admin dashboards",
      "Google OAuth alongside email and password",
      "PDF generation server-side with pdfkit",
      "Serverless-friendly via serverless-http",
    ],
    problem:
      "Moving freight needs two very different interfaces. A shipper posts a job and waits, while a carrier browses open routes and competes on price. One shared UI cannot serve either well.",
    approach:
      "I split the product into three dashboards over one API. Bids are a first-class model rather than a field on a job, so competing offers stay distinct and auditable. Google OAuth removes the largest drop-off in sign-up.",
    outcome:
      "The most structurally different project in the set: a real two-sided marketplace with generated documents rather than a catalogue.",
    repoUrl: "https://github.com/param004/movit",
    deployTarget: "Netlify",
    images: [],
  },
  {
    slug: "premier-products",
    title: "Premier Products",
    kicker: "Industrial catalogue",
    year: 2025,
    tier: "supporting",
    featured: true,
    summary:
      "B2B catalogue for brass fittings and instrumentation, built around a services layer and a full admin console.",
    role: "Sole developer",
    stack: [
      "React 19",
      "Vite 7",
      "Tailwind 3",
      "Express",
      "MongoDB",
      "Vercel",
    ],
    highlights: [
      "Six-service API client layer, one module per domain",
      "Admin console for products, orders and dashboard metrics",
      "AVIF product photography with premium variants",
      "Bespoke image pipeline documented for the client",
    ],
    problem:
      "Industrial buyers need accurate part data and a way to reorder, not a lifestyle storefront. The catalogue had to carry dense specifications without becoming unreadable.",
    approach:
      "I kept data access in a dedicated services layer instead of scattering fetches through components, then built an admin console over the same endpoints so catalogue edits never need a redeploy. Product photography is served as AVIF with separate premium variants.",
    outcome:
      "The largest catalogue in the portfolio and the deepest admin tooling. Also the earliest project on React 19.",
    repoUrl: "https://github.com/param004/Premier-Products",
    deployTarget: "Vercel",
    images: [
      {
        src: "/projects/premier-1.jpg",
        alt: "Brass cross fitting from the Premier Products catalogue",
        ratio: 1374 / 1400,
      },
      {
        src: "/projects/premier-2.jpg",
        alt: "Threaded adapters arranged on a work surface",
        ratio: 1400 / 1219,
      },
      {
        src: "/projects/premier-3.jpg",
        alt: "Instrumentation fittings photographed for the catalogue",
        ratio: 1400 / 1161,
      },
      {
        src: "/projects/premier-4.jpg",
        alt: "Brass valve components in the industrial catalogue range",
        ratio: 1400 / 1294,
      },
    ],
  },
  {
    slug: "herb-veda",
    title: "Herb Veda",
    kicker: "Ayurvedic storefront",
    year: 2026,
    tier: "archive",
    featured: false,
    summary:
      "Storefront for an Ayurvedic skincare range with cart, checkout, ratings and a seeded product catalogue.",
    role: "Sole developer",
    stack: [
      "React 18",
      "Vite 5",
      "Tailwind 3",
      "Express 4",
      "MongoDB",
      "multer",
      "Netlify",
    ],
    highlights: [
      "Cart and checkout with order confirmation flow",
      "Star ratings and product detail pages",
      "Route protection and separate auth and cart contexts",
      "Image upload through multer, seeded with 13 real products",
    ],
    problem:
      "A small brand needed a working shop rather than a brochure, including the unglamorous parts: cart persistence, order history and an admin view.",
    approach:
      "I built the full purchase path and split state into an auth context and a cart context so re-authentication does not clear the basket. Ratings and uploads were handled server-side rather than faked in the client.",
    outcome:
      "The first project where I owned a complete purchase flow end to end, including files.",
    repoUrl: "https://github.com/param004/Herb-Veda-final",
    deployTarget: "Netlify",
    images: [
      {
        src: "/projects/herveda-1.jpg",
        alt: "Ayurvedic skincare range from the Herb Veda storefront",
        ratio: 1200 / 1179,
      },
      {
        src: "/projects/herveda-2.jpg",
        alt: "Product packaging photographed for Herb Veda",
        ratio: 1200 / 1177,
      },
      {
        src: "/projects/herveda-3.jpg",
        alt: "Herb Veda product detail imagery",
        ratio: 1200 / 1162,
      },
    ],
  },
  {
    slug: "codequest",
    title: "CodeQuest",
    kicker: "Q&A community client",
    year: 2025,
    tier: "archive",
    featured: false,
    summary:
      "Question and answer client with tags, reputation and user profiles, built on Redux Toolkit and Create React App.",
    role: "Sole developer",
    stack: [
      "React 18",
      "Redux Toolkit",
      "React Hook Form",
      "Create React App",
      "Express",
      "MongoDB",
    ],
    highlights: [
      "Redux Toolkit slices for auth, questions and users",
      "Tags, answers and voting across the question view",
      "User profiles with reputation transfer and login history",
      "User agent and IP logging for session history",
    ],
    problem:
      "A community site needs shared state that many views mutate at once, which is exactly where component-local state falls apart.",
    approach:
      "I modelled auth, questions and users as separate Redux slices with thunks for async work, so any view can read or update the same source of truth. Login history records the user agent and IP for each session.",
    outcome:
      "The earliest project here and the only one on Create React App. It is where I learned why centralised state matters before reaching for it everywhere.",
    repoUrl: "https://github.com/param004/codequest1",
    images: [],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}