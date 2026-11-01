import Link from 'next/link';
import type { CSSProperties } from 'react';

const TOOLS = [
  { href: '/dev/styleguide', name: 'Style guide', description: 'Every theme component in every state, plus mockups.' },
];

const pageStyle: CSSProperties = {
  maxWidth: '640px',
  margin: '0 auto',
  padding: '40px 16px',
};

export default function DevIndex() {
  return (
    <main style={pageStyle}>
      <div className="lz-screen lz-texture-space">
        <h1 className="lz-display">Dev tools</h1>
        <p className="lz-fine">Only available while running `pnpm dev`.</p>
        <ul className="lz-links" style={{ marginTop: '12px' }}>
          {TOOLS.map(tool => (
            <li key={tool.href}>
              <Link href={tool.href}>{tool.name}</Link> <span className="lz-text">{tool.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
