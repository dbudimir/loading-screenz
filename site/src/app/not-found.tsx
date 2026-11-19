import Link from 'next/link';
import type { CSSProperties } from 'react';

const pageStyle: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  minHeight: '100dvh',
  // Design spacing plus safe-area insets (see the home page's pageStyle).
  padding:
    'calc(20px + env(safe-area-inset-top, 0px)) calc(20px + env(safe-area-inset-right, 0px)) calc(20px + env(safe-area-inset-bottom, 0px)) calc(20px + env(safe-area-inset-left, 0px))',
};

const screenStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  maxWidth: '520px',
  padding: '36px 28px',
  textAlign: 'center',
};

export default function NotFound() {
  return (
    <main style={pageStyle}>
      <div className="lz-screen lz-texture-space" style={screenStyle}>
        <span className="lz-led">ERROR 404</span>
        <h1 className="lz-display">Disc Read Error</h1>
        <p className="lz-text">
          The page you're looking for couldn't be read. Please check that the link is clean and inserted correctly.
        </p>
        <Link className="lz-button lz-button--primary" href="/">
          Return to Dashboard
        </Link>
      </div>
    </main>
  );
}
