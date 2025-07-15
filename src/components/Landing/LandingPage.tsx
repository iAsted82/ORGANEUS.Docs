import React from 'react';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <Footer />
    </div>
  );
};