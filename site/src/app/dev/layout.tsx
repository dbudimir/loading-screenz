import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Local-only tools. Anything outside `next dev` (production builds, `next start`) gets a 404.
export const metadata: Metadata = {
  title: 'Dev',
  robots: { index: false, follow: false },
};

export default function DevLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (process.env.NODE_ENV !== 'development') notFound();
  return children;
}
