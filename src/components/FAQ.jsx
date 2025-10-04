import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const faqs = [
    {
      question: "What is a chit fund?",
      answer: "A chit fund is a rotating savings and credit association system where members pool money periodically and one or more members get the lump-sum by draw or auction."
    },
    {
      question: "Is investing in a chit fund safe?",
      answer: "When managed by a credible, regulated operator with transparency, chit funds are relatively safe. At Bhavani Chits, we follow all statutory rules and maintain full disclosure."
    },
    {
      question: "How do I join Bhavani Chits?",
      answer: "You choose a plan, fill in an application, submit KYC documents, and begin paying installments monthly."
    },
    {
      question: "What happens if I miss a payment?",
      answer: "Depending on terms, your membership may be suspended or penalties may apply. Always check the fine print and contact us for clarification."
    },
    {
      question: "Can I withdraw early / exit the chit before maturity?",
      answer: "Some plans allow transfer or resale of your chit membership, subject to terms. Please consult with us for available exit options."
    },
    {
      question: "How are winners chosen?",
      answer: "Winners are selected through a monthly bidding/auction process or draw. The winning member is given the pooled money minus commission, and the rest is distributed among all members."
    },
    {
      question: "What are the charges / commission?",
      answer: "We charge a small commission / service charge from the pooled amount; all deductions and charges are transparently disclosed in the scheme details."
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate FAQ items on reveal
      gsap.fromTo('.faq-item', 
        { 
          opacity: 0, 
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" className="bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div ref={sectionRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 reveal">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto reveal">
            Get answers to common questions about chit funds and our services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="faq-item bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-violet-100 to-amber-100 dark:from-violet-900/30 dark:to-amber-900/30 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our customer support team is here to help you understand our chit fund plans better.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-amber-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="Contact Bhavani Chits customer support for assistance"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FAQ;
