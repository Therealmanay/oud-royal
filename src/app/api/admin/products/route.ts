import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

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

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: Number(body.price),
        oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
        volume: body.volume,
        type: body.type,
        category: body.category,
        brandId: body.brandId,
        image: body.image,
        images: body.images || [],
        notesTop: body.notesTop || [],
        notesMiddle: body.notesMiddle || [],
        notesBase: body.notesBase || [],
        stock: Number(body.stock),
        isFeatured: body.isFeatured,
        isNew: body.isNew,
        isBestSeller: body.isBestSeller,
        isActive: body.isActive,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
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

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}