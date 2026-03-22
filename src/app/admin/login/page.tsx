'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.success('Connexion réussie !');
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-5xl block mb-4">🪔</span>
          <h1 className="font-heading text-3xl font-bold text-gold tracking-wider">
            OUD ROYAL
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Panneau d&apos;Administration
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card-dark p-8 space-y-6"
        >
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              <Mail size={14} className="inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@oudroyal.ma"
              className="input-dark"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              <Lock size={14} className="inline mr-1" />
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-dark pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 font-bold disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <Lock size={18} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Accès réservé aux administrateurs
        </p>
      </div>
    </div>
  );
}