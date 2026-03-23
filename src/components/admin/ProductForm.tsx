'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft, Upload, X, Star, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Props {
  product?: any;
  brands: any[];
}

export default function ProductForm({ product, brands }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const [productImages, setProductImages] = useState<string[]>(() => {
    const imgs: string[] = [];
    if (product?.image) imgs.push(product.image);
    if (product?.images?.length) {
      product.images.forEach((img: string) => {
        if (img && !imgs.includes(img)) imgs.push(img);
      });
    }
    return imgs;
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

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} n'est pas une image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 5 MB)`);
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;
    if (productImages.length + validFiles.length > 8) {
      toast.error('Maximum 8 images par produit');
      return;
    }
    setUploading(true);
    try {
      const uploadData = new FormData();
      validFiles.forEach((file) => uploadData.append('files', file));
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erreur upload');
      }
      const data = await response.json();
      setProductImages((prev) => [...prev, ...data.urls]);
      toast.success(`${data.urls.length} image(s) uploadée(s) !`, { icon: '📸' });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    toast.success('Image retirée');
  };

  const setAsMain = (index: number) => {
    setProductImages((prev) => {
      const newImages = [...prev];
      const [moved] = newImages.splice(index, 1);
      newImages.unshift(moved);
      return newImages;
    });
    toast.success('Image principale mise à jour', { icon: '⭐' });
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
        image: productImages[0] || '',
        images: productImages.slice(1),
        notesTop: formData.notesTop.split(',').map((n: string) => n.trim()).filter(Boolean),
        notesMiddle: formData.notesMiddle.split(',').map((n: string) => n.trim()).filter(Boolean),
        notesBase: formData.notesBase.split(',').map((n: string) => n.trim()).filter(Boolean),
      };
      const url = isEditing ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      toast.success(isEditing ? 'Produit mis à jour !' : 'Produit créé !', { icon: '✅' });
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
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations Générales */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              Informations Générales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Nom du produit *</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Raghba" className="input-dark" required />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Slug (URL) *</label>
                <input name="slug" value={formData.slug} onChange={handleChange} placeholder="Ex: lattafa-raghba" className="input-dark" required />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input-dark resize-none" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Marque *</label>
                <select name="brandId" value={formData.brandId} onChange={handleChange} className="select-dark" required>
                  <option value="">Sélectionner</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Catégorie</label>
                <select name="category" value={formData.category} onChange={handleChange} className="select-dark">
                  <option value="UNISEX">Unisex</option>
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="select-dark">
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
            <h3 className="font-heading text-lg font-semibold text-white">Prix et Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Prix (DH) *</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} className="input-dark" required min={0} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Ancien prix (DH)</label>
                <input name="oldPrice" type="number" value={formData.oldPrice} onChange={handleChange} className="input-dark" min={0} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Stock *</label>
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="input-dark" required min={0} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Volume</label>
                <input name="volume" value={formData.volume} onChange={handleChange} placeholder="100ml" className="input-dark" />
              </div>
            </div>
          </div>

          {/* Notes Olfactives */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">Notes Olfactives</h3>
            <p className="text-xs text-gray-500">Séparez les notes par des virgules</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">🌸 Notes de tête</label>
                <input name="notesTop" value={formData.notesTop} onChange={handleChange} placeholder="Bergamote, Citron, Poivre" className="input-dark" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">💐 Notes de cœur</label>
                <input name="notesMiddle" value={formData.notesMiddle} onChange={handleChange} placeholder="Rose, Jasmin, Iris" className="input-dark" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">🪵 Notes de fond</label>
                <input name="notesBase" value={formData.notesBase} onChange={handleChange} placeholder="Oud, Ambre, Musc" className="input-dark" />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">🔍 SEO</h3>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Meta Title</label>
              <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="Raghba Lattafa - Parfum Oriental" className="input-dark" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} placeholder="Description pour Google (max 160 caractères)" className="input-dark resize-none" />
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (Sidebar) */}
        <div className="space-y-6">
          {/* IMAGES - DRAG & DROP */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              📸 Images ({productImages.length}/8)
            </h3>

            {/* Zone Drag & Drop */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-gold bg-gold/10'
                  : 'border-dark-border hover:border-gold/50 hover:bg-dark-secondary/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />

              {uploading ? (
                <div className="py-4">
                  <Loader2 size={32} className="animate-spin text-gold mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Upload en cours...</p>
                </div>
              ) : (
                <div className="py-4">
                  <ImagePlus size={32} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 font-medium">
                    Glissez vos images ici
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    JPG, PNG, WebP • Max 5 MB • Max 8 images
                  </p>
                </div>
              )}
            </div>

            {/* Grille des images uploadées */}
            {productImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                      index === 0 ? 'border-gold' : 'border-dark-border'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge principale */}
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ⭐ Principale
                      </div>
                    )}

                    {/* Actions au survol */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsMain(index)}
                          className="w-8 h-8 bg-gold rounded-full flex items-center justify-center hover:bg-gold/80 transition-colors"
                          title="Définir comme principale"
                        >
                          <Star size={14} className="text-black" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {productImages.length === 0 && (
              <p className="text-xs text-gray-500 text-center">
                Aucune image ajoutée. La première image sera l&apos;image principale.
              </p>
            )}
          </div>

          {/* Flags / Options */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-white">Options</h3>
            {[
              { name: 'isActive', label: 'Produit actif' },
              { name: 'isFeatured', label: 'Produit vedette (Accueil)' },
              { name: 'isBestSeller', label: 'Best Seller' },
              { name: 'isNew', label: 'Nouveau produit' },
            ].map((flag) => (
              <label key={flag.name} className="flex items-center gap-3 cursor-pointer">
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

          {/* Bouton Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 font-bold disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                Sauvegarde...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save size={18} />
                {isEditing ? 'Mettre à jour' : 'Créer le produit'}
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}