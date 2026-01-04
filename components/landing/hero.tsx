"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo")
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95" />
      
      {/* Subtle animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
      
      {/* Gradient orbs for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          {/* Badge/Tagline */}
          <div className="flex justify-center mb-8">
            <Badge 
              variant="outline" 
              className="bg-white/5 border-white/10 text-white/80 px-4 py-1.5 text-xs font-medium backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              Collaborative Travel Planning
            </Badge>
          </div>

          {/* Main Headline */}
          <div className="text-center space-y-6 mb-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
              Plan trips together.
              <br />
                Effortlessly.
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              The collaborative workspace for travel planning. Pin locations, build timelines, and organize every detail with your travel companions in real-time.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-lg px-6 py-2.5 text-sm h-auto font-medium transition-all"
              >
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button
              onClick={scrollToDemo}
              size="lg"
              variant="outline"
              className="rounded-lg px-6 py-2.5 text-sm h-auto border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all backdrop-blur-sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Try Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span>Real-time collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>Interactive maps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>Free to use</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  )
}
