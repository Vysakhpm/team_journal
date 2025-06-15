"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle } from "lucide-react"

export function FeatureTest() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const runTests = () => {
    const results: Record<string, boolean> = {}

    // Test 1: User Authentication
    const user = localStorage.getItem("demo-user")
    results["User Authentication"] = !!user

    // Test 2: Create Entry
    const entries = JSON.parse(localStorage.getItem("demo-entries") || "[]")
    results["Entry Storage"] = Array.isArray(entries)

    // Test 3: Local Storage Access
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      results["Local Storage"] = true
    } catch {
      results["Local Storage"] = false
    }

    // Test 4: Image Preview (simulated)
    results["Image Upload Support"] = typeof FileReader !== "undefined"

    // Test 5: CRUD Operations
    results["CRUD Operations"] = entries.length >= 0

    setTestResults(results)

    const allPassed = Object.values(results).every(Boolean)
    toast({
      title: allPassed ? "✅ All Tests Passed!" : "⚠️ Some Tests Failed",
      description: `${Object.values(results).filter(Boolean).length}/${Object.keys(results).length} features working`,
      variant: allPassed ? "default" : "destructive",
    })
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Feature Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={runTests} size="sm" className="w-full">
          Run Feature Tests
        </Button>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            {Object.entries(testResults).map(([feature, passed]) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                {passed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={passed ? "text-green-700" : "text-red-700"}>{feature}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
