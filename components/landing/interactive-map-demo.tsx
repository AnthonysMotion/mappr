"use client"

import { useState } from "react"
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls, MapRoute } from "@/components/ui/map"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Route, Calendar, Clock, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { LocationSearch } from "@/components/pins/location-search"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Demo data - fake pins and categories for showcase
const demoCategories = [
  { id: "1", name: "Restaurants", color: "#ef4444" },
  { id: "2", name: "Attractions", color: "#3b82f6" },
  { id: "3", name: "Hotels", color: "#10b981" },
  { id: "4", name: "Shopping", color: "#f59e0b" },
]

// Expanded demo pins to make it look like a real trip
const initialDemoPins = [
  // Day 1 - Arrival & Central Tokyo
  {
    id: "1",
    name: "Narita Airport",
    description: "Arrival point - International Terminal",
    latitude: 35.7720,
    longitude: 140.3929,
    category_id: "3",
    categories: demoCategories[2],
    day: 1,
    time: "09:00",
  },
  {
    id: "2",
    name: "Park Hyatt Tokyo",
    description: "Luxury hotel featured in Lost in Translation - Check-in",
    latitude: 35.6586,
    longitude: 139.7306,
    category_id: "3",
    categories: demoCategories[2],
    day: 1,
    time: "11:00",
  },
  {
    id: "3",
    name: "Tsukiji Outer Market",
    description: "Fresh seafood and traditional street food for lunch",
    latitude: 35.6654,
    longitude: 139.7706,
    category_id: "1",
    categories: demoCategories[0],
    day: 1,
    time: "13:00",
  },
  {
    id: "4",
    name: "Ginza Shopping District",
    description: "High-end shopping and dining area - Afternoon exploration",
    latitude: 35.6719,
    longitude: 139.7659,
    category_id: "4",
    categories: demoCategories[3],
    day: 1,
    time: "15:00",
  },
  {
    id: "5",
    name: "Sushi Saito",
    description: "Michelin-starred omakase experience - Dinner reservation",
    latitude: 35.6586,
    longitude: 139.7454,
    category_id: "1",
    categories: demoCategories[0],
    day: 1,
    time: "19:00",
  },
  // Day 2 - Cultural & Modern Tokyo
  {
    id: "6",
    name: "Senso-ji Temple",
    description: "Tokyo's oldest temple in Asakusa",
    latitude: 35.7148,
    longitude: 139.7967,
    category_id: "2",
    categories: demoCategories[1],
    day: 2,
    time: "09:00",
  },
  {
    id: "7",
    name: "Tokyo Skytree",
    description: "Iconic broadcasting tower with observation decks",
    latitude: 35.7101,
    longitude: 139.8107,
    category_id: "2",
    categories: demoCategories[1],
    day: 2,
    time: "11:00",
  },
  {
    id: "8",
    name: "Ueno Park",
    description: "Beautiful park with museums and cherry blossoms",
    latitude: 35.7142,
    longitude: 139.7734,
    category_id: "2",
    categories: demoCategories[1],
    day: 2,
    time: "14:00",
  },
  {
    id: "9",
    name: "Akihabara",
    description: "Electric Town - Electronics and anime culture",
    latitude: 35.6984,
    longitude: 139.7731,
    category_id: "4",
    categories: demoCategories[3],
    day: 2,
    time: "16:00",
  },
  {
    id: "10",
    name: "Shibuya Crossing",
    description: "World's busiest pedestrian crossing - Evening visit",
    latitude: 35.6598,
    longitude: 139.7006,
    category_id: "2",
    categories: demoCategories[1],
    day: 2,
    time: "18:00",
  },
  // Day 3 - Nature & Relaxation
  {
    id: "11",
    name: "Meiji Shrine",
    description: "Peaceful Shinto shrine surrounded by forest",
    latitude: 35.6764,
    longitude: 139.6993,
    category_id: "2",
    categories: demoCategories[1],
    day: 3,
    time: "10:00",
  },
  {
    id: "12",
    name: "Harajuku",
    description: "Fashion district and Takeshita Street",
    latitude: 35.6702,
    longitude: 139.7026,
    category_id: "4",
    categories: demoCategories[3],
    day: 3,
    time: "12:00",
  },
  {
    id: "13",
    name: "Roppongi Hills",
    description: "Modern complex with shopping, dining, and Mori Art Museum",
    latitude: 35.6586,
    longitude: 139.7314,
    category_id: "2",
    categories: demoCategories[1],
    day: 3,
    time: "15:00",
  },
  {
    id: "14",
    name: "Tokyo Tower",
    description: "Iconic red tower with panoramic city views",
    latitude: 35.6586,
    longitude: 139.7454,
    category_id: "2",
    categories: demoCategories[1],
    day: 3,
    time: "17:00",
  },
]

