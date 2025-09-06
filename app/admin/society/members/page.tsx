"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, UserPlus, Eye, Edit, IndianRupee, Phone, Mail, Calendar, Filter } from "lucide-react"

// Mock data for demonstration
const mockMembers = [
  {
    id: "M001",
    name: "Raj Kumar Sharma",
    mobile: "9876543210",
    email: "raj.sharma@email.com",
    plan: "2-year",
    shares: 5,
    monthlyInstallment: 500,
    joinDate: "2024-01-15",
    status: "Active",
    totalDeposit: 6000,
    referredBy: "M002",
  },
  {
    id: "M002",
    name: "Sunita Devi",
    mobile: "9876543211",
    email: "sunita.devi@email.com",
    plan: "3-year",
    shares: 3,
    monthlyInstallment: 300,
    joinDate: "2023-12-10",
    status: "Active",
    totalDeposit: 3900,
    referredBy: null,
  },
  {
    id: "M003",
    name: "Amit Gupta",
    mobile: "9876543212",
    email: "amit.gupta@email.com",
    plan: "Committee",
    shares: 2,
    monthlyInstallment: 200,
    joinDate: "2024-02-01",
    status: "Active",
    totalDeposit: 2400,
    referredBy: "M001",
  },
  {
    id: "M004",
    name: "Priya Singh",
    mobile: "9876543213",
    email: "priya.singh@email.com",
    plan: "2-year",
    shares: 4,
    monthlyInstallment: 400,
    joinDate: "2024-01-20",
    status: "Active",
    totalDeposit: 4800,
    referredBy: "M002",
  },
  {
    id: "M005",
    name: "Vikas Yadav",
    mobile: "9876543214",
    email: "vikas.yadav@email.com",
    plan: "3-year",
    shares: 6,
    monthlyInstallment: 600,
    joinDate: "2023-11-05",
    status: "Active",
    totalDeposit: 8400,
    referredBy: null,
  },
]

export default function MembersListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile.includes(searchTerm)
    const matchesPlan = filterPlan === "all" || member.plan === filterPlan
    const matchesStatus = filterStatus === "all" || member.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesPlan && matchesStatus
  })

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
                <h1 className="text-xl font-bold text-foreground">Member Management</h1>
                <p className="text-sm text-muted-foreground">View and manage all society members</p>
              </div>
            </div>
            <Link href="/admin/society/members/add">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Member
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
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{mockMembers.length}</p>
                </div>
                <Badge variant="secondary">{mockMembers.filter((m) => m.status === "Active").length} Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                  <p className="text-2xl font-bold">{mockMembers.reduce((sum, m) => sum + m.shares, 0)}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Collection</p>
                  <p className="text-2xl font-bold">
                    ₹{mockMembers.reduce((sum, m) => sum + m.monthlyInstallment, 0).toLocaleString()}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Deposits</p>
                  <p className="text-2xl font-bold">
                    ₹{mockMembers.reduce((sum, m) => sum + m.totalDeposit, 0).toLocaleString()}
                  </p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or mobile..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
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
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Members List ({filteredMembers.length} members)</CardTitle>
            <CardDescription>Complete list of society members with their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Monthly Installment</TableHead>
                    <TableHead>Total Deposit</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          {member.referredBy && (
                            <p className="text-xs text-muted-foreground">Referred by: {member.referredBy}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {member.mobile}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPlanBadgeColor(member.plan)}>{member.plan}</Badge>
                      </TableCell>
                      <TableCell>{member.shares}</TableCell>
                      <TableCell>₹{member.monthlyInstallment}</TableCell>
                      <TableCell>₹{member.totalDeposit.toLocaleString()}</TableCell>
                      <TableCell>{new Date(member.joinDate).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/admin/society/members/${member.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/society/members/${member.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
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
