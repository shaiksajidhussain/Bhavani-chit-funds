import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ThreeDCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const cardInnerRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const cardInner = cardInnerRef.current;
    
    if (!card || !cardInner) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let cardX = 0;
    let cardY = 0;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (mouseY - centerY) / 10;
      const rotateY = (centerX - mouseX) / 10;

      gsap.to(cardInner, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(cardInner, {
        z: 50,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(cardInner, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`3d-card perspective-1000 ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div 
        ref={cardInnerRef}
        className="3d-card-inner transform-gpu transition-all duration-300"
        style={{ 
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ThreeDCard;
