"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Calendar, TrendingUp, IndianRupee, Eye, Plus, Gavel } from "lucide-react"

// Mock auction data
const mockAuctions = [
  {
    id: "A001",
    committeeId: "C001",
    committeeName: "सुरक्षा कमेटी - जनवरी 2024",
    month: 3,
    auctionDate: "2024-03-01",
    totalAmount: 60000,
    governmentDeduction: 900,
    netAmount: 59100,
    status: "Completed",
    winner: {
      memberId: "M003",
      memberName: "अमित गुप्ता",
      bidAmount: 3000,
      bidPercentage: 5.0,
    },
    bids: [
      { memberId: "M003", memberName: "अमित गुप्ता", bidAmount: 3000, bidPercentage: 5.0 },
      { memberId: "M007", memberName: "रमेश कुमार", bidAmount: 2500, bidPercentage: 4.2 },
      { memberId: "M001", memberName: "राज कुमार शर्मा", bidAmount: 2000, bidPercentage: 3.3 },
    ],
  },
  {
    id: "A002",
    committeeId: "C001",
    committeeName: "सुरक्षा कमेटी - जनवरी 2024",
    month: 2,
    auctionDate: "2024-02-01",
    totalAmount: 60000,
    governmentDeduction: 900,
    netAmount: 59100,
    status: "Completed",
    winner: {
      memberId: "M005",
      memberName: "विकास यादव",
      bidAmount: 2800,
      bidPercentage: 4.7,
    },
    bids: [
      { memberId: "M005", memberName: "विकास यादव", bidAmount: 2800, bidPercentage: 4.7 },
      { memberId: "M002", memberName: "सुनीता देवी", bidAmount: 2200, bidPercentage: 3.7 },
      { memberId: "M004", memberName: "प्रिया सिंह", bidAmount: 1800, bidPercentage: 3.0 },
    ],
  },
  {
    id: "A003",
    committeeId: "C002",
    committeeName: "प्रगति कमेटी - फरवरी 2024",
    month: 2,
    auctionDate: "2024-03-01",
    totalAmount: 30000,
    governmentDeduction: 450,
    netAmount: 29550,
    status: "Completed",
    winner: {
      memberId: "M008",
      memberName: "सुमित्रा देवी",
      bidAmount: 1500,
      bidPercentage: 5.0,
    },
    bids: [
      { memberId: "M008", memberName: "सुमित्रा देवी", bidAmount: 1500, bidPercentage: 5.0 },
      { memberId: "M009", memberName: "संजय गुप्ता", bidAmount: 1200, bidPercentage: 4.0 },
    ],
  },
  {
    id: "A004",
    committeeId: "C001",
    committeeName: "सुरक्षा कमेटी - जनवरी 2024",
    month: 4,
    auctionDate: "2024-04-01",
    totalAmount: 60000,
    governmentDeduction: 0,
    netAmount: 60000,
    status: "Scheduled",
    winner: null,
    bids: [],
  },
]

export default function AuctionsPage() {
  const [selectedCommittee, setSelectedCommittee] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedAuction, setSelectedAuction] = useState<any>(null)

  const filteredAuctions = mockAuctions.filter((auction) => {
    const matchesCommittee = selectedCommittee === "all" || auction.committeeId === selectedCommittee
    const matchesStatus = selectedStatus === "all" || auction.status.toLowerCase() === selectedStatus.toLowerCase()

    return matchesCommittee && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalStats = {
    totalAuctions: mockAuctions.length,
    completedAuctions: mockAuctions.filter((a) => a.status === "Completed").length,
    scheduledAuctions: mockAuctions.filter((a) => a.status === "Scheduled").length,
    totalDistributed: mockAuctions.filter((a) => a.status === "Completed").reduce((sum, a) => sum + a.netAmount, 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/committee">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Committee
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Monthly Auctions</h1>
                <p className="text-sm text-muted-foreground">Manage committee auctions and bidding</p>
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Auction
            </Button>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Auctions</p>
                  <p className="text-2xl font-bold">{totalStats.totalAuctions}</p>
                </div>
                <Gavel className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{totalStats.completedAuctions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">{totalStats.scheduledAuctions}</p>
                </div>
                <Calendar className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Distributed</p>
                  <p className="text-2xl font-bold">₹{(totalStats.totalDistributed / 100000).toFixed(1)}L</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Committee</Label>
                <Select value={selectedCommittee} onValueChange={setSelectedCommittee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select committee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Committees</SelectItem>
                    <SelectItem value="C001">सुरक्षा कमेटी - जनवरी 2024</SelectItem>
                    <SelectItem value="C002">प्रगति कमेटी - फरवरी 2024</SelectItem>
                    <SelectItem value="C003">उन्नति कमेटी - दिसंबर 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedCommittee("all")
                    setSelectedStatus("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auctions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Auctions List ({filteredAuctions.length} auctions)</CardTitle>
            <CardDescription>Complete list of committee auctions with bidding details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Committee</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Auction Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Deduction</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>Winning Bid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuctions.map((auction) => (
                    <TableRow key={auction.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{auction.committeeName}</p>
                          <p className="text-xs text-muted-foreground">{auction.committeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>Month {auction.month}</TableCell>
                      <TableCell>{new Date(auction.auctionDate).toLocaleDateString("en-IN")}</TableCell>
                      <TableCell>₹{auction.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>₹{auction.governmentDeduction.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">₹{auction.netAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        {auction.winner ? (
                          <div>
                            <p className="font-medium text-sm">{auction.winner.memberName}</p>
                            <p className="text-xs text-muted-foreground">{auction.winner.memberId}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {auction.winner ? (
                          <div>
                            <p className="font-semibold">₹{auction.winner.bidAmount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{auction.winner.bidPercentage}%</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(auction.status)}>{auction.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAuction(auction)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Auction Details - {selectedAuction?.committeeName}</DialogTitle>
                              <DialogDescription>
                                Month {selectedAuction?.month} •{" "}
                                {selectedAuction && new Date(selectedAuction.auctionDate).toLocaleDateString("en-IN")}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedAuction && (
                              <div className="space-y-6">
                                {/* Auction Summary */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="font-semibold">₹{selectedAuction.totalAmount.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Government Deduction</p>
                                    <p className="font-semibold">
                                      ₹{selectedAuction.governmentDeduction.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Net Amount</p>
                                    <p className="font-semibold text-primary">
                                      ₹{selectedAuction.netAmount.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge className={getStatusBadgeColor(selectedAuction.status)}>
                                      {selectedAuction.status}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Winner Details */}
                                {selectedAuction.winner && (
                                  <div>
                                    <h4 className="font-semibold mb-3">Winning Bid</h4>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium">{selectedAuction.winner.memberName}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedAuction.winner.memberId}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold text-lg">
                                            ₹{selectedAuction.winner.bidAmount.toLocaleString()}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedAuction.winner.bidPercentage}% deduction
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* All Bids */}
                                {selectedAuction.bids.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-3">All Bids</h4>
                                    <div className="space-y-2">
                                      {selectedAuction.bids.map((bid: any, index: number) => (
                                        <div
                                          key={index}
                                          className={`p-3 rounded-lg border ${index === 0 ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
                                        >
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="font-medium">{bid.memberName}</p>
                                              <p className="text-sm text-muted-foreground">{bid.memberId}</p>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-semibold">₹{bid.bidAmount.toLocaleString()}</p>
                                              <p className="text-sm text-muted-foreground">{bid.bidPercentage}%</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
