'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, LogOut, Shield } from 'lucide-react'

export default function UserMenu() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <Button
        onClick={() => signIn()}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Shield className="w-4 h-4 mr-2" />
        Se connecter
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Card className="flex items-center gap-3 p-2 pr-4">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{session.user.name}</span>
          <span className="text-xs text-gray-500">{session.user.role}</span>
        </div>
      </Card>

      <Button
        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        variant="outline"
        size="sm"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
