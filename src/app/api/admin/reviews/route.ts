import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET — Récupérer les avis approuvés (public)
export async function GET() {
  try {
    const reviews = await prisma.siteReview.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    })

    return NextResponse.json(reviews)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST — Soumettre un nouvel avis (en attente d'approbation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'La note doit être entre 1 et 5' }, { status: 400 })
    }
    if (!body.comment?.trim()) {
      return NextResponse.json({ error: 'Le commentaire est requis' }, { status: 400 })
    }
    if (body.comment.trim().length < 10) {
      return NextResponse.json({ error: 'Le commentaire doit faire au moins 10 caractères' }, { status: 400 })
    }

    // Validation email si fourni
    if (body.email && body.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email.trim())) {
        return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
      }
    }

    const review = await prisma.siteReview.create({
      data: {
        name: body.name.trim(),
        email: body.email?.trim() || null,
        rating: Number(body.rating),
        comment: body.comment.trim(),
        isApproved: false,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}