import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Map, Users, List } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-background" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Plan Your Perfect Trip
              <span className="block text-primary">Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Collaborate with friends and family to create unforgettable travel experiences. Pin locations, share ideas, and organize everything in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="flex flex-col items-center gap-3 p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Interactive Maps</h3>
              <p className="text-sm text-muted-foreground text-center">
                Pin locations and explore your trip visually
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Real-time Collaboration</h3>
              <p className="text-sm text-muted-foreground text-center">
                Share trips and plan together in real-time
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <List className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Organized Lists</h3>
              <p className="text-sm text-muted-foreground text-center">
                Create lists for activities, stores, and things to see
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

