"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AuthDebug() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setAuthState({
        session: session,
        user: user,
        error: error,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })
    } catch (error) {
      setAuthState({ error: error })
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from("entries").select("count", { count: "exact", head: true })
      alert(error ? `Database Error: ${error.message}` : "Database connection successful!")
    } catch (error) {
      alert(`Connection test failed: ${error}`)
    }
  }

  if (loading) return <div>Loading debug info...</div>

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs">Supabase URL:</span>
          <Badge variant={authState?.supabaseUrl ? "default" : "destructive"}>
            {authState?.supabaseUrl ? "✓" : "✗"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">Anon Key:</span>
          <Badge variant={authState?.hasAnonKey ? "default" : "destructive"}>{authState?.hasAnonKey ? "✓" : "✗"}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">User:</span>
          <Badge variant={authState?.user ? "default" : "secondary"}>
            {authState?.user ? "Signed In" : "Not Signed In"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">Session:</span>
          <Badge variant={authState?.session ? "default" : "secondary"}>{authState?.session ? "Active" : "None"}</Badge>
        </div>
        {authState?.error && <div className="text-xs text-red-600">Error: {authState.error.message}</div>}
        <Button size="sm" onClick={testConnection} className="mt-2">
          Test Database Connection
        </Button>
        <Button size="sm" onClick={checkAuthState} variant="outline">
          Refresh Debug Info
        </Button>
      </CardContent>
    </Card>
  )
}
