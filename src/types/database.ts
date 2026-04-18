export interface Database {
  public: {
    Tables: {
      lists: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          list_id: string | null
          title: string
          description: string | null
          completed: boolean
          pomodoros_completed: number
          difficulty: number
          estimated_time: number
          start_date: string | null
          deadline: string | null
          scheduled_time: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          list_id?: string | null
          title: string
          description?: string | null
          completed?: boolean
          pomodoros_completed?: number
          difficulty?: number
          estimated_time?: number
          start_date?: string | null
          deadline?: string | null
          scheduled_time?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          list_id?: string | null
          title?: string
          description?: string | null
          completed?: boolean
          pomodoros_completed?: number
          difficulty?: number
          estimated_time?: number
          start_date?: string | null
          deadline?: string | null
          scheduled_time?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

