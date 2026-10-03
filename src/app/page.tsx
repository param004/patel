import KageScene from "@/components/KageScene";
import KagePortfolioLink from "@/components/KagePortfolioLink";

export const metadata = {
  title: "Param Pambhar - Full-stack developer",
  description:
    "The complete authored Kage temple experience: navigation, scroll scenes and a local Three.js world.",
};

export default function Home() {
  return (
    <div className="kage-shell">
      <KageScene />
      {/*
        The authored document owns its own navigation and has no link back to
        the portfolio, and its markup is hash-verified so it cannot be edited to
        add one. This sits outside the iframe as app-side chrome instead.
      */}
      <KagePortfolioLink />
    </div>
  );
}
