/** Hosts that block or reject Next.js server-side image optimization (often 401). */
const BYPASS_OPTIMIZER_HOSTS = [
  'vnexpress.vnecdn.net',
  '1cdn.vn',
  'vnu.edu.vn',
  'nxbctqg.org.vn',
  'oreka.vn',
  'hue.gov.vn',
  'hust.edu.vn',
  'lic.vnu.edu.vn',
];

export function shouldBypassImageOptimizer(src: string): boolean {
  if (!src || typeof src !== 'string') return false;
  if (src.startsWith('/') && !src.startsWith('//')) return false;
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return BYPASS_OPTIMIZER_HOSTS.some((host) => src.includes(host));
  }
  return false;
}
