// Landing.jsx — modular marketing page
import LandingNav         from "../components/landing/LandingNav";
import LandingHero        from "../components/landing/LandingHero";
import SocialProofBar     from "../components/landing/SocialProofBar";
import ProblemSection     from "../components/landing/ProblemSection";
import CapitalSection     from "../components/landing/CapitalSection";
import PaymentsSection    from "../components/landing/PaymentsSection";
import FeaturesSection    from "../components/landing/FeaturesSection";
import HowItWorksSection  from "../components/landing/HowItWorksSection";
import WhoIsItForSection  from "../components/landing/WhoIsItForSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import PricingSection     from "../components/landing/PricingSection";
import PosSection         from "../components/landing/PosSection";
import CountriesSection   from "../components/landing/CountriesSection";
import CtaSection         from "../components/landing/CtaSection";
import SupportSection     from "../components/landing/SupportSection";
import LandingFooter      from "../components/landing/LandingFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased" style={{ overflowX: "clip" }}>
      <LandingNav />
      <LandingHero />
      <SocialProofBar />
      <ProblemSection />
      <CapitalSection />
      <PaymentsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhoIsItForSection />
      <TestimonialsSection />
      <PricingSection />
      <PosSection />
      <CountriesSection />
      <CtaSection />
      <SupportSection />
      <LandingFooter />
    </div>
  );
}
