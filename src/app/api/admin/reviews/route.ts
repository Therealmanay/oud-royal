import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.name || !body.rating || !body.comment) {
      return NextResponse.json({ error: 'Nom, note et commentaire sont requis' }, { status: 400 })
    }

    // Si productId fourni → avis produit, sinon → avis général
    if (body.productId) {
      const review = await prisma.review.create({
        data: {
          name: body.name,
          email: body.email || null,
          rating: Number(body.rating),
          comment: body.comment,
          productId: body.productId,
          isApproved: body.isApproved ?? true,
        },
      })

      // Mettre à jour le rating moyen du produit
      const stats = await prisma.review.aggregate({
        where: { productId: body.productId, isApproved: true },
        _avg: { rating: true },
        _count: true,
      })

      await prisma.product.update({
        where: { id: body.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count,
        },
      })

      return NextResponse.json({ success: true, review })
    } else {
      // Avis général
      const review = await prisma.siteReview.create({
        data: {
          name: body.name,
          email: body.email || null,
          rating: Number(body.rating),
          comment: body.comment,
          isApproved: body.isApproved ?? true,
        },
      })

      return NextResponse.json({ success: true, review })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('POST /api/admin/reviews error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}