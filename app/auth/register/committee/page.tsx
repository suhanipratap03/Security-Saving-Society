"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, ArrowLeft } from "lucide-react"

export default function CommitteeRegisterPage() {
  const [formData, setFormData] = useState({
    committeeName: "",
    committeeId: "",
    password: "",
    confirmPassword: "",
    memberName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      setIsLoading(false)
      return
    }

    try {
      // read current passcodes map { [committeeId]: { passcode, committeeName } }
      const raw = typeof window !== "undefined" ? localStorage.getItem("committee_passcodes") : null
      const passcodes: Record<string, { passcode: string; committeeName: string }> = raw ? JSON.parse(raw) : {}

      passcodes[formData.committeeId.trim()] = {
        passcode: formData.password,
        committeeName: formData.committeeName.trim(),
      }
      localStorage.setItem("committee_passcodes", JSON.stringify(passcodes))

      const membersRaw = localStorage.getItem("committee_members")
      const members = membersRaw ? JSON.parse(membersRaw) : []
      const memberId = `M-${Date.now()}`
      members.push({
        committeeId: formData.committeeId.trim(),
        committeeName: formData.committeeName.trim(),
        memberId,
        memberName: formData.memberName.trim(),
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("committee_members", JSON.stringify(members))

      localStorage.setItem(
        "last_registered_member",
        JSON.stringify({
          committeeId: formData.committeeId.trim(),
          memberId,
          memberName: formData.memberName.trim(),
        }),
      )

      // Redirect to member login (so they log in with ID + password)
      setIsLoading(false)
      router.push("/auth/member/login")
    } catch (err) {
      console.error("[v0] committee register store error:", err)
      setIsLoading(false)
      alert("Could not save registration locally. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-6">
          <Link
            href="/auth/register"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registration Options
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-500 rounded-full w-fit">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Committee Member Registration</CardTitle>
            <CardDescription>Join an existing committee with your credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberName">Member Name *</Label>
                <Input
                  id="memberName"
                  name="memberName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.memberName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="committeeName">Committee Name *</Label>
                <Input
                  id="committeeName"
                  name="committeeName"
                  type="text"
                  placeholder="Enter committee name"
                  value={formData.committeeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="committeeId">Committee ID *</Label>
                <Input
                  id="committeeId"
                  name="committeeId"
                  type="text"
                  placeholder="Enter committee ID (e.g., COM1)"
                  value={formData.committeeId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Joining Committee..." : "Join Committee"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/member/login" className="text-accent hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
