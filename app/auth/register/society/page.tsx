"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, ArrowLeft } from "lucide-react"

export default function SocietyRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    aadhar: "",
    pan: "",
    bankAccount: "",
    ifsc: "",
    password: "",
    confirmPassword: "",
    plan: "",
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

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/auth/member/login")
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
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
            <div className="mx-auto mb-4 p-3 bg-green-500 rounded-full w-fit">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Society Member Registration</CardTitle>
            <CardDescription>Join Suraksha Savings Society with individual savings plans</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Member Profile */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Member Profile</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number *</Label>
                    <Input
                      id="aadhar"
                      name="aadhar"
                      type="text"
                      placeholder="Enter Aadhar number"
                      value={formData.aadhar}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                      id="pan"
                      name="pan"
                      type="text"
                      placeholder="Enter PAN number"
                      value={formData.pan}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bank Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account Number *</Label>
                    <Input
                      id="bankAccount"
                      name="bankAccount"
                      type="text"
                      placeholder="Enter account number"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code *</Label>
                    <Input
                      id="ifsc"
                      name="ifsc"
                      type="text"
                      placeholder="Enter IFSC code"
                      value={formData.ifsc}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Membership Plan */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Membership Plan</h3>
                <div className="space-y-2">
                  <Label htmlFor="plan">Select Plan *</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, plan: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your membership plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-year">2-Year Plan (2% Annual Interest)</SelectItem>
                      <SelectItem value="3-year">3-Year Plan (1%, 2%, 3% Progressive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Security</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
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
                </div>
              </div>

              <Button type="submit" variant="secondary" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Society Member Account"}
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
