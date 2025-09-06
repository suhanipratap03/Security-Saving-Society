"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { User, IndianRupee, Calendar, TrendingUp, FileText, LogOut, Clock, CheckCircle } from "lucide-react"

type MemberSession = {
  committeeId: string
  memberName?: string
  memberId?: string
}

type MemberPaymentRow = {
  memberId: string
  memberName: string
  monthlyPayments: { month: number; amount: number; status: string; dueDate?: string; paymentDate?: string | null }[]
}

type CommitteeRecord = {
  id: string
  name: string
  description?: string
  duration: number
  monthlyAmount: number
  startDate: string
  status: string
  committeeHead?: string
  memberPayments: MemberPaymentRow[]
  biddingHistory?: { month: number; memberId?: string; memberName?: string; amount: number; date?: string }[]
  currentMonth?: number
  committeeAccount?: number
  monthlyCycles?: MonthlyCycle[] // added monthlyCycles
  committeeMembers?: Array<any> // added committeeMembers
}

type AdminPayment = {
  id?: string
  date?: string
  member?: string
  memberId?: string
  month?: number | string // admin currently saves ISO 'YYYY-MM'
  paymentMonth?: number // admin saves numeric cycle month here
  amount?: number
  lateFees?: number
  status?: string // "paid" | "pending"
}

type MonthlyCycle = {
  month: number
  memberId?: string
  memberName?: string
  amount: number
  date?: string
}

function parseCycleMonth(raw: unknown): number | null {
  if (raw == null) return null
  if (typeof raw === "number" && Number.isFinite(raw)) return raw
  if (typeof raw === "string") {
    // handle "Month 1", "1", "2025-08"
    const m1 = raw.match(/month\s*(\d+)/i)
    if (m1?.[1]) return Number(m1[1])
    const num = Number(raw)
    if (Number.isFinite(num)) return num
    // "YYYY-MM" → no cycle embedded
    return null
  }
  return null
}

