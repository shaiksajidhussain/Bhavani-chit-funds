// Image optimization utilities
export const optimizeImageUrl = (url, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    quality = 'auto',
    format = 'auto'
  } = options;

  // For Cloudinary URLs, add optimization parameters
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];
    
    return `${baseUrl}/upload/w_${width},h_${height},q_${quality},f_${format}/${imagePath}`;
  }
  
  return url;
};

// Preload critical images
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Lazy load images
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};
