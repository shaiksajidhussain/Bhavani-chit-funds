// Utility functions for image handling

/**
 * Convert a file to Base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Convert Base64 string to file
 * @param {string} base64String - Base64 string
 * @param {string} filename - Name for the file
 * @returns {File} - File object
 */
export const base64ToFile = (base64String, filename) => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * Validate if string is a valid Base64 image
 * @param {string} str - String to validate
 * @returns {boolean} - True if valid Base64 image
 */
export const isValidBase64Image = (str) => {
  if (typeof str !== 'string') {
    console.log('Not a string:', typeof str);
    return false;
  }
  
  // Check if it starts with data:image
  const isDataImage = str.startsWith('data:image/');
  console.log('Starts with data:image:', isDataImage);
  
  // Check if it contains base64
  const hasBase64 = str.includes('base64,');
  console.log('Contains base64,:', hasBase64);
  
  // More flexible regex that handles different image types
  const isValidFormat = /^data:image\/(jpeg|jpg|png|gif|webp|bmp|tiff|svg\+xml);base64,/.test(str);
  console.log('Valid format:', isValidFormat);
  
  // Also check if it's a valid base64 string (contains only valid base64 characters after the comma)
  const base64Part = str.split(',')[1];
  const isValidBase64 = base64Part && /^[A-Za-z0-9+/]*={0,2}$/.test(base64Part);
  console.log('Valid base64 content:', isValidBase64);
  
  return isValidFormat && isValidBase64;
};

/**
 * Get image dimensions from Base64 string
 * @param {string} base64String - Base64 string
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export const getImageDimensions = (base64String) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = base64String;
  });
};
