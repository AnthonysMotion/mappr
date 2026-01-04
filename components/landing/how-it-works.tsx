import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Map, Share2, Plane } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: Plus,
    title: "Create a Trip",
    description: "Start by creating a new trip. Give it a name and set your travel dates.",
  },
  {
    icon: Map,
    title: "Add Pins & Lists",
    description: "Pin locations on the map, create custom categories, and organize everything with lists.",
  },
  {
    icon: Share2,
    title: "Invite Collaborators",
    description: "Share your trip with friends and family. They can view, add pins, and contribute to lists.",
  },
  {
    icon: Plane,
    title: "Enjoy Your Trip",
    description: "Access your trip from anywhere. All your plans are organized and ready to go.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes. Planning your perfect trip has never been easier.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Link href="/auth/login">
              <Button size="lg" className="text-lg px-8">
                Start Planning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

