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
      financial_uploads: {
        Row: {
          id: string
          user_id: string
          filename: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          filename: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          upload_id: string | null
          merchant: string
          amount: number
          date: string
          category: string
          raw: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          upload_id?: string | null
          merchant: string
          amount: number
          date: string
          category?: string
          raw?: string | null
          created_at?: string
        }
        Update: {
          category?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "financial_uploads"
            referencedColumns: ["id"]
          }
        ]
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

