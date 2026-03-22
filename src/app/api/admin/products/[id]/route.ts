import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        oldPrice: body.oldPrice,
        volume: body.volume,
        type: body.type,
        category: body.category,
        brandId: body.brandId,
        image: body.image,
        notesTop: body.notesTop || [],
        notesMiddle: body.notesMiddle || [],
        notesBase: body.notesBase || [],
        stock: body.stock,
        isFeatured: body.isFeatured,
        isNew: body.isNew,
        isBestSeller: body.isBestSeller,
        isActive: body.isActive,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await prisma.product.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}