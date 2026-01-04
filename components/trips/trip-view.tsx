"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map"
import { ClickableMap } from "@/components/trips/clickable-map"
import { MapFlyTo } from "@/components/trips/map-fly-to"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PinDialog } from "@/components/pins/pin-dialog"
import { PinViewDialog } from "@/components/pins/pin-view-dialog"
import { PinEditDialog } from "@/components/pins/pin-edit-dialog"
import { LocationSearch } from "@/components/pins/location-search"
import { CategoryManager } from "@/components/categories/category-manager"
import { Calendar, MoreVertical, Edit, Tag, Trash2, Clock, ChevronUp, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Trip {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  label: string | null
  created_at: string
}

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
}

interface Pin {
  id: string
  name: string
  description: string | null
  latitude: number
  longitude: number
  category_id: string | null
  day: number | null
  time: string | null
  place_id: string | null
  place_data: any | null
  created_by: string
  categories: Category | null
}

interface TripViewProps {
  trip: Trip
  pins: Pin[]
  categories: Category[]
  userRole: "owner" | "editor" | "viewer"
  currentUserId: string
}

export function TripView({
  trip,
  pins: initialPins,
  categories: initialCategories,
  userRole,
  currentUserId,
}: TripViewProps) {
  const [pins, setPins] = useState<Pin[]>(initialPins)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false)
  const [isPinViewDialogOpen, setIsPinViewDialogOpen] = useState(false)
  const [isPinEditDialogOpen, setIsPinEditDialogOpen] = useState(false)
  const [editingPin, setEditingPin] = useState<Pin | null>(null)
  const [viewingPin, setViewingPin] = useState<Pin | null>(null)
  const [mapClickLocation, setMapClickLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [pinDialogInitialName, setPinDialogInitialName] = useState<string | undefined>(undefined)
  const [flyToLocation, setFlyToLocation] = useState<[number, number] | null>(null)
  const [timelineExpanded, setTimelineExpanded] = useState(false)
  const supabase = createClient()

  const canEdit = userRole === "owner" || userRole === "editor"

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel(`trip-${trip.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pins",
          filter: `trip_id=eq.${trip.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("pins")
            .select(`
              *,
              categories(*)
            `)
            .eq("trip_id", trip.id)
            .order("created_at", { ascending: false })
          if (data) setPins(data as Pin[])
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
          filter: `trip_id=eq.${trip.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("categories")
            .select("*")
            .eq("trip_id", trip.id)
            .order("created_at", { ascending: true })
          if (data) setCategories(data as Category[])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [trip.id, supabase])

  const handleMapClick = (e: { lngLat: { lng: number; lat: number } }) => {
    if (!canEdit) return
    setMapClickLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    setPinDialogInitialName(undefined)
    setIsPinDialogOpen(true)
  }

  const handlePinSave = async (pinData: {
    name: string
    description?: string
    categoryId?: string
    latitude: number
    longitude: number
    day?: number
    time?: string
    placeId?: string
    placeData?: any
  }) => {
    const { data, error } = (await supabase
      .from("pins")
      .insert({
        trip_id: trip.id,
        name: pinData.name,
        description: pinData.description || null,
        latitude: pinData.latitude,
        longitude: pinData.longitude,
        category_id: pinData.categoryId || null,
        day: pinData.day || null,
        time: pinData.time || null,
        place_id: pinData.placeId || null,
        place_data: pinData.placeData || null,
        created_by: currentUserId,
      } as any)
      .select(`
        *,
        categories(*)
      `)
      .single()) as any

    if (!error && data) {
      setPins([data as Pin, ...pins])
      setIsPinDialogOpen(false)
      setMapClickLocation(null)
      setPinDialogInitialName(undefined)
    }
  }

  const handleLocationSearch = (location: { name: string; lat: number; lng: number }) => {
    if (!canEdit) return
    setFlyToLocation([location.lng, location.lat])
    setMapClickLocation({ lat: location.lat, lng: location.lng })
    setPinDialogInitialName(location.name)
    setIsPinDialogOpen(true)
  }

  const handlePinDelete = async (pinId: string) => {
    const { error } = await supabase.from("pins").delete().eq("id", pinId)
    if (!error) {
      setPins(pins.filter((p) => p.id !== pinId))
    }
  }

  const handlePinUpdate = async (pinData: {
    id: string
    name: string
    description?: string
    categoryId?: string
    latitude: number
    longitude: number
    day?: number
    time?: string
    placeId?: string
    placeData?: any
  }) => {
    const { data, error } = (await (supabase
      .from("pins") as any)
      .update({
        name: pinData.name,
        description: pinData.description || null,
        category_id: pinData.categoryId || null,
        latitude: pinData.latitude,
        longitude: pinData.longitude,
        day: pinData.day || null,
        time: pinData.time || null,
        place_id: pinData.placeId || null,
        place_data: pinData.placeData || null,
      })
      .eq("id", pinData.id)
      .select(`
        *,
        categories(*)
      `)
      .single()) as any

    if (!error && data) {
      setPins(pins.map((p) => (p.id === pinData.id ? (data as Pin) : p)))
      setIsPinEditDialogOpen(false)
      setEditingPin(null)
      // Fly to updated location
      setFlyToLocation([pinData.longitude, pinData.latitude])
    }
  }

  const handleEditPin = (pin: Pin) => {
    setEditingPin(pin)
    setIsPinEditDialogOpen(true)
  }

  const handleChangeCategory = async (pin: Pin, categoryId: string | null) => {
    const { data, error } = (await (supabase
      .from("pins") as any)
      .update({
        category_id: categoryId,
      })
      .eq("id", pin.id)
      .select(`
        *,
        categories(*)
      `)
      .single()) as any

    if (!error && data) {
      setPins(pins.map((p) => (p.id === pin.id ? (data as Pin) : p)))
    }
  }


  // Calculate trip days
  const tripDays = (() => {
    if (!trip.start_date || !trip.end_date) return []
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
    const days: { day: number; date: Date; dateStr: string }[] = []
    let currentDate = new Date(start)
    let dayNum = 1
    
    while (currentDate <= end) {
      const dateStr = currentDate.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short' 
      })
      days.push({ 
        day: dayNum, 
        date: new Date(currentDate), 
        dateStr: dateStr
      })
      currentDate.setDate(currentDate.getDate() + 1)
      dayNum++
    }
    return days
  })()

  // Group pins by day and sort by time
  const pinsByDay = (() => {
    const grouped: Record<number, Pin[]> = {}
    pins.forEach((pin) => {
      if (pin.day) {
        if (!grouped[pin.day]) {
          grouped[pin.day] = []
        }
        grouped[pin.day].push(pin)
      }
    })
    // Sort each day's pins by time
    Object.keys(grouped).forEach((day) => {
      grouped[parseInt(day)].sort((a, b) => {
        if (!a.time && !b.time) return 0
        if (!a.time) return 1
        if (!b.time) return -1
        return a.time.localeCompare(b.time)
      })
    })
    return grouped
  })()

  // Calculate map center from pins
  const mapCenter: [number, number] =
    pins.length > 0
      ? [
          pins.reduce((sum, p) => sum + Number(p.longitude), 0) / pins.length,
          pins.reduce((sum, p) => sum + Number(p.latitude), 0) / pins.length,
        ]
      : [0, 0]

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <ClickableMap
            center={[mapCenter[0] || 0, mapCenter[1] || 0]}
            zoom={pins.length > 0 ? 10 : 2}
            onMapClick={canEdit ? handleMapClick : undefined}
          >
            <MapFlyTo
              center={flyToLocation}
              zoom={14}
              onComplete={() => setFlyToLocation(null)}
            />
            <MapControls showZoom showLocate />
            {pins.map((pin) => {
              const category = pin.categories
              const isSelected = selectedPin?.id === pin.id
              return (
                <MapMarker
                  key={pin.id}
                  longitude={Number(pin.longitude)}
                  latitude={Number(pin.latitude)}
                >
                  <MarkerContent>
                    <div
                      className={`h-4 w-4 rounded-full border-2 border-background cursor-pointer transition-all ${
                        isSelected ? "ring-2 ring-primary" : ""
                      }`}
                      style={{
                        backgroundColor: category?.color || "#3b82f6",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setViewingPin(pin)
                        setIsPinViewDialogOpen(true)
                      }}
                    />
                  </MarkerContent>
                  <MarkerPopup>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{pin.name}</CardTitle>
                        {pin.description && (
                          <CardDescription className="line-clamp-2">
                            {pin.description}
                          </CardDescription>
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
                      </CardHeader>
                    </Card>
                  </MarkerPopup>
                </MapMarker>
              )
            })}
          </ClickableMap>
          {canEdit && (
            <div className="absolute top-4 left-4 z-10 w-96 max-w-[calc(100%-2rem)]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Search for a location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LocationSearch
                    onLocationSelect={handleLocationSearch}
                    disabled={!canEdit}
                  />
                  <p className="text-xs text-muted-foreground">
                    Or click on the map to add a pin
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="w-96 border-l bg-card overflow-y-auto">
          <Tabs defaultValue="pins" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="pins" className="flex-1">
                Pins ({pins.length})
              </TabsTrigger>
              {canEdit && (
                <TabsTrigger value="categories" className="flex-1">
                  Categories
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="pins" className="flex-1 overflow-y-auto p-4 space-y-2 m-0">
              {pins.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No pins yet. {canEdit && "Click on the map to add one!"}
                  </CardContent>
                </Card>
              ) : (
                pins.map((pin) => {
                  const category = pin.categories
                  return (
                    <Card
                      key={pin.id}
                      className="transition-colors hover:bg-accent/5"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => setSelectedPin(pin)}
                          >
                            <CardTitle className="text-base">{pin.name}</CardTitle>
                            {pin.description && (
                              <CardDescription className="line-clamp-2 mt-1">
                                {pin.description}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {category && (
                              <Badge
                                style={{
                                  backgroundColor: category.color,
                                  color: "white",
                                }}
                              >
                                {category.name}
                              </Badge>
                            )}
                            {canEdit && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditPin(pin)
                                  }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Pin
                                  </DropdownMenuItem>
                                            {categories.length > 0 && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation()
                                        handleChangeCategory(pin, null)
                                      }}>
                                        <Tag className="h-4 w-4 mr-2" />
                                        Remove Category
                                      </DropdownMenuItem>
                                      {categories.map((cat) => (
                                        <DropdownMenuItem
                                          key={cat.id}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleChangeCategory(pin, cat.id)
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div
                                              className="h-2 w-2 rounded-full"
                                              style={{ backgroundColor: cat.color }}
                                            />
                                            {cat.name}
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handlePinDelete(pin.id)
                                    }}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Pin
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })
              )}
            </TabsContent>
            {canEdit && (
              <TabsContent value="categories" className="flex-1 overflow-y-auto p-4 m-0">
                <CategoryManager
                  tripId={trip.id}
                  categories={categories}
                  currentUserId={currentUserId}
                  onCategoryCreated={(category) => {
                    setCategories([...categories, category])
                  }}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Timeline Bottom Bar */}
      <div className={`border-t bg-card transition-all duration-300 ${timelineExpanded ? 'h-64' : 'h-12'}`}>
        <div 
          className="flex items-center justify-between h-12 px-4 border-b cursor-pointer hover:bg-accent/5 transition-colors"
          onClick={() => setTimelineExpanded(!timelineExpanded)}
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Timeline</span>
            {trip.start_date && trip.end_date && tripDays.length > 0 && (
              <span className="text-xs text-muted-foreground">
                ({tripDays.length} {tripDays.length === 1 ? 'day' : 'days'})
              </span>
            )}
          </div>
          <div className="flex items-center">
            {timelineExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </div>
        </div>
        {timelineExpanded && (
          <div className="h-[calc(16rem-3rem)] overflow-x-auto overflow-y-hidden p-4">
            {!trip.start_date || !trip.end_date ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <p className="mb-2">No trip dates set.</p>
                  <p className="text-xs">Set start and end dates for your trip to see the timeline.</p>
                </div>
              </div>
            ) : tripDays.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Invalid trip dates. Please check your trip settings.
              </div>
            ) : (
              <div className="flex gap-4 h-full">
                {tripDays.map((tripDay) => {
                  const dayPins = pinsByDay[tripDay.day] || []
                  return (
                    <Card key={tripDay.day} className="min-w-80 shrink-0 h-full flex flex-col">
                      <CardHeader className="pb-2 shrink-0">
                        <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
                          <Calendar className="h-4 w-4" />
                          <span>Day {tripDay.day}</span>
                          <Badge variant="secondary" className="text-xs">
                            {tripDay.dateStr}
                          </Badge>
                          {dayPins.length > 0 && (
                            <span className="text-xs font-normal text-muted-foreground">
                              ({dayPins.length})
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-x-auto overflow-y-hidden">
                        {dayPins.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2">
                            No pins scheduled. {canEdit && "Add pins and assign them to this day."}
                          </p>
                        ) : (
                          <div className="flex gap-2 h-full">
                            {dayPins.map((pin) => {
                              const category = pin.categories
                              const isSelected = selectedPin?.id === pin.id
                              return (
                                <Card
                                  key={pin.id}
                                  className={`transition-colors cursor-pointer shrink-0 w-48 ${
                                    isSelected ? "ring-2 ring-primary" : "hover:bg-accent/5"
                                  }`}
                                  onClick={() => setSelectedPin(isSelected ? null : pin)}
                                >
                                  <CardContent className="p-2">
                                    <div className="flex items-start gap-2">
                                      <div
                                        className="h-2 w-2 rounded-full flex-shrink-0 mt-1 border border-border"
                                        style={{ backgroundColor: category?.color || "#3b82f6" }}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                          {pin.time && (
                                            <span className="text-xs font-medium text-muted-foreground">
                                              {pin.time}
                                            </span>
                                          )}
                                          {category && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs px-1 py-0"
                                              style={{
                                                borderColor: category.color,
                                                color: category.color,
                                              }}
                                            >
                                              {category.name}
                                            </Badge>
                                          )}
                                        </div>
                                        <h4 className="font-medium text-xs leading-tight line-clamp-1">
                                          {pin.name}
                                        </h4>
                                        {pin.description && (
                                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                            {pin.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
                {pins.filter((p) => !p.day).length > 0 && (
                  <Card className="min-w-80 shrink-0 h-full flex flex-col">
                    <CardHeader className="pb-2 shrink-0">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Unscheduled ({pins.filter((p) => !p.day).length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-x-auto overflow-y-hidden">
                      <div className="flex gap-2 h-full">
                        {pins
                          .filter((p) => !p.day)
                          .map((pin) => {
                            const category = pin.categories
                            const isSelected = selectedPin?.id === pin.id
                            return (
                              <Card
                                key={pin.id}
                                className={`transition-colors cursor-pointer shrink-0 w-48 ${
                                  isSelected ? "ring-2 ring-primary" : "hover:bg-accent/5"
                                }`}
                                onClick={() => setSelectedPin(isSelected ? null : pin)}
                              >
                                <CardContent className="p-2">
                                  <div className="flex items-start gap-2">
                                    <div
                                      className="h-2 w-2 rounded-full flex-shrink-0 mt-1 border border-border"
                                      style={{ backgroundColor: category?.color || "#3b82f6" }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-xs leading-tight line-clamp-1">
                                        {pin.name}
                                      </h4>
                                      {pin.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                          {pin.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <PinDialog
        open={isPinDialogOpen}
        onOpenChange={(open) => {
          setIsPinDialogOpen(open)
          if (!open) {
            setMapClickLocation(null)
            setPinDialogInitialName(undefined)
          }
        }}
        onSave={handlePinSave}
        categories={categories}
        initialLocation={mapClickLocation}
        initialName={pinDialogInitialName}
      />
      <PinViewDialog
        open={isPinViewDialogOpen}
        onOpenChange={setIsPinViewDialogOpen}
        pin={viewingPin}
        onDelete={handlePinDelete}
        canEdit={canEdit}
      />
      <PinEditDialog
        open={isPinEditDialogOpen}
        onOpenChange={(open) => {
          setIsPinEditDialogOpen(open)
          if (!open) {
            setEditingPin(null)
          }
        }}
        pin={editingPin}
        categories={categories}
        onSave={handlePinUpdate}
        tripStartDate={trip.start_date}
        tripEndDate={trip.end_date}
      />
    </div>
  )
}
