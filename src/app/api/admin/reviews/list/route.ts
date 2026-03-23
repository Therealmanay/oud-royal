import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: {
          select: { id: true, name: true, brand: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}