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
      trips: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          label: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          label?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          label?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      collaborators: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          role?: 'owner' | 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          user_id?: string
          role?: 'owner' | 'editor' | 'viewer'
          created_at?: string
        }
      }
      pins: {
        Row: {
          id: string
          trip_id: string
          name: string
          description: string | null
          latitude: number
          longitude: number
          category_id: string | null
          day: number | null
          time: string | null
          place_id: string | null
          place_data: Json | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          name: string
          description?: string | null
          latitude: number
          longitude: number
          category_id?: string | null
          day?: number | null
          time?: string | null
          place_id?: string | null
          place_data?: Json | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          name?: string
          description?: string | null
          latitude?: number
          longitude?: number
          category_id?: string | null
          day?: number | null
          time?: string | null
          place_id?: string | null
          place_data?: Json | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          trip_id: string
          name: string
          color: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          name: string
          color: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          name?: string
          color?: string
          icon?: string | null
          created_at?: string
        }
      }
      list_items: {
        Row: {
          id: string
          trip_id: string
          list_type: 'stores' | 'things_to_do' | 'things_to_see'
          name: string
          description: string | null
          pin_id: string | null
          completed: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          list_type: 'stores' | 'things_to_do' | 'things_to_see'
          name: string
          description?: string | null
          pin_id?: string | null
          completed?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          list_type?: 'stores' | 'things_to_do' | 'things_to_see'
          name?: string
          description?: string | null
          pin_id?: string | null
          completed?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
