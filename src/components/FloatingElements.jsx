import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FloatingElements = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('.floating-element');
    
    // Create floating animation for each element
    elements.forEach((element, index) => {
      const delay = index * 0.2;
      const duration = 3 + Math.random() * 2;
      const yDistance = 20 + Math.random() * 30;
      const xDistance = 10 + Math.random() * 20;
      const rotation = Math.random() * 360;

      gsap.set(element, { 
        opacity: 0,
        y: yDistance,
        x: xDistance,
        rotation: rotation
      });

      gsap.to(element, {
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0,
        duration: 1.5,
        delay: delay,
        ease: "power2.out"
      });

      // Continuous floating animation
      gsap.to(element, {
        y: -yDistance,
        x: xDistance * 0.5,
        rotation: rotation * 0.5,
        duration: duration,
        delay: delay + 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
      });
    });

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;

      elements.forEach((element, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;

        gsap.to(element, {
          x: x,
          y: y,
          duration: 1,
          ease: "power2.out"
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Geometric shapes */}
      <div className="floating-element absolute top-20 left-20 w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full opacity-20"></div>
      <div className="floating-element absolute top-40 right-32 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 transform rotate-45 opacity-30"></div>
      <div className="floating-element absolute bottom-40 left-32 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-25"></div>
      <div className="floating-element absolute bottom-20 right-20 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 transform rotate-45 opacity-35"></div>
      <div className="floating-element absolute top-1/2 left-10 w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-20"></div>
      <div className="floating-element absolute top-1/2 right-10 w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 transform rotate-45 opacity-25"></div>
      
      {/* Animated lines */}
      <div className="floating-element absolute top-1/4 left-1/4 w-16 h-0.5 bg-gradient-to-r from-violet-400 to-transparent opacity-30"></div>
      <div className="floating-element absolute bottom-1/4 right-1/4 w-12 h-0.5 bg-gradient-to-l from-amber-400 to-transparent opacity-25"></div>
      <div className="floating-element absolute top-1/2 left-1/2 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-transparent opacity-20"></div>
    </div>
  );
};

export default FloatingElements;
