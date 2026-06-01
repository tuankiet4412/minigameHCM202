'use client';

import Link from 'next/link';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline';
}

export function MagneticButton({ href, onClick, children, className, variant = 'primary' }: MagneticButtonProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(0.3);
  const baseClass = variant === 'primary' ? 'heritage-btn' : 'heritage-btn-outline';

  const props = {
    ref: ref as React.Ref<HTMLAnchorElement & HTMLButtonElement>,
    onMouseMove,
    onMouseLeave,
    className: cn(baseClass, 'transition-transform duration-200', className),
    children,
  };

  if (href) {
    return <Link href={href} {...props} />;
  }
  return <button type="button" onClick={onClick} {...props} />;
}
