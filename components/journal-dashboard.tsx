"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { JournalEntry } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, LogOut, Calendar, User, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function JournalDashboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = () => {
    try {
      // Load entries from localStorage (works for both demo and regular users)
      const storedEntries = localStorage.getItem("demo-entries")
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries)
        setEntries(parsedEntries)
        console.log("Loaded entries:", parsedEntries)
      } else {
        console.log("No entries found, starting with empty array")
        setEntries([])
      }
    } catch (error) {
      console.error("Error loading entries:", error)
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  const saveEntries = (newEntries: JournalEntry[]) => {
    try {
      localStorage.setItem("demo-entries", JSON.stringify(newEntries))
      setEntries(newEntries)
      console.log("Saved entries:", newEntries)
    } catch (error) {
      console.error("Error saving entries:", error)
      toast({
        title: "Save Error",
        description: "Failed to save entries to local storage",
        variant: "destructive",
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      console.log("Image selected:", file.name, file.size)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    // Reset file input
    const fileInput = document.getElementById("image") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your entry",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    console.log("Submitting entry:", { title, content, hasImage: !!imageFile })

    try {
      const currentUser = JSON.parse(localStorage.getItem("demo-user") || '{"id":"unknown","email":"user@example.com"}')

      // Handle image upload (simulate for demo)
      let imageUrl = null
      if (imageFile) {
        // In demo mode, we'll use the preview URL as the image URL
        imageUrl = imagePreview
        console.log("Image will be saved with entry")
      }

      if (editingEntry) {
        // Update existing entry
        console.log("Updating entry:", editingEntry.id)
        const updatedEntries = entries.map((entry) =>
          entry.id === editingEntry.id
            ? {
                ...entry,
                title: title.trim(),
                content: content.trim() || null,
                image_url: imageUrl || entry.image_url,
              }
            : entry,
        )
        saveEntries(updatedEntries)

        toast({
          title: "✅ Entry Updated",
          description: "Your journal entry has been updated successfully",
        })
      } else {
        // Create new entry
        console.log("Creating new entry")
        const newEntry: JournalEntry = {
          id: `entry-${Date.now()}`,
          user_id: currentUser.id,
          title: title.trim(),
          content: content.trim() || null,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        }

        const updatedEntries = [newEntry, ...entries]
        saveEntries(updatedEntries)

        toast({
          title: "🎉 Entry Created",
          description: "Your new journal entry has been saved",
        })
      }

      // Reset form
      setTitle("")
      setContent("")
      setImageFile(null)
      setImagePreview(null)
      setEditingEntry(null)
      setIsCreateDialogOpen(false)

      console.log("Entry saved successfully")
    } catch (error) {
      console.error("Error saving entry:", error)
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (entry: JournalEntry) => {
    console.log("Editing entry:", entry)
    setEditingEntry(entry)
    setTitle(entry.title)
    setContent(entry.content || "")
    setImageFile(null)
    setImagePreview(entry.image_url)
    setIsCreateDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    console.log("Deleting entry:", id)

    if (!confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      return
    }

    try {
      const updatedEntries = entries.filter((entry) => entry.id !== id)
      saveEntries(updatedEntries)

      toast({
        title: "🗑️ Entry Deleted",
        description: "Your journal entry has been removed",
      })

      console.log("Entry deleted successfully")
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = () => {
    console.log("Signing out user")
    localStorage.removeItem("demo-user")
    localStorage.removeItem("demo-entries")
    toast({
      title: "👋 Signed Out",
      description: "You have been signed out successfully",
    })
    router.push("/")
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setImageFile(null)
    setImagePreview(null)
    setEditingEntry(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    )
  }

  const currentUser = JSON.parse(localStorage.getItem("demo-user") || '{"email":"user@example.com","auth_mode":"demo"}')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">My Journal</h1>
            {currentUser.auth_mode === "demo" && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Demo Mode</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {currentUser.email}
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Entries</h2>
            <p className="text-gray-600 mt-2">
              {entries.length} {entries.length === 1 ? "entry" : "entries"} total
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">{editingEntry ? "Edit Entry" : "Create New Entry"}</DialogTitle>
                <DialogDescription>
                  {editingEntry ? "Update your journal entry" : "Add a new entry to your journal"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter entry title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Write your thoughts, experiences, or memories..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium">
                    Image (optional)
                  </Label>
                  <div className="space-y-3">
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full" />

                    {imagePreview && (
                      <div className="relative">
                        <div className="relative w-full max-w-sm mx-auto">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Image preview"
                            width={300}
                            height={200}
                            className="rounded-md object-cover w-full h-48"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">Click the X to remove image</p>
                      </div>
                    )}

                    {!imagePreview && (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Choose an image to add to your entry</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading} className="bg-blue-600 hover:bg-blue-700">
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : editingEntry ? (
                      "Update Entry"
                    ) : (
                      "Create Entry"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {entries.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-gray-400 mb-6">
                <Plus className="h-20 w-20 mx-auto" />
              </div>
              <CardTitle className="mb-4 text-2xl">No entries yet</CardTitle>
              <CardDescription className="mb-6 text-lg">
                Start your journaling journey by creating your first entry
              </CardDescription>
              <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 shadow-md"
              >
                {entry.image_url && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={entry.image_url || "/placeholder.svg"}
                      alt={entry.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2 text-lg mb-2">{entry.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)} className="hover:bg-blue-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {entry.content && (
                  <CardContent className="pt-0">
                    <p className="text-gray-600 line-clamp-4 leading-relaxed">{entry.content}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
