"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Heart, Sparkles, Zap, Star } from 'lucide-react';

const MicroInteractions = () => {
  return null; // This component provides utilities for micro-interactions
};

// Success animation component
export const SuccessAnimation = ({ isVisible, onComplete, message = "Succès !" }) => {
  const [animationPhase, setAnimationPhase] = useState('hidden');

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('appearing');
      
      const timer1 = setTimeout(() => setAnimationPhase('visible'), 100);
      const timer2 = setTimeout(() => setAnimationPhase('completing'), 2000);
      const timer3 = setTimeout(() => {
        setAnimationPhase('hidden');
        onComplete?.();
      }, 2800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isVisible, onComplete]);

  if (animationPhase === 'hidden') return null;

  return (
    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
      animationPhase === 'appearing' ? 'scale-0 opacity-0' : 
      animationPhase === 'visible' ? 'scale-100 opacity-100' : 
      'scale-75 opacity-0'
    }`}>
      <div className="bg-white rounded-2xl p-8 shadow-2xl border border-green-200 text-center">
        <div className="relative">
          {/* Success icon with ripple effect */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
            <div className="relative w-full h-full bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          
          {/* Confetti particles */}
          {animationPhase === 'visible' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-green-800 mb-2">{message}</h3>
        <p className="text-sm text-green-600">Action réalisée avec succès</p>
      </div>
    </div>
  );
};

// Loading dots animation
export const LoadingDots = ({ size = "medium", color = "blue" }) => {
  const sizeClasses = {
    small: "w-2 h-2",
    medium: "w-3 h-3", 
    large: "w-4 h-4"
  };

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    gray: "bg-gray-500",
    purple: "bg-purple-500"
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// Button with ripple effect
export const RippleButton = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  disabled = false,
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const createRipple = (event) => {
    if (disabled) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (event) => {
    createRipple(event);
    onClick?.(event);
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: '600ms'
          }}
        />
      ))}
    </button>
  );
};

// Floating action notification
export const FloatingNotification = ({ 
  type = "info", 
  message, 
  isVisible, 
  onDismiss,
  duration = 4000 
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onDismiss, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white", 
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white"
  };

  const typeIcons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Sparkles className="w-5 h-5" />
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isShowing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${typeStyles[type]}`}>
        {typeIcons[type]}
        <span className="font-medium">{message}</span>
        <button 
          onClick={() => setIsShowing(false)}
          className="ml-2 hover:bg-white/20 p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Pulse animation for important elements
export const PulseHighlight = ({ children, isActive = false, color = "blue" }) => {
  const colorClasses = {
    blue: "ring-blue-400",
    green: "ring-green-400", 
    red: "ring-red-400",
    yellow: "ring-yellow-400"
  };

  return (
    <div className={`transition-all duration-300 ${
      isActive ? `ring-4 ${colorClasses[color]} ring-opacity-50 animate-pulse` : ''
    }`}>
      {children}
    </div>
  );
};

// Stagger animation for lists
export const StaggeredList = ({ children, staggerDelay = 100 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {React.Children.map(children, (child, index) => (
        <div
          className={`transition-all duration-500 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms' 
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Morphing icon animation
export const MorphingIcon = ({ icons, currentIndex, size = 20 }) => {
  const [morphing, setMorphing] = useState(false);

  useEffect(() => {
    setMorphing(true);
    const timer = setTimeout(() => setMorphing(false), 200);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const CurrentIcon = icons[currentIndex];

  return (
    <div className={`transition-all duration-200 ${
      morphing ? 'scale-75 opacity-50 rotate-180' : 'scale-100 opacity-100 rotate-0'
    }`}>
      <CurrentIcon size={size} />
    </div>
  );
};

// Gradient background animation
export const AnimatedGradientBg = ({ className = "" }) => {
  return (
    <div className={`bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-[length:400%_400%] animate-gradient-x ${className}`}>
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

// Typewriter effect
export const TypewriterText = ({ 
  text, 
  speed = 50, 
  className = "", 
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-blink">|</span>
      )}
    </span>
  );
};

// Enhanced micro-interactions CSS
export const MicroInteractionStyles = () => (
  <style jsx global>{`
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    
    .animate-blink {
      animation: blink 1s infinite;
    }
    
    .hover-lift {
      transition: transform 0.2s ease;
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
    }
    
    .hover-scale {
      transition: transform 0.2s ease;
    }
    
    .hover-scale:hover {
      transform: scale(1.05);
    }
    
    .glass-morphism {
      backdrop-filter: blur(16px) saturate(180%);
      background-color: rgba(255, 255, 255, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.125);
    }
    
    .text-glow {
      text-shadow: 0 0 10px currentColor;
    }
    
    .smooth-enter {
      animation: smoothEnter 0.3s ease-out;
    }
    
    @keyframes smoothEnter {
      0% {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `}</style>
);

export default MicroInteractions;