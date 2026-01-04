"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, CheckCircle2, Circle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Pin {
  id: string
  name: string
}

interface ListItem {
  id: string
  list_type: "stores" | "things_to_do" | "things_to_see"
  name: string
  description: string | null
  pin_id: string | null
  completed: boolean
  pins: { id: string; name: string } | null
}

interface TripListsProps {
  tripId: string
  listItems: ListItem[]
  pins: Pin[]
  canEdit: boolean
  currentUserId: string
}

const LIST_TYPES = [
  { value: "stores", label: "Stores to Visit" },
  { value: "things_to_do", label: "Things to Do" },
  { value: "things_to_see", label: "Things to See" },
] as const

export function TripLists({
  tripId,
  listItems: initialListItems,
  pins,
  canEdit,
  currentUserId,
}: TripListsProps) {
  const [listItems, setListItems] = useState<ListItem[]>(initialListItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentListType, setCurrentListType] = useState<"stores" | "things_to_do" | "things_to_see">("stores")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [pinId, setPinId] = useState<string>("")
  const supabase = createClient()

  const getItemsByType = (type: typeof currentListType) => {
    return listItems.filter((item) => item.list_type === type)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = (await supabase
      .from("list_items")
      .insert({
        trip_id: tripId,
        list_type: currentListType,
        name,
        description: description || null,
        pin_id: pinId || null,
        created_by: currentUserId,
      } as any)
      .select(`
        *,
        pins(id, name)
      `)
      .single()) as any

    if (!error && data) {
      setListItems([data as ListItem, ...listItems])
      setName("")
      setDescription("")
      setPinId("")
      setIsDialogOpen(false)
    }
  }

  const handleToggleComplete = async (itemId: string, completed: boolean) => {
    const { error } = (await (supabase.from("list_items") as any)
      .update({ completed: !completed })
      .eq("id", itemId)) as any

    if (!error) {
      setListItems(
        listItems.map((item) =>
          item.id === itemId ? { ...item, completed: !completed } : item
        )
      )
    }
  }

  const handleDelete = async (itemId: string) => {
    const { error } = await supabase.from("list_items").delete().eq("id", itemId)
    if (!error) {
      setListItems(listItems.filter((item) => item.id !== itemId))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Lists</h3>
        {canEdit && (
          <Button onClick={() => setIsDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        )}
      </div>

      <Tabs defaultValue="stores" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {LIST_TYPES.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LIST_TYPES.map((type) => {
          const items = getItemsByType(type.value)
          return (
            <TabsContent key={type.value} value={type.value} className="space-y-2">
              {items.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No items yet. {canEdit && "Add one to get started!"}
                  </CardContent>
                </Card>
              ) : (
                items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {canEdit && (
                          <button
                            onClick={() => handleToggleComplete(item.id, item.completed)}
                            className="mt-0.5"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4
                                className={`font-medium ${
                                  item.completed ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              )}
                              {item.pins && (
                                <Badge variant="outline" className="mt-2">
                                  📍 {item.pins.name}
                                </Badge>
                              )}
                            </div>
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      {canEdit && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add List Item</DialogTitle>
              <DialogDescription>
                Add an item to your trip lists
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="list-type">List Type *</Label>
                  <Select
                    value={currentListType}
                    onValueChange={(value: typeof currentListType) => setCurrentListType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LIST_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-name">Name *</Label>
                  <Input
                    id="item-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details..."
                    rows={3}
                  />
                </div>
                {pins.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="pin-link">Link to Pin (Optional)</Label>
                    <Select value={pinId} onValueChange={setPinId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {pins.map((pin) => (
                          <SelectItem key={pin.id} value={pin.id}>
                            {pin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
