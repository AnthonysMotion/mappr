import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng parameters are required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
  }

  try {
    // Use reverse geocoding to get address information
    // This is more reliable than Nearby Search which requires keyword/type
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    const response = await fetch(geocodeUrl)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Geocoding API response error:", response.status, errorText)
      throw new Error(`Geocoding API request failed: ${response.status}`)
    }

    const geocodeData = await response.json()
    
    if (geocodeData.status === "REQUEST_DENIED") {
      console.error("Geocoding API denied:", geocodeData.error_message)
      return NextResponse.json({ error: "API access denied. Check API key and billing." }, { status: 403 })
    }

    if (geocodeData.status !== "OK" || !geocodeData.results || geocodeData.results.length === 0) {
      return NextResponse.json([])
    }

    // Get the most specific result (usually the first one)
    const result = geocodeData.results[0]
    
    // Return address information that can be used to fetch place details
    return NextResponse.json([{
      place_id: result.place_id,
      formatted_address: result.formatted_address,
      geometry: result.geometry,
      types: result.types,
      address_components: result.address_components,
    }])
  } catch (error) {
    console.error("Error fetching nearby places:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to fetch nearby places" 
    }, { status: 500 })
  }
}

