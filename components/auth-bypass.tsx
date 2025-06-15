"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function AuthBypass() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const bypassAuth = () => {
    setLoading(true)

    // Store a fake user session in localStorage for testing
    const fakeUser = {
      id: "00000000-0000-0000-0000-000000000001",
      email: "test@demo.com",
      created_at: new Date().toISOString(),
    }

    localStorage.setItem("demo-user", JSON.stringify(fakeUser))

    toast({
      title: "Demo Mode Activated",
      description: "You can now test the journal features",
    })

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm text-orange-800">Development Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-orange-700 mb-3">
          If authentication is still not working, you can bypass it for testing:
        </p>
        <Button
          onClick={bypassAuth}
          disabled={loading}
          variant="outline"
          className="w-full border-orange-300 text-orange-800 hover:bg-orange-100"
        >
          {loading ? "Setting up..." : "Enter Demo Mode"}
        </Button>
      </CardContent>
    </Card>
  )
}
