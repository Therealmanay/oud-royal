import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Avis produits
    const productReviews = await prisma.review.findMany({
      include: {
        product: {
          select: { id: true, name: true, brand: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Avis généraux
    const siteReviews = await prisma.siteReview.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      productReviews,
      siteReviews,
    })
  } catch (error) {
    console.error('GET /api/admin/reviews/list error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}