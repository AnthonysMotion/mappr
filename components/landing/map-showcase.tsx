"use client"

import { InteractiveMapDemo } from "./interactive-map-demo"

export function MapShowcase() {
  return (
    <section id="demo" className="py-20 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <InteractiveMapDemo />
        </div>
      </div>
    </section>
  )
}
