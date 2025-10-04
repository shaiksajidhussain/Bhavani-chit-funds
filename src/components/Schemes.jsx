import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';

gsap.registerPlugin(ScrollTrigger);

const Schemes = ({ onSchemeSelect }) => {
  const schemesRef = useRef(null);
  const particleContainerRef = useRef(null);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Stagger animation for scheme cards with 3D effect
      gsap.fromTo('.scheme-card', 
        { 
          opacity: 0, 
          y: 80,
          scale: 0.7,
          rotationY: 25,
          rotationX: 15,
          z: -100
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
            trigger: schemesRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate floating particles
      gsap.to('.floating-particle', {
        y: -30,
        x: 20,
        rotation: 360,
        duration: 6,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      });

      // Animate popular badge
      gsap.to('.popular-badge', {
        y: -5,
        scale: 1.05,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Hover effects for scheme cards
      gsap.set('.scheme-card', { transformOrigin: "center center" });
      
      // Add 3D tilt effect on mouse move
      const cards = document.querySelectorAll('.scheme-card');
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
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        });
      });

    }, schemesRef);

    return () => ctx.revert();
  }, []);

  const schemes = [
    {
      name: "Standard Chit Plans",
      monthlyAmount: "₹1,000",
      duration: "12-24 months",
      members: "Flexible",
      features: [
        "Monthly installments with fixed tenure",
        "Regular draw schedule",
        "Low entry amounts",
        "Minimal paperwork and quick registration"
      ],
      color: "from-gray-400 to-gray-600",
      gradient: "from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-900/30"
    },
    {
      name: "Premium / High Value Plans",
      monthlyAmount: "₹5,000",
      duration: "24-36 months",
      members: "Premium",
      features: [
        "Larger sums for higher returns",
        "Extended tenures available",
        "Secure handling of funds",
        "Regular statements & updates"
      ],
      color: "from-amber-400 to-amber-600",
      gradient: "from-amber-100 to-amber-200 dark:from-amber-800/30 dark:to-amber-900/30",
      popular: true
    },
    {
      name: "Customized Chit Plans",
      monthlyAmount: "Flexible",
      duration: "Custom",
      members: "Tailored",
      features: [
        "Tailor installment amount and duration",
        "Group / Corporate Chits available",
        "For clubs, groups, small companies",
        "Transparent monthly draw schedules"
      ],
      color: "from-violet-400 to-violet-600",
      gradient: "from-violet-100 to-violet-200 dark:from-violet-800/30 dark:to-violet-900/30"
    }
  ];

  const handleEnquire = (scheme) => {
    if (onSchemeSelect) {
      onSchemeSelect(scheme);
    }
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="schemes" className="bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Floating particles background */}
      <div ref={particleContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-particle absolute top-20 left-20 w-3 h-3 bg-violet-400 dark:bg-violet-600 rounded-full opacity-60"></div>
        <div className="floating-particle absolute top-40 right-32 w-2 h-2 bg-amber-400 dark:bg-amber-600 rounded-full opacity-50"></div>
        <div className="floating-particle absolute bottom-40 left-32 w-4 h-4 bg-blue-400 dark:bg-blue-600 rounded-full opacity-40"></div>
        <div className="floating-particle absolute bottom-20 right-20 w-2 h-2 bg-green-400 dark:bg-green-600 rounded-full opacity-70"></div>
        <div className="floating-particle absolute top-1/2 left-10 w-3 h-3 bg-pink-400 dark:bg-pink-600 rounded-full opacity-45"></div>
        <div className="floating-particle absolute top-1/2 right-10 w-2 h-2 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-55"></div>
      </div>

      <div ref={schemesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 reveal">
            Services / Chit Plans
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto reveal">
            Flexible schemes designed to fit your savings goals and financial capacity. Choose from our range of chit fund plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schemes.map((scheme, index) => (
            <div 
              key={index}
              className={`scheme-card relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 reveal border border-gray-100 dark:border-gray-700 group perspective-1000 ${
                scheme.popular ? 'ring-2 ring-amber-500 ring-opacity-50' : ''
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Content wrapper */}
              <div className="relative z-10">
                {scheme.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="popular-badge bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                    {scheme.name}
                  </h3>
                  <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {scheme.monthlyAmount}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    per month
                  </div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {scheme.duration} • {scheme.members}
                  </div>
                </div>

                <div className="mb-8">
                  <ul className="space-y-3">
                    {scheme.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: `${featureIndex * 100}ms` }}>
                        <svg className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleEnquire(scheme)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-700 dark:from-violet-500 dark:to-violet-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-violet-800 dark:hover:from-violet-600 dark:hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10">Enquire Now</span>
                </button>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/10 to-amber-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Schemes;
