import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Calculator } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Security Savings Society</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional Financial Management Portal for Savings Society, Loan Management & Committee Operations
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Login */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>
                Complete society management, member registration, loan processing & committee operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Member Management & Registration
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Society & Committee Operations
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Loan Processing & Reports
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <Link href="/auth/admin/login" className="block">
                  <Button className="w-full" size="lg">
                    Admin Login
                  </Button>
                </Link>
                <Link href="/auth/admin/register" className="block">
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    Admin Registration
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Member Login */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                <Calculator className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Member Portal</CardTitle>
              <CardDescription>
                View your account details, loan status, committee participation & financial reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  Account Statement & Balance
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  Loan Status & EMI Details
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  Committee Participation
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <Link href="/auth/member/login" className="block">
                  <Button variant="secondary" className="w-full" size="lg">
                    Member Login
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    Member Registration
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8 text-foreground">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Society Management</h3>
              <p className="text-sm text-muted-foreground">
                2-year & 3-year savings plans with flexible interest rates
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Committee Operations</h3>
              <p className="text-sm text-muted-foreground">Chit fund management with bidding system</p>
            </div>
            <div className="p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Loan Management</h3>
              <p className="text-sm text-muted-foreground">Flexible loan processing with automated calculations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
