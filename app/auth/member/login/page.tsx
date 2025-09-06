"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MemberLoginPage() {
  const [activeTab, setActiveTab] = useState<"committee" | "society">("committee")
  const [formData, setFormData] = useState({
    committeeId: "",
    password: "",
    memberName: "", // new: capture member name to restrict access to real members only
  })
  const [societyForm, setSocietyForm] = useState({
    societyId: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      router.prefetch?.("/member/dashboard")
    } catch {}
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const passRaw = typeof window !== "undefined" ? localStorage.getItem("committee_passcodes") : null
      const passcodes: Record<string, { passcode: string; committeeName?: string }> = passRaw ? JSON.parse(passRaw) : {}
      const cid = formData.committeeId.trim()
      const entry = passcodes[cid]

      if (!entry || entry.passcode !== formData.password) {
        setIsLoading(false)
        alert("Invalid committee ID or password.")
        return
      }

      const committeesRaw = localStorage.getItem("committees")
      const committees = committeesRaw ? (JSON.parse(committeesRaw) as Array<any>) : []
      const foundCommittee = committees.find((c) => String(c?.id || "").toLowerCase() === cid.toLowerCase())

      if (!foundCommittee) {
        setIsLoading(false)
        alert("Committee not found. Please check your Committee ID.")
        return
      }

      // Try to match against committeeMembers list primarily
      const members: Array<any> = Array.isArray(foundCommittee?.committeeMembers) ? foundCommittee.committeeMembers : []

      // normalize helper
      const norm = (v?: string) =>
        String(v || "")
          .trim()
          .toLowerCase()

      // Accept either the exact memberName typed, or allow fallback to last_registered_member if it matches this committee
      let memberNameInput = norm(formData.memberName)
      let matchedMember: any | null = null

      if (memberNameInput) {
        matchedMember =
          members.find(
            (m) =>
              norm(m?.name) === memberNameInput ||
              norm(m?.memberName) === memberNameInput ||
              norm(m?.fullName) === memberNameInput,
          ) || null
      } else {
        // If user didn't type a name, we still try to lock down using last_registered_member (strictly same committee)
        const reg = localStorage.getItem("last_registered_member")
        if (reg) {
          try {
            const r = JSON.parse(reg)
            const sameCommittee = norm(r?.committeeId || r?.committee_id) === norm(cid)
            if (sameCommittee) {
              memberNameInput = norm(r?.memberName || r?.name)
              matchedMember =
                members.find(
                  (m) =>
                    norm(m?.name) === memberNameInput ||
                    norm(m?.memberName) === memberNameInput ||
                    norm(m?.fullName) === memberNameInput,
                ) || null
            }
          } catch {}
        }
      }

      if (!matchedMember) {
        setIsLoading(false)
        alert("Access denied. Only registered members of this committee can log in.")
        return
      }

      // Build session with verified member info
      const session: any = {
        type: "committee",
        committeeId: cid,
        committeeName: entry?.committeeName || foundCommittee?.name || "",
        memberName: matchedMember?.name || matchedMember?.memberName || formData.memberName || "Member",
        memberId: matchedMember?.id || matchedMember?.memberId || undefined,
        loggedInAt: new Date().toISOString(),
      }

      localStorage.setItem("member_session", JSON.stringify(session))

      setIsLoading(false)
      router.push("/member/dashboard")
      return
    } catch (err) {
      console.error("[v0] committee login error:", err)
      setIsLoading(false)
      alert("Login failed. Please try again.")
      return
    }
  }

  const handleSocietySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const sid = societyForm.societyId.trim()
      const raw = typeof window !== "undefined" ? localStorage.getItem("society_passcodes") : null
      const passcodes: Record<string, { passcode: string; societyName?: string }> = raw ? JSON.parse(raw) : {}
      let entry = passcodes[sid]

      if (!entry) {
        const societiesRaw = localStorage.getItem("societies")
        if (societiesRaw) {
          try {
            const societies = JSON.parse(societiesRaw) as Array<any>
            const found = societies.find((s) => (s.id || s.societyId) === sid)
            if (found && (found.password || found.passcode)) {
              entry = {
                passcode: String(found.password || found.passcode),
                societyName: found.name || found.societyName,
              }
            }
          } catch {
            // ignore
          }
        }
      }

      if (!entry || entry.passcode !== societyForm.password) {
        setIsLoading(false)
        alert("Invalid society ID or password.")
        return
      }

      const session: any = { type: "society", societyId: sid, loggedInAt: new Date().toISOString() }
      if (entry?.societyName) session.societyName = entry.societyName

      localStorage.setItem("member_session", JSON.stringify(session))

      setIsLoading(false)
      router.push("/member/dashboard")
    } catch (err) {
      console.error("[v0] society login error:", err)
      setIsLoading(false)
      alert("Login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
              <Calculator className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Member Login</CardTitle>
            <CardDescription>Choose your login type and enter credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="committee">Committee Login</TabsTrigger>
                <TabsTrigger value="society">Society Login</TabsTrigger>
              </TabsList>

              <TabsContent value="committee">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="committeeId">Committee ID</Label>
                    <Input
                      id="committeeId"
                      name="committeeId"
                      type="text"
                      placeholder="Enter your committee ID (e.g., COM1)"
                      value={formData.committeeId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          committeeId: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberName">Member Name</Label>
                    <Input
                      id="memberName"
                      name="memberName"
                      type="text"
                      placeholder="Enter your name as registered by admin"
                      value={formData.memberName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          memberName: e.target.value,
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Access is restricted. Your name must match the admin-added member list for this committee.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your committee password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Button type="submit" variant="secondary" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In to Committee"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="society">
                <form onSubmit={handleSocietySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="societyId">Society ID</Label>
                    <Input
                      id="societyId"
                      name="societyId"
                      type="text"
                      placeholder="Enter your society ID"
                      value={societyForm.societyId}
                      onChange={(e) =>
                        setSocietyForm((prev) => ({
                          ...prev,
                          societyId: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="societyPassword">Password</Label>
                    <Input
                      id="societyPassword"
                      name="societyPassword"
                      type="password"
                      placeholder="Enter your society password"
                      value={societyForm.password}
                      onChange={(e) =>
                        setSocietyForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In to Society"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have a member account?{" "}
                <Link href="/auth/register" className="text-accent hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
