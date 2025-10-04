import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate cards on reveal
      gsap.fromTo('.about-card', 
        { 
          opacity: 0, 
          y: 60,
          scale: 0.9,
          rotationY: 15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate values list
      gsap.fromTo('.value-item', 
        { 
          opacity: 0, 
          x: -30
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const values = [
    "Integrity & Honesty",
    "Transparency in Operations", 
    "Customer First Approach",
    "Regulatory Compliance",
    "Financial Empowerment"
  ];

  return (
    <Section id="about" className="bg-white dark:bg-gray-900 relative overflow-hidden">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 reveal">
            About Us
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto reveal">
            Learn more about our mission, vision, and the values that drive us to provide exceptional chit fund services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Mission */}
          <div className="about-card bg-gradient-to-br from-violet-50 to-amber-50 dark:from-violet-900/20 dark:to-amber-900/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-amber-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At Bhavani Chits, our mission is to empower individuals to save and invest smartly using the time-tested mechanism of chit funds. We aim to provide financial inclusion, discipline, and opportunity to all.
            </p>
          </div>

          {/* Vision */}
          <div className="about-card bg-gradient-to-br from-amber-50 to-violet-50 dark:from-amber-900/20 dark:to-violet-900/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-violet-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To be recognized as the most trusted and customer-centric chit fund company across the region, setting new standards in transparency and customer satisfaction.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="about-card bg-gradient-to-br from-amber-50 to-violet-50 dark:from-amber-900/20 dark:to-violet-900/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="value-item flex items-center p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-amber-500 rounded-full mr-4 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutUs;
