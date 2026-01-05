"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { IconPicker } from "@/components/ui/icon-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
}

interface CategoryManagerProps {
  tripId: string
  categories: Category[]
  currentUserId: string
  onCategoryCreated?: (category: Category) => void
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
]

export function CategoryManager({
  tripId,
  categories: initialCategories,
  currentUserId,
  onCategoryCreated,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState(DEFAULT_COLORS[0])
  const [icon, setIcon] = useState<string | null>(null)
  const supabase = createClient()

  // Update local state when initialCategories changes
  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = (await supabase
      .from("categories")
      .insert({
        trip_id: tripId,
        name,
        color,
        icon,
      } as any)
      .select()
      .single()) as any

    if (!error && data) {
      const newCategory = data as Category
      setCategories([...categories, newCategory])
      // Notify parent component
      if (onCategoryCreated) {
        onCategoryCreated(newCategory)
      }
      setName("")
      setColor(DEFAULT_COLORS[0])
      setIcon(null)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", categoryId)
    if (!error) {
      setCategories(categories.filter((c) => c.id !== categoryId))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No categories yet. Create one to organize your pins!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {category.icon && category.icon in LucideIcons ? (
                      (() => {
                        const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons] as any
                        return IconComponent ? (
                          <IconComponent
                            className="h-5 w-5"
                            style={{ color: category.color }}
                          />
                        ) : (
                          <div
                            className="h-5 w-5 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        )
                      })()
                    ) : (
                      <div
                        className="h-5 w-5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Create a category to organize your pins
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Name *</Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Restaurants, Attractions"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        color === c ? "border-foreground scale-110" : "border-transparent"
                      } transition-transform`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <IconPicker
                value={icon}
                onChange={setIcon}
                label="Icon (optional)"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
