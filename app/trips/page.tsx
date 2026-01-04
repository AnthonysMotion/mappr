import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TripsList } from "@/components/trips/trips-list"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function TripsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get trips - RLS policies will automatically filter to trips user has access to
  // We query via collaborators join to ensure we only get accessible trips
  const { data: trips } = await supabase
    .from("trips")
    .select(`
      *
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 pt-24 overflow-hidden flex flex-col">
        <div className="container mx-auto py-8 px-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
              <h1 className="text-3xl font-bold">My Trips</h1>
              <p className="text-muted-foreground mt-1">
                Plan and collaborate on your travel adventures
              </p>
            </div>
            <Link href="/trips/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Trip
              </Button>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TripsList trips={trips || []} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
