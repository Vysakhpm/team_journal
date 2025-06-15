import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { JournalDashboard } from "@/components/journal-dashboard"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return <JournalDashboard />
}
