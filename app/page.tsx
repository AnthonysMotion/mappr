import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/landing/hero"
import { MapShowcase } from "@/components/landing/map-showcase"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MapShowcase />
      </main>
      <Footer />
    </div>
  )
}