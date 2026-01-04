import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { EditTripForm } from "@/components/trips/edit-trip-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Database } from "@/lib/supabase/database.types"

type Trip = Database["public"]["Tables"]["trips"]["Row"]
type CollaboratorRole = { role: "owner" | "editor" | "viewer" }

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

  // Type assertion to help TypeScript
  const typedTrip = trip as Trip

  // Check if user has permission to edit (must be owner or editor)
  const { data: collaborator } = await supabase
    .from("collaborators")
    .select("role")
    .eq("trip_id", id)
    .eq("user_id", user.id)
    .single()

  const typedCollaborator = collaborator as CollaboratorRole | null

  const canEdit =
    typedTrip.created_by === user.id ||
    (typedCollaborator && (typedCollaborator.role === "owner" || typedCollaborator.role === "editor"))

  if (!canEdit) {
    redirect(`/trips/${id}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Edit Trip</h1>
          <EditTripForm trip={typedTrip} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

