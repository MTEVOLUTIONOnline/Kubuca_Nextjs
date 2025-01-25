"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou senha inválidos")
      } else {
        router.push("/dashboard")
      }
    } catch (_error) {
      setError("Ocorreu um erro ao fazer login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex justify-center">
          <Image
            src="https://qxi5ol0ajf.ufs.sh/f/gsRgPIz1OcKELeKx4y5qv5Yu4TW0nbXrGst2Rke7OioAcV6w"
            alt="Kiwify Logo"
            width={130}
            height={40}
            priority
          />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Entrar na sua conta</h1>
          <p className="text-sm text-muted-foreground">
            Ou{" "}
            <Link href="/register" className="text-primary hover:underline text-[#5033C3]">
              fazer cadastro
            </Link>
          </p>
        </div>

        {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Exp: kubuca@gmail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#5033C3] hover:bg-[#5033C3]/90">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}

