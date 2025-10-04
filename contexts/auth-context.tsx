"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { User as SupabaseUser, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: SupabaseUser | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ user: SupabaseUser | null; error: string | null }>
  signUp: (name: string, email: string, password: string) => Promise<{ user: SupabaseUser | null; error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
        }
        
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
          // Check admin role from metadata first
          const userRole = session.user.user_metadata?.role
          if (userRole === 'admin') {
            setIsAdmin(true)
          } else {
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id)
        
        setSession(session)
        setUser(session?.user || null)
        
        if (session?.user) {
          // Check admin role from metadata
          const userRole = session.user.user_metadata?.role
          setIsAdmin(userRole === 'admin')
        } else {
          setIsAdmin(false)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUserRole = async (user: SupabaseUser) => {
    try {
      // Check if user has admin role in metadata
      const userRole = user.user_metadata?.role
      if (userRole === 'admin') {
        setIsAdmin(true)
        return
      }

      // Check users table for admin role
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error("Error checking user role:", error)
        setIsAdmin(false)
      } else {
        setIsAdmin(data?.role === 'admin')
      }
    } catch (error) {
      console.error("Error checking user role:", error)
      setIsAdmin(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: 'user' }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      console.log("Signing out...")
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
      } else {
        console.log("Sign out successful")
        // Force immediate state update
        setUser(null)
        setSession(null)
        setIsAdmin(false)
        setLoading(false)
        router.push('/')
      }
    } catch (error) {
      console.error("Error signing out:", error)
      // Force logout even if there's an error
      setUser(null)
      setSession(null)
      setIsAdmin(false)
      setLoading(false)
      router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}