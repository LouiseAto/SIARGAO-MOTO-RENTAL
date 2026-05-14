"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StatusDropdownProps {
  recordId: string
  currentStatus: "paid" | "pending"
  onStatusChange: (newStatus: "paid" | "pending") => Promise<void>
  disabled?: boolean
}

export function StatusDropdown({
  recordId,
  currentStatus,
  onStatusChange,
  disabled = false,
}: StatusDropdownProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: "paid" | "pending") => {
    if (newStatus === currentStatus || isLoading || disabled) return

    setIsLoading(true)
    try {
      await onStatusChange(newStatus)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled || isLoading}>
        <div className="inline-flex items-center gap-2">
          <Badge
            variant={currentStatus === "paid" ? "default" : "secondary"}
            className="capitalize cursor-pointer hover:opacity-80 transition-opacity"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                {currentStatus}
              </>
            ) : (
              currentStatus
            )}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusChange("paid")}
          className="cursor-pointer"
        >
          {currentStatus === "paid" && <Check className="mr-2 h-4 w-4" />}
          <span className={currentStatus !== "paid" ? "ml-6" : ""}>Paid</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("pending")}
          className="cursor-pointer"
        >
          {currentStatus === "pending" && <Check className="mr-2 h-4 w-4" />}
          <span className={currentStatus !== "pending" ? "ml-6" : ""}>
            Pending
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
