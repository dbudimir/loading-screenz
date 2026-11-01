import { type ReactNode, useId } from 'react';

// Logo mark explorations. The marks marked inUse are the shipped ones: Power Core is src/theme/logo-orb.svg
// (shown by .lz-logo-orb) and Flat Jewel is assets/icons/icon.svg and the site's favicon. Those files are the
// source of truth; update them along with these copies.
// Every mark is drawn on a 128 x 128 grid so any option can become a standalone SVG unchanged.

type MarkProps = { size: number };

export type LogoOption = {
  letter: string;
  name: string;
  note: string;
  inUse?: boolean;
  Mark: (props: MarkProps) => ReactNode;
};

/** Gradient and filter ids must be unique per SVG, since several copies of each mark share the page. */
function useIds() {
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string) => `${base}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;
  return { id, url };
}

function Svg({ size, label, children }: { size: number; label: string; children: ReactNode }) {
  return (
    <svg className="sg-mark" width={size} height={size} viewBox="0 0 128 128" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

const LIME = '#8cc63f';
const LIME_BRIGHT = '#c4f060';
const LIME_PALE = '#f2ffd0';
const SPACE = '#0b1220';

/** Points on a circle around the center, measured clockwise from 12 o'clock. */
function polar(radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180;
  return { x: 64 + radius * Math.sin(radians), y: 64 - radius * Math.cos(radians) };
}

/** The power glyph's ring: a circle with a gap at the top. */
function powerArc(radius: number, gap: number) {
  const start = polar(radius, gap / 2);
  const end = polar(radius, 360 - gap / 2);
  return `M${start.x.toFixed(2)} ${start.y.toFixed(2)} A${radius} ${radius} 0 1 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

const BLADE = 'M64 64 C60 44 78 24 102 34 C86 38 72 50 64 64 Z';
const FLAT_BLADE = 'M64 64 C58 40 80 14 112 30 C88 34 72 48 64 64 Z';

function ChromeStops() {
  return (
    <>
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.3" stopColor="#e2e5e2" />
      <stop offset="0.55" stopColor="#9da39f" />
      <stop offset="0.62" stopColor="#b9beba" />
      <stop offset="1" stopColor="#eef0ee" />
    </>
  );
}

function OrbStops() {
  return (
    <>
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.18" stopColor="#d8ff8a" />
      <stop offset="0.45" stopColor={LIME} />
      <stop offset="0.8" stopColor="#3f7a12" />
      <stop offset="1" stopColor="#173006" />
    </>
  );
}

function GlowFilter({ id, blur = 2.5 }: { id: string; blur?: number }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={blur} result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

/* Orb marks */

function PowerCore({ size }: MarkProps) {
  const { id, url } = useIds();
  return (
    <Svg size={size} label="Power Core">
      <defs>
        <linearGradient id={id('chrome')} x1="0" y1="0" x2="0" y2="1">
          <ChromeStops />
        </linearGradient>
        <radialGradient id={id('glass')}>
          <stop offset="0" stopColor="#24520d" />
          <stop offset="0.55" stopColor="#0c1d05" />
          <stop offset="1" stopColor="#030602" />
        </radialGradient>
        <radialGradient id={id('orb')} cx="0.38" cy="0.32" r="0.7">
          <OrbStops />
        </radialGradient>
        <radialGradient id={id('halo')}>
          <stop offset="0" stopColor="#b8ff4a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#b8ff4a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('segment')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LIME_PALE} />
          <stop offset="1" stopColor={LIME} />
        </linearGradient>
        <linearGradient id={id('shine')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <GlowFilter id={id('glow')} />
      </defs>
      <circle cx="64" cy="64" r="60" fill={url('chrome')} stroke="#5f6561" strokeWidth="1.5" />
      <circle cx="64" cy="64" r="51" fill="#1d201e" />
      <circle cx="64" cy="64" r="49" fill={url('glass')} />
      <g className="sg-anim-steps" filter={url('glow')} fill={url('segment')}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed set of segments
            key={i}
            x="60.5"
            y="20"
            width="7"
            height="13"
            rx="3.5"
            transform={`rotate(${360 - i * 30} 64 64)`}
            opacity={1 - i * 0.075}
          />
        ))}
      </g>
      <circle cx="64" cy="64" r="30" fill={url('halo')} />
      <circle cx="64" cy="64" r="18" fill={url('orb')} />
      <ellipse cx="58" cy="57" rx="6" ry="3.5" fill="#fff" opacity="0.85" />
      <ellipse cx="64" cy="40" rx="36" ry="22" fill={url('shine')} opacity="0.5" />
      <path d="M28 86 A44 44 0 0 0 100 86" fill="none" stroke={LIME_BRIGHT} strokeWidth="2" opacity="0.35" />
    </Svg>
  );
}

