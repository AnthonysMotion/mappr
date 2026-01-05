import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground">
            Built by <a href="https://anthonythach.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">Anthony Thach</a>.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
            <a
              href="https://github.com/AnthonysMotion/mappr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
