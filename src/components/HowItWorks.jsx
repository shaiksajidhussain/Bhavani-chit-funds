import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const progressBarRef = useRef(null);
  const floatingElementsRef = useRef(null);

  const steps = [
    {
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Create Group",
      description: "Set up your chit fund group with custom contribution amounts and member limits."
    },
    {
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: "Track & Remind",
      description: "Monitor contributions, send automated reminders, and maintain transparency."
    },
    {
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Collect & Confirm",
      description: "Streamlined collection process with instant confirmations and digital receipts."
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate floating background elements
      gsap.to('.floating-bg', {
        y: -20,
        x: 15,
        rotation: 360,
        duration: 8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.8
      });

      // Animate progress bar on scroll with elastic bounce
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1
        }
      });

      // Animate progress bar glow effect
      gsap.to(progressBarRef.current, {
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Animate steps with staggered entrance and floating effect
      gsap.fromTo('.step-item', 
        { 
          opacity: 0, 
          y: 60,
          scale: 0.8,
          rotationY: 15,
          rotationX: 10,
          z: -50
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          z: 0,
          duration: 0.8,
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

      // Animate step icons with floating motion
      gsap.to('.step-icon', {
        y: -8,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2
      });

      // Animate connection lines with flow effect
      gsap.to('.connection-line', {
        scaleX: 1,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate flow particles on connection lines
      gsap.to('.flow-particle', {
        x: "100%",
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        stagger: 0.5
      });

      // Add 3D tilt effect on mouse move for step cards
      const stepCards = document.querySelectorAll('.step-item');
      stepCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / 25;
          const rotateY = (centerX - x) / 25;
          
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
    <Section id="how-it-works" className="bg-white dark:bg-gray-900 relative overflow-hidden">
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
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto reveal">
            Simple three-step process to get your chit fund running smoothly.
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="relative mb-16">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div 
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-violet-600 via-amber-500 to-violet-600 rounded-full transform scale-x-0 origin-left relative"
            >
              {/* Progress bar shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine"></div>
            </div>
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-4 h-4 bg-violet-600 dark:bg-violet-400 rounded-full shadow-lg"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Step {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="step-item text-center group perspective-1000"
            >
              <div className="relative mb-8">
                <div className="step-icon inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-100 to-amber-100 dark:from-violet-900/30 dark:to-amber-900/30 rounded-full text-violet-600 dark:text-violet-400 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                  {/* Icon background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-amber-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  
                  {/* Icon */}
                  <div className="relative z-10">
                    {step.icon}
                  </div>
                  
                  {/* Hover effect ring */}
                  <div className="absolute inset-0 border-2 border-violet-300 dark:border-violet-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                </div>

                {/* Connection lines with flow effect */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-violet-300 to-amber-300 dark:from-violet-600 dark:to-amber-600 transform -translate-y-1/2 overflow-hidden">
                    <div className="connection-line w-full h-full bg-gradient-to-r from-violet-500 to-amber-500 transform scale-x-0 origin-left"></div>
                    
                    {/* Flow particles */}
                    <div className="flow-particle absolute top-0 left-0 w-2 h-full bg-white/60 rounded-full transform -translate-x-full"></div>
                    <div className="flow-particle absolute top-0 left-0 w-2 h-full bg-white/40 rounded-full transform -translate-x-full" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine { animation: shine 3s ease-in-out infinite; }
      `}</style>
    </Section>
  );
};

export default HowItWorks;
