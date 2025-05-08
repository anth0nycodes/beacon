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
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error getting initial user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
        } else {
          setUser(session?.user || null)
        }
        setLoading(false)
      }
    )

    // Cleanup on unmount
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [user])

  return {
    user,
    loading,
  }
}