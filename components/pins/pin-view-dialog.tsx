"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
}

interface Pin {
  id: string
  name: string
  description: string | null
  latitude: number
  longitude: number
  category_id: string | null
  categories: Category | null
}

interface PinViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pin: Pin | null
  onDelete: (pinId: string) => void
  canEdit: boolean
}

export function PinViewDialog({
  open,
  onOpenChange,
  pin,
  onDelete,
  canEdit,
}: PinViewDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    if (pin) {
      onDelete(pin.id)
      setShowDeleteConfirm(false)
      onOpenChange(false)
    }
  }

  if (!pin) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pin.name}</DialogTitle>
            <DialogDescription>
              Pin details and location information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {pin.description && (
              <div>
                <p className="text-sm text-muted-foreground">{pin.description}</p>
              </div>
            )}
            {pin.categories && (
              <div>
                <Badge
                  style={{
                    backgroundColor: pin.categories.color,
                    color: "white",
                  }}
                >
                  {pin.categories.name}
                </Badge>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Latitude: {Number(pin.latitude).toFixed(6)}</p>
              <p>Longitude: {Number(pin.longitude).toFixed(6)}</p>
            </div>
          </div>
          <DialogFooter>
            {canEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Pin
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pin?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{pin.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

