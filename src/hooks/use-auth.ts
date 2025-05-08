"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user state
    const getInitialUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (!error && data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error("Error getting initial user:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    // Cleanup on unmount
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase, user])

  return {
    user,
    loading,
  }
}