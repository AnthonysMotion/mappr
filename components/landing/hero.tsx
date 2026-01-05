"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Github } from "lucide-react"

export function Hero() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo")
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Plan trips together.
              <br />
              Effortlessly.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The collaborative workspace for travel planning. Pin locations, build timelines, and organize every detail with your travel companions in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/login">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              onClick={scrollToDemo}
              variant="outline"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Try Demo
            </Button>
            <a
              href="https://github.com/AnthonysMotion/mappr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
