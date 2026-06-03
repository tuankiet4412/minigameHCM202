import Image, { type ImageProps } from 'next/image';
import { shouldBypassImageOptimizer } from '@/lib/image-utils';

/**
 * next/image wrapper: skips the optimizer for CDNs that return 401 to the proxy.
 */
export default function AppImage({ src, unoptimized, ...props }: ImageProps) {
  const srcStr = typeof src === 'string' ? src : '';
  const bypass = unoptimized ?? shouldBypassImageOptimizer(srcStr);
  return <Image src={src} unoptimized={bypass} {...props} />;
}
