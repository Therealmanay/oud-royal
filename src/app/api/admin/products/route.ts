import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════
// GET - Liste des produits
// ═══════════════════════════════════
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { brand: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════
// POST - Créer un nouveau produit
// ═══════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()

    // Vérifier que le slug est unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug: body.slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ce slug existe déjà. Choisissez un autre.' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: Number(body.price),
        oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
        volume: body.volume || '100ml',
        type: body.type || 'EAU_DE_PARFUM',
        category: body.category || 'UNISEX',
        brandId: body.brandId,
        image: body.image || '',
        images: body.images || [],
        notesTop: body.notesTop || [],
        notesMiddle: body.notesMiddle || [],
        notesBase: body.notesBase || [],
        stock: Number(body.stock) || 0,
        isFeatured: body.isFeatured || false,
        isNew: body.isNew || false,
        isBestSeller: body.isBestSeller || false,
        isActive: body.isActive ?? true,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}