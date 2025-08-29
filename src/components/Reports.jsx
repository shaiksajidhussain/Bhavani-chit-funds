import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';

gsap.registerPlugin(ScrollTrigger);

const Reports = () => {
  const sectionRef = useRef(null);
  const floatingElementsRef = useRef(null);

  const reportTypes = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Collection Reports",
      description: "Track monthly collections, outstanding amounts, and payment trends across all schemes."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: "Member Reports",
      description: "Comprehensive member profiles, contribution history, and account status reports."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Financial Reports",
      description: "Profit & loss statements, balance sheets, and cash flow analysis for fund management."
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate floating background elements
      gsap.to('.floating-bg', {
        y: -25,
        x: 15,
        rotation: 360,
        duration: 10,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 1
      });

      // Animate report cards on reveal with 3D effect
      gsap.fromTo('.report-card', 
        { 
          opacity: 0, 
          y: 60,
          scale: 0.8,
          rotationY: 20,
          rotationX: 15,
          z: -50
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          z: 0,
          duration: 1,
          stagger: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Add 3D tilt effect on mouse move
      const cards = document.querySelectorAll('.report-card');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;
          
          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.4,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: "power3.out"
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="reports" className="bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Floating background elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-bg absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-800/20 dark:to-violet-900/20 rounded-full opacity-30 blur-sm"></div>
        <div className="floating-bg absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-800/20 dark:to-amber-900/20 rounded-full opacity-40 blur-sm"></div>
        <div className="floating-bg absolute bottom-40 left-32 w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800/20 dark:to-blue-900/20 rounded-full opacity-25 blur-sm"></div>
        <div className="floating-bg absolute bottom-20 right-20 w-8 h-8 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-800/20 dark:to-green-900/20 rounded-full opacity-35 blur-sm"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 reveal">
            Comprehensive Reporting
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto reveal">
            Get detailed insights into your chit fund operations with our advanced reporting system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reportTypes.map((report, index) => (
            <div 
              key={index}
              className="report-card bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 reveal border border-gray-100 dark:border-gray-700 group perspective-1000 cursor-pointer"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-amber-100/50 dark:from-violet-900/20 dark:to-amber-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Content wrapper */}
              <div className="relative z-10">
                <div className="text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform duration-500 relative">
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 bg-violet-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 scale-0 group-hover:scale-100"></div>
                  
                  {/* Icon with floating animation */}
                  <div className="relative z-10 group-hover:animate-bounce">
                    {report.icon}
                  </div>
                  
                  {/* Hover ring effect */}
              
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-500">
                  {report.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-500">
                  {report.description}
                </p>
                
                {/* Hover indicator */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
               
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/10 to-amber-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-violet-500 dark:border-t-violet-600 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 origin-top-right"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Access these reports through your admin dashboard or contact us for custom reporting solutions.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-violet-600 to-violet-700 dark:from-violet-500 dark:to-violet-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-violet-800 dark:hover:from-violet-600 dark:hover:bg-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group">
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative z-10">View Sample Reports</span>
          </button>
        </div>
      </div>
    </Section>
  );
};

export default Reports;
