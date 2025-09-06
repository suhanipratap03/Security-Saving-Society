"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Building2, Calculator, Settings, LogOut, Users } from "lucide-react"

export default function AdminDashboard() {
  const [adminName] = useState("Admin User") // This would come from auth context

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Security Savings Society</h1>
                <p className="text-sm text-muted-foreground">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Welcome, {adminName}</p>
                <Badge variant="secondary" className="text-xs">
                  Administrator
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Admin Dashboard</h2>
          <p className="text-lg text-muted-foreground">Choose a management module to get started</p>
        </div>

        {/* Main Navigation Cards - Only Society and Committee Management */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Society Management */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Society Management</CardTitle>
              <CardDescription className="text-base">
                Manage members, savings plans, loan processing and society operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Member Registration & Account Management
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  2-Year & 3-Year Savings Plans
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Loan Processing & EMI Management
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Financial Reports & Statements
                </div>
              </div>

              <div className="pt-4">
                <Link href="/admin/society" className="block">
                  <Button className="w-full" size="lg">
                    <Users className="h-5 w-5 mr-2" />
                    Access Society Module
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Committee Management */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
                <Calculator className="h-12 w-12 text-accent" />
              </div>
              <CardTitle className="text-2xl">Committee Management</CardTitle>
              <CardDescription className="text-base">
                Manage chit fund committees, bidding system and committee operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Create & Manage Committees
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Bidding System & Monthly Collections
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Committee Member Management
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Monthly Reports & Settlements
                </div>
              </div>

              <div className="pt-4">
                <Link href="/admin/committee" className="block">
                  <Button
                    variant="secondary"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    size="lg"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Access Committee Module
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