// Demo routes connecting pins
const demoRoutes = [
  {
    id: "route1",
    name: "Day 1 Itinerary",
    coordinates: [
      [140.3929, 35.7720], // Narita Airport
      [139.7306, 35.6586], // Park Hyatt
      [139.7706, 35.6654], // Tsukiji Market
      [139.7659, 35.6719], // Ginza
      [139.7454, 35.6586], // Sushi Saito
    ],
    color: "#3b82f6",
  },
  {
    id: "route2",
    name: "Day 2 Cultural Tour",
    coordinates: [
      [139.7967, 35.7148], // Senso-ji
      [139.8107, 35.7101], // Tokyo Skytree
      [139.7734, 35.7142], // Ueno Park
      [139.7731, 35.6984], // Akihabara
      [139.7006, 35.6598], // Shibuya
    ],
    color: "#10b981",
  },
  {
    id: "route3",
    name: "Day 3 Exploration",
    coordinates: [
      [139.6993, 35.6764], // Meiji Shrine
      [139.7026, 35.6702], // Harajuku
      [139.7314, 35.6586], // Roppongi Hills
      [139.7454, 35.6586], // Tokyo Tower
    ],
    color: "#f59e0b",
  },
]

interface Pin {
  id: string
  name: string
  description?: string
  latitude: number
  longitude: number
  category_id?: string
  categories?: typeof demoCategories[0]
  day?: number
  time?: string
}

