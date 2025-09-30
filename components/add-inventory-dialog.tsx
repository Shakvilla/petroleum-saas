"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"

interface AddInventoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: string
}

export function AddInventoryDialog({ open, onOpenChange, tenant }: AddInventoryDialogProps) {
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    type: "",
    tank: "",
    amount: "",
    supplier: "",
    reference: "",
    operator: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      type: "",
      tank: "",
      amount: "",
      supplier: "",
      reference: "",
      operator: "",
      notes: "",
    })
    setDate(undefined)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Inventory Transaction</span>
          </DialogTitle>
          <DialogDescription>Record a new inventory transaction for {tenant} petroleum</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tank">Tank</Label>
              <Select value={formData.tank} onValueChange={(value) => handleInputChange("tank", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T001">Premium Gasoline Tank 1</SelectItem>
                  <SelectItem value="T002">Regular Gasoline Tank 2</SelectItem>
                  <SelectItem value="T003">Diesel Tank 1</SelectItem>
                  <SelectItem value="T004">Kerosene Tank 1</SelectItem>
                  <SelectItem value="T005">Premium Diesel Tank 2</SelectItem>
                  <SelectItem value="T006">Heating Oil Tank 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Liters)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Transaction Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier/Source</Label>
              <Input
                id="supplier"
                placeholder="Enter supplier name"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="Enter reference number"
                value={formData.reference}
                onChange={(e) => handleInputChange("reference", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="operator">Operator</Label>
            <Input
              id="operator"
              placeholder="Enter operator name"
              value={formData.operator}
              onChange={(e) => handleInputChange("operator", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
