"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Loader2, 
  Check,
  ChevronRight,
  Shield,
  Bell,
  CreditCard,
  Lock
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type SettingsSection = "profile" | "security" | "notifications" | "privacy"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  })
  
  const [editedProfile, setEditedProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/auth/profile?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched profile:", data)
        const profileData = {
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          avatar: data.avatar || "",
        }
        setProfile(profileData)
        setEditedProfile({
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
        })
      } else {
        toast.error("Failed to load profile")
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("Saving profile:", editedProfile)
      
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProfile),
        cache: "no-store",
      })

      const result = await response.json()
      console.log("Save response:", result)

      if (!response.ok) {
        throw new Error(result.error || "Failed to save profile")
      }

      // Update displayed profile with saved data
      setProfile({
        ...profile,
        full_name: result.full_name || editedProfile.full_name,
        email: result.email || editedProfile.email,
        phone: result.phone || editedProfile.phone,
        address: result.address || editedProfile.address,
      })
      
      toast.success("Profile updated successfully")
      
      // Refresh profile data to ensure sync
      setTimeout(() => {
        fetchProfile()
      }, 500)
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile")
      console.error("Save profile error:", error)
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const menuItems = [
    { id: "profile" as SettingsSection, label: "My Profile", icon: User },
    { id: "security" as SettingsSection, label: "Security", icon: Shield },
    { id: "notifications" as SettingsSection, label: "Notifications", icon: Bell },
    { id: "privacy" as SettingsSection, label: "Privacy", icon: Lock },
  ]

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account settings and preferences"
    >
      <div className="flex gap-6 max-w-7xl">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 flex-shrink-0"
        >
          <div className="bg-card rounded-lg border border-border p-2 sticky top-6">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="bg-card rounded-lg border border-border"
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <h2 className="text-2xl font-bold">My Profile</h2>
                  <p className="text-muted-foreground mt-1">
                    Manage your personal information
                  </p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <span className="ml-3 text-muted-foreground">Loading profile...</span>
                  </div>
                ) : (
                  <div className="p-6 space-y-8">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                          <AvatarImage src={profile.avatar} />
                          <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                            {getInitials(profile.full_name || "User")}
                          </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{profile.full_name || "User"}</h3>
                        <p className="text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="space-y-6">
                      {/* Full Name */}
                      <div className="grid grid-cols-3 gap-4 items-start">
                        <Label className="text-right pt-3 text-muted-foreground">
                          Full Name
                        </Label>
                        <div className="col-span-2 space-y-2">
                          <Input
                            placeholder="Enter your full name"
                            value={editedProfile.full_name}
                            onChange={(e) =>
                              setEditedProfile({ ...editedProfile, full_name: e.target.value })
                            }
                            className="max-w-md"
                          />
                          <p className="text-xs text-muted-foreground">
                            Your full name as it appears on official documents
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Email */}
                      <div className="grid grid-cols-3 gap-4 items-start">
                        <Label className="text-right pt-3 text-muted-foreground">
                          Email
                        </Label>
                        <div className="col-span-2 space-y-2">
                          <div className="flex gap-2 max-w-md">
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              value={editedProfile.email}
                              onChange={(e) =>
                                setEditedProfile({ ...editedProfile, email: e.target.value })
                              }
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            We'll send important updates to this email
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Phone */}
                      <div className="grid grid-cols-3 gap-4 items-start">
                        <Label className="text-right pt-3 text-muted-foreground">
                          Phone Number
                        </Label>
                        <div className="col-span-2 space-y-2">
                          <Input
                            type="tel"
                            placeholder="+63 XXX XXX XXXX"
                            value={editedProfile.phone}
                            onChange={(e) =>
                              setEditedProfile({ ...editedProfile, phone: e.target.value })
                            }
                            className="max-w-md"
                          />
                          <p className="text-xs text-muted-foreground">
                            For account security and order updates
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Address */}
                      <div className="grid grid-cols-3 gap-4 items-start">
                        <Label className="text-right pt-3 text-muted-foreground">
                          Address
                        </Label>
                        <div className="col-span-2 space-y-2">
                          <Input
                            placeholder="Enter your address"
                            value={editedProfile.address}
                            onChange={(e) =>
                              setEditedProfile({ ...editedProfile, address: e.target.value })
                            }
                            className="max-w-md"
                          />
                          <p className="text-xs text-muted-foreground">
                            Your primary address for deliveries
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        size="lg"
                        className="min-w-[120px]"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h2 className="text-2xl font-bold mb-2">Security Settings</h2>
                <p className="text-muted-foreground mb-6">
                  Manage your password and security preferences
                </p>
                <div className="text-center py-12 text-muted-foreground">
                  Security settings coming soon
                </div>
              </motion.div>
            )}

            {activeSection === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h2 className="text-2xl font-bold mb-2">Notification Preferences</h2>
                <p className="text-muted-foreground mb-6">
                  Choose how you want to be notified
                </p>
                <div className="text-center py-12 text-muted-foreground">
                  Notification settings coming soon
                </div>
              </motion.div>
            )}

            {activeSection === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h2 className="text-2xl font-bold mb-2">Privacy Settings</h2>
                <p className="text-muted-foreground mb-6">
                  Control your privacy and data preferences
                </p>
                <div className="text-center py-12 text-muted-foreground">
                  Privacy settings coming soon
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  )
}
