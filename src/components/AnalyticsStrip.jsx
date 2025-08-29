import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnalyticsStrip = () => {
  const sectionRef = useRef(null);
  const numberRefs = useRef([]);

  const analytics = [
    {
      label: "Collections MTD",
      value: "7,50,000",
      suffix: "₹",
      color: "text-green-600"
    },
    {
      label: "Outstanding",
      value: "2,20,000",
      suffix: "₹",
      color: "text-amber-600"
    },
    {
      label: "Overdue",
      value: "18",
      suffix: "",
      color: "text-red-600"
    },
    {
      label: "On-time %",
      value: "92",
      suffix: "%",
      color: "text-blue-600"
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate numbers on scroll
      numberRefs.current.forEach((ref, index) => {
        if (ref) {
          const finalValue = analytics[index].value.replace(/,/g, '');
          const isPercentage = analytics[index].suffix === '%';
          const finalNum = isPercentage ? parseInt(finalValue) : parseInt(finalValue.replace(/,/g, ''));
          
          gsap.fromTo(ref, 
            { innerText: 0 },
            {
              innerText: finalNum,
              duration: 2,
              ease: "power2.out",
              snap: { innerText: 1 },
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addNumberRef = (el) => {
    if (el && !numberRefs.current.includes(el)) {
      numberRefs.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-r from-violet-600 to-amber-600 dark:from-violet-700 dark:to-amber-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 reveal">
            Our Performance at a Glance
          </h2>
          <p className="text-xl text-violet-100 dark:text-violet-200 max-w-2xl mx-auto reveal">
            Real-time insights into our chit fund operations and success metrics.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {analytics.map((item, index) => (
            <div key={index} className="text-center reveal">
              <div className={`text-4xl lg:text-5xl font-bold ${item.color} mb-2`}>
                <span ref={addNumberRef}>
                  {item.value}
                </span>
                {item.suffix}
              </div>
              <div className="text-violet-100 dark:text-violet-200 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsStrip;
