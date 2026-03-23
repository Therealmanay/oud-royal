import prisma from '@/lib/prisma'
import { Settings, Phone, Mail, Truck, DollarSign, Globe } from 'lucide-react'

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst()

  if (!settings) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
          Paramètres
        </h1>
        <div className="card-dark p-12 text-center">
          <Settings size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-400">Aucun paramètre configuré.</p>
          <p className="text-gray-500 text-sm mt-2">Lancez le seed pour initialiser les paramètres.</p>
        </div>
      </div>
    )
  }

  const sections = [
    {
      title: 'Informations Générales',
      icon: Globe,
      items: [
        { label: 'Nom du site', value: settings.siteName },
        { label: 'Description', value: settings.siteDescription },
        { label: 'Devise', value: settings.currency },
      ],
    },
    {
      title: 'Contact',
      icon: Phone,
      items: [
        { label: 'Téléphone', value: settings.phone },
        { label: 'Email', value: settings.email },
        { label: 'WhatsApp', value: settings.whatsapp },
        { label: 'Instagram', value: settings.instagram || 'Non configuré' },
        { label: 'Facebook', value: settings.facebook || 'Non configuré' },
        { label: 'TikTok', value: settings.tiktok || 'Non configuré' },
      ],
    },
    {
      title: 'Livraison',
      icon: Truck,
      items: [
        { label: 'Livraison gratuite dès', value: `${settings.freeShippingThreshold} DH` },
        { label: 'Livraison standard', value: `${settings.standardShipping} DH` },
        { label: 'Livraison express', value: `${settings.expressShipping} DH` },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold gold-gradient-text">
          Paramètres
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Configuration de votre boutique
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="card-dark p-6">
            <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <section.icon className="text-gold" size={20} />
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 bg-dark-secondary rounded-lg"
                >
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className="text-sm text-white font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Adresse */}
      {settings.address && (
        <div className="card-dark p-6">
          <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Mail className="text-gold" size={20} />
            Adresse
          </h3>
          <p className="text-gray-300">{settings.address}</p>
        </div>
      )}

      <div className="card-dark p-6 border-gold/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
            <Settings className="text-gold" size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Modifier les paramètres</h3>
            <p className="text-gray-500 text-sm mt-1">
              Pour modifier ces paramètres, mettez à jour les données directement dans Supabase 
              ou contactez votre développeur. Un formulaire d&apos;édition sera disponible prochainement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}