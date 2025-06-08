import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript support
export type Document = {
  id: string
  user_id: string
  name: string
  file_url?: string
  file_size: number
  file_type: string
  reading_progress: number
  total_pages: number
  current_page: number
  last_read?: string
  created_at: string
  updated_at: string
}

export type UserProfile = {
  id: string
  name?: string
  avatar_url?: string
  subscription: 'free' | 'basic' | 'pro' | 'ultraPro'
  settings: {
    notifications: boolean
    darkMode: boolean
    language: string
  }
  usage_stats: {
    documentsUploaded: number
    readingTime: number
    completedBooks: number
  }
  created_at: string
  updated_at: string
}