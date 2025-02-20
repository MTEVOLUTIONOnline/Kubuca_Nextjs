"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Notification settings updated:", { emailNotifications, pushNotifications, marketingEmails })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificações</CardTitle>
        <CardDescription>
          Gerencie como você recebe notificações e atualizações.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Notificações por Email</Label>
            <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pushNotifications">Notificações por Push</Label>
            <Switch id="pushNotifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketingEmails">Email de Marketing</Label>
            <Switch id="marketingEmails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Salvar Preferências de Notificações</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

