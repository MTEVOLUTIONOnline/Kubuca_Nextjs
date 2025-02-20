"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function PrivacySettings() {
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [activityVisibility, setActivityVisibility] = useState(true)
  const [dataCollection, setDataCollection] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Privacy settings updated:", { profileVisibility, activityVisibility, dataCollection })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Privacidade e Segurança</h1>
      <p className="text-gray-600">
        Gerencie suas configurações de privacidade e segurança.
      </p>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Configurações de Privacidade</CardTitle>
          <CardDescription>
            Gerencie suas preferências de privacidade e compartilhamento de dados.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="profileVisibility">Perfil Público</Label>
              <Switch id="profileVisibility" checked={profileVisibility} onCheckedChange={setProfileVisibility} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="activityVisibility">Mostrar Status de Atividade</Label>
              <Switch id="activityVisibility" checked={activityVisibility} onCheckedChange={setActivityVisibility} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dataCollection">Permitir Coleta de Dados</Label>
              <Switch id="dataCollection" checked={dataCollection} onCheckedChange={setDataCollection} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Salvar Configurações de Privacidade</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

