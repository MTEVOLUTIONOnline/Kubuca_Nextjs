"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface Product {
  title: string
  description: string
  image: string
  href: string
  new?: boolean
}

export default function Add() {
  const products: Product[] = [
    {
      title: "Curso Online",
      description: "Aulas em um ambiente seguro",
      image: "https://vulcano.hotmart.com/app-product/52a76191d485c8033a2b.svg",
      href: "courses",
    },
    {
      title: "eBook",
      description: "Arquivos em .pdf",
      image: "https://vulcano.hotmart.com/app-product/32b8aec76740212c1fa9.svg",
      href: "ebook",
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">O que você vai vender?</h1>
          <p className="text-muted-foreground mb-8">Escolha o tipo de produto que melhor se adequa ao seu negócio</p>
        <div className="">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <Link key={index} href={product.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                  <CardContent className="p-6">
                    
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="font-semibold text-xl">{product.title}</h2>
                          {product.new && (
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Novo</span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{product.description}</p>
                        <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium">
                          Começar
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

