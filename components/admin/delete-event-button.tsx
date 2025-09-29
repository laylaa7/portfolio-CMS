"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return

    setIsDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from("events").delete().eq("id", eventId)

    if (error) {
      alert("Error deleting event")
      setIsDeleting(false)
      return
    }

    router.refresh()
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
