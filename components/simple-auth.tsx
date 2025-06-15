"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function SimpleAuth() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const enterDemoMode = () => {
    setLoading(true)

    // Create a demo user session
    const demoUser = {
      id: "demo-user-123",
      email: "demo@teamjournal.com",
      created_at: new Date().toISOString(),
    }

    // Store in localStorage for demo purposes
    localStorage.setItem("demo-user", JSON.stringify(demoUser))
    localStorage.setItem(
      "demo-entries",
      JSON.stringify([
        {
          id: "demo-1",
          user_id: "demo-user-123",
          title: "Welcome to Team Journal!",
          content:
            "This is your first journal entry. You can create, edit, and delete entries. Try adding an image to make it more personal!",
          image_url: null,
          created_at: new Date().toISOString(),
        },
        {
          id: "demo-2",
          user_id: "demo-user-123",
          title: "Getting Started",
          content:
            "Here are some tips:\n\n• Click 'New Entry' to create a journal entry\n• Add images to make your entries more memorable\n• Edit or delete entries using the buttons on each card\n• Your data is private and secure",
          image_url: null,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ]),
    )

    toast({
      title: "Demo Mode Activated!",
      description: "You can now test all journal features",
    })

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <Card className="mt-4 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-sm text-green-800">Quick Start</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-green-700 mb-3">
          Skip authentication issues and test the journal features immediately:
        </p>
        <Button
          onClick={enterDemoMode}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? "Setting up..." : "🚀 Start Demo Mode"}
        </Button>
      </CardContent>
    </Card>
  )
}
