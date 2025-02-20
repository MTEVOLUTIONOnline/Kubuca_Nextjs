'use client'

import { useState, useEffect } from 'react'
import { FiAlertCircle, FiX } from 'react-icons/fi'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function HeaderAlert() {
  const { data: session } = useSession()
  const [showAlert, setShowAlert] = useState(false)
  const [userPhone, setUserPhone] = useState(null)

  useEffect(() => {
    const checkUserPhone = async () => {
      try {
        const response = await fetch('/api/users/me')
        const data = await response.json()
        setUserPhone(data.phoneNumber)
        setShowAlert(!data.phoneNumber) // Mostra alerta se não tiver telefone
      } catch (error) {
        console.error('Erro ao verificar telefone:', error)
      }
    }

    if (session?.user) {
      checkUserPhone()
    }
  }, [session])

  if (!showAlert) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Para receber notificações de pagamentos e transferências, adicione seu número de WhatsApp.{' '}
              <Link 
                href="/dashboard/settings" 
                className="font-medium underline text-yellow-700 hover:text-yellow-600"
              >
                Adicionar agora
              </Link>
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAlert(false)}
          className="ml-4 flex-shrink-0"
        >
          <FiX className="h-5 w-5 text-yellow-400 hover:text-yellow-500" />
        </button>
      </div>
    </div>
  )
}
