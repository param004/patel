import PortfolioNav from '@/components/portfolio/PortfolioNav';
import PortfolioHero from '@/components/portfolio/PortfolioHero';
import PortfolioTransition from '@/components/portfolio/PortfolioTransition';
import PortfolioWork from '@/components/portfolio/PortfolioWork';
import PortfolioWhy from '@/components/portfolio/PortfolioWhy';
import PortfolioContact from '@/components/portfolio/PortfolioContact';

export const metadata = {
  title: 'Portfolio - Param Pambhar',
  description:
    'Full-stack developer working across React, Node and real-time 3D in the browser. Five shipped projects, from a Redux Q&A client to an interactive WebGL product viewer.',
};

export default function PortfolioPage() {
  return (
    <div className="portfolio-page bg-black">
      <PortfolioNav />
      <PortfolioHero />
      <PortfolioTransition />
      <PortfolioWork />
      <PortfolioWhy />
      <PortfolioContact />
    </div>
  );
}
