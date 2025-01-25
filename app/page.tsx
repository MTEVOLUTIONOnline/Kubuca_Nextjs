import Navbar from "@/app/components/navbar"
import Hero from "@/app/components/hero"
import PremiumSection from "@/app/components/premium-section"
import SalesSection from "@/app/components/sales-section"
import Testimonials from "./components/testimonials"
import SupportSection from "./components/support-section"
import FeaturesSection from "./components/features-section"
import FaqSection from "./components/faq-section"
import PricingSection from "./components/pricing-section"
import Footer from "./components/footer"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PremiumSection />
      <SalesSection />
      <Testimonials />
      <SupportSection />
      <FeaturesSection />
      <FaqSection />
      <PricingSection />
      <Footer />
    </main>
  )
}


