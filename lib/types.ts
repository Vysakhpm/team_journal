export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string | null
  image_url: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
}
