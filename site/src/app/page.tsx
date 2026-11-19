import type { CSSProperties } from 'react';
import {
  ControlPanel,
  Faq,
  FinalCta,
  Hero,
  HowItWorks,
  InfoColumns,
  ScreenGallery,
  ShellFooter,
  SiteFooter,
  SiteHeader,
  StatsTicker,
} from '@/components';

const pageStyle: CSSProperties = {
  maxWidth: 'var(--site-width)',
  margin: '0 auto',
  // Design spacing plus the safe-area insets, so with viewport-fit: cover
  // the shell keeps its usual clearance below the Dynamic Island, beside a
  // landscape notch, and above the home indicator (insets are 0 on
  // rectangular screens, so desktop is unchanged apart from the new
  // 20px bottom clearance).
  padding:
    'calc(20px + env(safe-area-inset-top, 0px)) calc(var(--site-gutter) + env(safe-area-inset-right, 0px)) calc(20px + env(safe-area-inset-bottom, 0px)) calc(var(--site-gutter) + env(safe-area-inset-left, 0px))',
};

export default function Home() {
  return (
    <div style={pageStyle}>
      <div className="lz-shell" style={{ '--lz-cap-height': '84px' } as CSSProperties}>
        <SiteHeader />
        <main>
          <Hero />
          <StatsTicker />
          <HowItWorks />
          <InfoColumns />
          <ScreenGallery />
          <ControlPanel />
          <Faq />
          <FinalCta />
        </main>
        <ShellFooter />
      </div>
      <SiteFooter />
    </div>
  );
}
