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
          Ready to Start Your Investment Journey?
        </h2>
        <p className="text-xl text-violet-100 dark:text-violet-200 mb-8 max-w-2xl mx-auto reveal">
          Join thousands of satisfied members who trust Bhavani Chits for their financial growth and disciplined savings.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white dark:bg-gray-100 text-violet-600 dark:text-violet-700 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 reveal"
            aria-label="View our chit fund investment plans and schemes"
          >
            Explore Our Chit Plans
          </button>
          <button
            onClick={scrollToContact}
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-violet-600 dark:hover:text-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 reveal"
            aria-label="Contact us to join Bhavani Chits"
          >
            Join Now
          </button>
        </div>
      </div>
    </Section>
  );
};

export default CallToAction;
