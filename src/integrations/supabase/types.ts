export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blood_inventory: {
        Row: {
          blood_group: string
          hospital_id: string
          id: string
          units: number
          updated_at: string | null
        }
        Insert: {
          blood_group: string
          hospital_id: string
          id?: string
          units?: number
          updated_at?: string | null
        }
        Update: {
          blood_group?: string
          hospital_id?: string
          id?: string
          units?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blood_inventory_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      blood_requests: {
        Row: {
          blood_group: string
          contact_name: string
          contact_phone: string
          created_at: string | null
          hospital: string
          id: string
          location: string
          notes: string | null
          patient_name: string
          status: string | null
          units: number
          updated_at: string | null
          urgency: string
          user_id: string
        }
        Insert: {
          blood_group: string
          contact_name: string
          contact_phone: string
          created_at?: string | null
          hospital: string
          id?: string
          location: string
          notes?: string | null
          patient_name: string
          status?: string | null
          units: number
          updated_at?: string | null
          urgency: string
          user_id: string
        }
        Update: {
          blood_group?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          hospital?: string
          id?: string
          location?: string
          notes?: string | null
          patient_name?: string
          status?: string | null
          units?: number
          updated_at?: string | null
          urgency?: string
          user_id?: string
        }
        Relationships: []
      }
      donors: {
        Row: {
          blood_group: string
          created_at: string | null
          email: string
          id: string
          last_donation: string | null
          location: string
          name: string
          phone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blood_group: string
          created_at?: string | null
          email: string
          id?: string
          last_donation?: string | null
          location: string
          name: string
          phone: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blood_group?: string
          created_at?: string | null
          email?: string
          id?: string
          last_donation?: string | null
          location?: string
          name?: string
          phone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          contact_person: string
          created_at: string | null
          description: string | null
          email: string
          id: string
          location: string
          name: string
          phone: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_person: string
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          location: string
          name: string
          phone: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_person?: string
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          location?: string
          name?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
