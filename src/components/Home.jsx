import React, { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import FeatureGrid from './FeatureGrid';
import HowItWorks from './HowItWorks';
import Schemes from './Schemes';
import Reports from './Reports';
import AnalyticsStrip from './AnalyticsStrip';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';
import ContactForm from './ContactForm';
import Footer from './Footer';
import FloatingElements from './FloatingElements';

const Home = () => {
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleSchemeSelect = (scheme) => {
    setSelectedScheme(scheme);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <Schemes onSchemeSelect={handleSchemeSelect} />
      <Reports />
      <AnalyticsStrip />
      <Testimonials />
      <CallToAction />
      <ContactForm selectedScheme={selectedScheme} />
      <Footer />
    </div>
  );
};

export default Home;