function GelJewel({ size }: MarkProps) {
  const { id, url } = useIds();
  return (
    <Svg size={size} label="Gel Jewel">
      <defs>
        <linearGradient id={id('chrome')} x1="0" y1="0" x2="0" y2="1">
          <ChromeStops />
        </linearGradient>
        <radialGradient id={id('gel')} cx="0.5" cy="0.72" r="0.75">
          <stop offset="0" stopColor="#eaffb0" />
          <stop offset="0.25" stopColor="#a8e04c" />
          <stop offset="0.55" stopColor="#6aa82a" />
          <stop offset="0.85" stopColor="#2f6410" />
          <stop offset="1" stopColor="#142b04" />
        </radialGradient>
        <linearGradient id={id('highlight')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <GlowFilter id={id('glow')} blur={2} />
      </defs>
      <circle cx="64" cy="64" r="60" fill={url('chrome')} stroke="#5f6561" strokeWidth="1.5" />
      <circle cx="64" cy="64" r="53" fill="#142b04" />
      <circle cx="64" cy="64" r="52" fill={url('gel')} />
      <circle cx="64" cy="64" r="32" fill="none" stroke="#0f2205" strokeWidth="13" opacity="0.45" />
      <g className="sg-anim-spin" filter={url('glow')}>
        <path d="M64 32 A32 32 0 1 1 32 64" fill="none" stroke={LIME_PALE} strokeWidth="7" strokeLinecap="round" />
        <circle cx="32" cy="64" r="5" fill="#fff" />
      </g>
      <circle cx="64" cy="64" r="9" fill={LIME_PALE} filter={url('glow')} />
      <ellipse cx="64" cy="100" rx="28" ry="8" fill="#eaffb0" opacity="0.3" />
      <ellipse cx="64" cy="36" rx="40" ry="24" fill={url('highlight')} />
    </Svg>
  );
}

function Plasma({ size }: MarkProps) {
  const { id, url } = useIds();
  return (
    <Svg size={size} label="Plasma">
      <defs>
        <linearGradient id={id('chrome')} x1="0" y1="0" x2="0" y2="1">
          <ChromeStops />
        </linearGradient>
        <radialGradient id={id('space')}>
          <stop offset="0" stopColor="#0f2e0c" />
          <stop offset="0.6" stopColor="#06110a" />
          <stop offset="1" stopColor="#010301" />
        </radialGradient>
        <radialGradient id={id('blade')} cx="64" cy="64" r="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.25" stopColor="#d8ff8a" />
          <stop offset="0.6" stopColor={LIME} />
          <stop offset="1" stopColor="#2f6410" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id={id('core')}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#e2ff9e" />
          <stop offset="1" stopColor="#b8ff4a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('shine')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={id('blur')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="60" fill={url('chrome')} stroke="#5f6561" strokeWidth="1.5" />
      <circle cx="64" cy="64" r="51" fill="#1d201e" />
      <circle cx="64" cy="64" r="49" fill={url('space')} />
      <g className="sg-anim-slow">
        <g filter={url('blur')} opacity="0.9">
          {[0, 72, 144, 216, 288].map(angle => (
            <path key={angle} d={BLADE} fill={url('blade')} transform={`rotate(${angle} 64 64)`} />
          ))}
        </g>
        {[0, 72, 144, 216, 288].map(angle => (
          <path key={angle} d={BLADE} fill={url('blade')} transform={`rotate(${angle} 64 64)`} />
        ))}
      </g>
      <circle cx="64" cy="64" r="16" fill={url('core')} />
      <circle cx="40" cy="38" r="0.9" fill="#fff" opacity="0.8" />
      <circle cx="94" cy="86" r="0.8" fill="#dfe" opacity="0.6" />
      <ellipse cx="64" cy="38" rx="36" ry="20" fill={url('shine')} opacity="0.55" />
    </Svg>
  );
}

function Orbit({ size }: MarkProps) {
  const { id, url } = useIds();
  const ring = (tilt: number, front: boolean) => (
    <g transform={`rotate(${tilt} 64 64)`}>
      <path
        d={front ? 'M8 64 A56 17 0 0 0 120 64' : 'M8 64 A56 17 0 0 1 120 64'}
        fill="none"
        stroke={url('ring')}
        strokeWidth="3.5"
        opacity={front ? 1 : 0.45}
      />
      {front && <circle cx="96" cy="78.5" r="4.5" fill={LIME_PALE} filter={url('glow')} />}
    </g>
  );
  return (
    <Svg size={size} label="Orbit">
      <defs>
        <radialGradient id={id('aura')}>
          <stop offset="0" stopColor="#b8ff4a" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#8cc63f" stopOpacity="0.18" />
          <stop offset="1" stopColor="#8cc63f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('orb')} cx="0.38" cy="0.32" r="0.7">
          <OrbStops />
        </radialGradient>
        <linearGradient id={id('ring')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor={LIME_BRIGHT} />
          <stop offset="1" stopColor="#4b8a17" />
        </linearGradient>
        <GlowFilter id={id('glow')} />
      </defs>
      <circle cx="64" cy="64" r="62" fill={url('aura')} />
      <circle cx="64" cy="64" r="60" fill="none" stroke={LIME} strokeWidth="1.5" opacity="0.35" />
      {ring(-28, false)}
      {ring(32, false)}
      <circle cx="64" cy="64" r="27" fill={url('orb')} />
      <ellipse cx="55" cy="53" rx="9" ry="5" fill="#fff" opacity="0.85" />
      <g className="sg-anim-pulse">
        {ring(-28, true)}
        {ring(32, true)}
      </g>
    </Svg>
  );
}

function PowerUp({ size }: MarkProps) {
  const { id, url } = useIds();
  return (
    <Svg size={size} label="Power-Up">
      <defs>
        <linearGradient id={id('chrome')} x1="0" y1="0" x2="0" y2="1">
          <ChromeStops />
        </linearGradient>
        <linearGradient id={id('lip')} x1="0" y1="1" x2="0" y2="0">
          <ChromeStops />
        </linearGradient>
        <radialGradient id={id('recess')} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#1b3a12" />
          <stop offset="0.6" stopColor="#07120a" />
          <stop offset="1" stopColor="#010201" />
        </radialGradient>
        <linearGradient id={id('stem')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={LIME} />
          <stop offset="0.4" stopColor={LIME_PALE} />
          <stop offset="1" stopColor="#4b8a17" />
        </linearGradient>
        <linearGradient id={id('gloss')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <GlowFilter id={id('glow')} blur={3} />
      </defs>
      <circle cx="64" cy="64" r="60" fill={url('chrome')} stroke="#5f6561" strokeWidth="1.5" />
      <circle cx="64" cy="64" r="50" fill={url('lip')} />
      <circle cx="64" cy="64" r="45" fill={url('recess')} />
      <g filter={url('glow')}>
        <path d={powerArc(27, 70)} fill="none" stroke="#1d3a0b" strokeWidth="9" strokeLinecap="round" />
        <path
          className="sg-anim-dash"
          d={powerArc(27, 70)}
          fill="none"
          stroke={LIME_BRIGHT}
          strokeWidth="9"
          strokeDasharray="7 4"
        />
        <rect x="58.5" y="26" width="11" height="33" rx="5.5" fill={url('stem')} />
      </g>
      <ellipse cx="64" cy="40" rx="34" ry="18" fill={url('gloss')} />
    </Svg>
  );
}

export const ORB_LOGOS: LogoOption[] = [
  {
    letter: 'A',
    name: 'Power Core',
    note: 'The current dial, upgraded: twelve glowing segments chase around a gel core under tinted glass.',
    inUse: true,
    Mark: PowerCore,
  },
  {
    letter: 'B',
    name: 'Gel Jewel',
    note: 'A full lime gel jewel in a chrome ring, with a loading arc set into the plastic. Brightest of the set.',
    Mark: GelJewel,
  },
  {
    letter: 'C',
    name: 'Plasma',
    note: 'The Xbox boot sequence: green plasma arms spiral out of a white-hot core in a dark glass lens.',
    Mark: Plasma,
  },
  {
    letter: 'D',
    name: 'Orbit',
    note: 'A bare gel orb with two chrome-lime orbit rings and a satellite. No bezel, so it floats in its glow.',
    Mark: Orbit,
  },
  {
    letter: 'E',
    name: 'Power-Up',
    note: 'A chrome console button whose power ring is a marching loading bar. Matches the .lz-power switch.',
    Mark: PowerUp,
  },
];

/* Flat icons: solid fills only, no gradients or blur, so they stay crisp at 16px. */

function FlatDial({ size }: MarkProps) {
  return (
    <Svg size={size} label="Flat Dial">
      <circle cx="64" cy="64" r="62" fill={SPACE} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed set of segments
          key={i}
          x="56"
          y="10"
          width="16"
          height="30"
          rx="8"
          fill={LIME_BRIGHT}
          transform={`rotate(${360 - i * 45} 64 64)`}
          opacity={1 - i * 0.11}
        />
      ))}
      <circle cx="64" cy="64" r="14" fill={LIME} />
    </Svg>
  );
}

function FlatJewel({ size }: MarkProps) {
  return (
    <Svg size={size} label="Flat Jewel">
      <circle cx="64" cy="64" r="62" fill={LIME} />
      <path d="M2 64 A62 62 0 0 1 126 64 Z" fill={LIME_BRIGHT} />
      <path d="M64 30 A34 34 0 1 1 30 64" fill="none" stroke={SPACE} strokeWidth="17" strokeLinecap="round" />
      <circle cx="64" cy="64" r="11" fill={SPACE} />
    </Svg>
  );
}

function FlatPlasma({ size }: MarkProps) {
  return (
    <Svg size={size} label="Flat Plasma">
      <circle cx="64" cy="64" r="62" fill={SPACE} />
      {[0, 72, 144, 216, 288].map(angle => (
        <path key={angle} d={FLAT_BLADE} fill={LIME} transform={`rotate(${angle} 64 64)`} />
      ))}
      <circle cx="64" cy="64" r="15" fill={LIME_BRIGHT} />
    </Svg>
  );
}

function FlatOrbit({ size }: MarkProps) {
  const ring = (front: boolean) => (
    <path
      d={front ? 'M10 64 A54 18 0 0 0 118 64' : 'M10 64 A54 18 0 0 1 118 64'}
      fill="none"
      stroke={LIME_BRIGHT}
      strokeWidth="9"
      strokeLinecap="round"
      transform="rotate(-28 64 64)"
      opacity={front ? 1 : 0.5}
    />
  );
  return (
    <Svg size={size} label="Flat Orbit">
      <circle cx="64" cy="64" r="62" fill={SPACE} />
      {ring(false)}
      <circle cx="64" cy="64" r="28" fill={LIME} />
      {ring(true)}
    </Svg>
  );
}

function FlatPower({ size }: MarkProps) {
  return (
    <Svg size={size} label="Flat Power">
      <circle cx="64" cy="64" r="62" fill={LIME} />
      <path d={powerArc(32, 76)} fill="none" stroke={SPACE} strokeWidth="14" strokeLinecap="round" />
      <rect x="57" y="18" width="14" height="44" rx="7" fill={SPACE} />
    </Svg>
  );
}

export const FLAT_LOGOS: LogoOption[] = [
  {
    letter: 'A',
    name: 'Flat Dial',
    note: 'Eight chunky segments fading around a lime dot. Reads as "loading" even at 16px.',
    Mark: FlatDial,
  },
  {
    letter: 'B',
    name: 'Flat Jewel',
    note: 'A two-tone lime disc with a dark loading arc. The most visible in a crowded toolbar.',
    inUse: true,
    Mark: FlatJewel,
  },
  {
    letter: 'C',
    name: 'Flat Plasma',
    note: 'Five lime arms spinning out of a bright core on deep space.',
    Mark: FlatPlasma,
  },
  {
    letter: 'D',
    name: 'Flat Orbit',
    note: 'A lime planet with one tilted ring. The ring drops out first at small sizes.',
    Mark: FlatOrbit,
  },
  {
    letter: 'E',
    name: 'Flat Power',
    note: 'A bold power symbol on lime. Simplest silhouette of the five.',
    Mark: FlatPower,
  },
];
