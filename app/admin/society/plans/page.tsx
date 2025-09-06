"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Building2, Calculator, TrendingUp, Edit, Save, Users, IndianRupee } from "lucide-react"

// Mock plan data
const planData = [
  {
    id: "2-year",
    name: "2-Year Savings Plan",
    duration: 24,
    interestRate: "2% Annual",
    description: "Fixed 2% annual interest rate for 2 years",
    minShares: 1,
    maxShares: 10,
    activeMembers: 156,
    totalDeposits: 780000,
    features: [
      "Fixed 2% annual interest",
      "Monthly installment of ₹100 per share",
      "Loan facility after 3 months",
      "Referral bonus eligible",
    ],
  },
  {
    id: "3-year",
    name: "3-Year Progressive Plan",
    duration: 36,
    interestRate: "1%, 2%, 3% Progressive",
    description: "Progressive interest rates: Year 1 (1%), Year 2 (2%), Year 3 (3%)",
    minShares: 1,
    maxShares: 15,
    activeMembers: 92,
    totalDeposits: 552000,
    features: [
      "Progressive interest rates",
      "Higher returns in later years",
      "Monthly installment of ₹100 per share",
      "Premium loan facility",
    ],
  },
  {
    id: "committee",
    name: "Committee (Chit Fund)",
    duration: 12,
    interestRate: "Bidding System",
    description: "Monthly bidding system with 10-12 members per committee",
    minShares: 1,
    maxShares: 5,
    activeMembers: 96,
    totalDeposits: 480000,
    features: [
      "Monthly bidding system",
      "Immediate fund access on winning",
      "1.5% government deduction",
      "Flexible committee duration",
    ],
  },
]

export default function PlansPage() {
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [planSettings, setPlanSettings] = useState({
    registrationFee: 100,
    processingFee: 1,
    lateFee: 100,
    referralBonus: 50,
  })

  const handleSavePlan = (planId: string) => {
    setEditingPlan(null)
    // Here you would save the plan changes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/society">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Society
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Plan Management</h1>
                <p className="text-sm text-muted-foreground">Manage savings plans and interest rates</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Plan Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                  <p className="text-2xl font-bold">{planData.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold">{planData.reduce((sum, plan) => sum + plan.activeMembers, 0)}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Deposits</p>
                  <p className="text-2xl font-bold">
                    ₹{(planData.reduce((sum, plan) => sum + plan.totalDeposits, 0) / 100000).toFixed(1)}L
                  </p>
                </div>
                <IndianRupee className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Interest</p>
                  <p className="text-2xl font-bold">2.2%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans List */}
        <div className="grid gap-6 mb-8">
          {planData.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{plan.activeMembers} Members</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPlan(editingPlan === plan.id ? null : plan.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {editingPlan === plan.id ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Plan Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Plan Details</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{plan.duration} months</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold text-primary">{plan.interestRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Share Range</p>
                        <p className="font-semibold">
                          {plan.minShares} - {plan.maxShares} shares
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Statistics</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Members</p>
                        <p className="font-semibold">{plan.activeMembers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Deposits</p>
                        <p className="font-semibold">₹{(plan.totalDeposits / 100000).toFixed(1)}L</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Monthly Collection</p>
                        <p className="font-semibold">₹{Math.round(plan.totalDeposits / plan.duration / 1000)}K</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Features</h4>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Actions</h4>
                    <div className="space-y-2">
                      <Link href={`/admin/society/plans/${plan.id}/members`} className="block">
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                          <Users className="h-4 w-4 mr-2" />
                          View Members
                        </Button>
                      </Link>
                      <Link href={`/admin/society/plans/${plan.id}/reports`} className="block">
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Plan Reports
                        </Button>
                      </Link>
                      {editingPlan === plan.id && (
                        <Button size="sm" className="w-full" onClick={() => handleSavePlan(plan.id)}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plan Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Calculator className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Plan Settings & Fees</CardTitle>
                <CardDescription>Configure fees and charges for all plans</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
                <Input
                  id="registrationFee"
                  type="number"
                  value={planSettings.registrationFee}
                  onChange={(e) =>
                    setPlanSettings((prev) => ({
                      ...prev,
                      registrationFee: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  value={planSettings.processingFee}
                  onChange={(e) =>
                    setPlanSettings((prev) => ({
                      ...prev,
                      processingFee: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lateFee">Late Fee (₹/month)</Label>
                <Input
                  id="lateFee"
                  type="number"
                  value={planSettings.lateFee}
                  onChange={(e) =>
                    setPlanSettings((prev) => ({
                      ...prev,
                      lateFee: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralBonus">Referral Bonus (₹)</Label>
                <Input
                  id="referralBonus"
                  type="number"
                  value={planSettings.referralBonus}
                  onChange={(e) =>
                    setPlanSettings((prev) => ({
                      ...prev,
                      referralBonus: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
