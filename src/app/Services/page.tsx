import ServicesHero from "./components/ServicesHero";
import ServicesGrid from "./components/ServicesGrid";
import Coverage from "./components/Coverage";
import HowItWorks from "./components/HowItWorks";
import WhyChoose from "./components/WhyChoose";
import FinalCTA from "./components/FinalCTA";

export default function Services() {
  return (
    <main>
      <ServicesHero />
      <ServicesGrid />
      <Coverage />
      <HowItWorks />
      <WhyChoose />
      <FinalCTA />
    </main>
  );
}
