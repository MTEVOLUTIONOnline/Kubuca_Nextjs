'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FiEdit2, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: '',
    phoneNumber: '',
    image: ''
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me')
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        toast.error('Erro ao carregar informações do perfil')
      }
    }

    fetchUserData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-t-2xl">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20">
            {userData.image ? (
              <Image
                src={userData.image}
                alt="Perfil"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center">
                <FiUser size={40} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Olá, {userData.name || 'Usuário'}!</h1>
            <p className="text-blue-100">
              Gerencie tudo que importa em um só lugar: informações pessoais,
              configurações, privacidade e segurança. Mais controle e tranquilidade para você.
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-b-2xl shadow-sm">
        {/* Informações Pessoais */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                IT
              </div>
              <h2 className="text-xl font-semibold">Informações pessoais</h2>
            </div>
            <Link 
              href="/dashboard/settings" 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiEdit2 className="mr-1" /> Editar
            </Link>
          </div>

          <div className="grid gap-6">
            <div>
              <label className="text-sm text-gray-500">Nome social (público)</label>
              <p className="text-gray-900">{userData.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">E-mail</label>
              <p className="text-gray-900">{userData.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Usuário</label>
              <p className="text-gray-900">@{userData.username || 'usuário'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">WhatsApp</label>
              <p className="text-gray-900">{userData.phoneNumber || 'Não informado'}</p>
            </div>
          </div>
        </div>

        {/* Perfil Público */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                IM
              </div>
              <h2 className="text-xl font-semibold">Perfil público</h2>
            </div>
            <Link 
              href="/dashboard/settings" 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiEdit2 className="mr-1" /> Editar
            </Link>
          </div>

          <p className="text-gray-600">
            Como você quer se apresentar na página dos seus produtos.
          </p>
        </div>
      </div>
    </div>
  )
} 