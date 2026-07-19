import dynamic from "next/dynamic"
import { HeroSection } from "@/components/landing/hero-section"

const RunningHeadlines = dynamic(
  () => import("@/components/landing/running-headlines").then((mod) => mod.RunningHeadlines),
)
const HowItWorksSection = dynamic(
  () => import("@/components/landing/how-it-works-section").then((mod) => mod.HowItWorksSection),
)
const FeaturesSection = dynamic(
  () => import("@/components/landing/features-section").then((mod) => mod.FeaturesSection),
)
const KineticTextSection = dynamic(
  () => import("@/components/landing/kinetic-text-section").then((mod) => mod.KineticTextSection),
)
const BuiltForSection = dynamic(
  () => import("@/components/landing/refined-sections").then((mod) => mod.BuiltForSection),
)
const PricingSection = dynamic(
  () => import("@/components/landing/more-sections").then((mod) => mod.PricingSection),
)
const FaqSection = dynamic(
  () => import("@/components/landing/more-sections").then((mod) => mod.FaqSection),
)
const CtaSection = dynamic(
  () => import("@/components/landing/cta-section").then((mod) => mod.CtaSection),
)
const Footer = dynamic(
  () => import("@/components/landing/footer").then((mod) => mod.Footer),
)

export default function Home() {
  return (
    <main>
      <HeroSection />
      <KineticTextSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RunningHeadlines />
      <BuiltForSection />
      {/* <PricingSection />
      <FaqSection /> */}
      <CtaSection />
      <Footer />
    </main>
  )
}
