"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, User, IndianRupee, Calendar, FileText, AlertCircle, CheckCircle } from "lucide-react"

// Mock loan details
const loanData = {
  id: "L001",
  memberId: "M001",
  memberName: "राज कुमार शर्मा",
  memberMobile: "9876543210",
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
  purpose: "Personal Use",
  remarks: "Emergency loan for medical expenses",
}

// Mock EMI schedule
const emiSchedule = [
  {
    emiNo: 1,
    dueDate: "2024-03-15",
    emiAmount: 548,
    principal: 48,
    interest: 48,
    monthlyInstallment: 500,
    status: "Paid",
    paidDate: "2024-03-15",
    lateFee: 0,
  },
  {
    emiNo: 2,
    dueDate: "2024-04-15",
    emiAmount: 548,
    principal: 48,
    interest: 48,
    monthlyInstallment: 500,
    status: "Paid",
    paidDate: "2024-04-15",
    lateFee: 0,
  },
  {
    emiNo: 3,
    dueDate: "2024-05-15",
    emiAmount: 548,
    principal: 48,
    interest: 48,
    monthlyInstallment: 500,
    status: "Due",
    paidDate: null,
    lateFee: 0,
  },
  {
    emiNo: 4,
    dueDate: "2024-06-15",
    emiAmount: 548,
    principal: 48,
    interest: 48,
    monthlyInstallment: 500,
    status: "Upcoming",
    paidDate: null,
    lateFee: 0,
  },
]

export default function LoanDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "due":
        return "bg-red-100 text-red-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateOutstanding = () => {
    return loanData.remainingEmis * loanData.emiAmount
  }

  const calculatePaidAmount = () => {
    return loanData.paidEmis * loanData.emiAmount
  }

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
                <h1 className="text-xl font-bold text-foreground">Loan Details</h1>
                <p className="text-sm text-muted-foreground">Complete loan information and EMI schedule</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Statement
              </Button>
              <Button>
                <IndianRupee className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Loan Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loan Amount</p>
                  <p className="text-2xl font-bold">₹{loanData.loanAmount.toLocaleString()}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">EMI Amount</p>
                  <p className="text-2xl font-bold">₹{loanData.emiAmount}</p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                  <p className="text-2xl font-bold">₹{calculatePaidAmount().toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">₹{calculateOutstanding().toLocaleString()}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">EMI Schedule</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Loan Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IndianRupee className="h-6 w-6 text-primary" />
                    <CardTitle>Loan Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Loan ID</p>
                      <p className="font-semibold">{loanData.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={loanData.status === "Active" ? "default" : "secondary"}>{loanData.status}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Loan Amount</p>
                      <p className="font-semibold">₹{loanData.loanAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Processing Fee</p>
                      <p className="font-semibold">₹{loanData.processingFee}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold">{loanData.interestRate}% monthly</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tenure</p>
                      <p className="font-semibold">{loanData.tenure} months</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sanction Date</p>
                      <p className="font-semibold">{new Date(loanData.sanctionDate).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Next EMI Date</p>
                      <p className="font-semibold">{new Date(loanData.nextEmiDate).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                    <p className="font-semibold">{loanData.purpose}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                    <p className="text-sm">{loanData.remarks}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Member Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6 text-primary" />
                    <CardTitle>Member Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Member Name</p>
                    <p className="font-semibold">{loanData.memberName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member ID</p>
                      <p className="font-semibold">{loanData.memberId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                      <p className="font-semibold">{loanData.memberMobile}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Deposit</p>
                      <p className="font-semibold">₹{loanData.memberDeposit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Eligible Amount</p>
                      <p className="font-semibold">₹{loanData.eligibleAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* EMI Progress */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">EMI Progress</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {loanData.paidEmis} of {loanData.tenure} EMIs paid
                        </span>
                        <span>{Math.round((loanData.paidEmis / loanData.tenure) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(loanData.paidEmis / loanData.tenure) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>EMI Schedule</CardTitle>
                <CardDescription>Complete EMI schedule with payment status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>EMI No.</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>EMI Amount</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Monthly Installment</TableHead>
                      <TableHead>Late Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emiSchedule.map((emi) => (
                      <TableRow key={emi.emiNo}>
                        <TableCell className="font-medium">{emi.emiNo}</TableCell>
                        <TableCell>{new Date(emi.dueDate).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell>₹{emi.emiAmount}</TableCell>
                        <TableCell>₹{emi.principal}</TableCell>
                        <TableCell>₹{emi.interest}</TableCell>
                        <TableCell>₹{emi.monthlyInstallment}</TableCell>
                        <TableCell>₹{emi.lateFee}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(emi.status)}>{emi.status}</Badge>
                        </TableCell>
                        <TableCell>{emi.paidDate ? new Date(emi.paidDate).toLocaleDateString("en-IN") : "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All loan-related transactions and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>EMI No.</TableHead>
                      <TableHead>Late Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-02-15</TableCell>
                      <TableCell>Loan Disbursement</TableCell>
                      <TableCell className="text-green-600">+₹4,800</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </TableCell>
                      <TableCell>Loan amount credited</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-02-15</TableCell>
                      <TableCell>Processing Fee</TableCell>
                      <TableCell className="text-red-600">-₹48</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">Deducted</Badge>
                      </TableCell>
                      <TableCell>1% processing fee</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-03-15</TableCell>
                      <TableCell>EMI Payment</TableCell>
                      <TableCell className="text-red-600">-₹548</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>₹0</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </TableCell>
                      <TableCell>On time payment</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-04-15</TableCell>
                      <TableCell>EMI Payment</TableCell>
                      <TableCell className="text-red-600">-₹548</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>₹0</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </TableCell>
                      <TableCell>On time payment</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
