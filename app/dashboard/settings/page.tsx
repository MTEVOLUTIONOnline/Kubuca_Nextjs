'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { FiUser, FiPhone, FiMail, FiImage } from 'react-icons/fi'
import Image from 'next/image'

export default function Settings() {
  const { data: session, update: updateSession } = useSession()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    image: ''
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/users/me')
        const data = await response.json()
        
        setFormData({
          name: data.name || '',
          phoneNumber: data.phoneNumber || '',
          image: data.image || ''
        })
        setImagePreview(data.image || '')
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
        toast.error('Erro ao carregar dados do perfil')
      }
    }

    fetchUserProfile()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Erro no upload')

      const data = await response.json()
      setFormData(prev => ({ ...prev, image: data.fileUrl }))
      setImagePreview(data.fileUrl)
      toast.success('Imagem carregada com sucesso')
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error('Erro ao fazer upload da imagem')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Erro ao atualizar perfil')

      const data = await response.json()
      
      // Atualizar sessão com novos dados
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          image: data.image
        }
      })

      toast.success('Perfil atualizado com sucesso')
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" max-w-2xl ">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Foto do Perfil
          </label>
          <div className="flex items-center space-x-6">
            <div className="relative h-24 w-24">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Alterar foto
              </label>
            </div>
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Seu nome completo"
            />
          </div>
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="+258 84 XXX XXXX"
            />
          </div>
        </div>

        {/* Email (somente leitura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={session?.user?.email || ''}
              readOnly
              className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
} 