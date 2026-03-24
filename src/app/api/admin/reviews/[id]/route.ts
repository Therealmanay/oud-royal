import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { isApproved, type } = body

    if (type === 'site') {
      // Avis général
      const review = await prisma.siteReview.update({
        where: { id },
        data: { isApproved },
      })
      return NextResponse.json({ success: true, review })
    } else {
      // Avis produit
      const review = await prisma.review.update({
        where: { id },
        data: { isApproved },
      })

      // Recalculer le rating du produit
      const stats = await prisma.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true },
        _count: true,
      })

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count,
        },
      })

      return NextResponse.json({ success: true, review })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('PATCH /api/admin/reviews/[id] error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const url = new URL(request.url)
    const type = url.searchParams.get('type')

    if (type === 'site') {
      // Supprimer avis général
      await prisma.siteReview.delete({ where: { id } })
      return NextResponse.json({ success: true })
    } else {
      // Supprimer avis produit
      const review = await prisma.review.delete({ where: { id } })

      // Recalculer le rating
      const stats = await prisma.review.aggregate({
        where: { productId: review.productId, isApproved: true },
        _avg: { rating: true },
        _count: true,
      })

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: stats._avg.rating || 0,
          reviewCount: stats._count,
        },
      })

      return NextResponse.json({ success: true })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('DELETE /api/admin/reviews/[id] error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}