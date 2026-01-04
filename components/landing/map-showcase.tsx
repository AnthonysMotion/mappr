"use client"

import { InteractiveMapDemo } from "./interactive-map-demo"

export function MapShowcase() {
  return (
    <section id="demo" className="py-20 md:py-32 bg-black text-white border-t border-white/10 -mt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Interactive Demo */}
          <div>
            <InteractiveMapDemo />
          </div>
        </div>
      </div>
    </section>
  )
}

