"use client"

import { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { AuthCheck } from "@/components/AuthCheck"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <AuthCheck>
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header title={title} subtitle={subtitle} />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
