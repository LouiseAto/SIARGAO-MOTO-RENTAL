"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Download, Filter, Users, Mail, Phone, MapPin, CreditCard, Calendar, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { format } from "date-fns"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerRentals, setCustomerRentals] = useState<any[]>([])
  const [loadingRentals, setLoadingRentals] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    full_name: "",
    email: "",
    phone: "",
    id_number: "",
    address: "",
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      const data = await response.json()
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch customers")
      }
      
      setCustomers(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch customers")
      console.error(error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerRentals = async (customerId: string) => {
    setLoadingRentals(true)
    try {
      const response = await fetch("/api/rentals")
      const data = await response.json()
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to fetch rentals")
      }
      
      const rentals = Array.isArray(data) ? data : []
      const customerRentals = rentals.filter((r: any) => r.customer_id === customerId)
      setCustomerRentals(customerRentals)
    } catch (error: any) {
      console.error(error)
      setCustomerRentals([])
    } finally {
      setLoadingRentals(false)
    }
  }

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer)
    fetchCustomerRentals(customer.id)
  }

  const handleAddCustomer = async () => {
    if (!newCustomer.full_name || !newCustomer.phone) {
      toast.error("Name and phone are required")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add customer")
      }

      toast.success("Customer added successfully")
      setShowAddModal(false)
      setNewCustomer({
        full_name: "",
        email: "",
        phone: "",
        id_number: "",
        address: "",
      })
      fetchCustomers()
    } catch (error: any) {
      toast.error(error.message || "Failed to add customer")
    } finally {
      setSaving(false)
    }
  }

  const filteredCustomers = Array.isArray(customers) ? customers.filter((c) =>
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  return (
    <DashboardLayout
      title="Customers"
      subtitle="Manage your customer database"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : customers.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered customers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Customer List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchQuery
                    ? "No customers found matching your search."
                    : "No customers yet. Add your first customer to get started."}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCustomers.map((customer, index) => (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => handleCustomerClick(customer)}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{customer.full_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          {customer.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </span>
                          )}
                          {customer.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Detail Modal */}
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                View customer information and rental history
              </DialogDescription>
            </DialogHeader>

            {selectedCustomer && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{selectedCustomer.full_name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCustomer.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">Email</div>
                          <div className="text-sm text-muted-foreground">{selectedCustomer.email}</div>
                        </div>
                      </div>
                    )}
                    
                    {selectedCustomer.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">Phone</div>
                          <div className="text-sm text-muted-foreground">{selectedCustomer.phone}</div>
                        </div>
                      </div>
                    )}
                    
                    {selectedCustomer.id_number && (
                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">ID Number</div>
                          <div className="text-sm text-muted-foreground">{selectedCustomer.id_number}</div>
                        </div>
                      </div>
                    )}
                    
                    {selectedCustomer.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">Address</div>
                          <div className="text-sm text-muted-foreground">{selectedCustomer.address}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Customer Since</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(selectedCustomer.created_at), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental History */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Rental History</h3>
                  
                  {loadingRentals ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : customerRentals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                      No rental history yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customerRentals.map((rental: any) => (
                        <div key={rental.id} className="p-4 border rounded-lg space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {rental.motorbikes?.brand} {rental.motorbikes?.model}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {rental.motorbikes?.plate_number}
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              rental.status === 'active' ? 'bg-green-100 text-green-700' :
                              rental.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {rental.status}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{format(new Date(rental.start_date), "MMM dd, yyyy")} - {format(new Date(rental.end_date), "MMM dd, yyyy")}</span>
                            <span className="font-semibold text-foreground">₱{rental.total_cost?.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Customer Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Enter customer information to add them to your database
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={newCustomer.full_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, full_name: e.target.value })}
                  placeholder="Juan Dela Cruz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+63-XXX-XXX-XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="juan@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_number">ID Number</Label>
                <Input
                  id="id_number"
                  value={newCustomer.id_number}
                  onChange={(e) => setNewCustomer({ ...newCustomer, id_number: e.target.value })}
                  placeholder="ID or License Number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Complete address"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
