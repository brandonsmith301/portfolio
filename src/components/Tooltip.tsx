import React, { useState, useRef } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tooltipClassName?: string;
  delay?: number;
  isCitation?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content,
  children,
  className = '',
  tooltipClassName = '',
  delay = 200,
  isCitation = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const baseTooltipStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: isCitation ? '0' : '50%',
    padding: '8px 12px',
    backgroundColor: '#2D3748', 
    color: 'white',
    fontSize: '0.8rem',
    borderRadius: '6px',
    zIndex: 50,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)', 
    whiteSpace: 'normal',
    maxWidth: '600px',
    minWidth: '300px',
    textAlign: 'left',
    transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
    pointerEvents: 'none',
  };

  const tooltipDynamicStyles: React.CSSProperties = isVisible ? {
    opacity: 1,
    transform: isCitation 
      ? 'translateY(10px) scale(1)' 
      : 'translateX(-50%) translateY(10px) scale(1)',
    visibility: 'visible',
  } : {
    opacity: 0,
    transform: isCitation 
      ? 'translateY(5px) scale(0.95)' 
      : 'translateX(-50%) translateY(5px) scale(0.95)', 
    visibility: 'hidden',
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span 
        style={{
          position: 'relative',
          display: 'inline-block',
          cursor: 'help',
          backgroundColor: isCitation ? 'transparent' : '#FFFDEC',
          padding: '0 2px',
          borderRadius: '2px',
          transition: 'background-color 0.2s ease-in-out',
          ...(isCitation ? {
            color: '#9CA3AF',
            textDecoration: 'underline',
          } : {}),
          ...(isVisible && !isCitation ? {
            backgroundColor: '#FFFDEC',
          } : {}),
        }}
      >
        {children}
      </span>
      <div 
        style={{ ...baseTooltipStyles, ...tooltipDynamicStyles }}
        className={tooltipClassName}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
};