"use client"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, Plus, TrendingUp, Download, Calendar, Users, Eye } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { wipeCommitteeData } from "@/lib/committee-storage"

interface Committee {
  id: string
  name: string
  description: string
  members: number
  duration: number
  monthlyAmount: number
  startDate: string
  status: string
  totalFund: number
  createdAt: string
  currentMonth: number
  committeeMembers: any[]
  paymentHistory: any[]
  memberPayments: any[]
  committeeHead: string
  monthlyCycles: any[]
  completedAt: string
}

function CommitteeManagementContent() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCommittee, setSelectedCommittee] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedMemberCommittee, setSelectedMemberCommittee] = useState("all")
  const [selectedMember, setSelectedMember] = useState("all")
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromQuery = searchParams.get("tab") || undefined

  useEffect(() => {
    const loadCommittees = () => {
      try {
        const savedCommittees = localStorage.getItem("committees")
        if (savedCommittees) {
          const parsedCommittees = JSON.parse(savedCommittees)
          setCommittees(parsedCommittees)
          console.log("[v0] Loaded committees from localStorage:", parsedCommittees)
        }
      } catch (error) {
        console.error("[v0] Error loading committees:", error)
      }
    }

    loadCommittees()
  }, [])

  const filteredCommittees = committees.filter((committee) => {
    const matchesSearch =
      committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      committee.id.toLowerCase().includes(searchTerm.toLowerCase())

    const isCompleted =
      committee.status?.toLowerCase() === "completed" ||
      committee.monthlyCycles?.length >= committee.duration ||
      committee.completedAt

    const matchesStatus = statusFilter === "all" || committee.status.toLowerCase() === statusFilter.toLowerCase()

    // Only show active committees in existing committees tab
    return matchesSearch && matchesStatus && !isCompleted
  })

  const completedCommittees = committees.filter((committee) => {
    const isCompleted =
      committee.status?.toLowerCase() === "completed" ||
      committee.monthlyCycles?.length >= committee.duration ||
      committee.completedAt
    return isCompleted
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
      case "closed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const generateCommitteeReport = (committee: Committee) => {
    const reportContent = `
      COMMITTEE REPORT
      ================
      
      Committee Name: ${committee.name}
      Committee ID: ${committee.id}
      Start Date: ${new Date(committee.startDate).toLocaleDateString()}
      Members: ${committee.members}
      Duration: ${committee.duration} months
      Monthly Amount: ₹${committee.monthlyAmount?.toLocaleString()}
      Total Fund: ₹${committee.totalFund?.toLocaleString()}
      Current Month: ${committee.currentMonth}
      Status: ${committee.status}
      
      MEMBER DETAILS:
      ${
        committee.committeeMembers
          ?.map((member: any, index: number) => `${index + 1}. ${member.name} - ${member.mobile}`)
          .join("\n") || "No members added"
      }
      
      PAYMENT SUMMARY:
      Total Payments: ${committee.paymentHistory?.length || 0}
      Total Amount Collected: ₹${committee.paymentHistory?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0)?.toLocaleString() || "0"}
      
      Generated on: ${new Date().toLocaleString()}
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Committee Report - ${committee.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; border-bottom: 2px solid #333; }
              pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            <pre>${reportContent}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const generateMonthlyReport = (selectedCommitteeId: string, month: number) => {
    const committee = committees.find((c) => c.id === selectedCommitteeId)
    if (!committee) {
      alert("Committee not found!")
      return
    }

    const allPayments = JSON.parse(localStorage.getItem(`committee_payments_${selectedCommitteeId}`) || "[]")
    const payments = allPayments.filter((p: any) => Number(p.paymentMonth) === Number(month))

    const cycleData = (committee.monthlyCycles || []).find((cycle: any) => Number(cycle.month) === Number(month))

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>Monthly Report - ${committee.name} - Month ${month}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .committee-info { margin-bottom: 24px; background: #f8f9fa; padding: 16px; border-radius: 8px; }
            .section { margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .total-row { background-color: #e9ecef; font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Monthly Committee Report</h1>
            <h2>${committee.name}</h2>
            <p>Committee ID: ${committee.id} | Month: ${month} | Generated: ${new Date().toLocaleDateString("en-IN")}</p>
          </div>

          <div class="committee-info">
            <h3>Committee Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <p><strong>Committee Head:</strong> ${committee.committeeHead || "-"}</p>
                <p><strong>Total Members:</strong> ${committee.committeeMembers?.length || 0}</p>
                <p><strong>Monthly Amount:</strong> ₹${committee.monthlyAmount?.toLocaleString()}</p>
              </div>
              <div>
                <p><strong>Duration:</strong> ${committee.duration} months</p>
                <p><strong>Start Date:</strong> ${new Date(committee.startDate).toLocaleDateString("en-IN")}</p>
                <p><strong>Status:</strong> ${committee.status}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Member Payment Details (Month ${month})</h3>
            <table>
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Contact</th>
                  <th>Paid This Month</th>
                  <th>Payment Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                ${
                  (committee.committeeMembers || [])
                    .map((member: any) => {
                      const memberPayments = payments.filter(
                        (p: any) => p.memberName === member.name && p.status === "paid",
                      )
                      const paidThisMonth = memberPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
                      const lastPayment = memberPayments.sort(
                        (a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
                      )[0]
                      const status = paidThisMonth > 0 ? "PAID" : "PENDING"
                      return `
                        <tr>
                          <td>${member.name}</td>
                          <td>${member.mobile || "-"}</td>
                          <td>₹${paidThisMonth.toLocaleString()}</td>
                          <td>${status}</td>
                          <td>${lastPayment ? new Date(lastPayment.paymentDate).toLocaleDateString("en-IN") : "-"}</td>
                        </tr>
                      `
                    })
                    .join("") || `<tr><td colspan="5">No member data found</td></tr>`
                }
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Monthly Cycle (Month ${month})</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Withdrawer</th>
                  <th>Withdrawal Date</th>
                  <th>Amount Withdrawn</th>
                  <th>Balance Left</th>
                </tr>
              </thead>
              <tbody>
                ${
                  cycleData
                    ? `
                      <tr>
                        <td>Month ${month}</td>
                        <td>${cycleData.withdrawerName}${cycleData.isHead ? " (Head)" : ""}</td>
                        <td>${cycleData.withdrawalDate ? new Date(cycleData.withdrawalDate).toLocaleDateString("en-IN") : "-"}</td>
                        <td>₹${(cycleData.withdrawAmount || 0).toLocaleString()}</td>
                        <td>₹${(cycleData.balanceLeft || 0).toLocaleString()}</td>
                      </tr>
                    `
                    : `<tr><td colspan="5">No cycle data recorded for Month ${month}</td></tr>`
                }
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Financial Summary (Month ${month})</h3>
            <table>
              <tbody>
                <tr>
                  <td><strong>Total Expected (This Month)</strong></td>
                  <td>₹${((committee.monthlyAmount || 0) * (committee.committeeMembers?.length || 0)).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Total Collected (This Month)</strong></td>
                  <td>₹${payments.reduce((sum: number, p: any) => sum + (p.status === "paid" ? p.amount : 0), 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Withdrawn (This Month)</strong></td>
                  <td>₹${(cycleData?.withdrawAmount || 0).toLocaleString()}</td>
                </tr>
                <tr class="total-row">
                  <td><strong>Outstanding (This Month)</strong></td>
                  <td>₹${(
                    (committee.monthlyAmount || 0) * (committee.committeeMembers?.length || 0) -
                      payments.reduce((sum: number, p: any) => sum + (p.status === "paid" ? p.amount : 0), 0)
                  ).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const generateAllMonthsReport = (committee: Committee) => {
    const payments = JSON.parse(localStorage.getItem(`committee_payments_${committee.id}`) || "[]")
    const monthlyCycles = committee.monthlyCycles || []

    // Get completion date from last withdrawal
    const completionDate = monthlyCycles.length > 0 ? monthlyCycles[monthlyCycles.length - 1].withdrawalDate : null

    const allMonthsData = Array.from({ length: committee.duration }, (_, i) => {
      const month = i + 1
      const monthPayments = payments.filter((p: any) => p.paymentMonth === month && p.status === "paid")
      const totalContribution = monthPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
      const cycleData = monthlyCycles.find((cycle: any) => cycle.month === month)

      return {
        month,
        totalContribution,
        withdrawer: cycleData?.withdrawerName || "-",
        withdrawAmount: cycleData?.withdrawAmount || 0,
        withdrawalDate: cycleData?.withdrawalDate || "-",
        balanceLeft: cycleData?.balanceLeft || 0,
        status: cycleData ? "COMPLETED" : totalContribution > 0 ? "COLLECTED" : "PENDING",
      }
    })

    const reportContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 15px;">
          <h1 style="color: #1e40af; margin: 0; font-size: 28px;">COMPREHENSIVE COMMITTEE REPORT</h1>
          <h2 style="color: #64748b; margin: 5px 0; font-size: 20px;">All Months - ${committee.name}</h2>
          <p style="color: #64748b; margin: 0;">Committee ID: ${committee.id} | Duration: ${committee.duration} months | Generated: ${new Date().toLocaleDateString()}</p>
          ${completionDate ? `<p style="color: #dc2626; font-weight: bold; margin: 5px 0;">Committee Completed: ${new Date(completionDate).toLocaleDateString()}</p>` : ""}
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Monthly Summary Overview</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">Month</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left;">Withdrawer</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">Withdrawal Date</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">Total Collected</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">Amount Withdrawn</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">Balance</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${allMonthsData
                .map(
                  ({ month, totalContribution, withdrawer, withdrawAmount, withdrawalDate, balanceLeft, status }) => {
                    const statusColor =
                      status === "COMPLETED" ? "#10b981" : status === "COLLECTED" ? "#3b82f6" : "#f59e0b"

                    return `
                  <tr>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; font-weight: bold;">Month ${month}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px;">${withdrawer}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">${withdrawalDate !== "-" ? new Date(withdrawalDate).toLocaleDateString() : "-"}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">₹${totalContribution.toLocaleString()}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">₹${withdrawAmount.toLocaleString()}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">₹${balanceLeft.toLocaleString()}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center; color: ${statusColor}; font-weight: bold;">${status}</td>
                  </tr>
                `
                  },
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; font-weight: bold;">
                <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">TOTAL</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px;">-</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px;">-</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">₹${allMonthsData.reduce((sum, data) => sum + data.totalContribution, 0).toLocaleString()}</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">₹${allMonthsData.reduce((sum, data) => sum + data.withdrawAmount, 0).toLocaleString()}</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">₹${allMonthsData.reduce((sum, data) => sum + data.balanceLeft, 0).toLocaleString()}</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px;">-</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Complete Member Directory</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left;">Member Name</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left;">Contact Details</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">Role</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">Total Contributions</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                committee.committeeMembers
                  ?.map((member: any, index: number) => {
                    const memberPayments = payments.filter(
                      (p: any) => p.memberName === member.name && p.status === "paid",
                    )
                    const totalPaid = memberPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
                    const expectedTotal = committee.monthlyAmount * committee.duration
                    const paymentRate = expectedTotal > 0 ? ((totalPaid / expectedTotal) * 100).toFixed(1) : "0.0"
                    const isHead = member.name === committee.committeeHead

                    return `
                  <tr>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: bold;">${member.name}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px;">
                      <div>${member.mobile || "N/A"}</div>
                      <div style="color: #64748b; font-size: 12px;">${member.email || "N/A"}</div>
                    </td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">
                      <span style="background: ${isHead ? "#fef3c7" : "#f0f9ff"}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                        ${isHead ? "HEAD" : "MEMBER"}
                      </span>
                    </td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right; font-weight: bold;">₹${totalPaid.toLocaleString()}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: center;">
                      <div style="color: ${Number.parseFloat(paymentRate) >= 100 ? "#10b981" : Number.parseFloat(paymentRate) >= 50 ? "#f59e0b" : "#dc2626"}; font-weight: bold;">
                        ${paymentRate}%
                      </div>
                    </td>
                  </tr>
                `
                  })
                  .join("") ||
                '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #64748b;">No member data available</td></tr>'
              }
            </tbody>
          </table>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b;">
          <p>This comprehensive all-months report was generated on ${new Date().toLocaleString()}</p>
          <p style="font-size: 12px;">Suraksha Savings Society - Committee Management System</p>
        </div>
      </div>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>All Months Report - ${committee.name}</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print { 
                body { margin: 15px; }
                .no-print { display: none; }
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

  const generateCommitteeSummaryReport = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const totalCommittees = committees.length
    const activeCommittees = committees.filter((c) => {
      const isCompleted =
        c.status?.toLowerCase() === "completed" || c.monthlyCycles?.length >= c.duration || c.completedAt
      return !isCompleted
    }).length
    const completedCommitteesCount = totalCommittees - activeCommittees
    const totalMembers = committees.reduce((sum, c) => sum + (c.committeeMembers?.length || 0), 0)
    const totalFunds = committees.reduce((sum, c) => {
      const payments = JSON.parse(localStorage.getItem(`committee_payments_${c.id}`) || "[]")
      return sum + payments.reduce((pSum, p) => pSum + (p.status === "paid" ? p.amount : 0), 0)
    }, 0)

    const printContent = `
      <html>
        <head>
          <title>Committee Summary Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
            .card h3 { margin: 0 0 10px 0; color: #333; }
            .card .value { font-size: 2em; font-weight: bold; color: #007bff; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .status-active { color: #28a745; font-weight: bold; }
            .status-completed { color: #dc3545; font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Committee Summary Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}</p>
          </div>
          
          <div class="summary-cards">
            <div class="card">
              <h3>Total Committees</h3>
              <div class="value">${totalCommittees}</div>
            </div>
            <div class="card">
              <h3>Active Committees</h3>
              <div class="value">${activeCommittees}</div>
            </div>
            <div class="card">
              <h3>Completed Committees</h3>
              <div class="value">${completedCommitteesCount}</div>
            </div>
            <div class="card">
              <h3>Total Members</h3>
              <div class="value">${totalMembers}</div>
            </div>
            <div class="card">
              <h3>Total Funds</h3>
              <div class="value">₹${totalFunds.toLocaleString()}</div>
            </div>
          </div>

          <h3>Committee Details</h3>
          <table>
            <thead>
              <tr>
                <th>Committee ID</th>
                <th>Committee Name</th>
                <th>Members</th>
                <th>Monthly Amount</th>
                <th>Duration</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Completion Date</th>
              </tr>
            </thead>
            <tbody>
              ${committees
                .map((committee) => {
                  const isCompleted =
                    committee.status?.toLowerCase() === "completed" ||
                    committee.monthlyCycles?.length >= committee.duration ||
                    committee.completedAt

                  const status = isCompleted ? "Completed" : "Active"

                  const completionDate =
                    isCompleted && committee.monthlyCycles && committee.monthlyCycles.length > 0
                      ? committee.monthlyCycles[committee.monthlyCycles.length - 1].withdrawalDate
                      : isCompleted && committee.completedAt
                        ? committee.completedAt
                        : null

                  return `
                  <tr>
                    <td>${committee.id}</td>
                    <td>${committee.name}</td>
                    <td>${committee.committeeMembers?.length || 0}</td>
                    <td>₹${committee.monthlyAmount?.toLocaleString()}</td>
                    <td>${committee.duration} months</td>
                    <td>${new Date(committee.createdAt).toLocaleDateString("en-IN")}</td>
                    <td class="status-${status.toLowerCase()}">${status}</td>
                    <td>${completionDate ? new Date(completionDate).toLocaleDateString("en-IN") : "–"}</td>
                  </tr>
                `
                })
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const generateCommitteeAnnualReport = (year: string) => {
    const yearCommittees = committees.filter((c) => new Date(c.createdAt).getFullYear().toString() === year)

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>Annual Committee Report ${year}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .summary-section { margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
            .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
            .metric { text-align: center; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #007bff; }
            .metric h4 { margin: 0 0 10px 0; color: #333; }
            .metric .value { font-size: 1.5em; font-weight: bold; color: #007bff; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .status-active { color: #28a745; font-weight: bold; }
            .status-completed { color: #dc3545; font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Annual Committee Report</h1>
            <h2>Year: ${year}</h2>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}</p>
          </div>
          
          <div class="summary-section">
            <h3>Annual Summary</h3>
            <div class="metrics">
              <div class="metric">
                <h4>Committees Created</h4>
                <div class="value">${yearCommittees.length}</div>
              </div>
              <div class="metric">
                <h4>Total Members</h4>
                <div class="value">${yearCommittees.reduce((sum, c) => sum + (c.committeeMembers?.length || 0), 0)}</div>
              </div>
              <div class="metric">
                <h4>Total Funds Collected</h4>
                <div class="value">₹${yearCommittees
                  .reduce((sum, c) => {
                    const payments = JSON.parse(localStorage.getItem(`committee_payments_${c.id}`) || "[]")
                    return sum + payments.reduce((pSum, p) => pSum + (p.status === "paid" ? p.amount : 0), 0)
                  }, 0)
                  .toLocaleString()}</div>
              </div>
              <div class="metric">
                <h4>Completed Committees</h4>
                <div class="value">${
                  yearCommittees.filter((c) => {
                    const isCompleted =
                      c.status?.toLowerCase() === "completed" || c.monthlyCycles?.length >= c.duration || c.completedAt
                    return isCompleted
                  }).length
                }</div>
              </div>
            </div>
          </div>

          <h3>Committee Details for ${year}</h3>
          <table>
            <thead>
              <tr>
                <th>Committee ID</th>
                <th>Committee Name</th>
                <th>Members</th>
                <th>Monthly Amount</th>
                <th>Duration</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Completion Date</th>
                <th>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              ${yearCommittees
                .map((committee) => {
                  const isCompleted =
                    committee.status?.toLowerCase() === "completed" ||
                    committee.monthlyCycles?.length >= committee.duration ||
                    committee.completedAt
                  const status = isCompleted ? "Completed" : "Active"
                  const payments = JSON.parse(localStorage.getItem(`committee_payments_${committee.id}`) || "[]")
                  const totalCollected = payments.reduce((sum, p) => sum + (p.status === "paid" ? p.amount : 0), 0)

                  const completionDate =
                    committee.monthlyCycles && committee.monthlyCycles.length > 0
                      ? committee.monthlyCycles[committee.monthlyCycles.length - 1].withdrawalDate
                      : committee.completedAt

                  return `
                  <tr>
                    <td>${committee.id}</td>
                    <td>${committee.name}</td>
                    <td>${committee.committeeMembers?.length || 0}</td>
                    <td>₹${committee.monthlyAmount?.toLocaleString()}</td>
                    <td>${committee.duration} months</td>
                    <td>${new Date(committee.createdAt).toLocaleDateString("en-IN")}</td>
                    <td class="status-${status.toLowerCase()}">${status}</td>
                    <td>${completionDate ? new Date(completionDate).toLocaleDateString("en-IN") : "-"}</td>
                    <td>₹${totalCollected.toLocaleString()}</td>
                  </tr>
                `
                })
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const generateIndividualMemberReport = (committeeId: string, memberName: string) => {
    const committee = committees.find((c) => c.id === committeeId)
    if (!committee) {
      alert("Committee not found!")
      return
    }

    const member = committee.committeeMembers?.find((m) => m.name === memberName)
    if (!member) {
      alert("Member not found!")
      return
    }

    const allPayments = JSON.parse(localStorage.getItem(`committee_payments_${committeeId}`) || "[]")
    const memberPayments = allPayments.filter((p: any) => p.memberName === member.name && p.status === "paid")

    const memberWithdrawals = (committee.monthlyCycles || []).filter(
      (cycle: any) => cycle.withdrawerName === memberName,
    )

    const totalPaid = memberPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
    const totalWithdrawn = memberWithdrawals.reduce((sum: number, w: any) => sum + (w.withdrawAmount || 0), 0)
    const expectedTotal = committee.monthlyAmount * committee.duration
    const lateFees = memberPayments.reduce((sum: number, p: any) => sum + (p.lateFee || 0), 0)

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>Individual Member Report - ${memberName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #f97316; padding-bottom: 20px; }
            .member-info { margin-bottom: 24px; background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; }
            .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
            .summary-card { background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center; }
            .summary-card h4 { margin: 0 0 8px 0; color: #64748b; font-size: 14px; }
            .summary-card .value { font-size: 24px; font-weight: bold; color: #1e293b; }
            .section { margin-bottom: 24px; }
            .section h3 { color: #f97316; border-bottom: 2px solid #fed7aa; padding-bottom: 8px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #fff7ed; font-weight: bold; color: #9a3412; }
            .total-row { background-color: #fef3c7; font-weight: bold; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Individual Member Report</h1>
            <h2>${memberName}</h2>
            <p>Committee: ${committee.name} (${committee.id})</p>
            <p>Generated: ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}</p>
          </div>

          <div class="member-info">
            <h3>Member Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <p><strong>Name:</strong> ${member.name}</p>
                <p><strong>Mobile:</strong> ${member.mobile || "N/A"}</p>
                <p><strong>Email:</strong> ${member.email || "N/A"}</p>
              </div>
              <div>
                <p><strong>Role:</strong> ${member.name === committee.committeeHead ? "Committee Head" : "Member"}</p>
                <p><strong>Committee Duration:</strong> ${committee.duration} months</p>
                <p><strong>Monthly Amount:</strong> ₹${committee.monthlyAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div class="summary-grid">
            <div class="summary-card">
              <h4>Expected Total</h4>
              <div class="value">₹${expectedTotal.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <h4>Total Paid</h4>
              <div class="value" style="color: #10b981;">₹${totalPaid.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <h4>Total Withdrawn</h4>
              <div class="value" style="color: #3b82f6;">₹${totalWithdrawn.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <h4>Late Fees</h4>
              <div class="value" style="color: #dc2626;">₹${lateFees.toLocaleString()}</div>
            </div>
            <div class="summary-card">
              <h4>Balance</h4>
              <div class="value" style="color: ${expectedTotal - totalPaid > 0 ? "#dc2626" : "#10b981"};">
                ₹${Math.abs(expectedTotal - totalPaid).toLocaleString()}
                ${expectedTotal - totalPaid > 0 ? " (Due)" : " (Paid)"}
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Payment History</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Payment Date</th>
                  <th>Amount Paid</th>
                  <th>Late Fee</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                ${
                  memberPayments.length > 0
                    ? memberPayments
                        .sort((a: any, b: any) => a.paymentMonth - b.paymentMonth)
                        .map(
                          (payment: any) => `
                          <tr>
                            <td>Month ${payment.paymentMonth}</td>
                            <td>${new Date(payment.paymentDate).toLocaleDateString("en-IN")}</td>
                            <td>₹${payment.amount?.toLocaleString()}</td>
                            <td>₹${(payment.lateFee || 0).toLocaleString()}</td>
                            <td>₹${((payment.amount || 0) + (payment.lateFee || 0)).toLocaleString()}</td>
                            <td>${payment.paymentMethod || "Cash"}</td>
                          </tr>
                        `,
                        )
                        .join("")
                    : `<tr><td colspan="6" style="text-align: center; color: #64748b;">No payment records found</td></tr>`
                }
              </tbody>
              ${
                memberPayments.length > 0
                  ? `
                <tfoot>
                  <tr class="total-row">
                    <td colspan="2"><strong>TOTAL</strong></td>
                    <td><strong>₹${totalPaid.toLocaleString()}</strong></td>
                    <td><strong>₹${lateFees.toLocaleString()}</strong></td>
                    <td><strong>₹${(totalPaid + lateFees).toLocaleString()}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              `
                  : ""
              }
            </table>
          </div>

          <div class="section">
            <h3>Withdrawal History</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Withdrawal Date</th>
                  <th>Amount Withdrawn</th>
                  <th>Balance Left</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${
                  memberWithdrawals.length > 0
                    ? memberWithdrawals
                        .sort((a: any, b: any) => a.month - b.month)
                        .map(
                          (withdrawal: any) => `
                          <tr>
                            <td>Month ${withdrawal.month}</td>
                            <td>${withdrawal.withdrawalDate ? new Date(withdrawal.withdrawalDate).toLocaleDateString("en-IN") : "Pending"}</td>
                            <td>₹${(withdrawal.withdrawAmount || 0).toLocaleString()}</td>
                            <td>₹${(withdrawal.balanceLeft || 0).toLocaleString()}</td>
                            <td>${withdrawal.withdrawalDate ? "Completed" : "Pending"}</td>
                          </tr>
                        `,
                        )
                        .join("")
                    : `<tr><td colspan="5" style="text-align: center; color: #64748b;">No withdrawal records found</td></tr>`
                }
              </tbody>
              ${
                memberWithdrawals.length > 0
                  ? `
                <tfoot>
                  <tr class="total-row">
                    <td colspan="2"><strong>TOTAL WITHDRAWN</strong></td>
                    <td><strong>₹${totalWithdrawn.toLocaleString()}</strong></td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              `
                  : ""
              }
            </table>
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b;">
            <p>This individual member report was generated on ${new Date().toLocaleString()}</p>
            <p style="font-size: 12px;">Suraksha Savings Society - Committee Management System</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Committee Management</h1>
                <p className="text-sm text-slate-600">Comprehensive committee management & advanced reporting</p>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Advanced Module</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={tabFromQuery || "create"} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Create Committee
            </TabsTrigger>
            <TabsTrigger value="existing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Existing Committee
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Advanced Reports
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Committee History
            </TabsTrigger>
          </TabsList>

          {/* Create Committee Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create New Committee</span>
                </CardTitle>
                <CardDescription>Set up a new chit fund committee with members and structure</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/committee/create">
                  <Button className="w-full" size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Start Creating Committee
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Existing Committee Tab */}
          <TabsContent value="existing" className="space-y-6">
            {/* remove duplicate stat cards section to keep only committee listing/views */}
            {/*
            <div className="grid lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300"> ... Total Committees ... </Card>
              <Card className="hover:shadow-lg transition-all duration-300"> ... Active Committees ... </Card>
              <Card className="hover:shadow-lg transition-all duration-300"> ... Total Members ... </Card>
              <Card className="hover:shadow-lg transition-all duration-300"> ... Total Funds ... </Card>
            </div>
            */}
            {/* Enhanced Search and Filter Section */}
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter Committees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name or committee ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-slate-300"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Select defaultValue="all" onValueChange={setStatusFilter}>
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Updated Table Section with Better Styling and Delete Functionality */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Committee Details</CardTitle>
                <CardDescription>View all existing committee accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.NO</TableHead>
                        <TableHead>Committee ID</TableHead>
                        <TableHead>Committee Name</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Monthly Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCommittees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            {committees.length === 0
                              ? "No committees created yet. Create your first committee to get started."
                              : "No committees match your search criteria."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCommittees.map((committee, index) => (
                          <TableRow key={committee.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{committee.id}</TableCell>
                            <TableCell>{committee.name}</TableCell>
                            <TableCell>{committee.committeeMembers?.length || 0}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(committee.status)}`}
                              >
                                {committee.status}
                              </span>
                            </TableCell>
                            <TableCell>₹{committee.monthlyAmount?.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Link href={`/admin/committee/${committee.id}/details`}>
                                  <Button variant="outline" size="sm">
                                    <div className="h-4 w-4 text-slate-600 flex items-center justify-center">👁</div>
                                    Details
                                  </Button>
                                </Link>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        `Are you sure you want to delete committee "${committee.name}"? This action cannot be undone.`,
                                      )
                                    ) {
                                      try {
                                        // Deep-wipe all committee-related storage (payments, cycles, fees, sessions, etc.)
                                        wipeCommitteeData(committee.id)

                                        // Also update current UI list state
                                        const updatedCommittees = committees.filter((c) => c.id !== committee.id)
                                        setCommittees(updatedCommittees)
                                        localStorage.setItem("committees", JSON.stringify(updatedCommittees))
                                      } catch (e) {
                                        console.error("[v0] Error during committee wipe:", e)
                                      }
                                    }
                                  }}
                                >
                                  <div className="h-4 w-4 text-white flex items-center justify-center">🗑</div>
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Committee Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Monthly Reports Card */}
              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">Monthly Reports</CardTitle>
                      <CardDescription className="text-slate-600">Detailed month-wise analysis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Select Committee</label>
                      <Select value={selectedCommittee} onValueChange={setSelectedCommittee}>
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Choose committee" />
                        </SelectTrigger>
                        <SelectContent>
                          {committees.map((committee) => (
                            <SelectItem key={committee.id} value={committee.id}>
                              {committee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCommittee !== "all" && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Select Month</label>
                        <Select
                          value={selectedMonth ? String(selectedMonth) : ""}
                          onValueChange={(v) => setSelectedMonth(Number(v))}
                        >
                          <SelectTrigger className="border-slate-300">
                            <SelectValue placeholder="Choose month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: committees.find((c) => c.id === selectedCommittee)?.duration || 12 },
                              (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  Month {i + 1}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      const committee = committees.find((c) => c.id === selectedCommittee)
                      if (committee && selectedMonth) generateMonthlyReport(committee.id, Number(selectedMonth))
                    }}
                    disabled={selectedCommittee === "all" || !selectedMonth}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Monthly Report
                  </Button>

                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2"
                    onClick={() => {
                      const committee = committees.find((c) => c.id === selectedCommittee)
                      if (committee) generateAllMonthsReport(committee)
                    }}
                    disabled={selectedCommittee === "all"}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download All Months Report
                  </Button>
                </CardContent>
              </Card>

              {/* Committee Summary Card */}
              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <div className="h-6 w-6 text-green-600 flex items-center justify-center">📊</div>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">Committee Summary</CardTitle>
                      <CardDescription className="text-slate-600">Overall performance metrics</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-600" />
                        <span className="text-xs text-slate-600">Total Committees</span>
                      </div>
                      <p className="font-bold text-xl text-slate-800">{committees.length}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-slate-600">Active</span>
                      </div>
                      <p className="font-bold text-xl text-green-600">
                        {
                          committees.filter((c) => {
                            const isCompleted =
                              c.status?.toLowerCase() === "completed" ||
                              c.monthlyCycles?.length >= c.duration ||
                              c.completedAt
                            return !isCompleted
                          }).length
                        }
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-slate-600" />
                        <span className="text-xs text-slate-600">Total Members</span>
                      </div>
                      <p className="font-bold text-xl text-slate-800">
                        {committees.reduce((sum, c) => sum + (c.committeeMembers?.length || 0), 0)}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 text-blue-600 flex items-center justify-center">₹</div>
                        <span className="text-xs text-slate-600">Total Funds</span>
                      </div>
                      <p className="font-bold text-xl text-blue-600">
                        ₹
                        {(
                          committees.reduce((sum, c) => {
                            const payments = JSON.parse(localStorage.getItem(`committee_payments_${c.id}`) || "[]")
                            return sum + payments.reduce((pSum, p) => pSum + (p.status === "paid" ? p.amount : 0), 0)
                          }, 0) / 100000
                        ).toFixed(1)}
                        L
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={generateCommitteeSummaryReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Summary Report
                  </Button>
                </CardContent>
              </Card>

              {/* Annual Reports Card */}
              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <div className="h-6 w-6 text-purple-600 flex items-center justify-center">📅</div>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">Annual Reports</CardTitle>
                      <CardDescription className="text-slate-600">Yearly comprehensive analysis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Select Year</label>
                      <Select>
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Choose year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(committees.map((c) => new Date(c.createdAt).getFullYear()))).map(
                            (year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-600 mb-1">This Year's Committees</p>
                    <p className="font-bold text-lg text-purple-800">
                      {
                        committees.filter((c) => new Date(c.createdAt).getFullYear() === new Date().getFullYear())
                          .length
                      }
                    </p>
                  </div>

                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => generateCommitteeAnnualReport(new Date().getFullYear().toString())}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Generate Annual Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">Individual Member Reports</CardTitle>
                      <CardDescription className="text-slate-600">Member payment & withdrawal details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Select Committee</label>
                      <Select value={selectedMemberCommittee} onValueChange={setSelectedMemberCommittee}>
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Choose committee" />
                        </SelectTrigger>
                        <SelectContent>
                          {committees.map((committee) => (
                            <SelectItem key={committee.id} value={committee.id}>
                              {committee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedMemberCommittee !== "all" && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Select Member</label>
                        <Select value={selectedMember} onValueChange={setSelectedMember}>
                          <SelectTrigger className="border-slate-300">
                            <SelectValue placeholder="Choose member" />
                          </SelectTrigger>
                          <SelectContent>
                            {committees
                              .find((c) => c.id === selectedMemberCommittee)
                              ?.committeeMembers?.map((member: any) => (
                                <SelectItem key={member.name} value={member.name}>
                                  {member.name}
                                  {member.name ===
                                  committees.find((c) => c.id === selectedMemberCommittee)?.committeeHead
                                    ? " (Head)"
                                    : ""}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {selectedMemberCommittee !== "all" && selectedMember !== "all" && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-xs text-orange-600 mb-1">Member Summary</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-orange-800 font-semibold">
                            Paid: ₹{(() => {
                              const payments = JSON.parse(
                                localStorage.getItem(`committee_payments_${selectedMemberCommittee}`) || "[]",
                              )
                              return payments
                                .filter((p: any) => p.memberName === selectedMember && p.status === "paid")
                                .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
                                .toLocaleString()
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-orange-800 font-semibold">
                            Withdrawn: ₹{(() => {
                              const committee = committees.find((c) => c.id === selectedMemberCommittee)
                              return (committee?.monthlyCycles || [])
                                .filter((cycle: any) => cycle.withdrawerName === selectedMember)
                                .reduce((sum: number, w: any) => sum + (w.withdrawAmount || 0), 0)
                                .toLocaleString()
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      if (selectedMemberCommittee !== "all" && selectedMember !== "all") {
                        generateIndividualMemberReport(selectedMemberCommittee, selectedMember)
                      }
                    }}
                    disabled={selectedMemberCommittee === "all" || selectedMember === "all"}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Member Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Committee History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Committee History</CardTitle>
                <CardDescription>View all completed committees with their completion details</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const completedCommittees = committees.filter((c) => {
                    const isCompleted =
                      c.status?.toLowerCase() === "completed" || c.monthlyCycles?.length >= c.duration || c.completedAt
                    return isCompleted
                  })

                  if (completedCommittees.length === 0) {
                    return <div className="text-center py-8 text-muted-foreground">No completed committees found.</div>
                  }

                  return (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>S.NO</TableHead>
                            <TableHead>Committee ID</TableHead>
                            <TableHead>Committee Name</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead>Monthly Amount</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead>Completion Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedCommittees.map((committee, index) => {
                            const isCompleted =
                              committee.status?.toLowerCase() === "completed" ||
                              committee.monthlyCycles?.length >= committee.duration ||
                              committee.completedAt

                            const completionDate =
                              isCompleted && committee.monthlyCycles && committee.monthlyCycles.length > 0
                                ? committee.monthlyCycles[committee.monthlyCycles.length - 1].withdrawalDate
                                : isCompleted && committee.completedAt
                                  ? committee.completedAt
                                  : null

                            return (
                              <TableRow key={committee.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{committee.id}</TableCell>
                                <TableCell>{committee.name}</TableCell>
                                <TableCell>{committee.committeeMembers?.length || 0}</TableCell>
                                <TableCell>₹{committee.monthlyAmount?.toLocaleString()}</TableCell>
                                <TableCell>{committee.duration} months</TableCell>
                                <TableCell>{new Date(committee.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  {completionDate ? new Date(completionDate).toLocaleDateString() : "–"}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => router.push(`/admin/committee/${committee.id}/details`)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View Details
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateAllMonthsReport(committee)}
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      Report
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CommitteeManagementLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-9 w-32 bg-slate-200 animate-pulse rounded" />
              <div>
                <div className="h-8 w-64 bg-slate-200 animate-pulse rounded mb-2" />
                <div className="h-4 w-96 bg-slate-200 animate-pulse rounded" />
              </div>
            </div>
            <div className="h-8 w-32 bg-slate-200 animate-pulse rounded-full" />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 bg-white rounded-lg shadow-sm animate-pulse" />
      </div>
    </div>
  )
}

export default function CommitteeManagement() {
  return (
    <Suspense fallback={<CommitteeManagementLoading />}>
      <CommitteeManagementContent />
    </Suspense>
  )
}
