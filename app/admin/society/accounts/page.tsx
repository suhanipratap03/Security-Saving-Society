"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Eye, Calculator, TrendingUp, IndianRupee, Users } from "lucide-react"

// Mock account data
const mockAccounts = [
  {
    memberId: "M001",
    memberName: "Raj Kumar Sharma",
    plan: "2-year",
    shares: 5,
    monthlyInstallment: 500,
    totalDeposit: 6000,
    interestEarned: 120,
    currentBalance: 6120,
    lastPayment: "2024-03-01",
    status: "Active",
    maturityDate: "2026-01-15",
  },
  {
    memberId: "M002",
    memberName: "Sunita Devi",
    plan: "3-year",
    shares: 3,
    monthlyInstallment: 300,
    totalDeposit: 3900,
    interestEarned: 39,
    currentBalance: 3939,
    lastPayment: "2024-03-01",
    status: "Active",
    maturityDate: "2026-12-10",
  },
  {
    memberId: "M003",
    memberName: "Amit Gupta",
    plan: "Committee",
    shares: 2,
    monthlyInstallment: 200,
    totalDeposit: 2400,
    interestEarned: 0,
    currentBalance: 2400,
    lastPayment: "2024-03-01",
    status: "Active",
    maturityDate: "2025-02-01",
  },
  {
    memberId: "M004",
    memberName: "Priya Singh",
    plan: "2-year",
    shares: 4,
    monthlyInstallment: 400,
    totalDeposit: 4800,
    interestEarned: 96,
    currentBalance: 4896,
    lastPayment: "2024-03-01",
    status: "Active",
    maturityDate: "2026-01-20",
  },
]

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredAccounts = mockAccounts.filter((account) => {
    const matchesSearch =
      account.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.memberId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === "all" || account.plan === filterPlan
    const matchesStatus = filterStatus === "all" || account.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesPlan && matchesStatus
  })

  const totalStats = {
    totalAccounts: mockAccounts.length,
    totalDeposits: mockAccounts.reduce((sum, acc) => sum + acc.totalDeposit, 0),
    totalInterest: mockAccounts.reduce((sum, acc) => sum + acc.interestEarned, 0),
    totalBalance: mockAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0),
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "2-year":
        return "bg-blue-100 text-blue-800"
      case "3-year":
        return "bg-green-100 text-green-800"
      case "Committee":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                <h1 className="text-xl font-bold text-foreground">Account Management</h1>
                <p className="text-sm text-muted-foreground">View and manage member accounts and balances</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Accounts</p>
                  <p className="text-2xl font-bold">{totalStats.totalAccounts}</p>
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
                  <p className="text-2xl font-bold">₹{totalStats.totalDeposits.toLocaleString()}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interest Earned</p>
                  <p className="text-2xl font-bold">₹{totalStats.totalInterest.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold">₹{totalStats.totalBalance.toLocaleString()}</p>
                </div>
                <Calculator className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or member ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="2-year">2-Year Plan</SelectItem>
                  <SelectItem value="3-year">3-Year Plan</SelectItem>
                  <SelectItem value="Committee">Committee</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="matured">Matured</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterPlan("all")
                  setFilterStatus("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Member Accounts ({filteredAccounts.length} accounts)</CardTitle>
            <CardDescription>Complete account details with balances and interest calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Monthly Installment</TableHead>
                    <TableHead>Total Deposit</TableHead>
                    <TableHead>Interest Earned</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Maturity Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.memberId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{account.memberName}</p>
                          <p className="text-sm text-muted-foreground">{account.memberId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlanBadgeColor(account.plan)}>{account.plan}</Badge>
                      </TableCell>
                      <TableCell>{account.shares}</TableCell>
                      <TableCell>₹{account.monthlyInstallment}</TableCell>
                      <TableCell>₹{account.totalDeposit.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">₹{account.interestEarned}</TableCell>
                      <TableCell className="font-semibold">₹{account.currentBalance.toLocaleString()}</TableCell>
                      <TableCell>{new Date(account.lastPayment).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell>{new Date(account.maturityDate).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell>
                        <Badge variant={account.status === "Active" ? "default" : "secondary"}>{account.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/society/accounts/${account.memberId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
