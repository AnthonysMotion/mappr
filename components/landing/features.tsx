import { Map, Users, List, Share2, Tag, Zap, Clock, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Map,
    title: "Interactive Map Pinning",
    description: "Drop pins on locations you want to visit. Organize them by categories and see your entire trip at a glance.",
    color: "blue",
  },
  {
    icon: Users,
    title: "Collaborative Planning",
    description: "Invite friends and family to your trip. Everyone can add pins, create lists, and contribute to the planning.",
    color: "green",
  },
  {
    icon: List,
    title: "Custom Lists",
    description: "Create lists for anything - restaurants to try, stores to visit, activities to do, and things to see.",
    color: "purple",
  },
  {
    icon: Tag,
    title: "Custom Categories",
    description: "Organize your pins with custom categories. Color-code restaurants, hotels, attractions, and more.",
    color: "red",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "See changes as they happen. When a collaborator adds a pin or updates a list, you'll see it instantly.",
    color: "yellow",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your trips with collaborators via email. They'll get instant access to view and edit.",
    color: "orange",
  },
  {
    icon: Clock,
    title: "Timeline Planning",
    description: "Build day-by-day itineraries and timelines to keep everyone on track during your trip.",
    color: "indigo",
  },
  {
    icon: Search,
    title: "Location Search",
    description: "Search for addresses and locations instantly. Auto-add pins with coordinates and details.",
    color: "pink",
  },
]

const colorClasses = {
  blue: "bg-blue-500/20 text-blue-400",
  green: "bg-green-500/20 text-green-400",
  purple: "bg-purple-500/20 text-purple-400",
  red: "bg-red-500/20 text-red-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  orange: "bg-orange-500/20 text-orange-400",
  indigo: "bg-indigo-500/20 text-indigo-400",
  pink: "bg-pink-500/20 text-pink-400",
}

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Everything you need
          </h2>
          <p className="text-xl text-white/60">
            Powerful features designed to make collaborative trip planning simple and fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colorClass = colorClasses[feature.color as keyof typeof colorClasses]
            return (
              <Card
                key={index}
                className="group bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
