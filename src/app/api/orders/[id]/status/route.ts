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
    const { status, comment } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Statut requis' },
        { status: 400 }
      )
    }

    // Vérifier que la commande existe
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour le statut + ajouter dans l'historique
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            comment: comment || `Statut changé vers ${status}`,
          },
        },
      },
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('Update order status error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}