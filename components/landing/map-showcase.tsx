"use client"

import { InteractiveMapDemo } from "./interactive-map-demo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Pin, Tag, Users, Zap } from "lucide-react"

export function MapShowcase() {
  return (
    <section id="demo" className="py-20 md:py-32 bg-black text-white border-t border-white/10 -mt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Interactive Demo */}
          <div className="mb-16">
            <InteractiveMapDemo />
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <Map className="h-5 w-5 text-blue-400" />
                </div>
                <CardTitle className="text-white">Interactive Maps</CardTitle>
                <CardDescription className="text-white/60">
                  Pin locations, search addresses, and visualize your entire trip
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-4">
                  <Tag className="h-5 w-5 text-red-400" />
                </div>
                <CardTitle className="text-white">Custom Categories</CardTitle>
                <CardDescription className="text-white/60">
                  Organize pins by restaurants, hotels, attractions, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <CardTitle className="text-white">Real-time Sync</CardTitle>
                <CardDescription className="text-white/60">
                  See changes instantly as your team adds pins and updates plans
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5 text-yellow-400" />
                </div>
                <CardTitle className="text-white">Smart Lists</CardTitle>
                <CardDescription className="text-white/60">
                  Create organized lists for activities, stores, and things to see
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

