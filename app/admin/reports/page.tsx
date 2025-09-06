"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Download, FileText, TrendingUp, Users, IndianRupee } from "lucide-react"

// Mock data for reports
const financialSummary = {
  totalMembers: 150,
  totalDeposits: 750000,
  totalLoans: 300000,
  totalInterest: 45000,
  netProfit: 125000,
  activeCommittees: 5,
}

const monthlyData = [
  { month: "January 2024", deposits: 65000, loans: 25000, interest: 3500, members: 145 },
  { month: "February 2024", deposits: 68000, loans: 28000, interest: 3800, members: 148 },
  { month: "March 2024", deposits: 72000, loans: 30000, interest: 4200, members: 150 },
  { month: "April 2024", deposits: 75000, loans: 32000, interest: 4500, members: 152 },
]

const memberReports = [
  { id: "M001", name: "राज कुमार शर्मा", plan: "2-Year", deposit: 2500, loan: 2000, status: "Active" },
  { id: "M002", name: "सुनील कुमार", plan: "3-Year", deposit: 4500, loan: 0, status: "Active" },
  { id: "M003", name: "प्रिया शर्मा", plan: "Committee", deposit: 1200, loan: 800, status: "Active" },
  { id: "M004", name: "अमित गुप्ता", plan: "2-Year", deposit: 3200, loan: 1500, status: "Active" },
]

