import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-12 md:p-16 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Ready to plan your next adventure?
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Join travelers who are already planning their perfect trips together. Get started for free today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/login">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg h-auto">
                  Start Planning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-white/40">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
