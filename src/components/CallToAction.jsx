import React from 'react';
import Section from './Section';

const CallToAction = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section className="bg-gradient-to-r from-violet-600 to-amber-600 dark:from-violet-700 dark:to-amber-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 reveal">
          Ready to organize your chit groups the smart way?
        </h2>
        <p className="text-xl text-violet-100 dark:text-violet-200 mb-8 max-w-2xl mx-auto reveal">
          Join thousands of successful chit fund managers who have transformed their operations with our platform.
        </p>
        <button
          onClick={scrollToContact}
          className="px-8 py-4 bg-white dark:bg-gray-100 text-violet-600 dark:text-violet-700 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 reveal"
        >
          Get a Free Demo
        </button>
      </div>
    </Section>
  );
};

export default CallToAction;
