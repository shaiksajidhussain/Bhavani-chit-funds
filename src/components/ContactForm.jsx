import React, { useState, useEffect } from 'react';
import Section from './Section';

const ContactForm = ({ selectedScheme }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    scheme: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const schemes = [
    { value: '', label: 'Select a scheme' },
    { value: 'silver', label: 'Silver (₹1,000/month)' },
    { value: 'gold', label: 'Gold (₹5,000/month)' },
    { value: 'platinum', label: 'Platinum (₹10,000/month)' }
  ];

  useEffect(() => {
    if (selectedScheme) {
      const schemeValue = selectedScheme.name.toLowerCase();
      setFormData(prev => ({
        ...prev,
        scheme: schemeValue
      }));
    }
  }, [selectedScheme]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.scheme) {
      newErrors.scheme = 'Please select a scheme';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        scheme: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Section id="contact" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 reveal">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto reveal">
            Ready to start your chit fund journey? Contact us for a personalized consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="reveal">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Contact Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 mr-4 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Address</div>
                  <div className="text-gray-600">123 Financial District, Hyderabad, Telangana 500001</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 mr-4 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Phone</div>
                  <div className="text-gray-600">+91 98765 43210</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 mr-4 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">WhatsApp</div>
                  <div className="text-gray-600">+91 98765 43210</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 mr-4 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Email</div>
                  <div className="text-gray-600">info@bhavanichitfunds.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors duration-200 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="scheme" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Scheme *
                </label>
                <select
                  id="scheme"
                  name="scheme"
                  value={formData.scheme}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors duration-200 ${
                    errors.scheme ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {schemes.map((scheme) => (
                    <option key={scheme.value} value={scheme.value}>
                      {scheme.label}
                    </option>
                  ))}
                </select>
                {errors.scheme && (
                  <p className="mt-1 text-sm text-red-600">{errors.scheme}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors duration-200 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about your requirements..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {showSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ContactForm;
