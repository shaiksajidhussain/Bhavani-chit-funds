import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { optimizeImageUrl } from '../utils/imageOptimization';
import './HeroCarousel.css';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  const slides = [
    {
      image: optimizeImageUrl("https://media.assettype.com/tnm%2Fimport%2Fsites%2Fdefault%2Ffiles%2FInvestment_money_pixabayByNattananKanchanaprat.jpg?w=1200&ar=40%3A21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100", {
        width: '1920',
        height: '1080',
        quality: '80',
        format: 'webp'
      }),
      title: "Invest & Earn with Bhavani Chits",
      subtitle: "Your Trusted Chit Fund Partner",
      description: "Join thousands of satisfied members. Simple, transparent, and profitable chit fund investment plans."
    },
    {
      image: optimizeImageUrl("https://thumbs.dreamstime.com/b/coins-financial-growth-chart-blue-background-finance-investment-concepts-coins-financial-growth-chart-blue-344575282.jpg", {
        width: '1920',
        height: '1080',
        quality: '80',
        format: 'webp'
      }),
      title: "Safe & Transparent Operations",
      subtitle: "Regulatory Compliance & Trust",
      description: "All our operations adhere to regulatory norms and our processes are completely transparent."
    },
    {
      image: optimizeImageUrl("https://www.theitbase.com/wp-content/uploads/2025/07/Everything-You-Need-to-Know-About-a-Savings-Plan-in-2025-1200x675.jpg", {
        width: '1920',
        height: '1080',
        quality: '80',
        format: 'webp'
      }),
      title: "Flexible Investment Plans",
      subtitle: "Multiple Schemes for Every Budget",
      description: "Choose from various chit schemes to match different budgets and tenures that fit your financial goals."
    },
    {
      image: optimizeImageUrl("https://www.stampli.com/wp-content/uploads/2023/09/00-stampli-Improving-the-Vendor-Payment-Process-with-AP-Automation_hero-1024x536.png", {
        width: '1920',
        height: '1080',
        quality: '80',
        format: 'webp'
      }),
      title: "Timely & Reliable Payouts",
      subtitle: "Your Success, Our Priority",
      description: "We ensure prompt and reliable disbursement to winning members with dedicated customer support."
    }
  ];

  useEffect(() => {
    // Auto-advance carousel every 4 seconds
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    try {
      const ctx = gsap.context(() => {
        // Animate current slide
        gsap.to('.slide', {
          opacity: 0,
          scale: 1.1,
          duration: 0.8,
          ease: "power2.inOut"
        });

        gsap.to(`.slide-${currentSlide}`, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out"
        });

        // Animate text content
        gsap.fromTo(`.slide-${currentSlide} .slide-content`, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power2.out" }
        );
      }, carousel);

      return () => ctx.revert();
    } catch (error) {
      // Graceful fallback for animation errors - only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Animation error:', error);
      }
    }
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reset interval when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Carousel Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide slide-${index} absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Light Opacity */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${slide.image})`,
              filter: 'brightness(0.7) contrast(1.1)'
            }}
            role="img"
            aria-label={`Background image for ${slide.title}`}
          />
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 bg-opacity-30" />
          
          {/* Gradient overlay for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="slide-content max-w-4xl">
                <div className="mb-6">
                  <p className="text-lg lg:text-xl text-violet-300 font-medium mb-4 animate-fade-in">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
                    {slide.title}
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl leading-relaxed animate-fade-in-delay">
                    {slide.description}
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
                  <button 
                    onClick={() => document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border-2 border-violet-700"
                    aria-label="Explore our chit fund investment plans and schemes"
                  >
                    Explore Our Chit Plans
                  </button>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                    aria-label="Join Bhavani Chits and start your investment journey"
                  >
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3" role="tablist" aria-label="Carousel navigation">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-violet-500 scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}: ${slides[index].title}`}
            role="tab"
            aria-selected={index === currentSlide}
            tabIndex={index === currentSlide ? 0 : -1}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        aria-label={`Previous slide: ${slides[(currentSlide - 1 + slides.length) % slides.length].title}`}
        tabIndex={0}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        aria-label={`Next slide: ${slides[(currentSlide + 1) % slides.length].title}`}
        tabIndex={0}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
        <div 
          className="h-full bg-violet-500 transition-all duration-1000 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;
