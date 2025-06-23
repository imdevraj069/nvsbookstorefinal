// components/RouteLoader.jsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FullPageLoader from './ui/FullPageLoader';

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout;

    const handleStart = () => {
      timeout = setTimeout(() => setLoading(true), 100); // delay to avoid flicker
    };

    const handleComplete = () => {
      clearTimeout(timeout);
      setLoading(false);
    };

    handleStart();

    return () => handleComplete();
  }, [pathname]);

  return loading ? <FullPageLoader /> : null;
}
