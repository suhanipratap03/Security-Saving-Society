"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Users,
  IndianRupee,
  FileText,
  UserPlus,
  Calculator,
  TrendingUp,
  CreditCard,
  Building2,
} from "lucide-react"

export default function SocietyManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Society Management</h1>
                <p className="text-sm text-muted-foreground">Manage members, savings plans & loans</p>
              </div>
            </div>
            <Badge variant="secondary">Society Module</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Society Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">248</p>
                  <p className="text-xs text-green-600">+12 this month</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs text-blue-600">₹8.5L outstanding</p>
                </div>
                <IndianRupee className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Collection</p>
                  <p className="text-2xl font-bold">₹2.8L</p>
                  <p className="text-xs text-green-600">98% collection rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Deposits</p>
                  <p className="text-2xl font-bold">₹12.5L</p>
                  <p className="text-xs text-blue-600">Across all plans</p>
                </div>
                <Building2 className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Society Management Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Member Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Member Management</CardTitle>
                  <CardDescription>Add, edit and manage society members</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/society/members" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View All Members
                </Button>
              </Link>
              <Link href="/admin/society/members/add" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Member
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Loan Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <IndianRupee className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Loan Management</CardTitle>
                  <CardDescription>Process loans and manage EMIs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/society/loans" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  View All Loans
                </Button>
              </Link>
              <Link href="/admin/society/loans/process" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process New Loan
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Account Management</CardTitle>
                  <CardDescription>Manage member accounts and transactions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/society/accounts" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  View Accounts
                </Button>
              </Link>
              <Link href="/admin/society/transactions" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Transaction History
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Reports & Analytics */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Reports & Analytics</CardTitle>
                  <CardDescription>Generate financial reports and statements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/society/reports" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Financial Reports
                </Button>
              </Link>
              <Link href="/admin/society/statements" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Member Statements
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Plan Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Plan Management</CardTitle>
                  <CardDescription>Manage 2-year & 3-year savings plans</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/society/plans" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  View Plans
                </Button>
              </Link>
              <Link href="/admin/society/interest-rates" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  Interest Rates
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Society Settings</CardTitle>
                  <CardDescription>Configure fees, charges and bonuses</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/society/fees" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Fees & Charges
                </Button>
              </Link>
              <Link href="/admin/society/bonuses" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Referral Bonuses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
