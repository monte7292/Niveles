// components/AnimateOnVisible.tsx
import { ReactNode, useEffect, useRef } from 'react';

interface AnimateOnVisibleProps {
  children: ReactNode;
  threshold?: number;
  animation?: string;
}

const AnimateOnVisible = ({
  children,
  threshold = 0.55,
  animation = 'modernAppear 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
}: AnimateOnVisibleProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (elementRef.current) {
              elementRef.current.style.opacity = '1';
              elementRef.current.style.animation = animation;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, animation]);

  return (
    <div ref={elementRef} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

export default AnimateOnVisible;