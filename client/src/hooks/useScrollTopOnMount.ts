import { useEffect } from 'react';

export function useScrollTopOnMount(): void {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
}
