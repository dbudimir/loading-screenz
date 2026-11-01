import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_NAME, TAGLINE } from '@/lib/site';

export const alt = `${SITE_NAME}: ${TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The site builds from site/, so the extension's theme folder is one level up.
const orbData = await readFile(join(process.cwd(), '../src/theme/logo-orb.svg'), 'base64');
const orbSrc = `data:image/svg+xml;base64,${orbData}`;

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: 28,
        background: 'linear-gradient(180deg, #ffffff 0%, #d9dcd9 40%, #9da39f 60%, #e9ece9 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          gap: 44,
          padding: '0 52px',
          border: '3px solid #000',
          borderRadius: 18,
          background: 'radial-gradient(ellipse at 75% 20%, #1f3550 0%, #0b1220 40%, #020304 80%)',
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: ImageResponse renders plain img elements */}
        <img
          src={orbSrc}
          alt=""
          width={220}
          height={220}
          style={{ borderRadius: 110, boxShadow: '0 0 90px rgba(156, 230, 60, 0.6)' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              color: '#ffffff',
              fontSize: 70,
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: 2,
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            Loading <span style={{ color: '#9be05a', marginLeft: 22 }}>Screenz</span>
          </div>
          <div style={{ display: 'flex', color: '#8fd84a', fontSize: 40, fontStyle: 'italic', fontWeight: 700 }}>
            {TAGLINE}
          </div>
          <div style={{ display: 'flex', color: '#c9d2cb', fontSize: 28 }}>
            Halo · PS2 · Xbox · GameCube · Dreamcast · and more
          </div>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              marginTop: 10,
              padding: '10px 28px',
              border: '2px solid #437a14',
              borderRadius: 12,
              background: 'linear-gradient(180deg, #d7f5a0 0%, #9fd858 45%, #72b02c 55%, #9ad452 100%)',
              color: '#ffffff',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            Install Free for Chrome
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
