export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      document_flashcards: {
        Row: {
          answer: string;
          created_at: string | null;
          id: string;
          question: string;
          revision_set_id: string;
          updated_at: string | null;
        };
        Insert: {
          answer: string;
          created_at?: string | null;
          id?: string;
          question: string;
          revision_set_id: string;
          updated_at?: string | null;
        };
        Update: {
          answer?: string;
          created_at?: string | null;
          id?: string;
          question?: string;
          revision_set_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "document_flashcards_revision_set_id_revision_sets_id_fk";
            columns: ["revision_set_id"];
            isOneToOne: false;
            referencedRelation: "revision_sets";
            referencedColumns: ["id"];
          }
        ];
      };
      document_summaries: {
        Row: {
          created_at: string;
          id: string;
          revision_set_id: string;
          status: Database["public"]["Enums"]["status"];
          summary_text: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          revision_set_id: string;
          status: Database["public"]["Enums"]["status"];
          summary_text: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          revision_set_id?: string;
          status?: Database["public"]["Enums"]["status"];
          summary_text?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "document_summaries_revision_set_id_revision_sets_id_fk";
            columns: ["revision_set_id"];
            isOneToOne: false;
            referencedRelation: "revision_sets";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          content: string;
          created_at: string;
          file_hash: string;
          file_size: number;
          file_type: Database["public"]["Enums"]["file_type"];
          id: string;
          original_filename: string;
          revision_set_id: string;
          ufs_url: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          file_hash: string;
          file_size: number;
          file_type: Database["public"]["Enums"]["file_type"];
          id?: string;
          original_filename: string;
          revision_set_id: string;
          ufs_url: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          file_hash?: string;
          file_size?: number;
          file_type?: Database["public"]["Enums"]["file_type"];
          id?: string;
          original_filename?: string;
          revision_set_id?: string;
          ufs_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_revision_set_id_revision_sets_id_fk";
            columns: ["revision_set_id"];
            isOneToOne: false;
            referencedRelation: "revision_sets";
            referencedColumns: ["id"];
          }
        ];
      };
      revision_sets: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "revision_sets_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: {
          created_at: string;
          id: string;
          plan: Database["public"]["Enums"]["plan"];
          status: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          plan: Database["public"]["Enums"]["plan"];
          status: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          plan?: Database["public"]["Enums"]["plan"];
          status?: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_users_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          id: string;
          name: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      file_type: "pdf" | "docx" | "txt";
      plan: "free" | "plus" | "pro";
      status: "processing" | "completed" | "failed";
      subscription_status: "active" | "canceled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      file_type: ["pdf", "docx", "txt"],
      plan: ["free", "plus", "pro"],
      status: ["processing", "completed", "failed"],
      subscription_status: ["active", "canceled"],
    },
  },
} as const;
