// app/api/quote/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET daily quote
export async function GET() {
  try {
    // Ambil satu quote yang aktif secara acak
    const quotes = await prisma.quote.findMany({
      where: {
        isActive: true,
      },
      select: {
        quoteText: true,
        author: true,
        scriptureReference: true,
      },
      take: 1,
      orderBy: {
        id: "asc", // Prisma tidak punya RANDOM() di semua provider, gunakan workaround
      },
    })

    if (quotes.length === 0) {
      return NextResponse.json({
        quote_text:
          "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        author: "Bible",
        scripture_reference: "Jeremiah 29:11",
      })
    }

    const [quote] = quotes

    return NextResponse.json({
      quote_text: quote.quoteText,
      author: quote.author,
      scripture_reference: quote.scriptureReference || "Unknown",
    })
  } catch (error) {
    console.error("Error fetching quote:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}