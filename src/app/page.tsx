import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactBar from '@/components/ContactBar';
import HeroSection from '@/app/components/HeroSection';
import ProblemSection from '@/app/components/ProblemSection';
import SolutionSection from '@/app/components/SolutionSection';
import ModulesSection from '@/app/components/ModulesSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import CTASection from '@/app/components/CTASection';

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <HeroSection />
      <ContactBar />
      <ProblemSection />
      <SolutionSection />
      <ModulesSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
