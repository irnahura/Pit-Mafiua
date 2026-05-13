import { useEffect, useRef } from 'react';
import { startTimer, logInfo } from '@/lib/logger';

/**
 * Hook to measure component render performance
 */
export function usePerformance(componentName: string) {
  const renderCount = useRef(0);
  const mountTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;

    if (renderCount.current === 1) {
      // First render (mount)
      mountTime.current = performance.now();
    }

    return () => {
      if (renderCount.current === 1) {
        // Component unmounting
        const lifetime = performance.now() - mountTime.current;
        logInfo(`Component Lifetime: ${componentName}`, {
          lifetime: `${lifetime.toFixed(2)}ms`,
          renders: renderCount.current,
        });
      }
    };
  });

  return {
    renderCount: renderCount.current,
    measureOperation: (operationName: string) => {
      return startTimer(`${componentName} - ${operationName}`);
    },
  };
}

/**
 * Hook to measure async operation performance
 */
export function useAsyncPerformance() {
  const measure = async <T,>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const endTimer = startTimer(operationName);
    try {
      const result = await operation();
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  };

  return { measure };
}
