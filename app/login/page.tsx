"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState("")
  const router = useRouter()
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignup) {
        const { user, error } = await signUp(name, email, password)
        
        if (error) {
          setError(error)
        } else if (user) {
          alert("Account created successfully! You can now sign in.")
          setIsSignup(false)
          setEmail("")
          setPassword("")
          setName("")
        }
      } else {
        const { user, error } = await signIn(email, password)
        
        if (error) {
          setError(error)
        } else if (user) {
          router.push("/")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <Card className="border-2" style={{ borderColor: '#0D0A53' }}>
          <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold" style={{ color: '#0D0A53' }}>
              {isSignup ? "Create Account" : "Sign In"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200">
                  {error}
                </div>
              )}

              {isSignup && (
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#0D0A53' }}>
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#0D0A53' }}>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#0D0A53' }}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                style={{ backgroundColor: '#0D0A53' }}
              >
                {loading ? "Loading..." : (isSignup ? "Create Account" : "Sign In")}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setIsSignup(!isSignup)
                    setError("")
                  }}
                  className="text-xs sm:text-sm"
                  style={{ color: '#C7A600' }}
                >
                  {isSignup 
                    ? "Already have an account? Sign In" 
                    : "Don't have an account? Sign Up"
                  }
                </Button>
              </div>

              <div className="text-center">
                <Link 
                  href="/" 
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
