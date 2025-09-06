"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  User,
  CreditCard,
  IndianRupee,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
  Edit,
} from "lucide-react"

// Mock member data
const memberData = {
  id: "M001",
  name: "राज कुमार शर्मा",
  mobile: "9876543210",
  email: "raj.sharma@email.com",
  address: "123, गांधी नगर, नई दिल्ली - 110001",
  aadhar: "1234-5678-9012",
  pan: "ABCDE1234F",
  bankAccount: "1234567890123456",
  bankName: "State Bank of India",
  ifsc: "SBIN0001234",
  plan: "2-year",
  shares: 5,
  monthlyInstallment: 500,
  joinDate: "2024-01-15",
  status: "Active",
  totalDeposit: 6000,
  referredBy: "M002",
  nominee: "सुनीता शर्मा",
  nomineeRelation: "Spouse",
  occupation: "Teacher",
  annualIncome: "600000",
}

// Mock transaction data
const transactions = [
  {
    id: "T001",
    date: "2024-03-01",
    type: "Monthly Installment",
    amount: 500,
    status: "Completed",
    description: "Monthly installment for March 2024",
  },
  {
    id: "T002",
    date: "2024-02-01",
    type: "Monthly Installment",
    amount: 500,
    status: "Completed",
    description: "Monthly installment for February 2024",
  },
  {
    id: "T003",
    date: "2024-01-15",
    type: "Registration Fee",
    amount: 100,
    status: "Completed",
    description: "One-time registration fee",
  },
  {
    id: "T004",
    date: "2024-01-15",
    type: "Monthly Installment",
    amount: 500,
    status: "Completed",
    description: "Initial monthly installment",
  },
]

export default function MemberDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

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

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
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
              <Link href="/admin/society/members">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Members
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Member Details</h1>
                <p className="text-sm text-muted-foreground">Complete member information and account history</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href={`/admin/society/members/${params.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Member
                </Button>
              </Link>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Statement
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Member Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Deposit</p>
                  <p className="text-2xl font-bold">₹{memberData.totalDeposit.toLocaleString()}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Installment</p>
                  <p className="text-2xl font-bold">₹{memberData.monthlyInstallment}</p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                  <p className="text-2xl font-bold">{memberData.shares}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-lg font-bold">{new Date(memberData.joinDate).toLocaleDateString("en-IN")}</p>
                </div>
                <User className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Member Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="account">Account Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6 text-primary" />
                    <CardTitle>Personal Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member ID</p>
                      <p className="font-semibold">{memberData.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={memberData.status === "Active" ? "default" : "secondary"}>
                        {memberData.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{memberData.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{memberData.mobile}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{memberData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                      <p>{memberData.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                      <p>{memberData.occupation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Annual Income</p>
                      <p>₹{Number.parseInt(memberData.annualIncome).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    <CardTitle>Plan Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Membership Plan</p>
                    <Badge className={getPlanBadgeColor(memberData.plan)}>{memberData.plan}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Number of Shares</p>
                      <p className="font-semibold">{memberData.shares}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Share Value</p>
                      <p className="font-semibold">₹{memberData.shares * 100}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Installment</p>
                    <p className="text-xl font-bold text-primary">₹{memberData.monthlyInstallment}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                      <p>{new Date(memberData.joinDate).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Referred By</p>
                      <p>{memberData.referredBy || "Direct"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nominee</p>
                      <p>{memberData.nominee}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Relationship</p>
                      <p>{memberData.nomineeRelation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Complete transaction history for this member</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>₹{transaction.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(transaction.status)}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <CardTitle>Bank Account Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                    <p className="font-semibold">{memberData.bankAccount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                    <p className="font-semibold">{memberData.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
                    <p className="font-semibold">{memberData.ifsc}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aadhar Number</p>
                    <p className="font-semibold">{memberData.aadhar}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">PAN Number</p>
                    <p className="font-semibold">{memberData.pan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Verification</CardTitle>
                <CardDescription>Member documents and verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Aadhar Card</p>
                      <p className="text-sm text-muted-foreground">Identity verification document</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">PAN Card</p>
                      <p className="text-sm text-muted-foreground">Tax identification document</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Bank Account Proof</p>
                      <p className="text-sm text-muted-foreground">Bank account verification</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
