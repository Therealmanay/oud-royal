'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Props {
  product?: any;
  brands: any[];
}

export default function ProductForm({ product, brands }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    oldPrice: product?.oldPrice || 0,
    volume: product?.volume || '100ml',
    type: product?.type || 'EAU_DE_PARFUM',
    category: product?.category || 'UNISEX',
    brandId: product?.brandId || '',
    image: product?.image || '',
    stock: product?.stock || 0,
    notesTop: product?.notesTop?.join(', ') || '',
    notesMiddle: product?.notesMiddle?.join(', ') || '',
    notesBase: product?.notesBase?.join(', ') || '',
    isFeatured: product?.isFeatured || false,
    isNew: product?.isNew || false,
    isBestSeller: product?.isBestSeller || false,
    isActive: product?.isActive ?? true,
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice) || null,
        stock: Number(formData.stock),
        notesTop: formData.notesTop
          .split(',')
          .map((n: string) => n.trim())
          .filter(Boolean),
        notesMiddle: formData.notesMiddle
          .split(',')
          .map((n: string) => n.trim())
          .filter(Boolean),
        notesBase: formData.notesBase
          .split(',')
          .map((n: string) => n.trim())
          .filter(Boolean),
      };

      const url = isEditing
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      toast.success(
        isEditing ? 'Produit mis à jour !' : 'Produit créé !',
        { icon: '✅' }
      );
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      toast.error('Erreur, veuillez réessayer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors"
      >
        <ArrowLeft size={16} />
        Retour aux produits
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              Informations Générales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Nom du produit *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Raghba"
                  className="input-dark"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Slug (URL) *
                </label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="Ex: lattafa-raghba"
                  className="input-dark"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-dark resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Marque *
                </label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  className="select-dark"
                  required
                >
                  <option value="">Sélectionner</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select-dark"
                >
                  <option value="UNISEX">Unisex</option>
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="select-dark"
                >
                  <option value="EAU_DE_PARFUM">Eau de Parfum</option>
                  <option value="EXTRAIT_DE_PARFUM">Extrait de Parfum</option>
                  <option value="EAU_DE_TOILETTE">Eau de Toilette</option>
                  <option value="PARFUM">Parfum</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prix et Stock */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              Prix et Stock
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Prix (DH) *
                </label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-dark"
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Ancien prix (DH)
                </label>
                <input
                  name="oldPrice"
                  type="number"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  className="input-dark"
                  min={0}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Stock *
                </label>
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input-dark"
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  Volume
                </label>
                <input
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  placeholder="100ml"
                  className="input-dark"
                />
              </div>
            </div>
          </div>

          {/* Notes Olfactives */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              Notes Olfactives
            </h3>
            <p className="text-xs text-gray-500">
              Séparez les notes par des virgules
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  🌸 Notes de tête
                </label>
                <input
                  name="notesTop"
                  value={formData.notesTop}
                  onChange={handleChange}
                  placeholder="Bergamote, Citron, Poivre"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  💐 Notes de cœur
                </label>
                <input
                  name="notesMiddle"
                  value={formData.notesMiddle}
                  onChange={handleChange}
                  placeholder="Rose, Jasmin, Iris"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">
                  🪵 Notes de fond
                </label>
                <input
                  name="notesBase"
                  value={formData.notesBase}
                  onChange={handleChange}
                  placeholder="Oud, Ambre, Musc"
                  className="input-dark"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              🔍 SEO
            </h3>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">
                Meta Title
              </label>
              <input
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="Raghba Lattafa - Parfum Oriental | Oud Royal"
                className="input-dark"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={2}
                placeholder="Description pour Google (max 160 caractères)"
                className="input-dark resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              Image
            </h3>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">
                URL de l&apos;image
              </label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/images/products/nom.jpg"
                className="input-dark"
              />
            </div>
            {formData.image && (
              <div className="aspect-square bg-dark-secondary rounded-lg flex items-center justify-center overflow-hidden">
                {formData.image.startsWith('/') || formData.image.startsWith('http') ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="object-contain max-h-full p-4"
                  />
                ) : (
                  <span className="text-6xl">🧴</span>
                )}
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              Options
            </h3>

            {[
              { name: 'isActive', label: 'Produit actif' },
              { name: 'isFeatured', label: 'Produit vedette (Accueil)' },
              { name: 'isBestSeller', label: 'Best Seller' },
              { name: 'isNew', label: 'Nouveau produit' },
            ].map((flag) => (
              <label
                key={flag.name}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={flag.name}
                  checked={(formData as any)[flag.name]}
                  onChange={handleCheckbox}
                  className="w-5 h-5 rounded border-dark-border bg-dark-secondary text-gold focus:ring-gold focus:ring-offset-0 cursor-pointer accent-gold"
                />
                <span className="text-sm text-gray-300">{flag.label}</span>
              </label>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 font-bold disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditing ? 'Mettre à jour' : 'Créer le produit'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}