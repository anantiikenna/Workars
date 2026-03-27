export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'customer' | 'worker' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'worker' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'worker' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          created_at?: string
        }
      }
      artisans: {
        Row: {
          id: string
          category_id: string | null
          bio: string | null
          experience_years: number | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          phone_number: string | null
          is_verified: boolean
          is_subscribed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          category_id?: string | null
          bio?: string | null
          experience_years?: number | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          phone_number?: string | null
          is_verified?: boolean
          is_subscribed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          bio?: string | null
          experience_years?: number | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          phone_number?: string | null
          is_verified?: boolean
          is_subscribed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
