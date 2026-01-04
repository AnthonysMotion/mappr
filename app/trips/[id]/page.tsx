import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { TripView } from "@/components/trips/trip-view"
import { Navbar } from "@/components/layout/navbar"

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has access to this trip
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single()

  if (!trip) {
    notFound()
  }

  const { data: collaborator } = await supabase
    .from("collaborators")
    .select("role")
    .eq("trip_id", id)
    .eq("user_id", user.id)
    .single()

  if (!collaborator) {
    redirect("/trips")
  }

  const role = (collaborator as { role: "owner" | "editor" | "viewer" }).role

  // Fetch pins
  const { data: pins } = await supabase
    .from("pins")
    .select(`
      *,
      categories(*)
    `)
    .eq("trip_id", id)
    .order("created_at", { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("trip_id", id)
    .order("created_at", { ascending: true })

  // Fetch list items
  const { data: listItems } = await supabase
    .from("list_items")
    .select(`
      *,
      pins(id, name)
    `)
    .eq("trip_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <TripView
          trip={trip}
          pins={pins || []}
          categories={categories || []}
          listItems={listItems || []}
          userRole={role}
          currentUserId={user.id}
        />
      </main>
    </div>
  )
}
