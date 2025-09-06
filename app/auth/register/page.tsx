"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Users, Building2, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()

  const registrationOptions = [
    {
      id: "committee",
      title: "Committee Member",
      description: "Join an existing committee for group savings and monthly withdrawals",
      icon: Users,
      color: "bg-blue-500",
      href: "/auth/register/committee",
    },
    {
      id: "society",
      title: "Society Member",
      description: "Become a society member with individual savings plans and benefits",
      icon: Building2,
      color: "bg-green-500",
      href: "/auth/register/society",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
              <Calculator className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-3xl">Join Suraksha Savings Society</CardTitle>
            <CardDescription className="text-lg">
              Choose your membership type to start your financial journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {registrationOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <Card
                    key={option.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-accent/50"
                    onClick={() => router.push(option.href)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`mx-auto mb-4 p-4 ${option.color} rounded-full w-fit`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                      <p className="text-muted-foreground mb-4">{option.description}</p>
                      <Button variant="outline" className="w-full bg-transparent">
                        Register as {option.title}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/member/login" className="text-accent hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