const getPaymentCycle = (p: AdminPayment): number | null => {
  if (typeof p.paymentMonth === "number") return p.paymentMonth
  return parseCycleMonth(p.month)
}

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [session, setSession] = useState<MemberSession | null>(null)
  const [committee, setCommittee] = useState<CommitteeRecord | null>(null)
  const [payments, setPayments] = useState<AdminPayment[]>([]) // track admin-saved payments

  // derived data to keep existing UI largely intact
  const memberData = useMemo(() => {
    if (!committee) {
      return {
        id: session?.memberId || "—",
        name: session?.memberName || "Member",
        memberType: "committee",
        committee: {
          id: session?.committeeId || "—",
          name: "—",
          monthlyAmount: 0,
          currentMonth: 0,
          totalMonths: 0,
          nextDueDate: new Date().toISOString(),
          status: "Active",
        },
        totalDeposit: 0,
      }
    }

    const monthlyAmount = committee.monthlyAmount || 0
    const totalMonths = committee.duration || 0
    const currentMonth = Math.max(1, Math.min(committee.currentMonth || 1, totalMonths))

    const myRow =
      committee.memberPayments?.find(
        (r) => r.memberId === session?.memberId || r.memberName?.trim() === session?.memberName?.trim(),
      ) || null

    let totalDeposit =
      myRow?.monthlyPayments?.reduce((sum, p) => sum + (p.status === "paid" ? p.amount || monthlyAmount : 0), 0) || 0

    // fallback/augment using admin payments
    if ((totalDeposit || 0) === 0) {
      totalDeposit =
        payments
          ?.filter(
            (p) =>
              (session?.memberName && (p.member || "").trim() === (session?.memberName || "").trim()) ||
              (session?.memberId && p.memberId === session?.memberId),
          )
          .filter((p) => (p.status || "paid") === "paid")
          .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0
    }

    const nextUnpaid = myRow?.monthlyPayments?.find((p) => p.status !== "paid")
    const nextDueDate = nextUnpaid?.dueDate || new Date().toISOString()

    return {
      id: session?.memberId || "—",
      name: session?.memberName || "Member",
      memberType: "committee",
      committee: {
        id: committee.id,
        name: committee.name,
        monthlyAmount,
        currentMonth,
        totalMonths,
        nextDueDate,
        status: committee.status || "Active",
      },
      totalDeposit,
    }
  }, [committee, session, payments])

  // table: memberDeposits (all members status snapshot for first 3 months)
  const memberDeposits = useMemo(() => {
    if (!committee) return []
    const monthlyAmount = committee.monthlyAmount || 0
    const duration = committee.duration || 0
    const monthsToShow = Math.min(3, duration || 3)

    const cmMembers: Array<any> = Array.isArray((committee as any).committeeMembers)
      ? ((committee as any).committeeMembers as Array<any>)
      : []

    // build quick map of paid months per member from admin payments
    const paidBy: Record<string, Set<number>> = {}
    for (const p of payments || []) {
      if ((p.status || "paid") !== "paid") continue
      const cyc = getPaymentCycle(p)
      if (!cyc) continue
      const key = String((p.member || "").trim().toLowerCase())
      if (!paidBy[key]) paidBy[key] = new Set()
      paidBy[key].add(cyc)
    }

    if (cmMembers.length > 0) {
      return cmMembers.map((m: any) => {
        const name: string = (m?.name || m?.memberName || "").trim()
        const key = name.toLowerCase()
        const paidSet = paidBy[key] || new Set<number>()
        const map: Record<string, string> = {}
        for (let i = 1; i <= monthsToShow; i++) {
          map[`month${i}`] = paidSet.has(i) ? "paid" : "pending"
        }
        const totalPaid = Array.from(paidSet.values()).reduce((acc, _i) => acc + monthlyAmount, 0)
        return { name, totalPaid, nextDue: null, ...map }
      })
    }

    // derive members from admin payments fallback
    const byMember = new Map<string, number>()
    const paidByMemberMonth = new Map<string, Set<number>>()
    for (const p of payments || []) {
      if ((p.status || "paid") !== "paid") continue
      const name = (p.member || "").trim()
      const amt = Number(p.amount || monthlyAmount)
      byMember.set(name, (byMember.get(name) || 0) + amt)
      const key = `${name}`
      if (!paidByMemberMonth.has(key)) paidByMemberMonth.set(key, new Set())
      const cyc = getPaymentCycle(p)
      if (cyc) paidByMemberMonth.get(key)!.add(cyc)
    }

    const members = Array.from(byMember.entries()).map(([name, totalPaid]) => {
      const monthsToShow = Math.min(3, duration || 3)
      const map: Record<string, string> = {}
      const paidSet = paidByMemberMonth.get(name) || new Set<number>()
      for (let i = 1; i <= monthsToShow; i++) {
        map[`month${i}`] = paidSet.has(i) ? "paid" : "pending"
      }
      return { name, totalPaid, nextDue: null, ...map }
    })

    return members
  }, [committee, payments])

  // table: monthly overview built from memberPayments + biddingHistory
  const monthlyOverview = useMemo(() => {
    if (!committee) return []
    const months = committee.duration || 0
    const cycles = (committee as any).monthlyCycles as MonthlyCycle[] | undefined
    const rows = []
    for (let m = 1; m <= months; m++) {
      const totalCollected =
        payments
          ?.filter((p) => getPaymentCycle(p) === m && (p.status || "paid") === "paid")
          .reduce((sum, p) => sum + (Number(p.amount) || committee.monthlyAmount || 0), 0) || 0

      const cyc = cycles?.find((c) => Number(c.month) === m)
      const amountWithdrawn = cyc?.amount || 0
      const balance = totalCollected - amountWithdrawn
      rows.push({
        month: m,
        withdrawer: cyc?.memberName || "—",
        withdrawDate: cyc?.date || null,
        totalCollected,
        amountWithdrawn,
        balance,
        status: amountWithdrawn > 0 ? "completed" : totalCollected > 0 ? "in-progress" : "pending",
      })
    }
    return rows
  }, [committee, payments])

  // myPayments derived table: member's month-wise payments with dates and status
  const myPayments = useMemo(() => {
    if (!committee) return []
    const duration = committee.duration || 0
    const monthlyAmount = committee.monthlyAmount || 0

    const mine = payments?.filter(
      (p) =>
        (session?.memberName && (p.member || "").trim() === (session?.memberName || "").trim()) ||
        (session?.memberId && p.memberId === session?.memberId),
    )

    if (duration > 0) {
      const byMonth: Record<number, AdminPayment | undefined> = {}
      for (const p of mine || []) {
        const cyc = getPaymentCycle(p)
        if (!cyc) continue
        if (!byMonth[cyc] && (p.status || "paid") === "paid") byMonth[cyc] = p
      }
      return Array.from({ length: duration }, (_, i) => i + 1).map((m) => {
        const p = byMonth[m]
        return {
          month: m,
          amount: p?.amount || monthlyAmount,
          dueDate: null as string | null,
          paymentDate: p?.date || null,
          status: p ? "paid" : "pending",
        }
      })
    }

    const myRow =
      committee.memberPayments?.find(
        (r) => r.memberId === session?.memberId || r.memberName?.trim() === session?.memberName?.trim(),
      ) || null

    return (
      myRow?.monthlyPayments
        ?.map((p) => ({
          month: p.month,
          amount: p.amount || monthlyAmount,
          dueDate: p.dueDate || null,
          paymentDate: p.paymentDate || null,
          status: p.status || "pending",
        }))
        .sort((a, b) => a.month - b.month) || []
    )
  }, [committee, payments, session])

  // transactions for member only (history of paid months)
  const transactions = useMemo(() => {
    let items: { date: string; type: string; amount: number; balance: number; status: string }[] = []

    let bal = 0
    items = (payments || [])
      .filter(
        (p) =>
          (session?.memberName && (p.member || "").trim() === (session?.memberName || "").trim()) ||
          (session?.memberId && p.memberId === session?.memberId),
      )
      .filter((p) => (p.status || "paid") === "paid")
      .map((p) => {
        const cyc = getPaymentCycle(p)
        return {
          date: p.date || new Date().toISOString(),
          type: `Committee Contribution - Month ${cyc ?? "-"}`,
          amount: Number(p.amount || 0),
          balance: 0,
          status: "Credit",
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((t) => {
        bal += t.amount
        return { ...t, balance: bal }
      })
      .reverse()

    return items
  }, [payments, session])

  const printSection = (id: string, title: string) => {
    const node = document.getElementById(id)
    if (!node) return
    const w = window.open("", "_blank", "width=1024,height=768")
    if (!w) return
    w.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 16px; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: left; font-size: 12px; }
            th { background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${node.outerHTML}
        </body>
      </html>
    `)
    w.document.close()
    w.focus()
    w.print()
  }

  useEffect(() => {
    const load = () => {
      try {
        const rawSession = typeof window !== "undefined" ? localStorage.getItem("member_session") : null
        const fallback = typeof window !== "undefined" ? localStorage.getItem("last_registered_member") : null
        const parsed: MemberSession | null = rawSession
          ? JSON.parse(rawSession)
          : fallback
            ? JSON.parse(fallback)
            : null
        if (!parsed?.committeeId) return
        setSession(parsed)

        const rawCommittees = localStorage.getItem("committees")
        const committees: CommitteeRecord[] = rawCommittees ? JSON.parse(rawCommittees) : []
        // if committee was deleted, clear and redirect
        const found = committees.find((c) => c.id === parsed.committeeId) || null
        if (!found) {
          localStorage.removeItem("member_session")
          window.location.href = "/auth/member/login"
          return
        }

        if (!parsed.memberName && Array.isArray((found as any).committeeMembers)) {
          const first = (found as any).committeeMembers.find((m: any) => !!m?.name || !!m?.memberName)
          if (first?.name || first?.memberName) {
            setSession((prev) => (prev ? { ...prev, memberName: first.name || first.memberName } : prev))
          }
        }

        // Attach payments from admin store if present
        const savedPaymentsKey = `committee_payments_${found.id}`
        const savedPaymentsRaw = localStorage.getItem(savedPaymentsKey)
        let parsedPayments: AdminPayment[] = []
        if (savedPaymentsRaw) {
          try {
            const data = JSON.parse(savedPaymentsRaw)
            if (Array.isArray(data)) parsedPayments = data
          } catch {}
        }
        setPayments(parsedPayments)

        setCommittee(found)
      } catch (e) {
        console.error("[v0] member dashboard load error:", e)
      }
    }

    load()
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return
      // React to committee updates, payment updates, and explicit wipe pings
      if (e.key === "committees" || e.key.startsWith("committee_payments_") || e.key === "__committee_wipe_ping__") {
        load()
      }
    }
    window.addEventListener("storage", onStorage)

    const onVis = () => {
      if (document.visibilityState === "visible") load()
    }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      window.removeEventListener("storage", onStorage)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  const calculateProgress = () => {
    if (!committee) return 0
    const curr = committee.currentMonth || 1
    const total = committee.duration || 1
    return Math.min(100, Math.max(0, (curr / total) * 100))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        )
      case "pending":
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {status === "pending" ? "Pending" : "In Progress"}
          </Badge>
        )
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Welcome, {memberData.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    Committee: {memberData.committee.name} ({memberData.committee.id})
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => printSection("payments-table", "Payment Statement")}>
                <FileText className="h-4 w-4 mr-2" />
                Print Statement
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // clear session and go to login
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("member_session")
                  }
                  window.location.href = "/auth/member/login"
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Contributed</p>
                  <p className="text-2xl font-bold">₹{(memberData.totalDeposit || 0).toLocaleString()}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Amount</p>
                  <p className="text-2xl font-bold">₹{committee?.monthlyAmount?.toLocaleString?.() || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Committee Progress</p>
                  <p className="text-2xl font-bold">
                    {committee?.currentMonth || 0}/{committee?.duration || 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Due Date</p>
                  <p className="text-lg font-bold">
                    {memberData?.committee?.nextDueDate
                      ? new Date(memberData.committee.nextDueDate).toLocaleDateString("en-IN")
                      : "-"}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-payments">My Payments</TabsTrigger>
            <TabsTrigger value="cycles">Monthly Overview</TabsTrigger>
            <TabsTrigger value="transactions">Payment History</TabsTrigger>
            <TabsTrigger value="committee">Committee Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6" id="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Committee Information</CardTitle>
                  <CardDescription>Your committee membership details and progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Committee Name</p>
                      <p className="font-semibold">{memberData.committee.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Committee ID</p>
                      <p className="font-semibold">{memberData.committee.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Amount</p>
                      <p className="font-semibold">₹{memberData.committee.monthlyAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Contributed</p>
                      <p className="font-semibold">₹{memberData.totalDeposit.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Committee Progress */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Committee Progress</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {memberData.committee.currentMonth} of {memberData.committee.totalMonths} months completed
                        </span>
                        <span>{Math.round(calculateProgress())}%</span>
                      </div>
                      <Progress value={calculateProgress()} className="h-3" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Committee Status</p>
                    <Badge
                      className={
                        memberData.committee.status === "Closed" ||
                        (committee?.currentMonth || 0) >= (committee?.duration || 0)
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {memberData.committee.status === "Closed" ||
                      (committee?.currentMonth || 0) >= (committee?.duration || 0)
                        ? "Closed"
                        : "Active"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Member Identity */}
              <Card>
                <CardHeader>
                  <CardTitle>Member Identity</CardTitle>
                  <CardDescription>Read-only profile for this committee</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Member Name</p>
                    <p className="font-semibold">{memberData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Committee Name</p>
                    <p className="font-semibold">{memberData.committee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Committee ID</p>
                    <p className="font-semibold">{memberData.committee.id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="my-payments">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>My Monthly Payments</CardTitle>
                  <CardDescription>Month-wise contribution details</CardDescription>
                </div>
                <Button variant="outline" onClick={() => printSection("my-payments-table", "My Monthly Payments")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </CardHeader>
              <CardContent>
                <div id="my-payments-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myPayments.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">Month {row.month}</TableCell>
                          <TableCell className="font-semibold">₹{row.amount.toLocaleString()}</TableCell>
                          <TableCell>{row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-IN") : "-"}</TableCell>
                          <TableCell>
                            {row.paymentDate ? new Date(row.paymentDate).toLocaleDateString("en-IN") : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(row.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cycles">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Overview</CardTitle>
                  <CardDescription>Month-wise collection and withdrawal summary</CardDescription>
                </div>
                <Button variant="outline" onClick={() => printSection("monthly-overview-table", "Monthly Overview")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </CardHeader>
              <CardContent>
                <div id="monthly-overview-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Withdrawer</TableHead>
                        <TableHead>Withdrawer Date</TableHead>
                        <TableHead>Total Collected</TableHead>
                        <TableHead>Amount Withdrawn</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyOverview.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell>
                            <Badge variant="outline">Month {row.month}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{row.withdrawer}</TableCell>
                          <TableCell>
                            {row.withdrawDate ? new Date(row.withdrawDate).toLocaleDateString("en-IN") : "-"}
                          </TableCell>
                          <TableCell className="font-semibold">₹{row.totalCollected.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">₹{row.amountWithdrawn.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">₹{row.balance.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(row.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Your committee contribution history</CardDescription>
                </div>
                <Button variant="outline" onClick={() => printSection("payments-table", "Payment Statement")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </CardHeader>
              <CardContent>
                <div id="payments-table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((txn, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(txn.date).toLocaleDateString("en-IN")}</TableCell>
                          <TableCell>{txn.type}</TableCell>
                          <TableCell className={txn.amount > 0 ? "text-green-600" : "text-red-600"}>
                            {txn.amount > 0 ? "+" : ""}₹{Math.abs(txn.amount)}
                          </TableCell>
                          <TableCell>₹{txn.balance.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={txn.status === "Credit" ? "default" : "secondary"}>{txn.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="committee">
            <Card>
              <CardHeader>
                <CardTitle>Committee Details</CardTitle>
                <CardDescription>Complete information about your committee</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-2xl font-bold text-blue-600">{memberDeposits.length}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Collection</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{(memberData.committee.monthlyAmount * memberDeposits.length).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Committee Duration</p>
                      <p className="text-2xl font-bold text-purple-600">{memberData.committee.totalMonths} Months</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Committee Members</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {memberDeposits.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">Total: ₹{member.totalPaid.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            {member.month3 === "paid" ? (
                              <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            )}
                          </div>
                        </div>
                      ))}
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
