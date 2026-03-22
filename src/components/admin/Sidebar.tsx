'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  BarChart3,
  Tag,
  Star,
} from 'lucide-react';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
  { href: '/admin/products', icon: Package, label: 'Produits' },
  { href: '/admin/customers', icon: Users, label: 'Clients' },
  { href: '/admin/brands', icon: Tag, label: 'Marques' },
  { href: '/admin/reviews', icon: Star, label: 'Avis' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Statistiques' },
  { href: '/admin/settings', icon: Settings, label: 'Paramètres' },
];

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-dark-secondary border-b border-dark-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border text-gray-400"
          >
            <Menu size={20} />
          </button>
          <span className="font-heading text-lg font-bold text-gold">
            🪔 Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{user?.name}</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-dark-secondary border-r border-dark-border z-50 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl">🪔</span>
              <span className="font-heading text-lg font-bold text-gold">
                Oud Royal
              </span>
            </Link>
          )}
          {collapsed && (
            <span className="text-xl mx-auto">🪔</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-dark-card text-gray-500 hover:text-white transition-all"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto mt-2">
          {menuItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gold/15 text-gold border border-gold/20'
                    : 'text-gray-400 hover:text-white hover:bg-dark-card'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="p-3 border-t border-dark-border">
          {/* Visit Site */}
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-dark-card transition-all mb-2 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <span className="text-base">🌐</span>
            {!collapsed && <span>Voir le site</span>}
          </Link>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}