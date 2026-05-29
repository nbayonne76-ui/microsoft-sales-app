'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Building2, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'

export default function SignUpPage() {
  const router = useRouter()
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(lang === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError(lang === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || (lang === 'fr' ? 'Une erreur est survenue' : 'An error occurred'))
        return
      }

      router.push('/auth/signin?registered=true')
    } catch (err) {
      setError(lang === 'fr' ? 'Une erreur est survenue lors de la création du compte' : 'An error occurred while creating the account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lang === 'fr' ? 'Créer un compte' : 'Create an account'}
          </h1>
          <p className="text-gray-600">
            {lang === 'fr' ? 'Rejoignez le Microsoft Partner Hub' : 'Join the Microsoft Partner Hub'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              {lang === 'fr' ? 'Nom complet' : 'Full name'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-12"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder={lang === 'fr' ? 'votre@email.com' : 'your@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              {lang === 'fr' ? 'Mot de passe' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 h-12"
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500">
              {lang === 'fr' ? 'Minimum 6 caractères' : 'Minimum 6 characters'}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              {lang === 'fr' ? 'Confirmer le mot de passe' : 'Confirm password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10 h-12"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {loading
              ? (lang === 'fr' ? 'Création...' : 'Creating...')
              : (lang === 'fr' ? 'Créer mon compte' : 'Create my account')}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <span>{lang === 'fr' ? 'Vous avez déjà un compte ? ' : 'Already have an account? '}</span>
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              {lang === 'fr' ? 'Se connecter' : 'Sign in'}
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{lang === 'fr' ? 'Mots de passe cryptés avec bcrypt' : 'Passwords encrypted with bcrypt'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{lang === 'fr' ? 'Données sécurisées et confidentielles' : 'Secured and confidential data'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{lang === 'fr' ? 'Conforme RGPD' : 'GDPR compliant'}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
