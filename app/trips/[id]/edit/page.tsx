import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { EditTripForm } from "@/components/trips/edit-trip-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get the trip
  const { data: trip, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !trip) {
    notFound()
  }

  // Check if user has permission to edit (must be owner or editor)
  const { data: collaborator } = await supabase
    .from("collaborators")
    .select("role")
    .eq("trip_id", id)
    .eq("user_id", user.id)
    .single()

  const canEdit =
    trip.created_by === user.id ||
    (collaborator && (collaborator.role === "owner" || collaborator.role === "editor"))

  if (!canEdit) {
    redirect(`/trips/${id}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Edit Trip</h1>
          <EditTripForm trip={trip} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

