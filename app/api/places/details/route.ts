import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const placeId = searchParams.get("placeId")

  if (!placeId) {
    return NextResponse.json({ error: "placeId parameter is required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
  }

  try {
    // Use Places Details API with specific fields
    // Note: Use formatted_phone_number instead of phone_number
    const fields = [
      "name",
      "formatted_address",
      "rating",
      "user_ratings_total",
      "opening_hours",
      "formatted_phone_number",
      "international_phone_number",
      "website",
      "photos",
      "geometry",
      "types",
      "price_level",
      "reviews",
    ].join(",")

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error("Google Places API request failed")
    }

    const data = await response.json()

    if (data.status === "REQUEST_DENIED") {
      console.error("Places API denied:", data.error_message)
      return NextResponse.json({ error: "API access denied. Check API key and billing." }, { status: 403 })
    }

    if (data.status === "INVALID_REQUEST") {
      console.error("Places API invalid request:", data.error_message)
      // This can happen if the place_id is from Geocoding API, not Places API
      return NextResponse.json({ 
        error: "Invalid place ID. This location may not have detailed place information available.",
        status: "INVALID_REQUEST"
      }, { status: 400 })
    }

    if (data.status !== "OK") {
      console.error("Places API error:", data.status, data.error_message)
      return NextResponse.json({ 
        error: data.error_message || `Google Places API error: ${data.status}`,
        status: data.status
      }, { status: 400 })
    }

    return NextResponse.json(data.result)
  } catch (error) {
    console.error("Error fetching place details:", error)
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 })
  }
}

