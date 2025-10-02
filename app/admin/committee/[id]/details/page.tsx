"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Calendar,
  Users,
  Building2,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  Plus,
  Edit,
  Save,
  X,
  Calculator,
  CheckCircle,
  Clock,
  Crown,
  IndianRupee,
  Trash2,
  FileText,
} from "lucide-react"
import { wipeCommitteeAndRefresh } from "@/lib/committee-storage"

interface CommitteeMember {
  name: string
  mobile: string
  email: string
  address: string
}

interface Committee {
  id: string
  name: string
  description: string
  members: number
  duration: number
  monthlyAmount: number
  startDate: string
  governmentDeduction: number
  rules: string
  committeeHead: string
  committeeMembers: CommitteeMember[]
  status: string
  totalFund: number
  createdAt: string
  monthlyCycles?: MonthlyCycle[]
  completedAt?: string
}

interface MonthlyCycle {
  month: number
  withdrawerName: string
  withdrawAmount: number
  withdrawalDate: string
  balanceLeft: number
  lossPercentage: number
  nextMonthContributions: { [memberName: string]: number }
  isHead: boolean
  isLastMember: boolean
}

interface Payment {
  id: string
  memberName: string
  amount: number
  paymentMode: string
  paymentDate: string
  dueDate: string
  status: "paid" | "pending" | "overdue"
  remarks: string
  lateFees: number
  month: string // Format: "YYYY-MM"
  paymentMonth: number // 1-based month number for the committee cycle
}

interface MemberPaymentStatus {
  memberName: string
  currentMonth: number
  totalPaid: number
  monthlyPayments: { [month: number]: Payment | null }
  status: "paid" | "pending" | "overdue"
  nextDueDate: string
}

// Added interface for member report data
interface MemberReportData {
  payments: Payment[]
  totalPaid: number
  totalLateFees: number
  expectedTotal: number
  balance: number
  paymentCount: number
}

// Added interface for withdrawal data in member report
interface MemberWithdrawal {
  month: number
  amount: number
  date: string
  isHead: boolean
  lossPercentage: number
}

