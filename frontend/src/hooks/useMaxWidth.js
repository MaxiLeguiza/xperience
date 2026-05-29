import { useEffect, useState } from 'react';

/** true cuando el viewport es <= maxWidthPx */
export function useMaxWidth(maxWidthPx) {
  const query = `(max-width: ${maxWidthPx}px)`;

  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
