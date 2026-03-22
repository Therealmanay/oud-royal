import prisma from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
          Ajouter un Produit
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Créer un nouveau parfum dans la boutique
        </p>
      </div>
      <ProductForm brands={brands} />
    </div>
  );
}