"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"

// Popular icons for categories and pins
const POPULAR_ICONS = [
  "MapPin",
  "UtensilsCrossed",
  "Camera",
  "Hotel",
  "Plane",
  "Car",
  "ShoppingBag",
  "Coffee",
  "Beer",
  "Music",
  "Film",
  "Mountain",
  "Waves",
  "TreePine",
  "Building",
  "Landmark",
  "Heart",
  "Star",
  "Flag",
  "Gift",
  "Briefcase",
  "GraduationCap",
  "Dumbbell",
  "Gamepad2",
  "Palette",
  "BookOpen",
  "Theater",
  "Church",
  "Store",
  "Bank",
  "Hospital",
  "School",
  "Zap",
  "Sun",
  "Moon",
  "Cloud",
  "Droplet",
  "Flame",
  "Leaf",
  "Fish",
] as const

type IconName = keyof typeof LucideIcons

interface IconPickerProps {
  value: string | null
  onChange: (icon: string | null) => void
  label?: string
  className?: string
}

export function IconPicker({ value, onChange, label = "Icon", className }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Get all available icons from lucide-react
  const allIcons = Object.keys(LucideIcons).filter(
    (name) =>
      typeof LucideIcons[name as IconName] === "function" &&
      name[0] === name[0].toUpperCase() &&
      !name.startsWith("Icon")
  ) as IconName[]

  // Filter icons based on search query
  const filteredIcons = allIcons.filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get the icon component
  const SelectedIcon = value ? (LucideIcons[value as IconName] as any) : null

  const handleSelect = (iconName: string) => {
    onChange(iconName === value ? null : iconName)
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon className="h-4 w-4" />
              <span className="text-xs">{value}</span>
            </>
          ) : (
            <span>Select icon</span>
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Icon</DialogTitle>
            <DialogDescription>Choose an icon for this item</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="h-[400px] overflow-y-auto">
              <div className="grid grid-cols-8 gap-2 p-2">
                {/* Popular icons section */}
                {searchQuery === "" && (
                  <>
                    {POPULAR_ICONS.map((iconName) => {
                      const Icon = LucideIcons[iconName] as any
                      if (!Icon) return null
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => handleSelect(iconName)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all hover:bg-accent",
                            value === iconName
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          )}
                          title={iconName}
                        >
                          <Icon className="h-5 w-5" />
                        </button>
                      )
                    })}
                    <div className="col-span-8 my-4">
                      <div className="h-px bg-border" />
                    </div>
                  </>
                )}

                {/* All icons or filtered results */}
                {filteredIcons.map((iconName) => {
                  const Icon = LucideIcons[iconName] as any
                  if (!Icon) return null
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelect(iconName)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all hover:bg-accent",
                        value === iconName
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      )}
                      title={iconName}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

