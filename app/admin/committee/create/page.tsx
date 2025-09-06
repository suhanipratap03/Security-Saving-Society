"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save, Calculator, Users, Building2, Crown, Plus, Trash2 } from "lucide-react"
import { wipeCommitteeData } from "@/lib/committee-storage"

interface Member {
  id: string
  name: string
  mobile: string
  email: string
  address: string
  adhar: string
}

const availableMembers = [
  {
    id: "1",
    name: "John Doe",
    mobile: "1234567890",
    email: "john@example.com",
    address: "123 Main St",
    adhar: "1234-5678-9012",
  },
  {
    id: "2",
    name: "Jane Smith",
    mobile: "0987654321",
    email: "jane@example.com",
    address: "456 Elm St",
    adhar: "9876-5432-1098",
  },
  // Add more members as needed
]

export default function CreateCommitteePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: "",
    duration: "",
    monthlyAmount: "",
    startDate: "",
    rules: "",
    committeeHead: "",
    committeeId: "COM1",
  })

  const [committeeMembers, setCommitteeMembers] = useState<Member[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addNewMember = () => {
    const maxMembers = Number.parseInt(formData.members || "0")
    if (committeeMembers.length < maxMembers) {
      const newMember: Member = {
        id: `member-${Date.now()}`,
        name: "",
        mobile: "",
        email: "",
        address: "",
        adhar: "",
      }
      setCommitteeMembers([...committeeMembers, newMember])
    }
  }

  const removeMember = (memberId: string) => {
    setCommitteeMembers(committeeMembers.filter((member) => member.id !== memberId))
    // Reset committee head if the removed member was selected as head
    if (formData.committeeHead === memberId) {
      setFormData((prev) => ({ ...prev, committeeHead: "" }))
    }
  }

  const updateMember = (memberId: string, field: keyof Member, value: string) => {
    setCommitteeMembers(
      committeeMembers.map((member) => (member.id === memberId ? { ...member, [field]: value } : member)),
    )
  }

  const handleCommitteeHeadChange = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      committeeHead: memberId,
    }))
  }

  const calculateTotalFund = () => {
    const members = Number.parseInt(formData.members) || 0
    const monthlyAmount = Number.parseInt(formData.monthlyAmount) || 0
    return members * monthlyAmount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      try {
        wipeCommitteeData(formData.committeeId)
      } catch (e) {
        console.warn("[v0] wipeCommitteeData failed or unavailable:", e)
      }

      // Create committee object with all the form data
      const committeeData = {
        id: formData.committeeId,
        name: formData.name,
        description: formData.description,
        members: Number.parseInt(formData.members),
        duration: Number.parseInt(formData.duration),
        monthlyAmount: Number.parseInt(formData.monthlyAmount),
        startDate: formData.startDate,
        rules: formData.rules,
        committeeHead: formData.committeeHead,
        committeeMembers: committeeMembers,
        status: "Active",
        totalFund: calculateTotalFund(),
        createdAt: new Date().toISOString(),
        currentMonth: 1,
        paymentHistory: [],
        memberPayments: committeeMembers.map((member) => ({
          memberId: member.id,
          memberName: member.name,
          monthlyPayments: Array.from({ length: Number.parseInt(formData.duration) || 12 }, (_, i) => ({
            month: i + 1,
            amount: 0,
            status: "pending",
            dueDate: new Date(new Date(formData.startDate).getTime() + i * 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            paymentDate: null,
            paymentMode: null,
            lateFees: 0,
            remarks: "",
          })),
        })),
        biddingHistory: [],
        committeeAccount: 0,
      }

      // Get existing committees from localStorage
      const existingCommittees = JSON.parse(localStorage.getItem("committees") || "[]")

      // Add new committee
      existingCommittees.push(committeeData)

      // Save back to localStorage
      localStorage.setItem("committees", JSON.stringify(existingCommittees))

      console.log("[v0] Committee created successfully:", committeeData)

      setTimeout(() => {
        setIsLoading(false)
        router.push("/admin/committee/list")
      }, 1000)
    } catch (error) {
      console.error("[v0] Error creating committee:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/committee/list">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Committees
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Create New Committee</h1>
                <p className="text-sm text-muted-foreground">Set up a new chit fund committee</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-accent" />
                  <div>
                    <CardTitle>Committee Information</CardTitle>
                    <CardDescription>Basic details about the committee</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Committee Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter committee name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="committeeId">Committee ID *</Label>
                    <Input
                      id="committeeId"
                      name="committeeId"
                      value={formData.committeeId}
                      onChange={handleChange}
                      placeholder="e.g., COM1, COM2, COM3..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter committee description"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Committee Structure */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Calculator className="h-6 w-6 text-accent" />
                  <div>
                    <CardTitle>Committee Structure</CardTitle>
                    <CardDescription>Define committee size and financial parameters</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="members">Number of Members *</Label>
                    <Input
                      id="members"
                      name="members"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.members}
                      onChange={handleChange}
                      placeholder="Enter number of members"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (Months) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      max="24"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="Enter duration in months"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyAmount">Monthly Amount per Member (₹) *</Label>
                    <Input
                      id="monthlyAmount"
                      name="monthlyAmount"
                      type="number"
                      value={formData.monthlyAmount}
                      onChange={handleChange}
                      placeholder="Enter monthly amount"
                      required
                    />
                  </div>
                </div>

                {formData.members && formData.monthlyAmount && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Calculator className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Committee Summary</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Monthly Fund</p>
                          <p className="font-semibold text-lg">₹{calculateTotalFund().toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Member Addition */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-accent" />
                    <div>
                      <CardTitle className="text-base">Add Committee Members</CardTitle>
                      <CardDescription>Manually add member details for this committee</CardDescription>
                    </div>
                  </div>
                  {formData.members && committeeMembers.length < Number.parseInt(formData.members) && (
                    <Button type="button" onClick={addNewMember} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {formData.members && (
                  <div className="mb-4 text-sm text-muted-foreground">
                    Members Added: {committeeMembers.length} / {formData.members}
                  </div>
                )}

                <div className="space-y-6">
                  {committeeMembers.map((member, index) => (
                    <Card key={member.id} className="border-2 border-dashed">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Member {index + 1}</CardTitle>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeMember(member.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${member.id}`}>Full Name *</Label>
                            <Input
                              id={`name-${member.id}`}
                              value={member.name}
                              onChange={(e) => updateMember(member.id, "name", e.target.value)}
                              placeholder="Enter member name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`mobile-${member.id}`}>Mobile Number *</Label>
                            <Input
                              id={`mobile-${member.id}`}
                              value={member.mobile}
                              onChange={(e) => updateMember(member.id, "mobile", e.target.value)}
                              placeholder="Enter mobile number"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`email-${member.id}`}>Email Address</Label>
                            <Input
                              id={`email-${member.id}`}
                              type="email"
                              value={member.email}
                              onChange={(e) => updateMember(member.id, "email", e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`adhar-${member.id}`}>Adhar Card Number</Label>
                            <Input
                              id={`adhar-${member.id}`}
                              value={member.adhar || ""}
                              onChange={(e) => updateMember(member.id, "adhar", e.target.value)}
                              placeholder="Enter Adhar card number"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`address-${member.id}`}>Address</Label>
                          <Input
                            id={`address-${member.id}`}
                            value={member.address}
                            onChange={(e) => updateMember(member.id, "address", e.target.value)}
                            placeholder="Enter address"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {formData.members && committeeMembers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No members added yet. Click "Add Member" to start adding committee members.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Committee Head Selection */}
            {committeeMembers.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Crown className="h-6 w-6 text-accent" />
                    <div>
                      <CardTitle>Select Committee Head</CardTitle>
                      <CardDescription>Choose one member as the committee head</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={formData.committeeHead} onValueChange={handleCommitteeHeadChange}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {committeeMembers
                        .filter((member) => member.name.trim() !== "")
                        .map((member) => (
                          <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <RadioGroupItem value={member.id} id={`head-${member.id}`} />
                            <div className="flex-1">
                              <Label htmlFor={`head-${member.id}`} className="font-medium text-sm cursor-pointer">
                                {member.name || "Unnamed Member"}
                              </Label>
                              <p className="text-xs text-muted-foreground">{member.mobile || "No mobile"}</p>
                            </div>
                            {formData.committeeHead === member.id && <Crown className="h-4 w-4 text-accent" />}
                          </div>
                        ))}
                    </div>
                  </RadioGroup>
                  {formData.committeeHead && (
                    <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                      <p className="text-sm font-medium text-accent">
                        Committee Head: {committeeMembers.find((m) => m.id === formData.committeeHead)?.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Committee Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Committee Rules & Terms</CardTitle>
                <CardDescription>Additional rules and terms for the committee</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="rules">Committee Rules</Label>
                  <Textarea
                    id="rules"
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    placeholder="Enter any specific rules or terms for this committee"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/admin/committee/list">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Calculator className="h-4 w-4 mr-2 animate-spin" />
                    Creating Committee...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Committee
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