export function InteractiveMapDemo() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [showRoutes, setShowRoutes] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [pins, setPins] = useState<Pin[]>(initialDemoPins)
  const [isAddPinDialogOpen, setIsAddPinDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lng: number } | null>(null)
  const [newPinName, setNewPinName] = useState("")
  const [newPinDescription, setNewPinDescription] = useState("")
  const [newPinCategory, setNewPinCategory] = useState<string>("none")
  const [newPinDay, setNewPinDay] = useState<string>("1")
  const [newPinTime, setNewPinTime] = useState("")

  const filteredPins = selectedCategory
    ? pins.filter((pin) => pin.category_id === selectedCategory)
    : pins

  const mapCenter: [number, number] = [139.75, 35.68] // Tokyo center

  const activeRoutes = selectedRoute
    ? demoRoutes.filter((route) => route.id === selectedRoute)
    : showRoutes
    ? demoRoutes
    : []

  // Group pins by day for timeline
  const pinsByDay = pins.reduce((acc, pin) => {
    const day = pin.day || 0
    if (!acc[day]) acc[day] = []
    acc[day].push(pin)
    return acc
  }, {} as Record<number, Pin[]>)

  const handleLocationSelect = (location: { name: string; lat: number; lng: number }) => {
    setSelectedLocation(location)
    setNewPinName(location.name)
    setIsAddPinDialogOpen(true)
  }

  const handleAddPin = () => {
    if (!selectedLocation) return

    const newPin: Pin = {
      id: `user-${Date.now()}`,
      name: newPinName || selectedLocation.name,
      description: newPinDescription || undefined,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      category_id: newPinCategory !== "none" ? newPinCategory : undefined,
      categories: newPinCategory !== "none" ? demoCategories.find(c => c.id === newPinCategory) : undefined,
      day: parseInt(newPinDay),
      time: newPinTime || undefined,
    }

    setPins([...pins, newPin])
    setIsAddPinDialogOpen(false)
    setSelectedLocation(null)
    setNewPinName("")
    setNewPinDescription("")
    setNewPinCategory("none")
    setNewPinDay("1")
    setNewPinTime("")
  }

  return (
    <div className="w-full">
      {/* Map Container with Overlay Controls */}
      <motion.div 
        className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-black mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
            <Map center={mapCenter} zoom={11}>
              <MapControls showZoom />
              
              {/* Routes with animation */}
              <AnimatePresence>
                {activeRoutes.map((route) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <MapRoute
                      coordinates={route.coordinates}
                      color={route.color}
                      width={4}
                      opacity={0.7}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

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
                        className={`h-5 w-5 rounded-full border-2 border-white cursor-pointer transition-all ${
                          isSelected ? "ring-2 ring-white" : ""
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
                            {pin.day && pin.time && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-white/60">
                                <Clock className="h-3 w-3" />
                                Day {pin.day} • {pin.time}
                              </div>
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

            {/* Overlay Controls - Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="w-80 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  className="w-full"
                />
              </div>

              {/* Route Controls */}
              <motion.div 
                className="flex flex-wrap items-center gap-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden"
                animate={{
                  padding: showRoutes ? "0.75rem" : "0.5rem",
                  minWidth: showRoutes ? "auto" : "auto",
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={() => {
                    setShowRoutes(!showRoutes)
                    setSelectedRoute(null)
                  }}
                  variant={showRoutes ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full text-xs transition-all ${
                    showRoutes
                      ? "bg-white text-black hover:bg-white/90 h-8 px-4"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20 h-7 px-3"
                  }`}
                >
                  <Route className={`${showRoutes ? "h-3 w-3 mr-1.5" : "h-3 w-3 mr-1"}`} />
                  {showRoutes ? "Hide" : "Routes"}
                </Button>
                
                <AnimatePresence mode="popLayout">
                  {showRoutes && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <Button
                        onClick={() => setSelectedRoute(null)}
                        variant={selectedRoute === null ? "default" : "outline"}
                        size="sm"
                        className={`rounded-full text-xs h-8 ${
                          selectedRoute === null
                            ? "bg-white text-black hover:bg-white/90"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        All
                      </Button>
                      {demoRoutes.map((route, index) => (
                        <motion.div
                          key={route.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 0.2,
                            delay: index * 0.05 
                          }}
                        >
                          <Button
                            onClick={() => setSelectedRoute(route.id)}
                            variant={selectedRoute === route.id ? "default" : "outline"}
                            size="sm"
                            className={`rounded-full text-xs h-8 flex items-center gap-1.5 ${
                              selectedRoute === route.id
                                ? "bg-white text-black hover:bg-white/90"
                                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                            }`}
                          >
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: route.color }}
                            />
                            {route.name}
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/10">
                <span className="text-xs font-medium text-white/60 mr-1">Filter:</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all h-7 ${
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 h-7 ${
                      selectedCategory === category.id
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

      {/* Timeline - Always shown below map */}
      <div className="space-y-4">
        {Object.keys(pinsByDay)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((day) => {
            const dayPins = pinsByDay[parseInt(day)]
              .sort((a, b) => {
                if (!a.time || !b.time) return 0
                return a.time.localeCompare(b.time)
              })

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Day {day}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {dayPins.map((pin, index) => {
                    const category = pin.categories
                    return (
                      <motion.div
                        key={pin.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-start gap-2 p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                          selectedPin === pin.id ? "ring-2 ring-white/50 bg-white/10" : ""
                        }`}
                        onClick={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
                      >
                        <div
                          className="h-2.5 w-2.5 rounded-full flex-shrink-0 mt-0.5 border border-white/20"
                          style={{ backgroundColor: category?.color || "#3b82f6" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-medium text-white text-xs leading-tight line-clamp-1">
                              {pin.name}
                            </h4>
                            {pin.time && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                {pin.time}
                              </Badge>
                            )}
                          </div>
                          {pin.description && (
                            <p className="text-[10px] text-white/50 line-clamp-2">{pin.description}</p>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
      </div>

      {/* Add Pin Dialog */}
      <Dialog open={isAddPinDialogOpen} onOpenChange={setIsAddPinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Pin to Demo</DialogTitle>
            <DialogDescription>
              Add a custom location to the interactive demo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newPinName}
                onChange={(e) => setNewPinName(e.target.value)}
                placeholder="Location name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPinDescription}
                onChange={(e) => setNewPinDescription(e.target.value)}
                placeholder="Add details about this location..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newPinCategory} onValueChange={setNewPinCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {demoCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select value={newPinDay} onValueChange={setNewPinDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Day 1</SelectItem>
                    <SelectItem value="2">Day 2</SelectItem>
                    <SelectItem value="3">Day 3</SelectItem>
                    <SelectItem value="4">Day 4</SelectItem>
                    <SelectItem value="5">Day 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time (optional)</Label>
              <Input
                id="time"
                type="time"
                value={newPinTime}
                onChange={(e) => setNewPinTime(e.target.value)}
                placeholder="HH:MM"
              />
            </div>
            {selectedLocation && (
              <div className="text-sm text-muted-foreground">
                Location: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddPinDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddPin} disabled={!selectedLocation || !newPinName}>
              Add Pin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