export default function CommitteeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [committee, setCommittee] = useState<Committee | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [memberStatuses, setMemberPaymentStatus] = useState<MemberPaymentStatus[]>([])
  const [currentCommitteeMonth, setCurrentCommitteeMonth] = useState(1)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [showLateFeeCalculator, setShowLateFeeCalculator] = useState(false)
  const [showMonthlyCycleForm, setShowMonthlyCycleForm] = useState(false)
  const [monthlyCycleForm, setMonthlyCycleForm] = useState({
    month: 1,
    withdrawerName: "",
    withdrawAmount: "",
    withdrawalDate: new Date().toISOString().split("T")[0],
  })
  const [autoUpdateStatus, setAutoUpdateStatus] = useState<{
    isProcessing: boolean
    message: string
    lastUpdate: string | null
  }>({
    isProcessing: false,
    message: "",
    lastUpdate: null,
  })
  const [lateFeeSettings, setLateFeeSettings] = useState({
    dailyRate: 10, // Default ₹10 per day
    maxLateFee: 500, // Maximum late fee cap
    gracePeriod: 7, // Grace period in days
  })
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    duration: "",
    monthlyAmount: "",
    startDate: "",
    committeeHead: "",
    governmentDeduction: "",
    rules: "",
  })
  const [paymentForm, setPaymentForm] = useState({
    memberName: "",
    amount: "",
    paymentMode: "cash",
    paymentDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    remarks: "",
    lateFees: "0",
    paymentMonth: "1",
    autoCalculateLateFees: true,
    customLateFeeReason: "",
  })

  const [multiPaymentForm, setMultiPaymentForm] = useState({
    selectedMembers: [] as string[],
    amount: "",
    paymentMode: "cash",
    paymentDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    remarks: "",
    lateFees: "0",
    paymentMonth: "1",
    autoCalculateLateFees: true,
    customLateFeeReason: "",
  })
  const [showMultiPaymentForm, setShowMultiPaymentForm] = useState(false)
  const [monthlyCycles, setMonthlyCycles] = useState<MonthlyCycle[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)

  const [showMemberReport, setShowMemberReport] = useState(false)
  const [selectedMemberForReport, setSelectedMemberForReport] = useState<string>("")

  useEffect(() => {
    const loadCommitteeDetails = () => {
      try {
        const savedCommittees = localStorage.getItem("committees")
        if (savedCommittees) {
          const committees = JSON.parse(savedCommittees)
          const foundCommittee = committees.find((c: Committee) => c.id === params.id)
          if (foundCommittee) {
            setCommittee(foundCommittee)
            setEditForm({
              name: foundCommittee.name || "",
              description: foundCommittee.description || "",
              duration: foundCommittee.duration?.toString() || "",
              monthlyAmount: foundCommittee.monthlyAmount?.toString() || "",
              startDate: foundCommittee.startDate || "",
              committeeHead: foundCommittee.committeeHead || "",
              governmentDeduction: foundCommittee.governmentDeduction?.toString() || "",
              rules: foundCommittee.rules || "",
            })

            const savedPayments = localStorage.getItem(`committee_payments_${params.id}`)
            let loadedPayments: Payment[] = []
            if (savedPayments) {
              loadedPayments = JSON.parse(savedPayments)
              setPayments(loadedPayments)
            }

            // Load late fee settings
            const savedLateFeeSettings = localStorage.getItem(`committee_late_fee_settings_${params.id}`)
            if (savedLateFeeSettings) {
              setLateFeeSettings(JSON.parse(savedLateFeeSettings))
            }

            // Calculate current committee month and member statuses
            calculateMemberStatuses(foundCommittee, loadedPayments)
            setMonthlyCycles(foundCommittee.monthlyCycles || [])
          }
        }
      } catch (error) {
        console.error("[v0] Error loading committee details:", error)
      }
    }

    loadCommitteeDetails()
  }, [params.id])

  const calculateLateFees = (dueDate: string, paymentDate: string, baseAmount: number) => {
    if (!dueDate || !paymentDate) return 0

    const due = new Date(dueDate)
    const payment = new Date(paymentDate)
    const daysDiff = Math.floor((payment.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff <= lateFeeSettings.gracePeriod) return 0

    const lateDays = daysDiff - lateFeeSettings.gracePeriod
    const calculatedFee = lateDays * lateFeeSettings.dailyRate

    return Math.min(calculatedFee, lateFeeSettings.maxLateFee)
  }

  useEffect(() => {
    if (paymentForm.autoCalculateLateFees && paymentForm.dueDate && paymentForm.paymentDate) {
      const baseAmount = Number.parseFloat(paymentForm.amount) || committee?.monthlyAmount || 0
      const calculatedLateFees = calculateLateFees(paymentForm.dueDate, paymentForm.paymentDate, baseAmount)

      if (calculatedLateFees !== Number.parseFloat(paymentForm.lateFees)) {
        setPaymentForm((prev) => ({
          ...prev,
          lateFees: calculatedLateFees.toString(),
        }))
      }
    }
  }, [
    paymentForm.dueDate,
    paymentForm.paymentDate,
    paymentForm.autoCalculateLateFees,
    paymentForm.amount,
    committee?.monthlyAmount,
    lateFeeSettings,
  ])

  const handlePaymentFormChange = (field: string, value: string) => {
    setPaymentForm((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-set due date based on committee start date and payment month
      if (field === "paymentMonth" && committee) {
        const startDate = new Date(committee.startDate)
        const dueDate = new Date(startDate)
        dueDate.setMonth(dueDate.getMonth() + Number.parseInt(value) - 1)
        updated.dueDate = dueDate.toISOString().split("T")[0]
      }

      // Auto-set amount to committee monthly amount if not specified
      if (field === "memberName" && !updated.amount && committee) {
        updated.amount = committee.monthlyAmount.toString()
      }

      return updated
    })
  }

  const checkAndUpdateMonthStatus = async (committee: Committee, payments: Payment[], currentMonth: number) => {
    if (!committee.committeeMembers || currentMonth >= committee.duration) return

    const membersInCurrentMonth = committee.committeeMembers.length
    const paidMembersInCurrentMonth = payments.filter(
      (p) => p.paymentMonth === currentMonth && p.status === "paid",
    ).length

    console.log(`[v0] Month ${currentMonth}: ${paidMembersInCurrentMonth}/${membersInCurrentMonth} members paid`)

    // Check if all members have paid for current month
    if (paidMembersInCurrentMonth === membersInCurrentMonth) {
      setAutoUpdateStatus({
        isProcessing: true,
        message: `All members paid for Month ${currentMonth}. Advancing to Month ${currentMonth + 1}...`,
        lastUpdate: new Date().toISOString(),
      })

      // Wait 2 seconds to show the status message
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (currentMonth < committee.duration) {
        // Advance to next month
        const newMonth = currentMonth + 1
        setCurrentCommitteeMonth(newMonth)

        // Update committee status in localStorage
        try {
          const savedCommittees = localStorage.getItem("committees")
          if (savedCommittees) {
            const committees = JSON.parse(savedCommittees)
            const updatedCommittees = committees.map((c: Committee) => {
              if (c.id === committee.id) {
                return {
                  ...c,
                  currentMonth: newMonth,
                  lastAutoUpdate: new Date().toISOString(),
                }
              }
              return c
            })
            localStorage.setItem("committees", JSON.stringify(updatedCommittees))
          }
        } catch (error) {
          console.error("[v0] Error updating committee month:", error)
        }

        setAutoUpdateStatus({
          isProcessing: false,
          message: `Successfully advanced to Month ${newMonth}. All member statuses reset to pending.`,
          lastUpdate: new Date().toISOString(),
        })

        // Clear the success message after 5 seconds
        setTimeout(() => {
          setAutoUpdateStatus((prev) => ({ ...prev, message: "" }))
        }, 5000)

        console.log(`[v0] Auto-advanced committee to month ${newMonth}`)
      } else {
        setAutoUpdateStatus({
          isProcessing: false,
          message: "Committee cycle completed! All months have been paid.",
          lastUpdate: new Date().toISOString(),
        })

        // Update committee status to completed
        try {
          const savedCommittees = localStorage.getItem("committees")
          if (savedCommittees) {
            const committees = JSON.parse(savedCommittees)
            const updatedCommittees = committees.map((c: Committee) => {
              if (c.id === committee.id) {
                return {
                  ...c,
                  status: "Completed",
                  completedAt: new Date().toISOString(),
                }
              }
              return c
            })
            localStorage.setItem("committees", JSON.stringify(updatedCommittees))

            // Update local state
            setCommittee((prev) => (prev ? { ...prev, status: "Completed" } : null))
          }
        } catch (error) {
          console.error("[v0] Error completing committee:", error)
        }
      }
    }
  }

  const calculateMonthlyCycle = (
    month: number,
    withdrawerName: string,
    withdrawAmount: number,
    withdrawalDate: string,
  ) => {
    if (!committee) return null

    const totalContribution = committee.committeeMembers.length * committee.monthlyAmount
    const balanceLeft = totalContribution - withdrawAmount
    const lossPercentage = (balanceLeft / totalContribution) * 100

    const isHead = withdrawerName === committee.committeeHead
    const isLastMember = month === committee.duration

    const nextMonthContributions: { [memberName: string]: number } = {}

    if (isHead) {
      // Head can withdraw full committee amount, others pay normal amount next month
      committee.committeeMembers.forEach((member) => {
        nextMonthContributions[member.name] = committee.monthlyAmount
      })
    } else if (isLastMember) {
      committee.committeeMembers.forEach((member) => {
        nextMonthContributions[member.name] = 0
      })
    } else {
      // Regular member withdrawal logic
      const remainingMembers = committee.committeeMembers.filter((m) => m.name !== withdrawerName)

      committee.committeeMembers.forEach((member) => {
        if (member.name === withdrawerName) {
          // Withdrawer always pays fixed monthly amount next month
          nextMonthContributions[member.name] = committee.monthlyAmount
        } else {
          // Others share the balance left equally
          const balancePerMember = balanceLeft > 0 ? balanceLeft / remainingMembers.length : 0
          nextMonthContributions[member.name] = committee.monthlyAmount - balancePerMember
        }
      })
    }

    return {
      month,
      withdrawerName,
      withdrawAmount,
      withdrawalDate,
      balanceLeft,
      lossPercentage: Math.round(lossPercentage * 100) / 100, // Round to 2 decimal places
      nextMonthContributions,
      isHead,
      isLastMember,
    }
  }

  const handleMonthlyCycleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!committee) return

    const cycleData = calculateMonthlyCycle(
      monthlyCycleForm.month,
      monthlyCycleForm.withdrawerName,
      Number.parseFloat(monthlyCycleForm.withdrawAmount),
      monthlyCycleForm.withdrawalDate,
    )

    if (cycleData) {
      const updatedCommittee = {
        ...committee,
        monthlyCycles: [...(committee.monthlyCycles || []), cycleData],
      }

      try {
        const savedCommittees = localStorage.getItem("committees")
        if (savedCommittees) {
          const committees = JSON.parse(savedCommittees)
          const updatedCommittees = committees.map((c: Committee) => (c.id === committee.id ? updatedCommittee : c))
          localStorage.setItem("committees", JSON.stringify(updatedCommittees))
          setCommittee(updatedCommittee)

          // Reset form
          setMonthlyCycleForm({
            month: monthlyCycleForm.month + 1,
            withdrawerName: "",
            withdrawAmount: "",
            withdrawalDate: new Date().toISOString().split("T")[0],
          })
          setShowMonthlyCycleForm(false)

          console.log("[v0] Monthly cycle data added successfully")
        }
      } catch (error) {
        console.error("[v0] Error saving monthly cycle data:", error)
      }
    }
  }

  const calculateMemberStatuses = async (committee: Committee, payments: Payment[]) => {
    if (!committee.committeeMembers) return

    const startDate = new Date(committee.startDate)
    const currentDate = new Date()
    const monthsDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const calculatedMonth = Math.max(1, Math.min(monthsDiff + 1, committee.duration))

    // Use stored current month if available, otherwise use calculated
    const currentMonth = currentCommitteeMonth || calculatedMonth
    setCurrentCommitteeMonth(currentMonth)

    const statuses: MemberPaymentStatus[] = committee.committeeMembers.map((member) => {
      const memberPayments = payments.filter((p) => p.memberName === member.name)
      const monthlyPayments: { [month: number]: Payment | null } = {}

      // Initialize all months as null
      for (let i = 1; i <= committee.duration; i++) {
        monthlyPayments[i] = null
      }

      // Fill in actual payments
      memberPayments.forEach((payment) => {
        if (payment.paymentMonth) {
          monthlyPayments[payment.paymentMonth] = payment
        }
      })

      const totalPaid = memberPayments.reduce((sum, p) => {
        return sum + (p.status === "paid" ? p.amount : 0)
      }, 0)

      const currentMonthPayment = monthlyPayments[currentMonth]

      let status: "paid" | "pending" | "overdue" = "pending"
      if (currentMonthPayment && currentMonthPayment.status === "paid") {
        status = "paid"
      } else if (currentMonth > 1 && !currentMonthPayment) {
        // Check if payment is overdue
        const dueDate = new Date(startDate)
        dueDate.setMonth(dueDate.getMonth() + currentMonth - 1)
        const daysPastDue = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysPastDue > lateFeeSettings.gracePeriod) {
          status = "overdue"
        }
      }

      const nextDueDate = new Date(startDate)
      nextDueDate.setMonth(nextDueDate.getMonth() + currentMonth)

      return {
        memberName: member.name,
        currentMonth,
        totalPaid,
        monthlyPayments,
        status,
        nextDueDate: nextDueDate.toISOString().split("T")[0],
      }
    })

    setMemberPaymentStatus(statuses)

    const isCompleted =
      committee.status?.toLowerCase() === "completed" ||
      committee.monthlyCycles?.length >= committee.duration ||
      committee.completedAt
    if (!isCompleted) {
      await checkAndUpdateMonthStatus(committee, payments, currentMonth)
    }
  }

  const handleDetailsUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!committee) return

    const updatedCommittee = {
      ...committee,
      name: editForm.name,
      description: editForm.description,
      duration: Number.parseInt(editForm.duration),
      monthlyAmount: Number.parseFloat(editForm.monthlyAmount),
      startDate: editForm.startDate,
      committeeHead: editForm.committeeHead,
      governmentDeduction: Number.parseFloat(editForm.governmentDeduction),
      rules: editForm.rules,
    }

    try {
      const savedCommittees = localStorage.getItem("committees")
      if (savedCommittees) {
        const committees = JSON.parse(savedCommittees)
        const updatedCommittees = committees.map((c: Committee) => (c.id === committee.id ? updatedCommittee : c))
        localStorage.setItem("committees", JSON.stringify(updatedCommittees))
        setCommittee(updatedCommittee)
        setIsEditingDetails(false)
        console.log("[v0] Committee details updated successfully")
      }
    } catch (error) {
      console.error("[v0] Error updating committee details:", error)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!committee) return

    const baseAmount = Number.parseFloat(paymentForm.amount)
    const lateFees = Number.parseFloat(paymentForm.lateFees) || 0
    const totalAmount = baseAmount + lateFees

    const newPayment: Payment = {
      id: Date.now().toString(),
      memberName: paymentForm.memberName,
      amount: totalAmount,
      paymentMode: paymentForm.paymentMode,
      paymentDate: paymentForm.paymentDate,
      dueDate: paymentForm.dueDate,
      status: "paid",
      remarks:
        paymentForm.remarks +
        (paymentForm.customLateFeeReason ? ` | Late Fee Reason: ${paymentForm.customLateFeeReason}` : ""),
      lateFees: lateFees,
      month: new Date().toISOString().slice(0, 7),
      paymentMonth: Number.parseInt(paymentForm.paymentMonth),
    }

    const updatedPayments = [...payments, newPayment]
    setPayments(updatedPayments)
    localStorage.setItem(`committee_payments_${params.id}`, JSON.stringify(updatedPayments))

    // Reset form
    setPaymentForm({
      memberName: "",
      amount: "",
      paymentMode: "cash",
      paymentDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      remarks: "",
      lateFees: "0",
      paymentMonth: currentCommitteeMonth.toString(),
      autoCalculateLateFees: true,
      customLateFeeReason: "",
    })
    setShowPaymentForm(false)

    if (committee) {
      await calculateMemberStatuses(committee, updatedPayments)
    }

    console.log("[v0] Payment recorded and auto-update logic triggered")
  }

  const handleMultiPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!committee || multiPaymentForm.selectedMembers.length === 0) return

    const baseAmount = Number.parseFloat(multiPaymentForm.amount)
    const lateFees = Number.parseFloat(multiPaymentForm.lateFees) || 0
    const totalAmount = baseAmount + lateFees

    // Create separate payment records for each selected member
    const newPayments: Payment[] = multiPaymentForm.selectedMembers.map((memberName) => ({
      id: `${Date.now()}-${memberName}`,
      memberName,
      amount: totalAmount,
      paymentMode: multiPaymentForm.paymentMode,
      paymentDate: multiPaymentForm.paymentDate,
      dueDate: multiPaymentForm.dueDate,
      status: "paid",
      remarks:
        multiPaymentForm.remarks +
        (multiPaymentForm.customLateFeeReason ? ` | Late Fee Reason: ${multiPaymentForm.customLateFeeReason}` : ""),
      lateFees: lateFees,
      month: new Date().toISOString().slice(0, 7),
      paymentMonth: Number.parseInt(multiPaymentForm.paymentMonth),
    }))

    const updatedPayments = [...payments, ...newPayments]
    setPayments(updatedPayments)
    localStorage.setItem(`committee_payments_${params.id}`, JSON.stringify(updatedPayments))

    // Reset form
    setMultiPaymentForm({
      selectedMembers: [],
      amount: "",
      paymentMode: "cash",
      paymentDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      remarks: "",
      lateFees: "0",
      paymentMonth: currentCommitteeMonth.toString(),
      autoCalculateLateFees: true,
      customLateFeeReason: "",
    })
    setShowMultiPaymentForm(false)

    if (committee) {
      await calculateMemberStatuses(committee, updatedPayments)
    }

    console.log("[v0] Multi-payment recorded for", multiPaymentForm.selectedMembers.length, "members")
  }

  const handlePrintHistory = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>Payment History - ${committee?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payment History</h1>
            <h2>${committee?.name}</h2>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN")}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Member</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Late Fee</th>
                <th>Total</th>
                <th>Payment Mode</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${
                payments.length > 0
                  ? payments
                      .map(
                        (payment) => `
                      <tr>
                        <td>${new Date(payment.paymentDate).toLocaleDateString("en-IN")}</td>
                        <td>${payment.memberName}</td>
                        <td>Month ${payment.month}</td>
                        <td>₹${payment.amount.toLocaleString()}</td>
                        <td>₹${payment.lateFees.toLocaleString()}</td>
                        <td>₹${(payment.amount + payment.lateFees).toLocaleString()}</td>
                        <td>${payment.paymentMode}</td>
                        <td>${payment.remarks || "-"}</td>
                      </tr>
                    `,
                      )
                      .join("")
                  : '<tr><td colspan="8">No payments recorded</td></tr>'
              }
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const handlePrintMonthlyCycle = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>Monthly Cycle Report - ${committee?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .committee-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .contributions { font-size: 12px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Monthly Cycle Management Report</h1>
            <h2>${committee?.name}</h2>
          </div>
          <div class="committee-info">
            <p><strong>Total Members:</strong> ${committee?.committeeMembers.length}</p>
            <p><strong>Monthly Amount:</strong> ₹${committee?.monthlyAmount.toLocaleString()}</p>
            <p><strong>Committee Head:</strong> ${committee?.committeeHead}</p>
            <p><strong>Duration:</strong> ${committee?.duration} months</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Withdrawer</th>
                <th>Amount Withdrawn</th>
                <th>Balance Left</th>
                <th>Next Month Contributions</th>
              </tr>
            </thead>
            <tbody>
              ${
                committee?.monthlyCycles
                  ?.map(
                    (cycle) => `
                <tr>
                  <td>Month ${cycle.month}</td>
                  <td>${cycle.withdrawerName}${cycle.isHead ? " (Head)" : ""}</td>
                  <td>₹${cycle.withdrawAmount.toLocaleString()}</td>
                  <td>₹${cycle.balanceLeft.toLocaleString()}</td>
                  <td class="contributions">
                    ${Object.entries(cycle.nextMonthContributions)
                      .map(([name, amount]) => `${name}: ₹${amount.toLocaleString()}`)
                      .join("<br>")}
                  </td>
                </tr>
              `,
                  )
                  .join("") || '<tr><td colspan="5">No monthly cycles recorded</td></tr>'
              }
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const getTotalPaidByMember = (memberName: string) => {
    return payments.filter((p) => p.memberName === memberName).reduce((sum, p) => sum + p.amount, 0)
  }

  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "banking":
        return <Building2 className="h-4 w-4" />
      case "online":
        return <Smartphone className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getStatusBadgeColor = (status: "paid" | "pending" | "overdue") => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!committee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Committee not found</h2>
          <Link href="/admin/committee/list">
            <Button>Back to Committee List</Button>
          </Link>
        </div>
      </div>
    )
  }

  const calculateFinancialMetrics = () => {
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalWithdrawals = (committee.monthlyCycles || []).reduce((sum, cycle) => sum + cycle.withdrawAmount, 0)

    // Total Collected = Payments made by members - Withdrawals taken
    const totalCollected = totalPayments - totalWithdrawals

    // Outstanding = Balance remaining in committee after withdrawals
    let outstanding = 0

    if (committee.monthlyCycles && committee.monthlyCycles.length > 0) {
      // Get the latest balance from the most recent cycle
      const latestCycle = committee.monthlyCycles[committee.monthlyCycles.length - 1]
      outstanding = latestCycle.balanceLeft || 0
    } else {
      // If no cycles, outstanding is total collected minus withdrawals
      outstanding = Math.max(0, totalCollected)
    }

    // Calculate expected total for progress tracking
    let expectedTotal = 0
    if (committee.monthlyCycles && committee.monthlyCycles.length > 0) {
      committee.monthlyCycles.forEach((cycle, index) => {
        const monthNumber = index + 1
        if (monthNumber <= currentCommitteeMonth) {
          if (cycle.nextMonthContributions) {
            Object.values(cycle.nextMonthContributions).forEach((amount) => {
              expectedTotal += amount || 0
            })
          } else {
            expectedTotal += committee.committeeMembers.length * committee.monthlyAmount
          }
        }
      })

      if (currentCommitteeMonth >= 1) {
        expectedTotal += committee.committeeMembers.length * committee.monthlyAmount
      }

      const monthsBeyondCycles = currentCommitteeMonth - committee.monthlyCycles.length
      if (monthsBeyondCycles > 0) {
        expectedTotal += committee.committeeMembers.length * committee.monthlyAmount * monthsBeyondCycles
      }
    } else {
      expectedTotal = committee.committeeMembers.length * committee.monthlyAmount * currentCommitteeMonth
    }

    return {
      totalPaid: totalPayments,
      totalWithdrawals,
      totalCollected,
      expectedTotal,
      outstanding,
    }
  }

  const { totalPaid, totalWithdrawals, totalCollected, expectedTotal, outstanding } = calculateFinancialMetrics()

  const handleDeleteMonthlyCycle = (cycleIndex: number) => {
    if (confirm("Are you sure you want to delete this monthly cycle entry?")) {
      const updatedCycles = [...(committee.monthlyCycles || [])]
      updatedCycles.splice(cycleIndex, 1)

      const updatedCommittee = {
        ...committee,
        monthlyCycles: updatedCycles,
      }

      // Update localStorage
      const committees = JSON.parse(localStorage.getItem("committees") || "[]")
      const committeeIndex = committees.findIndex((c: any) => c.id === params.id)
      if (committeeIndex !== -1) {
        committees[committeeIndex] = updatedCommittee
        localStorage.setItem("committees", JSON.stringify(committees))
        setCommittee(updatedCommittee)
      }
    }
  }

  const isCommitteeCompleted =
    committee?.status?.toLowerCase() === "completed" ||
    committee?.monthlyCycles?.length >= committee?.duration ||
    committee?.completedAt
  // Removed redeclaration of committeeStatus
  const committeeStatus = isCommitteeCompleted ? "Closed" : "Active"

  const getMemberWithdrawals = (memberName: string): MemberWithdrawal[] => {
    if (!committee?.monthlyCycles) return []
    return committee.monthlyCycles
      .filter((cycle) => cycle.withdrawerName === memberName)
      .map((cycle) => ({
        month: cycle.month,
        amount: cycle.withdrawAmount,
        date: cycle.withdrawalDate,
        isHead: cycle.isHead,
        lossPercentage: cycle.lossPercentage,
      }))
  }

  const getMemberPaymentDetails = (memberName: string): MemberReportData => {
    const memberPayments = payments.filter((p) => p.memberName === memberName)
    const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalLateFees = memberPayments.reduce((sum, p) => sum + p.lateFees, 0)
    const expectedTotal = committee ? committee.monthlyAmount * currentCommitteeMonth : 0
    const balance = expectedTotal - totalPaid

    return {
      payments: memberPayments,
      totalPaid,
      totalLateFees,
      expectedTotal,
      balance,
      paymentCount: memberPayments.length,
    }
  }

  const handlePrintMemberReport = (memberName: string) => {
    const memberDetails = getMemberPaymentDetails(memberName)
    const memberWithdrawals = getMemberWithdrawals(memberName)
    const member = committee?.committeeMembers.find((m) => m.name === memberName)

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>Member Report - ${memberName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
            .header h1 { color: #1e40af; margin-bottom: 10px; }
            .member-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .member-info p { margin: 5px 0; }
            .section { margin-bottom: 30px; }
            .section h3 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #1e40af; color: white; }
            tbody tr:nth-child(even) { background-color: #f9fafb; }
            .summary-box { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .summary-box h4 { color: #1e40af; margin-bottom: 10px; }
            .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .summary-item { display: flex; justify-content: space-between; padding: 5px 0; }
            .summary-item strong { color: #374151; }
            .total-row { background-color: #1e40af !important; color: white; font-weight: bold; }
            .positive { color: #059669; font-weight: 600; }
            .negative { color: #dc2626; font-weight: 600; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INDIVIDUAL MEMBER REPORT</h1>
            <h2>${committee?.name}</h2>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}</p>
          </div>

          <div class="member-info">
            <h3>Member Information</h3>
            <p><strong>Name:</strong> ${memberName}</p>
            <p><strong>Mobile:</strong> ${member?.mobile || "N/A"}</p>
            <p><strong>Email:</strong> ${member?.email || "N/A"}</p>
            <p><strong>Address:</strong> ${member?.address || "N/A"}</p>
            ${memberName === committee?.committeeHead ? '<p><strong>Role:</strong> <span style="color: #d97706;">Committee Head</span></p>' : ""}
          </div>

          <div class="summary-box">
            <h4>Financial Summary</h4>
            <div class="summary-grid">
              <div class="summary-item">
                <span>Expected Total Contribution:</span>
                <strong>₹${memberDetails.expectedTotal.toLocaleString("en-IN")}</strong>
              </div>
              <div class="summary-item">
                <span>Total Paid:</span>
                <strong class="positive">₹${memberDetails.totalPaid.toLocaleString("en-IN")}</strong>
              </div>
              <div class="summary-item">
                <span>Total Late Fees:</span>
                <strong class="${memberDetails.totalLateFees > 0 ? "negative" : ""}">₹${memberDetails.totalLateFees.toLocaleString("en-IN")}</strong>
              </div>
              <div class="summary-item">
                <span>Balance:</span>
                <strong class="${memberDetails.balance > 0 ? "negative" : "positive"}">₹${Math.abs(memberDetails.balance).toLocaleString("en-IN")} ${memberDetails.balance > 0 ? "(Due)" : "(Paid)"}</strong>
              </div>
              <div class="summary-item">
                <span>Number of Payments:</span>
                <strong>${memberDetails.paymentCount}</strong>
              </div>
              <div class="summary-item">
                <span>Total Withdrawals:</span>
                <strong class="positive">₹${memberWithdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Payment History</h3>
            ${
              memberDetails.payments.length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Late Fee</th>
                    <th>Total</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${memberDetails.payments
                    .map(
                      (payment) => `
                    <tr>
                      <td>${new Date(payment.paymentDate).toLocaleDateString("en-IN")}</td>
                      <td>Month ${payment.paymentMonth}</td>
                      <td>₹${(payment.amount - payment.lateFees).toLocaleString("en-IN")}</td>
                      <td class="${payment.lateFees > 0 ? "negative" : ""}">₹${payment.lateFees.toLocaleString("en-IN")}</td>
                      <td><strong>₹${payment.amount.toLocaleString("en-IN")}</strong></td>
                      <td style="text-transform: capitalize;">${payment.paymentMode}</td>
                      <td style="text-transform: capitalize;">${payment.status}</td>
                      <td>${payment.remarks || "-"}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                  <tr class="total-row">
                    <td colspan="2">TOTAL</td>
                    <td>₹${(memberDetails.totalPaid - memberDetails.totalLateFees).toLocaleString("en-IN")}</td>
                    <td>₹${memberDetails.totalLateFees.toLocaleString("en-IN")}</td>
                    <td>₹${memberDetails.totalPaid.toLocaleString("en-IN")}</td>
                    <td colspan="3"></td>
                  </tr>
                </tbody>
              </table>
            `
                : '<p style="text-align: center; color: #6b7280; padding: 20px;">No payments recorded yet.</p>'
            }
          </div>

          <div class="section">
            <h3>Withdrawal History</h3>
            ${
              memberWithdrawals.length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Withdrawal Date</th>
                    <th>Amount</th>
                    <th>Loss %</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  ${memberWithdrawals
                    .map(
                      (withdrawal) => `
                    <tr>
                      <td>Month ${withdrawal.month}</td>
                      <td>${new Date(withdrawal.date).toLocaleDateString("en-IN")}</td>
                      <td class="positive"><strong>₹${withdrawal.amount.toLocaleString("en-IN")}</strong></td>
                      <td>${withdrawal.lossPercentage}%</td>
                      <td>${withdrawal.isHead ? '<span style="color: #d97706;">Head Withdrawal</span>' : "Regular"}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                  <tr class="total-row">
                    <td colspan="2">TOTAL WITHDRAWALS</td>
                    <td>₹${memberWithdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString("en-IN")}</td>
                    <td colspan="2"></td>
                  </tr>
                </tbody>
              </table>
            `
                : '<p style="text-align: center; color: #6b7280; padding: 20px;">No withdrawals recorded yet.</p>'
            }
          </div>

          <div class="footer">
            <p>This is a computer-generated report for ${memberName}</p>
            <p><strong>${committee?.name}</strong> | Suraksha Savings Society</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  // Corrected committeeStatus declaration to avoid redeclaration
  const currentCommitteeStatus = isCommitteeCompleted ? "Closed" : "Active"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Committee List
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{committee.name}</h1>
                <p className="text-muted-foreground">
                  Committee ID: {committee.id} | Month: {committee.monthlyCycles?.length || 0}/{committee.duration}
                  {isCommitteeCompleted && " | Status: Committee Closed"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  currentCommitteeStatus === "Closed" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                }
              >
                {currentCommitteeStatus}
              </Badge>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this committee? This action cannot be undone.")) {
                    try {
                      wipeCommitteeAndRefresh(committee.id)
                    } catch (error) {
                      console.error("Error deleting committee:", error)
                    }
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Committee
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {(autoUpdateStatus.message || autoUpdateStatus.isProcessing) && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {autoUpdateStatus.isProcessing ? (
                  <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                <div>
                  <p className="font-medium text-blue-800">{autoUpdateStatus.message}</p>
                  {autoUpdateStatus.lastUpdate && (
                    <p className="text-xs text-blue-600">
                      Last updated: {new Date(autoUpdateStatus.lastUpdate).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Committee Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Committee Financial Overview
              {committee.status === "completed" && (
                <Badge className="ml-3 bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Amount</p>
                <p className="text-2xl font-bold text-blue-600">₹{committee.monthlyAmount?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Per Member</p>
              </div>
              {/* Updated display to show corrected Total Collected value */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">₹{totalCollected.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Till Month {currentCommitteeMonth}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">₹{outstanding.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(((committee.monthlyCycles?.length || 0) / committee.duration) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Month {committee.monthlyCycles?.length || 0} of {committee.duration}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Committee Progress</span>
                <span>
                  {committee.monthlyCycles?.length || 0}/{committee.duration} months
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((committee.monthlyCycles?.length || 0) / committee.duration) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Monthly Cycle Management</h3>
                <div className="flex space-x-2">
                  {committee.monthlyCycles && committee.monthlyCycles.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handlePrintMonthlyCycle}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Report
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setShowMonthlyCycleForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Monthly Data
                  </Button>
                </div>
              </div>

              {/* Monthly Cycle Form */}
              {showMonthlyCycleForm && (
                <Card className="mb-4 border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Add Monthly Cycle Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleMonthlyCycleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium">Month</label>
                          <Select
                            value={monthlyCycleForm.month.toString()}
                            onValueChange={(value) =>
                              setMonthlyCycleForm((prev) => ({ ...prev, month: Number.parseInt(value) }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: committee.duration }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  Month {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Withdrawer</label>
                          <Select
                            value={monthlyCycleForm.withdrawerName}
                            onValueChange={(value) =>
                              setMonthlyCycleForm((prev) => ({ ...prev, withdrawerName: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                              {committee.committeeMembers.map((member, index) => (
                                <SelectItem key={index} value={member.name}>
                                  {member.name} {member.name === committee.committeeHead && "(Head)"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Withdrawal Date</label>
                          <Input
                            type="date"
                            value={monthlyCycleForm.withdrawalDate}
                            onChange={(e) =>
                              setMonthlyCycleForm((prev) => ({ ...prev, withdrawalDate: e.target.value }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Withdraw Amount</label>
                          <Input
                            type="number"
                            value={monthlyCycleForm.withdrawAmount}
                            onChange={(e) =>
                              setMonthlyCycleForm((prev) => ({ ...prev, withdrawAmount: e.target.value }))
                            }
                            placeholder={`Max: ₹${committee.monthlyAmount * committee.committeeMembers.length}`}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit">
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculate & Save
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowMonthlyCycleForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Monthly Cycle History */}
              {committee.monthlyCycles && committee.monthlyCycles.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Monthly Cycle History</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Withdrawer</TableHead>
                          <TableHead>Withdrawal Date</TableHead>
                          <TableHead>Withdraw Amount</TableHead>
                          <TableHead>Balance Left</TableHead>
                          <TableHead>Loss %</TableHead>
                          <TableHead>Next Month Contributions</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {committee.monthlyCycles.map((cycle, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge variant="outline">Month {cycle.month}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {cycle.withdrawerName}
                                {cycle.isHead && <Badge className="ml-2 bg-yellow-100 text-yellow-800">Head</Badge>}
                                {cycle.isLastMember && (
                                  <Badge className="ml-2 bg-purple-100 text-purple-800">Last</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {cycle.withdrawalDate ? new Date(cycle.withdrawalDate).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell>₹{(cycle.withdrawAmount || 0).toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={cycle.balanceLeft > 0 ? "text-green-600" : "text-gray-500"}>
                                ₹{(cycle.balanceLeft || 0).toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={cycle.lossPercentage > 0 ? "destructive" : "secondary"}>
                                {cycle.lossPercentage || 0}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs space-y-1 max-w-48">
                                {Object.entries(cycle.nextMonthContributions || {}).map(([name, amount]) => (
                                  <div key={name} className="flex justify-between">
                                    <span className="truncate max-w-20">{name}:</span>
                                    <span className="font-medium">₹{(amount || 0).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteMonthlyCycle(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!isCommitteeCompleted && (
          <Card>
            <CardHeader>
              <CardTitle>Next Payment Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <p className="text-sm text-muted-foreground">Due Date for Month {currentCommitteeMonth}</p>
                <p className="text-lg font-bold">
                  {(() => {
                    const startDate = new Date(committee.startDate)
                    const nextPaymentDate = new Date(startDate)
                    nextPaymentDate.setMonth(startDate.getMonth() + currentCommitteeMonth - 1)
                    return nextPaymentDate.toLocaleDateString()
                  })()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Amount: ₹{committee.monthlyAmount?.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Committee Details</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditingDetails(!isEditingDetails)}>
              {isEditingDetails ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditingDetails ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingDetails ? (
              <form onSubmit={handleDetailsUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Committee Name</label>
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duration (months)</label>
                    <Input
                      name="duration"
                      type="number"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Monthly Amount</label>
                    <Input
                      name="monthlyAmount"
                      type="number"
                      value={editForm.monthlyAmount}
                      onChange={(e) => setEditForm({ ...editForm, monthlyAmount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <Input
                      name="startDate"
                      type="date"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <Textarea
                    name="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Committee Head</label>
                  <Select
                    value={editForm.committeeHead}
                    onValueChange={(value) => setEditForm({ ...editForm, committeeHead: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select committee head" />
                    </SelectTrigger>
                    <SelectContent>
                      {committee.committeeMembers.map((member, index) => (
                        <SelectItem key={index} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditingDetails(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Members</span>
                    </div>
                    <p className="text-lg font-semibold">{committee.committeeMembers.length}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Monthly Amount</span>
                    </div>
                    <p className="text-lg font-semibold">₹{committee.monthlyAmount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <p className="text-lg font-semibold">{committee.duration} months</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Committee Head</span>
                    </div>
                    <p className="text-lg font-semibold">{committee.committeeHead}</p>
                  </div>
                </div>
                {committee.description && (
                  <div className="space-y-2 pt-2 border-t">
                    <span className="text-sm font-medium text-muted-foreground">Description</span>
                    <p className="text-sm">{committee.description}</p>
                  </div>
                )}
                <div className="space-y-2 pt-2 border-t">
                  <span className="text-sm font-medium text-muted-foreground">Start Date</span>
                  <p className="text-sm">{new Date(committee.startDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Members List with Enhanced Status Tracking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Committee Members - Month {currentCommitteeMonth} Status
              </div>
              <div className="flex items-center space-x-2">
                {(() => {
                  const paidCount = memberStatuses.filter(
                    (s) => s.monthlyPayments[currentCommitteeMonth]?.status === "paid",
                  ).length
                  const totalCount = committee.committeeMembers.length
                  const allPaid = paidCount === totalCount

                  return (
                    <Badge className={allPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {allPaid ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          All Paid
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-1" />
                          {paidCount}/{totalCount} Paid
                        </>
                      )}
                    </Badge>
                  )
                })()}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.NO</TableHead>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Month Status</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Next Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {committee.committeeMembers.map((member, index) => {
                    const memberStatus = memberStatuses.find((s) => s.memberName === member.name)
                    const totalPaidByMember = getTotalPaidByMember(member.name)
                    const isHead = member.name === committee.committeeHead
                    const currentMonthPayment = memberStatus?.monthlyPayments[currentCommitteeMonth]

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {member.name}
                            {isHead && <Badge className="ml-2 bg-gold-100 text-gold-800">Head</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{member.mobile}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(currentMonthPayment?.status || "pending")}>
                            {currentMonthPayment?.status === "paid" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {currentMonthPayment?.status || "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{totalPaidByMember.toLocaleString()}</TableCell>
                        <TableCell>
                          {isCommitteeCompleted ? (
                            <Badge className="bg-red-100 text-red-800">Closed</Badge>
                          ) : memberStatus?.nextDueDate ? (
                            new Date(memberStatus.nextDueDate).toLocaleDateString("en-IN")
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMemberForReport(member.name)
                                setShowMemberReport(true)
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Report
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePrintMemberReport(member.name)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {showMemberReport && selectedMemberForReport && (
          <Card className="mb-6 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Individual Member Report - {selectedMemberForReport}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handlePrintMemberReport(selectedMemberForReport)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                  <Button variant="outline" onClick={() => setShowMemberReport(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {(() => {
                const memberDetails = getMemberPaymentDetails(selectedMemberForReport)
                const memberWithdrawals = getMemberWithdrawals(selectedMemberForReport)
                const member = committee.committeeMembers.find((m) => m.name === selectedMemberForReport)

                return (
                  <>
                    {/* Member Info */}
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Member Information</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <p className="font-medium">{selectedMemberForReport}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mobile:</span>
                          <p className="font-medium">{member?.mobile}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{member?.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Role:</span>
                          <p className="font-medium">
                            {selectedMemberForReport === committee.committeeHead ? "Committee Head" : "Member"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-blue-800">Financial Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Expected Total:</span>
                          <p className="font-semibold text-lg">₹{memberDetails.expectedTotal.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Paid:</span>
                          <p className="font-semibold text-lg text-green-600">
                            ₹{memberDetails.totalPaid.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Late Fees:</span>
                          <p
                            className={`font-semibold text-lg ${memberDetails.totalLateFees > 0 ? "text-red-600" : ""}`}
                          >
                            ₹{memberDetails.totalLateFees.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Balance:</span>
                          <p
                            className={`font-semibold text-lg ${memberDetails.balance > 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            ₹{Math.abs(memberDetails.balance).toLocaleString()}{" "}
                            {memberDetails.balance > 0 ? "(Due)" : "(Paid)"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payments Made:</span>
                          <p className="font-semibold text-lg">{memberDetails.paymentCount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Withdrawals:</span>
                          <p className="font-semibold text-lg text-green-600">
                            ₹{memberWithdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div>
                      <h4 className="font-semibold mb-3">Payment History</h4>
                      {memberDetails.payments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Month</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Late Fee</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remarks</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {memberDetails.payments.map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString("en-IN")}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">Month {payment.paymentMonth}</Badge>
                                  </TableCell>
                                  <TableCell>₹{(payment.amount - payment.lateFees).toLocaleString()}</TableCell>
                                  <TableCell>
                                    {payment.lateFees > 0 ? (
                                      <span className="text-red-600 font-medium">
                                        ₹{payment.lateFees.toLocaleString()}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">₹0</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                                  <TableCell className="capitalize">{payment.paymentMode}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusBadgeColor(payment.status)}>{payment.status}</Badge>
                                  </TableCell>
                                  <TableCell>{payment.remarks || "-"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No payments recorded yet.</p>
                      )}
                    </div>

                    {/* Withdrawal History */}
                    <div>
                      <h4 className="font-semibold mb-3">Withdrawal History</h4>
                      {memberWithdrawals.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Month</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Loss %</TableHead>
                                <TableHead>Type</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {memberWithdrawals.map((withdrawal, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>
                                    <Badge variant="outline">Month {withdrawal.month}</Badge>
                                  </TableCell>
                                  <TableCell>{new Date(withdrawal.date).toLocaleDateString("en-IN")}</TableCell>
                                  <TableCell className="font-semibold text-green-600">
                                    ₹{withdrawal.amount.toLocaleString()}
                                  </TableCell>
                                  <TableCell>{withdrawal.lossPercentage}%</TableCell>
                                  <TableCell>
                                    {withdrawal.isHead ? (
                                      <Badge className="bg-gold-100 text-gold-800">Head Withdrawal</Badge>
                                    ) : (
                                      "Regular"
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No withdrawals recorded yet.</p>
                      )}
                    </div>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* Make Payment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Make a Payment</CardTitle>
            <CardDescription>Record member payments with automatic late fees calculation</CardDescription>
          </CardHeader>
          <CardContent>
            {!showPaymentForm && !showMultiPaymentForm ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={() => setShowPaymentForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Single Payment
                  </Button>
                  <Button variant="outline" onClick={() => setShowMultiPaymentForm(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    Multiple Payments
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setShowLateFeeCalculator(true)}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Late Fee Settings
                </Button>
              </div>
            ) : showMultiPaymentForm ? (
              <form onSubmit={handleMultiPaymentSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Members</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-lg">
                      {committee.committeeMembers.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`member-${index}`}
                            checked={multiPaymentForm.selectedMembers.includes(member.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMultiPaymentForm((prev) => ({
                                  ...prev,
                                  selectedMembers: [...prev.selectedMembers, member.name],
                                }))
                              } else {
                                setMultiPaymentForm((prev) => ({
                                  ...prev,
                                  selectedMembers: prev.selectedMembers.filter((name) => name !== member.name),
                                }))
                              }
                            }}
                            className="rounded"
                          />
                          <label htmlFor={`member-${index}`} className="text-sm">
                            {member.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {multiPaymentForm.selectedMembers.length} members
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Payment Month</label>
                      <Select
                        value={multiPaymentForm.paymentMonth}
                        onValueChange={(value) => setMultiPaymentForm((prev) => ({ ...prev, paymentMonth: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: committee.duration }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Month {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Base Amount (per member)</label>
                      <Input
                        type="number"
                        value={multiPaymentForm.amount}
                        onChange={(e) => setMultiPaymentForm((prev) => ({ ...prev, amount: e.target.value }))}
                        placeholder={`Default: ₹${committee.monthlyAmount}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Payment Date</label>
                      <Input
                        type="date"
                        value={multiPaymentForm.paymentDate}
                        onChange={(e) => setMultiPaymentForm((prev) => ({ ...prev, paymentDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={multiPaymentForm.dueDate}
                        onChange={(e) => setMultiPaymentForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Payment Mode</label>
                      <Select
                        value={multiPaymentForm.paymentMode}
                        onValueChange={(value) => setMultiPaymentForm((prev) => ({ ...prev, paymentMode: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="banking">Banking</SelectItem>
                          <SelectItem value="online">Online Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Remarks</label>
                      <Input
                        value={multiPaymentForm.remarks}
                        onChange={(e) => setMultiPaymentForm((prev) => ({ ...prev, remarks: e.target.value }))}
                        placeholder="Payment remarks"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={multiPaymentForm.selectedMembers.length === 0}>
                    Record Payments ({multiPaymentForm.selectedMembers.length} members)
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowMultiPaymentForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Member Name</label>
                    <Select
                      value={paymentForm.memberName}
                      onValueChange={(value) => handlePaymentFormChange("memberName", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {committee.committeeMembers.map((member, index) => (
                          <SelectItem key={index} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Payment Month</label>
                    <Select
                      value={paymentForm.paymentMonth}
                      onValueChange={(value) => handlePaymentFormChange("paymentMonth", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: committee.duration }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Month {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Base Amount</label>
                    <Input
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => handlePaymentFormChange("amount", e.target.value)}
                      placeholder={`Default: ₹${committee.monthlyAmount}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Payment Date</label>
                    <Input
                      type="date"
                      value={paymentForm.paymentDate}
                      onChange={(e) => handlePaymentFormChange("paymentDate", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={paymentForm.dueDate}
                      onChange={(e) => handlePaymentFormChange("dueDate", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Payment Mode</label>
                    <Select
                      value={paymentForm.paymentMode}
                      onValueChange={(value) => handlePaymentFormChange("paymentMode", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Calculator className="h-5 w-5 mr-2 text-orange-600" />
                      Late Fees Calculator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoCalculate"
                        checked={paymentForm.autoCalculateLateFees}
                        onChange={(e) =>
                          setPaymentForm((prev) => ({ ...prev, autoCalculateLateFees: e.target.checked }))
                        }
                        className="rounded"
                      />
                      <label htmlFor="autoCalculate" className="text-sm font-medium">
                        Auto-calculate late fees based on due date
                      </label>
                    </div>

                    {paymentForm.autoCalculateLateFees ? (
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Daily Rate:</span>
                            <span className="font-semibold ml-2">₹{lateFeeSettings.dailyRate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Grace Period:</span>
                            <span className="font-semibold ml-2">{lateFeeSettings.gracePeriod} days</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Late Fee:</span>
                            <span className="font-semibold ml-2">₹{lateFeeSettings.maxLateFee}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Calculated Fee:</span>
                            <span className="font-semibold ml-2 text-orange-600">₹{paymentForm.lateFees}</span>
                          </div>
                        </div>
                        {Number.parseFloat(paymentForm.lateFees) > 0 && (
                          <div className="mt-3 p-2 bg-orange-100 rounded text-sm">
                            <strong>Late Fee Breakdown:</strong>
                            {(() => {
                              const due = new Date(paymentForm.dueDate)
                              const payment = new Date(paymentForm.paymentDate)
                              const daysDiff = Math.floor((payment.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
                              const lateDays = Math.max(0, daysDiff - lateFeeSettings.gracePeriod)
                              return (
                                <div className="mt-1">
                                  Payment is {daysDiff} days late. After {lateFeeSettings.gracePeriod} days grace
                                  period, late fee = {lateDays} days × ₹{lateFeeSettings.dailyRate} = ₹
                                  {lateDays * lateFeeSettings.dailyRate}
                                  {lateDays * lateFeeSettings.maxLateFee &&
                                    ` (capped at ₹${lateFeeSettings.maxLateFee})`}
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Manual Late Fees</label>
                          <Input
                            type="number"
                            value={paymentForm.lateFees}
                            onChange={(e) => setPaymentForm((prev) => ({ ...prev, lateFees: e.target.value }))}
                            placeholder="Enter late fees manually"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Late Fee Reason</label>
                          <Input
                            value={paymentForm.customLateFeeReason}
                            onChange={(e) =>
                              setPaymentForm((prev) => ({ ...prev, customLateFeeReason: e.target.value }))
                            }
                            placeholder="Reason for late fee (optional)"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div>
                  <label className="text-sm font-medium">Remarks</label>
                  <Textarea
                    value={paymentForm.remarks}
                    onChange={(e) => handlePaymentFormChange("remarks", e.target.value)}
                    placeholder="Optional payment remarks"
                    rows={3}
                  />
                </div>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 text-blue-800">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Amount:</span>
                        <span className="font-semibold">
                          ₹{Number.parseFloat(paymentForm.amount || "0").toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Late Fees:</span>
                        <span
                          className={`font-semibold ${Number.parseFloat(paymentForm.lateFees) > 0 ? "text-red-600" : ""}`}
                        >
                          ₹{Number.parseFloat(paymentForm.lateFees || "0").toLocaleString()}
                        </span>
                      </div>
                      <hr className="border-blue-200" />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total Amount:</span>
                        <span className="font-bold text-blue-800">
                          ₹
                          {(
                            Number.parseFloat(paymentForm.amount || "0") +
                            Number.parseFloat(paymentForm.lateFees || "0")
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Submit Payment
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {showLateFeeCalculator && (
          <Card className="mb-6 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-orange-600" />
                Late Fee Settings
              </CardTitle>
              <CardDescription>Configure automatic late fee calculation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Daily Late Fee Rate</label>
                  <Input
                    type="number"
                    value={lateFeeSettings.dailyRate}
                    onChange={(e) =>
                      setLateFeeSettings((prev) => ({ ...prev, dailyRate: Number.parseFloat(e.target.value) }))
                    }
                    placeholder="₹ per day"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Amount charged per day after grace period</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Grace Period (Days)</label>
                  <Input
                    type="number"
                    value={lateFeeSettings.gracePeriod}
                    onChange={(e) =>
                      setLateFeeSettings((prev) => ({ ...prev, gracePeriod: Number.parseInt(e.target.value) }))
                    }
                    placeholder="Days"
                  />
                  <p className="text-xs text-muted-foreground mt-1">No late fee charged within this period</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Maximum Late Fee</label>
                  <Input
                    type="number"
                    value={lateFeeSettings.maxLateFee}
                    onChange={(e) =>
                      setLateFeeSettings((prev) => ({ ...prev, maxLateFee: Number.parseFloat(e.target.value) }))
                    }
                    placeholder="₹ maximum"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Cap on total late fees charged</p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold mb-2">Example Calculation:</h4>
                <p className="text-sm text-muted-foreground">
                  If payment is 15 days late: Grace period ({lateFeeSettings.gracePeriod} days) + Late days (
                  {15 - lateFeeSettings.gracePeriod} days) × ₹{lateFeeSettings.dailyRate} = ₹
                  {Math.min((15 - lateFeeSettings.gracePeriod) * lateFeeSettings.dailyRate, lateFeeSettings.maxLateFee)}
                  (max ₹{lateFeeSettings.maxLateFee})
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    localStorage.setItem(`committee_late_fee_settings_${params.id}`, JSON.stringify(lateFeeSettings))
                    setShowLateFeeCalculator(false)
                    console.log("[v0] Late fee settings saved")
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
                <Button variant="outline" onClick={() => setShowLateFeeCalculator(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="selectAll"
                    className="rounded"
                    onChange={(e) => {
                      const checkboxes = document.querySelectorAll(
                        'input[name="paymentSelect"]',
                      ) as NodeListOf<HTMLInputElement>
                      checkboxes.forEach((checkbox) => {
                        checkbox.checked = e.target.checked
                      })
                    }}
                  />
                  <label htmlFor="selectAll" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const selectedPayments = Array.from(
                      document.querySelectorAll('input[name="paymentSelect"]:checked') as NodeListOf<HTMLInputElement>,
                    ).map((checkbox) => checkbox.value)

                    if (
                      selectedPayments.length > 0 &&
                      confirm(`Delete ${selectedPayments.length} selected payment(s)?`)
                    ) {
                      const updatedPayments = payments.filter((payment) => !selectedPayments.includes(payment.id))
                      setPayments(updatedPayments)
                      localStorage.setItem(`committee_payments_${params.id}`, JSON.JSON.stringify(updatedPayments))

                      // Uncheck select all
                      const selectAllCheckbox = document.getElementById("selectAll") as HTMLInputElement
                      if (selectAllCheckbox) selectAllCheckbox.checked = false
                    }
                  }}
                >
                  Delete Selected
                </Button>
                <Button variant="outline" onClick={handlePrintHistory}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print History
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No payments recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Late Fee</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <input type="checkbox" name="paymentSelect" value={payment.id} className="rounded" />
                        </TableCell>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell>{payment.memberName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Month {payment.paymentMonth}</Badge>
                        </TableCell>
                        <TableCell>₹{(payment.amount - payment.lateFees).toLocaleString()}</TableCell>
                        <TableCell>
                          {payment.lateFees > 0 ? (
                            <span className="text-red-600 font-medium">₹{payment.lateFees.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-400">₹0</span>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getPaymentModeIcon(payment.paymentMode)}
                            <span className="ml-2 capitalize">{payment.paymentMode}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(payment.status)}>{payment.status}</Badge>
                        </TableCell>
                        <TableCell className="max-w-32 truncate">{payment.remarks || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Set edit mode for this payment
                              setEditingPayment(payment)
                              setShowPaymentForm(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
