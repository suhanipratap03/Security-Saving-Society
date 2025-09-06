"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MemberRegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // redirect members to the dedicated committee member registration form
    router.replace("/auth/register/committee")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to committee member registration...</p>
      </div>
    </div>
  )
}
