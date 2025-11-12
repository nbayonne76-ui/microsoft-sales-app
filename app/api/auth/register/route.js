import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validation
    if (!email || !password) {
      return Response.json(
        { error: "Email et mot de passe sont requis" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return Response.json(
        { error: "Un compte avec cet email existe déjà" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: "user" // Default role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return Response.json(
      {
        message: "Compte créé avec succès",
        user
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    return Response.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
