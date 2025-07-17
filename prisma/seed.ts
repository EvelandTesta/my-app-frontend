// prisma/seed.ts
import { prisma } from "@/lib/prisma"

const bcrypt = require('bcrypt')
async function main() {
    const ADMIN_EMAIL = "admin@gkbjregency.org"
    const ADMIN_PASSWORD = "admin123"

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    // Upsert admin user
    await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {},
        create: {
            email: ADMIN_EMAIL,
            passwordHash: hashedPassword,
            name: "Admin User",
            role: "admin",
        },
    })

    console.log("✅ Admin user seeded")
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })