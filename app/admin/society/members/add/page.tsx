"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Calculator, User, CreditCard, Building2 } from "lucide-react"

export default function AddMemberPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    mobile: "",
    email: "",
    address: "",
    aadhar: "",
    pan: "",

    // Bank Information
    bankAccount: "",
    bankName: "",
    ifsc: "",

    // Plan Selection
    plan: "",
    shares: "",
    referredBy: "",

    // Additional Information
    occupation: "",
    annualIncome: "",
    nominee: "",
    nomineeRelation: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const calculateMonthlyInstallment = () => {
    const shares = Number.parseInt(formData.shares) || 0
    return shares * 100
  }

  const getInterestRate = () => {
    switch (formData.plan) {
      case "2-year":
        return "2% Annual"
      case "3-year":
        return "1%, 2%, 3% Progressive"
      case "committee":
        return "Chit Fund System"
      default:
        return ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/society/members")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/society/members">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Members
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Add New Member</h1>
                <p className="text-sm text-muted-foreground">Register a new member to the society</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic member details and contact information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number *</Label>
                    <Input
                      id="aadhar"
                      name="aadhar"
                      value={formData.aadhar}
                      onChange={handleChange}
                      placeholder="Enter Aadhar number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                      id="pan"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      placeholder="Enter PAN number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income</Label>
                    <Input
                      id="annualIncome"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      placeholder="Enter annual income"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Bank Information</CardTitle>
                    <CardDescription>Bank account details for transactions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account Number *</Label>
                    <Input
                      id="bankAccount"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Enter bank name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code *</Label>
                  <Input
                    id="ifsc"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleChange}
                    placeholder="Enter IFSC code"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Plan Selection</CardTitle>
                    <CardDescription>Choose membership plan and share allocation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Membership Plan *</Label>
                    <Select onValueChange={(value) => handleSelectChange("plan", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select membership plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-year">2-Year Plan (2% Annual Interest)</SelectItem>
                        <SelectItem value="3-year">3-Year Plan (1%, 2%, 3% Progressive)</SelectItem>
                        <SelectItem value="committee">Committee (Chit Fund System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shares">Number of Shares *</Label>
                    <Input
                      id="shares"
                      name="shares"
                      type="number"
                      value={formData.shares}
                      onChange={handleChange}
                      placeholder="Enter number of shares (₹100 each)"
                      required
                    />
                  </div>
                </div>

                {formData.plan && formData.shares && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Calculator className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Plan Summary</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly Installment</p>
                          <p className="font-semibold text-lg">₹{calculateMonthlyInstallment()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Interest Rate</p>
                          <p className="font-semibold">{getInterestRate()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Shares</p>
                          <p className="font-semibold">{formData.shares} × ₹100</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label htmlFor="referredBy">Referred By (Member ID)</Label>
                  <Input
                    id="referredBy"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    placeholder="Enter referrer's member ID (optional)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Nominee Information */}
            <Card>
              <CardHeader>
                <CardTitle>Nominee Information</CardTitle>
                <CardDescription>Nominee details for the account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nominee">Nominee Name</Label>
                    <Input
                      id="nominee"
                      name="nominee"
                      value={formData.nominee}
                      onChange={handleChange}
                      placeholder="Enter nominee name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomineeRelation">Relationship with Nominee</Label>
                    <Select onValueChange={(value) => handleSelectChange("nomineeRelation", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="son">Son</SelectItem>
                        <SelectItem value="daughter">Daughter</SelectItem>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="brother">Brother</SelectItem>
                        <SelectItem value="sister">Sister</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/admin/society/members">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Calculator className="h-4 w-4 mr-2 animate-spin" />
                    Creating Member...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Member Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
