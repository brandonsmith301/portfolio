import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { usePageTitle } from '../hooks/usePageTitle';
import { FadeInSection } from '../utils/FadeInSection';
import { useEffect, useState, useRef, useMemo } from 'react';
import { AboutSection } from '../components/AboutSection';

declare module 'react' {
  interface CSSProperties {
    '--peak-y'?: string;
    '--peak-y-settle-start'?: string;
  }
}

const NUM_PARTICLES = 100;
const HIGHLIGHT_RANGE_PERCENT = 15; 
const MAX_PEAK_HEIGHT = -60;
const MIN_PEAK_HEIGHT = -10;
const SVG_VIEWBOX_HEIGHT = 100; 

const generatePathData = (points: Array<{x: number, y: number}>): string => {
  if (points.length < 2) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const xMid = (points[i].x + points[i+1].x) / 2;
    const yMid = (points[i].y + points[i+1].y) / 2;
    const cp1x = (xMid + points[i].x) / 2;
    const cp1y = (points[i].y + yMid) / 2; 

    if (i === 0) {
        path += ` Q ${cp1x},${cp1y} ${xMid},${yMid}`;
    } else {
        path += ` S ${points[i].x},${points[i].y} ${xMid},${yMid}`;
    }
    if (i === points.length - 2) {
        path += ` T ${points[i+1].x},${points[i+1].y}`;
    }
  }
  return path;
};

const Home = () => {
  const [isLineVisible] = useState(true); 
  const [cursorX, setCursorX] = useState<number>(50); 
  const [particlePeaks, setParticlePeaks] = useState<Array<{x: number, y: number}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const particleBaseStyles = useMemo(() => {
    return Array.from({ length: NUM_PARTICLES }).map(() => ({
      animationDelay: `${Math.random() * 1}s`,
      animationDuration: `${1.5 + Math.random() * 1}s`,
    }));
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (mainContentRef.current) {
        const rect = mainContentRef.current.getBoundingClientRect();
        const relativeX = event.clientX - rect.left;
        const x = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
        setCursorX(x);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    
    const peaks = Array.from({ length: NUM_PARTICLES }).map((_, i) => {
      const particlePositionPercent = (i / (NUM_PARTICLES - 1)) * 100;
      let peakYValue = MIN_PEAK_HEIGHT; 

      const diff = Math.abs(particlePositionPercent - cursorX);
      if (diff < HIGHLIGHT_RANGE_PERCENT) {
        const proximityFactor = 1 - (diff / HIGHLIGHT_RANGE_PERCENT);
        peakYValue = MIN_PEAK_HEIGHT + (MAX_PEAK_HEIGHT - MIN_PEAK_HEIGHT) * Math.pow(proximityFactor, 2);
      }
      
      const svgX = (particlePositionPercent / 100) * containerWidth;
      const svgY = SVG_VIEWBOX_HEIGHT + peakYValue;
      return { x: svgX, y: svgY };
    });
    setParticlePeaks(peaks);

  }, [cursorX, particleBaseStyles]);

  usePageTitle('');
  const pathData = useMemo(() => generatePathData(particlePeaks), [particlePeaks]);

  return (
    <div ref={mainContentRef}>
      <FadeInSection>
        <section className="space-y-4 mb-8">
          <motion.div
            className="text-2xl sm:text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TypeAnimation
              sequence={[
                'Hi, I am Brandon.',
              ]}
              wrapper="h1"
              cursor={true}
              repeat={0}
              speed={50}
              style={{ display: 'inline-block' }}
            />
          </motion.div>
          <motion.p
            className="text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
          I am currently working in analytics at Monash University.
          </motion.p>
        </section>
      </FadeInSection>

      <div 
        ref={containerRef}
        className="relative w-full my-12 group py-8"
      >
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-500 ease-out"
          viewBox={`0 0 ${containerRef.current?.offsetWidth || 1000} ${SVG_VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
          style={{ opacity: isLineVisible ? 0.7 : 0 }}
        >
          <defs>
            <linearGradient id="lineFadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#9ca3af', stopOpacity: 0}} />
              <stop offset="20%" style={{stopColor: '#9ca3af', stopOpacity: 1}} />
              <stop offset="80%" style={{stopColor: '#9ca3af', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#9ca3af', stopOpacity: 0}} />
            </linearGradient>
          </defs>
          <path 
            d={pathData} 
            stroke="url(#lineFadeGradient)"
            strokeWidth="1.5"
            fill="none" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-end justify-center" style={{top: '32px', bottom: '32px'}}>
          <div className="flex justify-around w-full">
            {particleBaseStyles.map((baseStyle, i) => {
              const particlePositionPercent = (i / (NUM_PARTICLES - 1)) * 100;
              let peakY = MIN_PEAK_HEIGHT;
              let isCursorHighlighted = false;

              const diff = Math.abs(particlePositionPercent - cursorX);
              if (diff < HIGHLIGHT_RANGE_PERCENT) {
                isCursorHighlighted = true;
                const proximityFactor = 1 - (diff / HIGHLIGHT_RANGE_PERCENT);
                peakY = MIN_PEAK_HEIGHT + (MAX_PEAK_HEIGHT - MIN_PEAK_HEIGHT) * Math.pow(proximityFactor, 2);
              }
              
              const dynamicStyle: React.CSSProperties = {
                ...baseStyle,
                '--peak-y': `${peakY}px`,
                '--peak-y-settle-start': `${peakY / 2}px`,
              };

              return (
                <div
                  key={i}
                  className={`w-[3px] h-[3px] rounded-full transition-colors duration-300 animate-kde-particle ${
                    isCursorHighlighted ? 'bg-particle-highlight' : 'bg-gray-400'
                  }`}
                  style={dynamicStyle}
                />
              );
            })}
          </div>
        </div>
      </div>

      <FadeInSection delay={1.2}>
        <AboutSection />
      </FadeInSection>
    </div>
  );
};

export default Home;