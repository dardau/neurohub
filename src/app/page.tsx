import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import ProblemSection from '@/app/components/ProblemSection';
import SolutionSection from '@/app/components/SolutionSection';
import ModulesSection from '@/app/components/ModulesSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import HowItWorksSection from '@/app/components/HowItWorksSection';
import PricingSection from '@/app/components/PricingSection';

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ModulesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </main>
  );
}