
import { prisma } from "./prisma"

const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
    id: number
    email: string
    name: string
    role: string
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
        },
    })

    if (!user) {
        return null
    }

    const isValid = await verifyPassword(password, user.passwordHash)

    if (!isValid) {
        return null
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    }
    } catch (error) {
        console.error("Authentication error:", error)
        return null
    }
}

export function generateToken(user: User): string {
    return jwt.sign(
        {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
    )
}

export function signToken(payload: { id: number; email: string; role: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" })
}

export function verifyToken(token: string): User | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as User
        return decoded
    } catch (error) {
        return null
    }
}


