"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Copy, Check } from "lucide-react"

interface ShareTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tripId: string
  userRole: "owner" | "editor" | "viewer"
}

export function ShareTripDialog({
  open,
  onOpenChange,
  tripId,
  userRole,
}: ShareTripDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"editor" | "viewer">("editor")
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  const shareLink = typeof window !== "undefined" ? `${window.location.origin}/trips/${tripId}` : ""

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userRole !== "owner") return

    // Get user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    // Note: This requires admin access. For a real app, you'd need a different approach
    // For now, we'll just show a message that the user needs to sign up first

    if (userError) {
      alert("Unable to add collaborator. Please make sure the user has signed up first.")
      return
    }

    // For production, you'd need to:
    // 1. Create a user lookup table or API endpoint
    // 2. Find the user by email
    // 3. Add them as a collaborator

    alert("Collaborator feature requires user to be registered. Share the trip link instead.")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Trip</DialogTitle>
          <DialogDescription>
            Share this trip with others or add collaborators
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyLink}
                size="icon"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Anyone with this link can view the trip (if they're logged in)
            </p>
          </div>

          {/* Add Collaborator */}
          {userRole === "owner" && (
            <form onSubmit={handleAddCollaborator} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collaborator-email">Add Collaborator by Email</Label>
                <Input
                  id="collaborator-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collaborator-role">Role</Label>
                <Select value={role} onValueChange={(value: "editor" | "viewer") => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor - Can add/edit pins and lists</SelectItem>
                    <SelectItem value="viewer">Viewer - Can only view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Add Collaborator
              </Button>
              <p className="text-xs text-muted-foreground">
                Note: The user must have an account. Share the link above for now.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
