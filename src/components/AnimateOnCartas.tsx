// components/SequentialCards.tsx
import { ReactNode, useEffect, useState } from 'react';

interface SequentialCardsProps {
  children: ReactNode[];
  delayBetween?: number;
}

const SequentialCards = ({
  children,
  delayBetween = 450,
}: SequentialCardsProps) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            children.forEach((_, i) => {
              setTimeout(() => {
                setVisibleCount(prev => Math.max(prev, i + 1));
              }, i * delayBetween);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const container = document.querySelector('.commands-grid');
    if (container) observer.observe(container);

    return () => {
      if (container) observer.unobserve(container);
    };
  }, [children.length, delayBetween]);

  return (
    <>
      {children.map((child, i) => (
        <div 
          key={i}
          style={{
            backgroundColor: '#3d3d45',
            border: '3px solid #4d4d57',
            borderRadius: '.5rem',
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? 'translateY(0)' : 'translateY(15px)',
            transition: `opacity 0.4s ease ${i * delayBetween}ms, transform 0.4s ease ${i * delayBetween}ms`,
            marginBottom: '2rem' // Para mantener el gap del grid
          }}
        >
          {child}
        </div>
      ))}
    </>
  );
};

export default SequentialCards;