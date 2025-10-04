import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from './Section';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef(null);
  const floatingElementsRef = useRef(null);

  const testimonials = [
    {
      quote: "Bhavani Chits has been my trusted partner for savings for over 5 years. The transparency and timely payouts give me complete confidence in my investments.",
      name: "Rajesh Kumar",
      role: "Salaried Individual",
      avatar: "👨‍💼"
    },
    {
      quote: "As a homemaker, I needed a safe way to save for my children's education. Bhavani Chits' flexible plans and regular updates have been perfect for my needs.",
      name: "Priya Sharma",
      role: "Homemaker",
      avatar: "👩‍🏫"
    },
    {
      quote: "Running a small business requires disciplined savings. Bhavani Chits' various schemes have helped me build a substantial corpus over the years.",
      name: "Amit Patel",
      role: "Small Business Owner",
      avatar: "👨‍💻"
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate floating background elements
      gsap.to('.floating-bg', {
        y: -30,
        x: 20,
        rotation: 360,
        duration: 12,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 1.5
      });

      // Animate testimonial cards on reveal with 3D effect
      gsap.fromTo('.testimonial-card', 
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
          duration: 1.2,
          stagger: 0.4,
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
      const cards = document.querySelectorAll('.testimonial-card');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / 18;
          const rotateY = (centerX - x) / 18;
          
          gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.5,
            ease: "power2.out"
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "power3.out"
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="testimonials" className="bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Floating background elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-bg absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-800/20 dark:to-violet-900/20 rounded-full opacity-30 blur-sm"></div>
        <div className="floating-bg absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-800/20 dark:to-amber-900/20 rounded-full opacity-40 blur-sm"></div>
        <div className="floating-bg absolute bottom-40 left-32 w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800/20 dark:to-blue-900/20 rounded-full opacity-25 blur-sm"></div>
        <div className="floating-bg absolute bottom-20 right-20 w-8 h-8 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-800/20 dark:to-green-900/20 rounded-full opacity-35 blur-sm"></div>
        <div className="floating-bg absolute top-1/2 left-10 w-6 h-6 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-800/20 dark:to-pink-900/20 rounded-full opacity-30 blur-sm"></div>
        <div className="floating-bg absolute top-1/2 right-10 w-10 h-10 bg-gradient-to-br from-indigo-200 to-indigo-300 dark:from-indigo-800/20 dark:to-indigo-900/20 rounded-full opacity-25 blur-sm"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 reveal">
            What Our Members Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto reveal">
            Join thousands of satisfied members who trust Bhavani Chits for their savings journey. We cater to salaried individuals, small business owners, homemakers — anyone who wants to grow savings through disciplined investment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-card bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-600 transform hover:-translate-y-5 reveal border border-gray-100 dark:border-gray-700 group perspective-1000 cursor-pointer"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-100/60 to-amber-100/60 dark:from-violet-900/30 dark:to-amber-900/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-600"></div>
              
              {/* Content wrapper */}
              <div className="relative z-10">
                <div className="mb-6 relative">
                  {/* Quote icon with glow effect */}
                  <div className="text-violet-200 dark:text-violet-800 mb-4 group-hover:scale-110 transition-transform duration-500 relative">
                    <div className="absolute inset-0 bg-violet-400/30 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 scale-0 group-hover:scale-100"></div>
                    <svg className="w-12 h-12 relative z-10 group-hover:rotate-12 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  
                  {/* Quote text with enhanced typography */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-500 relative">
                    <span className="absolute -left-2 -top-2 text-4xl text-violet-300 dark:text-violet-700 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">"</span>
                    {testimonial.quote}
                    <span className="absolute -right-2 -bottom-2 text-4xl text-violet-300 dark:text-violet-700 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">"</span>
                  </p>
                </div>
                
                {/* Author section with enhanced hover effects */}
                <div className="flex items-center group-hover:translate-x-2 transition-transform duration-500">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                    {/* Avatar background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-amber-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 scale-0 group-hover:scale-100"></div>
                    
                    {/* Avatar with floating animation */}
                    <div className="relative z-10 group-hover:animate-bounce">
                      {testimonial.avatar}
                    </div>
                    
                    {/* Hover ring effect */}
                    <div className="absolute inset-0 border-2 border-violet-300 dark:border-violet-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>
                  </div>
                  
                  <div className="group-hover:translate-y-1 transition-transform duration-500">
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-500">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                
          
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/15 to-amber-400/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-600 blur-xl"></div>
              
              {/* Corner accent with different colors for each card */}
              <div className={`absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] opacity-0 group-hover:opacity-100 transition-all duration-600 transform scale-0 group-hover:scale-100 origin-top-right ${
                index === 0 ? 'border-t-violet-500 dark:border-t-violet-600' :
                index === 1 ? 'border-t-amber-500 dark:border-t-amber-600' :
                'border-t-blue-500 dark:border-t-blue-600'
              }`}></div>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-violet-500 to-amber-500 dark:from-violet-400 dark:to-amber-400 group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;
