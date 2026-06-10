import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeatureGridSection from '../components/home/FeatureGridSection';
import StorySection from '../components/home/StorySection';
import FeaturedItems from '../components/home/FeaturedItems';
import TestimonialsSection from '../components/home/TestimonialsSection';
import LocationsSection from '../components/home/LocationsSection';

export default function Home() {
  return (
    <div className="hide-scrollbar pb-40">
      <HeroSection />
      <FeatureGridSection />
      <StorySection />
      <FeaturedItems />
      <TestimonialsSection />
      <LocationsSection />
    </div>
  );
}