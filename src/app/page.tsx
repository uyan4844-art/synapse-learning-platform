import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/marketing/hero-section";
import { ProductPillars } from "@/components/marketing/product-pillars";
import { LiveBattlePreview } from "@/components/marketing/live-battle-preview";
import { AnalyticsPreview } from "@/components/marketing/analytics-preview";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <AppShell isMarketing={true}>
      <HeroSection />
      <ProductPillars />
      <LiveBattlePreview />
      <AnalyticsPreview />
      <PricingSection />
      <CtaSection />
      <Footer />
    </AppShell>
  );
}
