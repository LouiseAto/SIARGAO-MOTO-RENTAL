"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Bike,
  MapPin,
  BarChart3,
  Shield,
  Zap,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PesoIcon } from "@/components/icons/PesoIcon"

const features = [
  {
    icon: Bike,
    title: "Fleet Management",
    description: "Manage your entire motorcycle fleet with real-time status tracking and maintenance schedules.",
  },
  {
    icon: MapPin,
    title: "GIS Tracking",
    description: "Track motorcycle locations in real-time with advanced GPS integration and geofencing.",
  },
  {
    icon: PesoIcon,
    title: "Automated Payroll",
    description: "Calculate employee salaries automatically based on rentals, bonuses, and deductions.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Get insights into revenue, rental trends, and business performance with beautiful charts.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with role-based access control and data encryption.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with modern technology for blazing-fast performance and seamless user experience.",
  },
]

const stats = [
  { label: "Active Rentals", value: "1,200+" },
  { label: "Fleet Size", value: "500+" },
  { label: "Happy Customers", value: "5,000+" },
  { label: "Uptime", value: "99.9%" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bike className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Siargao Moto</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 gradient-mesh">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Modern Rental Management Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
              Manage Your Motorcycle Rental Business{" "}
              <span className="text-primary">Effortlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Complete rental management solution with real-time tracking, automated payroll,
              and powerful analytics. Built for modern rental businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="rounded-xl border border-border shadow-2xl overflow-hidden bg-card">
              <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to streamline your operations and grow your rental business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Choose Siargao Moto?
              </h2>
              <div className="space-y-4">
                {[
                  "Real-time fleet tracking and monitoring",
                  "Automated payroll calculations",
                  "Comprehensive analytics and reporting",
                  "Mobile-responsive design",
                  "Secure cloud-based platform",
                  "24/7 customer support",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Customer Management</div>
                      <div className="text-sm text-muted-foreground">
                        Track customer history and preferences
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Rental Tracking</div>
                      <div className="text-sm text-muted-foreground">
                        Monitor active and completed rentals
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Business Insights</div>
                      <div className="text-sm text-muted-foreground">
                        Make data-driven decisions
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of rental businesses already using Siargao Moto
              </p>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bike className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Siargao Moto</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Siargao Moto Rental. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