const committeeReports = [
  {
    id: "C001",
    name: "Committee A",
    members: 10,
    duration: "10 months",
    totalAmount: 50000,
    currentMonth: 3,
    status: "Active",
  },
  {
    id: "C002",
    name: "Committee B",
    members: 12,
    duration: "12 months",
    totalAmount: 72000,
    currentMonth: 7,
    status: "Active",
  },
  {
    id: "C003",
    name: "Committee C",
    members: 10,
    duration: "10 months",
    totalAmount: 45000,
    currentMonth: 10,
    status: "Completed",
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("financial")
  const [selectedMonth, setSelectedMonth] = useState("april-2024")
  const [selectedYear, setSelectedYear] = useState("2024")

  const generateProfessionalReport = (type: "monthly" | "annual" | "committee", data?: any) => {
    const currentDate = new Date().toLocaleDateString("en-IN")
    const currentTime = new Date().toLocaleTimeString("en-IN")

    let reportContent = ""
    let reportTitle = ""

    if (type === "monthly") {
      reportTitle = `Monthly Financial Report - ${selectedMonth.replace("-", " ").toUpperCase()}`
      const monthData = monthlyData.find((m) => m.month.toLowerCase().includes(selectedMonth.split("-")[0]))

      reportContent = `
        <div class="report-header">
          <h1>SURAKSHA SAVINGS SOCIETY</h1>
          <h2>${reportTitle}</h2>
          <div class="report-meta">
            <p>Generated on: ${currentDate} at ${currentTime}</p>
            <p>Report Period: ${monthData?.month || "N/A"}</p>
          </div>
        </div>

        <div class="financial-summary">
          <h3>FINANCIAL OVERVIEW</h3>
          <table class="summary-table">
            <tr><td>Total Deposits</td><td>₹${monthData?.deposits.toLocaleString("en-IN") || "0"}</td></tr>
            <tr><td>Total Loans Disbursed</td><td>₹${monthData?.loans.toLocaleString("en-IN") || "0"}</td></tr>
            <tr><td>Interest Earned</td><td>₹${monthData?.interest.toLocaleString("en-IN") || "0"}</td></tr>
            <tr><td>Active Members</td><td>${monthData?.members || 0}</td></tr>
            <tr class="total-row"><td><strong>Net Position</strong></td><td><strong>₹${((monthData?.deposits || 0) - (monthData?.loans || 0) + (monthData?.interest || 0)).toLocaleString("en-IN")}</strong></td></tr>
          </table>
        </div>

        <div class="member-details">
          <h3>MEMBER ACTIVITY SUMMARY</h3>
          <table class="data-table">
            <thead>
              <tr><th>Member ID</th><th>Name</th><th>Plan Type</th><th>Monthly Deposit</th><th>Loan Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${memberReports
                .map(
                  (member) => `
                <tr>
                  <td>${member.id}</td>
                  <td>${member.name}</td>
                  <td>${member.plan}</td>
                  <td>₹${member.deposit.toLocaleString("en-IN")}</td>
                  <td>₹${member.loan.toLocaleString("en-IN")}</td>
                  <td><span class="status-active">${member.status}</span></td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>This is a computer-generated report. For any queries, contact the administration.</p>
          <p><strong>Suraksha Savings Society</strong> | Comprehensive Financial Management</p>
        </div>
      `
    } else if (type === "annual") {
      reportTitle = `Annual Financial Report - ${selectedYear}`
      const yearlyDeposits = monthlyData.reduce((sum, month) => sum + month.deposits, 0)
      const yearlyLoans = monthlyData.reduce((sum, month) => sum + month.loans, 0)
      const yearlyInterest = monthlyData.reduce((sum, month) => sum + month.interest, 0)

      reportContent = `
        <div class="report-header">
          <h1>SURAKSHA SAVINGS SOCIETY</h1>
          <h2>${reportTitle}</h2>
          <div class="report-meta">
            <p>Generated on: ${currentDate} at ${currentTime}</p>
            <p>Report Period: January ${selectedYear} - December ${selectedYear}</p>
          </div>
        </div>

        <div class="executive-summary">
          <h3>EXECUTIVE SUMMARY</h3>
          <div class="summary-grid">
            <div class="summary-card">
              <h4>Total Members</h4>
              <p class="big-number">${financialSummary.totalMembers}</p>
            </div>
            <div class="summary-card">
              <h4>Annual Deposits</h4>
              <p class="big-number">₹${yearlyDeposits.toLocaleString("en-IN")}</p>
            </div>
            <div class="summary-card">
              <h4>Loans Disbursed</h4>
              <p class="big-number">₹${yearlyLoans.toLocaleString("en-IN")}</p>
            </div>
            <div class="summary-card">
              <h4>Interest Earned</h4>
              <p class="big-number">₹${yearlyInterest.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        <div class="monthly-breakdown">
          <h3>MONTHLY PERFORMANCE BREAKDOWN</h3>
          <table class="data-table">
            <thead>
              <tr><th>Month</th><th>Deposits</th><th>Loans</th><th>Interest</th><th>Net Growth</th></tr>
            </thead>
            <tbody>
              ${monthlyData
                .map((month) => {
                  const netGrowth = month.deposits - month.loans + month.interest
                  return `
                  <tr>
                    <td>${month.month}</td>
                    <td>₹${month.deposits.toLocaleString("en-IN")}</td>
                    <td>₹${month.loans.toLocaleString("en-IN")}</td>
                    <td>₹${month.interest.toLocaleString("en-IN")}</td>
                    <td class="${netGrowth >= 0 ? "positive" : "negative"}">₹${netGrowth.toLocaleString("en-IN")}</td>
                  </tr>
                `
                })
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="committee-summary">
          <h3>COMMITTEE PERFORMANCE</h3>
          <table class="data-table">
            <thead>
              <tr><th>Committee</th><th>Members</th><th>Total Amount</th><th>Status</th><th>Progress</th></tr>
            </thead>
            <tbody>
              ${committeeReports
                .map(
                  (committee) => `
                <tr>
                  <td>${committee.name}</td>
                  <td>${committee.members}</td>
                  <td>₹${committee.totalAmount.toLocaleString("en-IN")}</td>
                  <td><span class="status-${committee.status.toLowerCase()}">${committee.status}</span></td>
                  <td>${committee.currentMonth}/${committee.duration.split(" ")[0]} months</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>This comprehensive annual report provides insights into our society's financial health and growth.</p>
          <p><strong>Suraksha Savings Society</strong> | Building Financial Security Together</p>
        </div>
      `
    }

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background: white;
                padding: 20px;
              }
              .report-header { 
                text-align: center; 
                border-bottom: 3px solid #1e40af; 
                padding-bottom: 20px; 
                margin-bottom: 30px; 
              }
              .report-header h1 { 
                font-size: 28px; 
                color: #1e40af; 
                margin-bottom: 10px; 
                font-weight: bold;
              }
              .report-header h2 { 
                font-size: 20px; 
                color: #374151; 
                margin-bottom: 15px; 
              }
              .report-meta { 
                background: #f8fafc; 
                padding: 10px; 
                border-radius: 8px; 
                display: inline-block;
              }
              .report-meta p { 
                margin: 5px 0; 
                font-size: 14px; 
                color: #6b7280; 
              }
              
              .financial-summary, .executive-summary, .monthly-breakdown, .member-details, .committee-summary { 
                margin: 30px 0; 
                page-break-inside: avoid;
              }
              .financial-summary h3, .executive-summary h3, .monthly-breakdown h3, .member-details h3, .committee-summary h3 { 
                color: #1e40af; 
                font-size: 18px; 
                margin-bottom: 15px; 
                border-bottom: 2px solid #e5e7eb; 
                padding-bottom: 8px;
              }
              
              .summary-table, .data-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 15px 0; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .summary-table td, .data-table th, .data-table td { 
                padding: 12px; 
                text-align: left; 
                border: 1px solid #e5e7eb; 
              }
              .summary-table td:first-child { 
                font-weight: 600; 
                background: #f9fafb; 
                width: 40%;
              }
              .summary-table td:last-child { 
                text-align: right; 
                font-weight: 600; 
                color: #059669;
              }
              .total-row td { 
                background: #1e40af !important; 
                color: white !important; 
                font-size: 16px;
              }
              
              .data-table th { 
                background: #1e40af; 
                color: white; 
                font-weight: 600; 
                text-align: center;
              }
              .data-table tbody tr:nth-child(even) { 
                background: #f9fafb; 
              }
              .data-table tbody tr:hover { 
                background: #e0f2fe; 
              }
              
              .summary-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 20px; 
                margin: 20px 0;
              }
              .summary-card { 
                background: linear-gradient(135deg, #1e40af, #3b82f6); 
                color: white; 
                padding: 20px; 
                border-radius: 12px; 
                text-align: center; 
                box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
              }
              .summary-card h4 { 
                font-size: 14px; 
                margin-bottom: 10px; 
                opacity: 0.9;
              }
              .big-number { 
                font-size: 24px; 
                font-weight: bold; 
                margin: 0;
              }
              
              .status-active { 
                background: #10b981; 
                color: white; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: 600;
              }
              .status-completed { 
                background: #3b82f6; 
                color: white; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: 600;
              }
              .positive { color: #059669; font-weight: 600; }
              .negative { color: #dc2626; font-weight: 600; }
              
              .footer { 
                margin-top: 40px; 
                padding-top: 20px; 
                border-top: 2px solid #e5e7eb; 
                text-align: center; 
                color: #6b7280; 
                font-size: 14px;
              }
              .footer p { margin: 5px 0; }
              .footer strong { color: #1e40af; }
              
              @media print {
                body { padding: 15px; }
                .report-header { page-break-after: avoid; }
                .financial-summary, .executive-summary, .monthly-breakdown, .member-details, .committee-summary { 
                  page-break-inside: avoid; 
                }
              }
            </style>
          </head>
          <body>
            ${reportContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

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
                <h1 className="text-xl font-bold text-foreground">Reports & Analytics</h1>
                <p className="text-sm text-muted-foreground">Comprehensive financial and operational reports</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button onClick={() => generateProfessionalReport("annual")}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{financialSummary.totalMembers}</p>
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
                  <p className="text-2xl font-bold">₹{(financialSummary.totalDeposits / 100000).toFixed(1)}L</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Loans</p>
                  <p className="text-2xl font-bold">₹{(financialSummary.totalLoans / 100000).toFixed(1)}L</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interest Earned</p>
                  <p className="text-2xl font-bold">₹{(financialSummary.totalInterest / 1000).toFixed(0)}K</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold">₹{(financialSummary.netProfit / 100000).toFixed(1)}L</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Committees</p>
                  <p className="text-2xl font-bold">{financialSummary.activeCommittees}</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial">Financial Reports</TabsTrigger>
            <TabsTrigger value="members">Member Reports</TabsTrigger>
            <TabsTrigger value="committees">Committee Reports</TabsTrigger>
            <TabsTrigger value="settlement">Settlement Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Monthly Financial Report</CardTitle>
                    <CardDescription>Monthly deposits, loans, and interest summary</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => generateProfessionalReport("monthly")}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Total Deposits</TableHead>
                      <TableHead>Total Loans</TableHead>
                      <TableHead>Interest Earned</TableHead>
                      <TableHead>New Members</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{data.month}</TableCell>
                        <TableCell>₹{data.deposits.toLocaleString()}</TableCell>
                        <TableCell>₹{data.loans.toLocaleString()}</TableCell>
                        <TableCell>₹{data.interest.toLocaleString()}</TableCell>
                        <TableCell>{data.members}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => generateProfessionalReport("monthly")}>
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Member Account Reports</CardTitle>
                    <CardDescription>Individual member account statements and summaries</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => generateProfessionalReport("annual")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Statements
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Total Deposit</TableHead>
                      <TableHead>Active Loan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberReports.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.id}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.plan}</TableCell>
                        <TableCell>₹{member.deposit.toLocaleString()}</TableCell>
                        <TableCell>₹{member.loan.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {member.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="committees">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Committee Reports</CardTitle>
                    <CardDescription>Committee performance and auction summaries</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => generateProfessionalReport("annual")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Committee Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Committee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Current Month</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {committeeReports.map((committee) => (
                      <TableRow key={committee.id}>
                        <TableCell className="font-medium">{committee.id}</TableCell>
                        <TableCell>{committee.name}</TableCell>
                        <TableCell>{committee.members}</TableCell>
                        <TableCell>{committee.duration}</TableCell>
                        <TableCell>₹{committee.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{committee.currentMonth}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              committee.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {committee.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settlement">
            <Card>
              <CardHeader>
                <CardTitle>Settlement Reports</CardTitle>
                <CardDescription>Final settlement reports for completed plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="settlement-year">Settlement Year</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="plan-type">Plan Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2-year">2-Year Plan</SelectItem>
                          <SelectItem value="3-year">3-Year Plan</SelectItem>
                          <SelectItem value="committee">Committee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full" onClick={() => generateProfessionalReport("annual")}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Settlement Report
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold mb-2">Settlement Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Completed Plans</p>
                        <p className="font-semibold">25</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Settlement</p>
                        <p className="font-semibold">₹12,50,000</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interest Paid</p>
                        <p className="font-semibold">₹2,50,000</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bonus Distributed</p>
                        <p className="font-semibold">₹50,000</p>
                      </div>
                    </div>
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
