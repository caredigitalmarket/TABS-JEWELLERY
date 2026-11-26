import { useState } from 'react';
import { Gem } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  fallbackLabel,
  className = '',
  loading = 'lazy',
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F2EFE9] via-[#EAE5DC] to-[#DFD8CC] text-[#78716C] p-6 text-center ${className}`}
      >
        <Gem className="w-7 h-7 stroke-[1.25] text-[#9A6F38] mb-2" aria-hidden="true" />
        <span className="font-display text-lg text-[#1C1917] leading-snug">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
