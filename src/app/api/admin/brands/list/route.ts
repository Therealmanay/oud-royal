import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(brands)
  } catch (error) {
    return NextResponse.json([], { status: 500 })
  }
}