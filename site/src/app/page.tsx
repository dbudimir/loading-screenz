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
  padding: '20px var(--site-gutter) 0',
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
