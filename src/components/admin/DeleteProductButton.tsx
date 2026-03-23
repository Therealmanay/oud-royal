'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  productId: string
  productName: string
}

export default function DeleteProductButton({ productId, productName }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      toast.success(`"${productName}" supprimé !`, { icon: '🗑️' })
      router.refresh()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      {/* Bouton supprimer */}
      <button
        onClick={() => setShowConfirm(true)}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-red-400 hover:border-red-400 transition-all cursor-pointer"
        title="Supprimer"
      >
        <Trash2 size={14} />
      </button>

      {/* Modal de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Supprimer ce produit ?
              </h3>
              <p className="text-gray-400 text-sm mb-1">
                Vous allez supprimer définitivement :
              </p>
              <p className="text-gold font-semibold mb-6">
                &quot;{productName}&quot;
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-lg border border-dark-border text-gray-300 hover:bg-dark-secondary transition-colors cursor-pointer text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}