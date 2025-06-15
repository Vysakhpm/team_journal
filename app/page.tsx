"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ImageIcon, Lock, Users } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Team Journal</h1>
          <p className="text-xl text-gray-600 mb-8">Your personal space for thoughts, memories, and moments</p>
          <Button size="lg" onClick={() => router.push("/auth")} className="text-lg px-8 py-3">
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Personal Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Write and organize your thoughts in a beautiful, private journal</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <ImageIcon className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Image Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Add photos to your entries to capture memories visually</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Lock className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Your entries are protected with advanced security and encryption</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Each user has their own private space with secure authentication</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
