"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string // Format: "HH:MM" (24-hour) or empty
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function TimePicker({ value, onChange, disabled, className }: TimePickerProps) {
  // Parse 24-hour time to 12-hour format
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hours: 12, minutes: 0, ampm: "AM" }
    
    const [hours, minutes] = timeStr.split(":").map(Number)
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    const ampm = hours < 12 ? "AM" : "PM"
    
    return { hours: hour12, minutes: minutes || 0, ampm }
  }

  // Convert 12-hour to 24-hour format
  const formatTime = (hours: number, minutes: number, ampm: string) => {
    let hour24 = hours
    if (ampm === "PM" && hours !== 12) hour24 = hours + 12
    if (ampm === "AM" && hours === 12) hour24 = 0
    
    return `${hour24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  const initialTime = parseTime(value)
  const [hours, setHours] = useState(initialTime.hours)
  const [minutes, setMinutes] = useState(initialTime.minutes)
  const [ampm, setAmpm] = useState<"AM" | "PM">(initialTime.ampm)
  const [hoursInput, setHoursInput] = useState(initialTime.hours.toString().padStart(2, "0"))
  const [minutesInput, setMinutesInput] = useState(initialTime.minutes.toString().padStart(2, "0"))
  
  const hoursInputRef = useRef<HTMLInputElement>(null)
  const minutesInputRef = useRef<HTMLInputElement>(null)

  // Update state when value prop changes
  useEffect(() => {
    const parsed = parseTime(value)
    setHours(parsed.hours)
    setMinutes(parsed.minutes)
    setAmpm(parsed.ampm)
    setHoursInput(parsed.hours.toString().padStart(2, "0"))
    setMinutesInput(parsed.minutes.toString().padStart(2, "0"))
  }, [value])

  const updateTime = (newHours: number, newMinutes: number, newAmpm: "AM" | "PM", updateInputs = true) => {
    setHours(newHours)
    setMinutes(newMinutes)
    setAmpm(newAmpm)
    if (updateInputs) {
      setHoursInput(newHours.toString().padStart(2, "0"))
      setMinutesInput(newMinutes.toString().padStart(2, "0"))
    }
    onChange(formatTime(newHours, newMinutes, newAmpm))
  }

  const incrementHours = () => {
    const newHours = hours === 12 ? 1 : hours + 1
    updateTime(newHours, minutes, ampm)
  }

  const decrementHours = () => {
    const newHours = hours === 1 ? 12 : hours - 1
    updateTime(newHours, minutes, ampm)
  }

  const incrementMinutes = () => {
    const newMinutes = minutes === 59 ? 0 : minutes + 1
    updateTime(hours, newMinutes, ampm)
  }

  const decrementMinutes = () => {
    const newMinutes = minutes === 0 ? 59 : minutes - 1
    updateTime(hours, newMinutes, ampm)
  }

  const toggleAmpm = () => {
    updateTime(hours, minutes, ampm === "AM" ? "PM" : "AM")
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "") // Only numbers
    if (val === "") {
      setHoursInput("")
      return
    }
    
    const num = parseInt(val, 10)
    if (num >= 1 && num <= 12) {
      // Allow single digit while typing, pad on blur
      setHoursInput(val)
      updateTime(num, minutes, ampm, false) // Don't update input, we're handling it
    } else if (num > 12) {
      // Auto-correct to 12 if user types something higher
      setHoursInput("12")
      updateTime(12, minutes, ampm)
    }
  }

  const handleHoursBlur = () => {
    // Ensure valid value on blur
    if (hoursInput === "" || parseInt(hoursInput, 10) < 1) {
      const defaultHours = 12
      setHoursInput(defaultHours.toString().padStart(2, "0"))
      updateTime(defaultHours, minutes, ampm)
    } else {
      const num = parseInt(hoursInput, 10)
      if (num > 12) {
        setHoursInput("12")
        updateTime(12, minutes, ampm)
      } else {
        setHoursInput(num.toString().padStart(2, "0"))
      }
    }
  }

  const handleHoursKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      incrementHours()
      hoursInputRef.current?.select()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      decrementHours()
      hoursInputRef.current?.select()
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "") // Only numbers
    if (val === "") {
      setMinutesInput("")
      return
    }
    
    const num = parseInt(val, 10)
    if (num >= 0 && num <= 59) {
      // Allow single digit while typing, pad on blur
      setMinutesInput(val)
      updateTime(hours, num, ampm, false) // Don't update input, we're handling it
    } else if (num > 59) {
      // Auto-correct to 59 if user types something higher
      setMinutesInput("59")
      updateTime(hours, 59, ampm)
    }
  }

  const handleMinutesBlur = () => {
    // Ensure valid value on blur
    if (minutesInput === "") {
      const defaultMinutes = 0
      setMinutesInput(defaultMinutes.toString().padStart(2, "0"))
      updateTime(hours, defaultMinutes, ampm)
    } else {
      const num = parseInt(minutesInput, 10)
      if (num > 59) {
        setMinutesInput("59")
        updateTime(hours, 59, ampm)
      } else {
        setMinutesInput(num.toString().padStart(2, "0"))
      }
    }
  }

  const handleMinutesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      incrementMinutes()
      minutesInputRef.current?.select()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      decrementMinutes()
      minutesInputRef.current?.select()
    }
  }

  const handleAmpmKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "a" || e.key === "A") {
      e.preventDefault()
      if (ampm !== "AM") updateTime(hours, minutes, "AM")
    } else if (e.key === "p" || e.key === "P") {
      e.preventDefault()
      if (ampm !== "PM") updateTime(hours, minutes, "PM")
    }
  }

  if (disabled) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <span className="text-sm">Select day first</span>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Hours */}
      <div className="flex flex-col items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-8 rounded-b-none"
          onClick={incrementHours}
          disabled={disabled}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <input
          ref={hoursInputRef}
          type="text"
          inputMode="numeric"
          value={hoursInput}
          onChange={handleHoursChange}
          onBlur={handleHoursBlur}
          onKeyDown={handleHoursKeyDown}
          onFocus={(e) => e.target.select()}
          className="w-12 h-10 border border-border bg-background text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          maxLength={2}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-8 rounded-t-none"
          onClick={decrementHours}
          disabled={disabled}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <span className="text-xl font-bold mt-4">:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-8 rounded-b-none"
          onClick={incrementMinutes}
          disabled={disabled}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <input
          ref={minutesInputRef}
          type="text"
          inputMode="numeric"
          value={minutesInput}
          onChange={handleMinutesChange}
          onBlur={handleMinutesBlur}
          onKeyDown={handleMinutesKeyDown}
          onFocus={(e) => e.target.select()}
          className="w-12 h-10 border border-border bg-background text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          maxLength={2}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-8 rounded-t-none"
          onClick={decrementMinutes}
          disabled={disabled}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* AM/PM */}
      <div className="flex flex-col items-center ml-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-8 rounded-b-none"
          onClick={toggleAmpm}
          disabled={disabled}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <button
          type="button"
          onClick={toggleAmpm}
          onKeyDown={handleAmpmKeyDown}
          className="w-12 h-10 border border-border bg-background text-sm font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 cursor-pointer"
          disabled={disabled}
        >
          {ampm}
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-8 rounded-t-none"
          onClick={toggleAmpm}
          disabled={disabled}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

