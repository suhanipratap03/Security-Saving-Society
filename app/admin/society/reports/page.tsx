"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileText, Download, TrendingUp, IndianRupee, Users, Calculator } from "lucide-react"

// Mock report data
const monthlyReports = [
  {
    month: "March 2024",
    totalCollection: 285000,
    newMembers: 12,
    activeLoans: 42,
    interestPaid: 5700,
    latePayments: 8,
    collectionRate: 98.2,
  },
  {
    month: "February 2024",
    totalCollection: 278000,
    newMembers: 8,
    activeLoans: 38,
    interestPaid: 5200,
    latePayments: 12,
    collectionRate: 96.8,
  },
  {
    month: "January 2024",
    totalCollection: 265000,
    newMembers: 15,
    activeLoans: 35,
    interestPaid: 4800,
    latePayments: 6,
    collectionRate: 99.1,
  },
]

const planWiseData = [
  {
    plan: "2-Year Plan",
    members: 156,
    totalDeposits: 780000,
    monthlyCollection: 156000,
    interestPaid: 15600,
    avgBalance: 5000,
  },
  {
    plan: "3-Year Plan",
    members: 92,
    totalDeposits: 552000,
    monthlyCollection: 92000,
    interestPaid: 5520,
    avgBalance: 6000,
  },
  {
    plan: "Committee",
    members: 96,
    totalDeposits: 480000,
    monthlyCollection: 96000,
    interestPaid: 0,
    avgBalance: 5000,
  },
]

export default function ReportsPage() {
  const [reportType, setReportType] = useState("monthly")
  const [selectedMonth, setSelectedMonth] = useState("march-2024")
  const [selectedYear, setSelectedYear] = useState("2024")

  const generateReport = () => {
    // Here you would generate and download the report
    console.log("Generating report:", { reportType, selectedMonth, selectedYear })
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
                <h1 className="text-xl font-bold text-foreground">Reports & Analytics</h1>
                <p className="text-sm text-muted-foreground">Generate financial reports and view analytics</p>
              </div>
            </div>
            <Button onClick={generateReport}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Report Generation */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create custom reports for society operations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="yearly">Yearly Report</SelectItem>
                    <SelectItem value="member-wise">Member-wise Report</SelectItem>
                    <SelectItem value="plan-wise">Plan-wise Report</SelectItem>
                    <SelectItem value="loan-report">Loan Report</SelectItem>
                    <SelectItem value="collection">Collection Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="march-2024">March 2024</SelectItem>
                    <SelectItem value="february-2024">February 2024</SelectItem>
                    <SelectItem value="january-2024">January 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button className="w-full" onClick={generateReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Society performance over the last few months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Total Collection</TableHead>
                    <TableHead>New Members</TableHead>
                    <TableHead>Active Loans</TableHead>
                    <TableHead>Interest Paid</TableHead>
                    <TableHead>Late Payments</TableHead>
                    <TableHead>Collection Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.month}</TableCell>
                      <TableCell>₹{report.totalCollection.toLocaleString()}</TableCell>
                      <TableCell>{report.newMembers}</TableCell>
                      <TableCell>{report.activeLoans}</TableCell>
                      <TableCell>₹{report.interestPaid.toLocaleString()}</TableCell>
                      <TableCell>{report.latePayments}</TableCell>
                      <TableCell>
                        <Badge variant={report.collectionRate > 98 ? "default" : "secondary"}>
                          {report.collectionRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Plan-wise Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Plan-wise Analysis</CardTitle>
            <CardDescription>Performance breakdown by membership plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Total Deposits</TableHead>
                    <TableHead>Monthly Collection</TableHead>
                    <TableHead>Interest Paid</TableHead>
                    <TableHead>Avg. Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planWiseData.map((plan, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{plan.plan}</TableCell>
                      <TableCell>{plan.members}</TableCell>
                      <TableCell>₹{plan.totalDeposits.toLocaleString()}</TableCell>
                      <TableCell>₹{plan.monthlyCollection.toLocaleString()}</TableCell>
                      <TableCell>₹{plan.interestPaid.toLocaleString()}</TableCell>
                      <TableCell>₹{plan.avgBalance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Society Value</p>
                  <p className="text-2xl font-bold">₹18.12L</p>
                  <p className="text-xs text-green-600">+8.2% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                  <p className="text-2xl font-bold">12.5%</p>
                  <p className="text-xs text-green-600">New member additions</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interest Distributed</p>
                  <p className="text-2xl font-bold">₹26.32K</p>
                  <p className="text-xs text-blue-600">This month</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collection Efficiency</p>
                  <p className="text-2xl font-bold">98.2%</p>
                  <p className="text-xs text-green-600">Above target</p>
                </div>
                <Calculator className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
