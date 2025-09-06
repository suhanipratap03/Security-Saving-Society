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
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Calculator, User, IndianRupee, AlertCircle } from "lucide-react"

// Mock member data for loan eligibility
const mockMembers = [
  {
    id: "M001",
    name: "राज कुमार शर्मा",
    joinDate: "2024-01-15",
    totalDeposit: 6000,
    monthlyInstallment: 500,
    plan: "2-year",
    monthsSinceJoining: 3,
    eligibleForLoan: true,
    maxLoanAmount: 4800, // 80% of deposit
    currentLoan: null,
  },
  {
    id: "M002",
    name: "सुनीता देवी",
    joinDate: "2023-12-10",
    totalDeposit: 3900,
    monthlyInstallment: 300,
    plan: "3-year",
    monthsSinceJoining: 4,
    eligibleForLoan: false, // Already has active loan
    maxLoanAmount: 3120,
    currentLoan: "L002",
  },
  {
    id: "M006",
    name: "अनीता शर्मा",
    joinDate: "2024-02-01",
    totalDeposit: 2400,
    monthlyInstallment: 200,
    plan: "Committee",
    monthsSinceJoining: 2,
    eligibleForLoan: false, // Less than 3 months
    maxLoanAmount: 1920,
    currentLoan: null,
  },
  {
    id: "M007",
    name: "रमेश कुमार",
    joinDate: "2023-11-15",
    totalDeposit: 5400,
    monthlyInstallment: 450,
    plan: "2-year",
    monthsSinceJoining: 5,
    eligibleForLoan: true,
    maxLoanAmount: 4320,
    currentLoan: null,
  },
]

export default function ProcessLoanPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [formData, setFormData] = useState({
    memberId: "",
    loanAmount: "",
    interestRate: "",
    tenure: "",
    purpose: "",
    remarks: "",
  })

  const handleMemberSelect = (memberId: string) => {
    const member = mockMembers.find((m) => m.id === memberId)
    setSelectedMember(member)
    setFormData((prev) => ({
      ...prev,
      memberId,
      interestRate: getInterestRateByPlan(member?.plan || ""),
    }))
  }

  const getInterestRateByPlan = (plan: string) => {
    switch (plan) {
      case "2-year":
        return "1.0"
      case "3-year":
        return "1.5"
      case "Committee":
        return "0.5"
      default:
        return "2.0"
    }
  }

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

  const calculateLoanDetails = () => {
    const loanAmount = Number.parseFloat(formData.loanAmount) || 0
    const interestRate = Number.parseFloat(formData.interestRate) || 0
    const tenure = Number.parseInt(formData.tenure) || 0
    const processingFee = Math.round(loanAmount * 0.01) // 1% processing fee
    const monthlyInterest = Math.round(loanAmount * (interestRate / 100))
    const monthlyInstallment = selectedMember?.monthlyInstallment || 0
    const totalEmi = monthlyInstallment + monthlyInterest
    const totalAmount = loanAmount + processingFee + monthlyInterest * tenure

    return {
      loanAmount,
      processingFee,
      monthlyInterest,
      totalEmi,
      totalAmount,
      tenure,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/society/loans")
    }, 2000)
  }

  const loanDetails = calculateLoanDetails()
  const eligibleMembers = mockMembers.filter((m) => m.eligibleForLoan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/society/loans">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Loans
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Process New Loan</h1>
                <p className="text-sm text-muted-foreground">Create a new loan for eligible members</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Member Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Member Selection</CardTitle>
                    <CardDescription>Select an eligible member for loan processing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="memberId">Select Member *</Label>
                  <Select onValueChange={handleMemberSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an eligible member" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.id}) - Max: ₹{member.maxLoanAmount.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMember && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <User className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Member Details</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Deposit</p>
                          <p className="font-semibold">₹{selectedMember.totalDeposit.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Monthly Installment</p>
                          <p className="font-semibold">₹{selectedMember.monthlyInstallment}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Loan Amount</p>
                          <p className="font-semibold text-primary">₹{selectedMember.maxLoanAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Plan</p>
                          <p className="font-semibold">{selectedMember.plan}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Member Since</p>
                          <p className="font-semibold">
                            {new Date(selectedMember.joinDate).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Months Completed</p>
                          <p className="font-semibold">{selectedMember.monthsSinceJoining} months</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Loan Details */}
            {selectedMember && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IndianRupee className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>Loan Details</CardTitle>
                      <CardDescription>Configure loan amount and terms</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
                      <Input
                        id="loanAmount"
                        name="loanAmount"
                        type="number"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        placeholder="Enter loan amount"
                        max={selectedMember.maxLoanAmount}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum: ₹{selectedMember.maxLoanAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (% monthly)</Label>
                      <Input
                        id="interestRate"
                        name="interestRate"
                        type="number"
                        step="0.1"
                        value={formData.interestRate}
                        onChange={handleChange}
                        placeholder="Interest rate"
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground">Based on member's plan</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenure">Tenure (Months) *</Label>
                      <Select onValueChange={(value) => handleSelectChange("tenure", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months</SelectItem>
                          <SelectItem value="18">18 Months</SelectItem>
                          <SelectItem value="24">24 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Loan Purpose *</Label>
                      <Select onValueChange={(value) => handleSelectChange("purpose", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal Use</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="medical">Medical Emergency</SelectItem>
                          <SelectItem value="home">Home Improvement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Textarea
                        id="remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Additional remarks or notes"
                        rows={3}
                      />
                    </div>
                  </div>

                  {formData.loanAmount && formData.tenure && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Calculator className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">Loan Calculation</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Loan Amount</p>
                            <p className="font-semibold text-lg">₹{loanDetails.loanAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Processing Fee (1%)</p>
                            <p className="font-semibold">₹{loanDetails.processingFee.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Monthly Interest</p>
                            <p className="font-semibold">₹{loanDetails.monthlyInterest.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total EMI</p>
                            <p className="font-semibold text-primary">₹{loanDetails.totalEmi.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <p className="text-sm text-blue-800">
                              <strong>EMI Breakdown:</strong> Monthly Installment (₹
                              {selectedMember.monthlyInstallment}) + Loan Interest (₹{loanDetails.monthlyInterest}) =
                              Total EMI (₹{loanDetails.totalEmi})
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            {selectedMember && (
              <div className="flex justify-end space-x-4">
                <Link href="/admin/society/loans">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Calculator className="h-4 w-4 mr-2 animate-spin" />
                      Processing Loan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Process Loan
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
