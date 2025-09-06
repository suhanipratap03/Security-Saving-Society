"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Plus, Eye, IndianRupee, Calendar, TrendingUp, Users, AlertCircle } from "lucide-react"

// Mock loan data
const mockLoans = [
  {
    id: "L001",
    memberId: "M001",
    memberName: "Raj Kumar Sharma",
    loanAmount: 4800,
    interestRate: 1.0,
    processingFee: 48,
    totalAmount: 4848,
    emiAmount: 548,
    sanctionDate: "2024-02-15",
    tenure: 12,
    paidEmis: 2,
    remainingEmis: 10,
    nextEmiDate: "2024-04-15",
    status: "Active",
    memberDeposit: 6000,
    eligibleAmount: 4800,
    lateFees: 0,
  },
  {
    id: "L002",
    memberId: "M002",
    memberName: "Sunita Devi",
    loanAmount: 3120,
    interestRate: 1.5,
    processingFee: 31,
    totalAmount: 3151,
    emiAmount: 347,
    sanctionDate: "2024-01-20",
    tenure: 10,
    paidEmis: 3,
    remainingEmis: 7,
    nextEmiDate: "2024-04-20",
    status: "Active",
    memberDeposit: 3900,
    eligibleAmount: 3120,
    lateFees: 100,
  },
  {
    id: "L003",
    memberId: "M004",
    memberName: "Priya Singh",
    loanAmount: 3840,
    interestRate: 0.5,
    processingFee: 38,
    totalAmount: 3878,
    emiAmount: 438,
    sanctionDate: "2024-03-01",
    tenure: 10,
    paidEmis: 1,
    remainingEmis: 9,
    nextEmiDate: "2024-04-01",
    status: "Active",
    memberDeposit: 4800,
    eligibleAmount: 3840,
    lateFees: 0,
  },
  {
    id: "L004",
    memberId: "M005",
    memberName: "Vikas Yadav",
    loanAmount: 6720,
    interestRate: 2.0,
    processingFee: 67,
    totalAmount: 6787,
    emiAmount: 734,
    sanctionDate: "2023-12-10",
    tenure: 12,
    paidEmis: 12,
    remainingEmis: 0,
    nextEmiDate: null,
    status: "Closed",
    memberDeposit: 8400,
    eligibleAmount: 6720,
    lateFees: 0,
  },
]

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredLoans = mockLoans.filter((loan) => {
    const matchesSearch =
      loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || loan.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const totalStats = {
    totalLoans: mockLoans.length,
    activeLoans: mockLoans.filter((l) => l.status === "Active").length,
    totalDisbursed: mockLoans.reduce((sum, l) => sum + l.loanAmount, 0),
    totalOutstanding: mockLoans
      .filter((l) => l.status === "Active")
      .reduce((sum, l) => sum + l.remainingEmis * l.emiAmount, 0),
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
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
                <h1 className="text-xl font-bold text-foreground">Loan Management</h1>
                <p className="text-sm text-muted-foreground">View and manage member loans</p>
              </div>
            </div>
            <Link href="/admin/society/loans/process">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Process New Loan
              </Button>
            </Link>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Loans</p>
                  <p className="text-2xl font-bold">{totalStats.totalLoans}</p>
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
                  <p className="text-2xl font-bold">{totalStats.activeLoans}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Disbursed</p>
                  <p className="text-2xl font-bold">₹{(totalStats.totalDisbursed / 100000).toFixed(1)}L</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">₹{(totalStats.totalOutstanding / 100000).toFixed(1)}L</p>
                </div>
                <AlertCircle className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by member name, ID, or loan ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loans Table */}
        <Card>
          <CardHeader>
            <CardTitle>Loans List ({filteredLoans.length} loans)</CardTitle>
            <CardDescription>Complete list of member loans with EMI details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan Details</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>EMI Amount</TableHead>
                    <TableHead>EMI Progress</TableHead>
                    <TableHead>Next EMI</TableHead>
                    <TableHead>Late Fees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{loan.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Sanctioned: {new Date(loan.sanctionDate).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{loan.memberName}</p>
                          <p className="text-sm text-muted-foreground">{loan.memberId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">₹{loan.loanAmount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">+ ₹{loan.processingFee} processing fee</p>
                        </div>
                      </TableCell>
                      <TableCell>{loan.interestRate}% monthly</TableCell>
                      <TableCell>
                        <p className="font-semibold">₹{loan.emiAmount}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {loan.paidEmis}/{loan.tenure} EMIs
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(loan.paidEmis / loan.tenure) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {loan.nextEmiDate ? (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            {new Date(loan.nextEmiDate).toLocaleDateString("en-IN")}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Completed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {loan.lateFees > 0 ? (
                          <p className="text-red-600 font-semibold">₹{loan.lateFees}</p>
                        ) : (
                          <span className="text-muted-foreground">₹0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(loan.status)}>{loan.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/society/loans/${loan.id}`}>
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
