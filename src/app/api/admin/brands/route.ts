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

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Nom et slug requis' }, { status: 400 })
    }

    const existing = await prisma.brand.findUnique({ where: { slug: body.slug } })
    if (existing) {
      return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 })
    }

    const brand = await prisma.brand.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        country: body.country || 'Émirats Arabes Unis',
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, brand })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}