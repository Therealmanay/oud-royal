import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      notes,
      items,
      subtotal,
      shippingCost,
      total,
    } = body

    if (!firstName || !lastName || !phone || !address || !city || !items?.length) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    const orderNumber = generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        firstName,
        lastName,
        phone,
        email: email || null,
        address,
        city,
        notes: notes || null,
        subtotal,
        shippingCost,
        total,
        status: 'PENDING',
        paymentMethod: 'COD',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            comment: 'Commande reçue',
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Erreur création commande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}