import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Section = ({ 
  id, 
  children, 
  className = "", 
  reveal = true,
  stagger = 0.1 
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!reveal) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const elements = sectionRef.current.querySelectorAll('.reveal');
      
      gsap.fromTo(elements, 
        { 
          opacity: 0, 
          y: 24 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: stagger,
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
  }, [reveal, stagger]);

  return (
    <section 
      id={id} 
      ref={sectionRef}
      className={`py-16 lg:py-24 ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;
