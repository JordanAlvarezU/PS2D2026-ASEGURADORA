import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import StatsSection from '@/components/sections/StatsSection'
import ProductsSection from '@/components/sections/ProductsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CardSearchSection from '@/components/sections/CardSearchSection'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <StatsSection />
      <ProductsSection />
      <TestimonialsSection />
      <CardSearchSection />
      <Footer />
    </main>
  )
}
