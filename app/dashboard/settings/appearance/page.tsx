"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light")
  const [reducedMotion, setReducedMotion] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Appearance settings updated:", { theme, reducedMotion })
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Configurações de Aparência</CardTitle>
        <CardDescription>
          Personalize a aparência da aplicação.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Tema</Label>
            <RadioGroup value={theme} onValueChange={setTheme}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Claro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Escuro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">Sistema</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="reducedMotion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
            <Label htmlFor="reducedMotion">Reduzir movimento</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Salvar Configurações de Aparência</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

