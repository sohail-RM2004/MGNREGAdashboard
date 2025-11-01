import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';

export default function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    '/images/carousel1.jpg',
    '/images/carousel2.jpg',
    '/images/womeninqq.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      
      <div className="carousel-overlay">
        <h1>MGNREGA District Performance Dashboard</h1>
        <p>Transparency • Accountability • Progress</p>
      </div>
    </div>
  );
}