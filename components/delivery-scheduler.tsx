"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Package, Truck, Clock } from "lucide-react"

interface DeliverySchedulerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeliveryScheduler({ open, onOpenChange }: DeliverySchedulerProps) {
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    customer: "",
    address: "",
    product: "",
    quantity: "",
    priority: "medium",
    vehicle: "",
    driver: "",
    notes: "",
    timeSlot: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Scheduling delivery:", { ...formData, date })
    onOpenChange(false)
    // Reset form
    setFormData({
      customer: "",
      address: "",
      product: "",
      quantity: "",
      priority: "medium",
      vehicle: "",
      driver: "",
      notes: "",
      timeSlot: "",
    })
    setDate(undefined)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Delivery</DialogTitle>
          <DialogDescription>
            Create a new delivery schedule with customer details and route information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer Name *</Label>
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => updateFormData("customer", e.target.value)}
                  placeholder="e.g., Shell Station Downtown"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Full delivery address"
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product">Product Type *</Label>
                <Select value={formData.product} onValueChange={(value) => updateFormData("product", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium-gasoline">Premium Gasoline</SelectItem>
                    <SelectItem value="regular-gasoline">Regular Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="heating-oil">Heating Oil</SelectItem>
                    <SelectItem value="jet-fuel">Jet Fuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => updateFormData("quantity", e.target.value)}
                  placeholder="e.g., 5000L"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value) => updateFormData("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Delivery Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="timeSlot">Preferred Time Slot</Label>
                <Select value={formData.timeSlot} onValueChange={(value) => updateFormData("timeSlot", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                    <SelectItem value="evening">Evening (5:00 PM - 8:00 PM)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Assignment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle">Assign Vehicle</Label>
                <Select value={formData.vehicle} onValueChange={(value) => updateFormData("vehicle", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trk-001">TRK-001 (Available)</SelectItem>
                    <SelectItem value="trk-002">TRK-002 (Available)</SelectItem>
                    <SelectItem value="trk-006">TRK-006 (Available)</SelectItem>
                    <SelectItem value="auto">Auto-assign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="driver">Assign Driver</Label>
                <Select value={formData.driver} onValueChange={(value) => updateFormData("driver", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="robert-chen">Robert Chen</SelectItem>
                    <SelectItem value="auto">Auto-assign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                placeholder="Special instructions, access codes, contact information, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Schedule Delivery
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
