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
          phone_number: string | null
          avatar_url: string | null
          role: 'customer' | 'worker' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone_number?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'worker' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone_number?: string | null
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
      workers: {
        Row: {
          id: string
          category_id: string | null
          skills: string[] | null
          bio: string | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          is_online: boolean
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          category_id?: string | null
          skills?: string[] | null
          bio?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          is_online?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          skills?: string[] | null
          bio?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          is_online?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          customer_id: string | null
          worker_id: string | null
          description: string
          location_name: string | null
          location_lat: number | null
          location_lng: number | null
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined' | 'canceled'
          payment_status: 'pending' | 'escrowed' | 'released' | 'refunded'
          price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          worker_id?: string | null
          description: string
          location_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined' | 'canceled'
          payment_status?: 'pending' | 'escrowed' | 'released' | 'refunded'
          price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          worker_id?: string | null
          description?: string
          location_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined' | 'canceled'
          payment_status?: 'pending' | 'escrowed' | 'released' | 'refunded'
          price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          job_id: string | null
          worker_id: string | null
          customer_id: string | null
          rating: number | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id?: string | null
          worker_id?: string | null
          customer_id?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string | null
          worker_id?: string | null
          customer_id?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}
