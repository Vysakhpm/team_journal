"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function WorkingAuth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleQuickStart = () => {
    setLoading(true)

    // Create a working user session
    const user = {
      id: `user-${Date.now()}`,
      email: email || "user@teamjournal.com",
      created_at: new Date().toISOString(),
    }

    // Store user session
    localStorage.setItem("demo-user", JSON.stringify(user))

    // Create some sample entries
    const sampleEntries = [
      {
        id: "entry-1",
        user_id: user.id,
        title: "Welcome to Your Journal!",
        content:
          "This is your first journal entry. You can create, edit, and delete entries. The app is fully functional in demo mode!",
        image_url: null,
        created_at: new Date().toISOString(),
      },
      {
        id: "entry-2",
        user_id: user.id,
        title: "How to Use This App",
        content:
          "• Click 'New Entry' to create journal entries\n• Add images to make entries more memorable\n• Edit or delete entries using the buttons\n• All your data is saved locally in demo mode",
        image_url: null,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    localStorage.setItem("demo-entries", JSON.stringify(sampleEntries))

    toast({
      title: "🎉 Ready to Go!",
      description: `Welcome ${user.email}! Your journal is ready.`,
    })

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800 text-center">✨ Quick Start</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quick-email" className="text-blue-700">
            Email (optional)
          </Label>
          <Input
            id="quick-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-blue-300"
          />
        </div>

        <Button
          onClick={handleQuickStart}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}🚀 Start Journaling Now
        </Button>

        <p className="text-xs text-blue-600 text-center">
          Skip authentication issues - start using the journal immediately!
        </p>
      </CardContent>
    </Card>
  )
}
