import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier envoyé' }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      // Valider le type
      if (!file.type.startsWith('image/')) {
        continue
      }

      // Valider la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        continue
      }

      // Générer un nom unique
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
      const filePath = `products/${fileName}`

      // Convertir en Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        console.error('Supabase upload error:', error)
        continue
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl)
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'Aucune image uploadée. Vérifiez le format et la taille.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}