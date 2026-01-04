import { Map, Users, List, Share2, Tag, Zap } from "lucide-react"

const features = [
  {
    icon: Map,
    title: "Interactive Map Pinning",
    description: "Drop pins on locations you want to visit. Organize them by categories and see your entire trip at a glance.",
  },
  {
    icon: Users,
    title: "Collaborative Planning",
    description: "Invite friends and family to your trip. Everyone can add pins, create lists, and contribute to the planning.",
  },
  {
    icon: List,
    title: "Custom Lists",
    description: "Create lists for anything - restaurants to try, stores to visit, activities to do, and things to see.",
  },
  {
    icon: Tag,
    title: "Custom Categories",
    description: "Organize your pins with custom categories. Color-code restaurants, hotels, attractions, and more.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "See changes as they happen. When a collaborator adds a pin or updates a list, you'll see it instantly.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your trips with collaborators via email. They'll get instant access to view and edit.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to Plan Together
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to make collaborative trip planning simple and fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

