

import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json()

        // Verifica se o email já está em uso
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "Email já está em uso" },
                { status: 400 }
            )
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10)

        // Cria o novo usuário
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        return NextResponse.json(
            { message: "Usuário criado com sucesso", userId: user.id },
            { status: 201 }
        )
    } catch (error) {
        console.error("Erro ao registrar usuário:", error)
        return NextResponse.json(
            { message: "Erro ao criar usuário" },
            { status: 500 }
        )
    }
} 