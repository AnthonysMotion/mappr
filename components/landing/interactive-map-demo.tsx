"use client"

import { useState } from "react"
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls, MapRoute } from "@/components/ui/map"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Route, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Demo data - fake pins and categories for showcase
const demoCategories = [
  { id: "1", name: "Restaurants", color: "#ef4444" },
  { id: "2", name: "Attractions", color: "#3b82f6" },
  { id: "3", name: "Hotels", color: "#10b981" },
  { id: "4", name: "Shopping", color: "#f59e0b" },
]

const demoPins = [
  {
    id: "1",
    name: "Tokyo Skytree",
    description: "Iconic broadcasting tower with observation decks",
    latitude: 35.7101,
    longitude: 139.8107,
    category_id: "2",
    categories: demoCategories[1],
  },
  {
    id: "2",
    name: "Sushi Saito",
    description: "Michelin-starred omakase experience",
    latitude: 35.6586,
    longitude: 139.7454,
    category_id: "1",
    categories: demoCategories[0],
  },
  {
    id: "3",
    name: "Park Hyatt Tokyo",
    description: "Luxury hotel featured in Lost in Translation",
    latitude: 35.6586,
    longitude: 139.7306,
    category_id: "3",
    categories: demoCategories[2],
  },
  {
    id: "4",
    name: "Ginza Shopping District",
    description: "High-end shopping and dining area",
    latitude: 35.6719,
    longitude: 139.7659,
    category_id: "4",
    categories: demoCategories[3],
  },
  {
    id: "5",
    name: "Shibuya Crossing",
    description: "World's busiest pedestrian crossing",
    latitude: 35.6598,
    longitude: 139.7006,
    category_id: "2",
    categories: demoCategories[1],
  },
  {
    id: "6",
    name: "Tsukiji Outer Market",
    description: "Fresh seafood and traditional street food",
    latitude: 35.6654,
    longitude: 139.7706,
    category_id: "1",
    categories: demoCategories[0],
  },
]

// Demo routes connecting pins
const demoRoutes = [
  {
    id: "route1",
    name: "Day 1 Itinerary",
    coordinates: [
      [139.8107, 35.7101], // Tokyo Skytree
      [139.7659, 35.6719], // Ginza
      [139.7454, 35.6586], // Sushi Saito
      [139.7306, 35.6586], // Park Hyatt
    ],
    color: "#3b82f6",
  },
  {
    id: "route2",
    name: "Shopping & Food Tour",
    coordinates: [
      [139.7659, 35.6719], // Ginza
      [139.7706, 35.6654], // Tsukiji Market
      [139.7006, 35.6598], // Shibuya Crossing
    ],
    color: "#10b981",
  },
  {
    id: "route3",
    name: "Attractions Route",
    coordinates: [
      [139.8107, 35.7101], // Tokyo Skytree
      [139.7006, 35.6598], // Shibuya Crossing
    ],
    color: "#f59e0b",
  },
]

export function InteractiveMapDemo() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [showRoutes, setShowRoutes] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)

  const filteredPins = selectedCategory
    ? demoPins.filter((pin) => pin.category_id === selectedCategory)
    : demoPins

  const mapCenter: [number, number] = [139.75, 35.68] // Tokyo center

  const activeRoutes = selectedRoute
    ? demoRoutes.filter((route) => route.id === selectedRoute)
    : showRoutes
    ? demoRoutes
    : []

  return (
    <div className="w-full">
      {/* Route Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => {
            setShowRoutes(!showRoutes)
            setSelectedRoute(null)
          }}
          variant={showRoutes ? "default" : "outline"}
          className={`rounded-full ${
            showRoutes
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }`}
        >
          <Route className="h-4 w-4 mr-2" />
          {showRoutes ? "Hide Routes" : "Show Routes"}
        </Button>
        {showRoutes && (
          <>
            <Button
              onClick={() => setSelectedRoute(null)}
              variant={selectedRoute === null ? "default" : "outline"}
              className={`rounded-full text-sm ${
                selectedRoute === null
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              All Routes
            </Button>
            {demoRoutes.map((route) => (
              <Button
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                variant={selectedRoute === route.id ? "default" : "outline"}
                className={`rounded-full text-sm flex items-center gap-2 ${
                  selectedRoute === route.id
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: route.color }}
                />
                {route.name}
              </Button>
            ))}
          </>
        )}
      </div>

      {/* Category Filter - Centered */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-medium text-white/60">Filter by category:</span>
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-white text-black"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          All
        </button>
        {demoCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === category.id
                ? "bg-white text-black"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-black">
        <Map center={mapCenter} zoom={12}>
          <MapControls showZoom />
          
          {/* Routes */}
          {activeRoutes.map((route) => (
            <MapRoute
              key={route.id}
              coordinates={route.coordinates}
              color={route.color}
              width={4}
              opacity={0.7}
            />
          ))}

          {/* Pins */}
          {filteredPins.map((pin) => {
            const category = pin.categories
            const isSelected = selectedPin === pin.id
            return (
              <MapMarker
                key={pin.id}
                longitude={pin.longitude}
                latitude={pin.latitude}
              >
                <MarkerContent>
                  <div
                    className={`h-5 w-5 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all ${
                      isSelected ? "scale-125 ring-2 ring-white" : ""
                    }`}
                    style={{
                      backgroundColor: category?.color || "#3b82f6",
                    }}
                    onClick={() => setSelectedPin(isSelected ? null : pin.id)}
                  />
                </MarkerContent>
                <MarkerPopup>
                  <div className="space-y-2 min-w-[200px]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{pin.name}</h3>
                        {pin.description && (
                          <p className="text-sm text-white/70 mt-1">{pin.description}</p>
                        )}
                        {category && (
                          <Badge
                            className="mt-2"
                            style={{
                              backgroundColor: category.color,
                              color: "white",
                            }}
                          >
                            {category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </MarkerPopup>
              </MapMarker>
            )
          })}
        </Map>
      </div>

      {/* Pins List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPins.map((pin) => {
          const category = pin.categories
          return (
            <Card
              key={pin.id}
              className={`cursor-pointer transition-all bg-white/5 border-white/10 hover:bg-white/10 ${
                selectedPin === pin.id ? "ring-2 ring-white/50" : ""
              }`}
              onClick={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category?.color || "#3b82f6" }}
                      />
                      <h4 className="font-semibold text-white">{pin.name}</h4>
                    </div>
                    {pin.description && (
                      <p className="text-sm text-white/60 line-clamp-2">{pin.description}</p>
                    )}
                    {category && (
                      <Badge
                        className="mt-2"
                        style={{
                          backgroundColor: category.color,
                          color: "white",
                        }}
                      >
                        {category.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
