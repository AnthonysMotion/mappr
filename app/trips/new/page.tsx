import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewTripForm } from "@/components/trips/new-trip-form"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default async function NewTripPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Create New Trip</h1>
          <NewTripForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
