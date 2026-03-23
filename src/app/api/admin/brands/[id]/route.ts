import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

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

    // Vérifier si la marque a des produits
    const productCount = await prisma.product.count({ where: { brandId: id } })
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer : ${productCount} produit(s) lié(s) à cette marque` },
        { status: 400 }
      )
    }

    await prisma.brand.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
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

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        country: body.country,
        isActive: body.isActive,
      },
    })

    return NextResponse.json({ success: true, brand })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}