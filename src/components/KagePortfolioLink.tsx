import Link from "next/link";

/**
 * Route back to the portfolio from the Kage homepage.
 *
 * The authored Kage document supplies its own navigation, and its markup is
 * hash-verified, so it cannot be edited to link out to the portfolio. This is
 * app-side chrome rendered outside the iframe. It is deliberately anchored to
 * the bottom corner and kept quiet so it does not compete with the authored
 * hero and top navigation.
 */
export default function KagePortfolioLink() {
  return (
    <Link href="/portfolio" className="kage-portfolio-link">
      Portfolio
    </Link>
  );
}
