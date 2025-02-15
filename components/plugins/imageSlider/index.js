import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ImageSliderBlock = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Default image URLs if none provided
    const defaultImageUrls = [
        "https://plus.unsplash.com/premium_photo-1675805015392-28fd80c551ec?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1483206048520-2321c1a5fb36?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1666863909125-3a01f038e71f?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1666896192348-dbd2afd19b07?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    const imageUrls = images || defaultImageUrls;

    const nextSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
        }
    };

    const prevSlide = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    return (
        <div className="image-slider-container" style={{
            position: 'relative',
            width: '100%',
            height: '600px',
            overflow: 'hidden',
            backgroundColor: '#000',
            borderRadius: '20px'
        }}>
            <div className="image-slider" style={{
                position: 'relative',
                height: '100%',
                width: '100%'
            }}>
                {imageUrls.map((url, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: index === currentIndex ? 1 : 0,
                            transition: 'opacity 0.5s ease-in-out',
                        }}
                    >
                        <Image
                            src={url}
                            alt={`Slide ${index + 1}`}
                            fill
                            style={{
                                objectFit: 'cover',
                            }}
                            priority={index === currentIndex}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span style={{ color: 'white', fontSize: '20px' }}>←</span>
            </button>

            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span style={{ color: 'white', fontSize: '20px' }}>→</span>
            </button>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px'
            }}>
                {imageUrls.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSliderBlock;