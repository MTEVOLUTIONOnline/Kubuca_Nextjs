'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function CourseForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [enableAffiliates, setEnableAffiliates] = useState(true)
  const [affiliateCommission, setAffiliateCommission] = useState('30')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)

    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Imagem muito grande. Máximo: 5MB')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem')
      }

      const data = await response.json()
      return data.fileUrl
    } catch (error) {
      console.error('Erro no upload:', error)
      throw new Error('Erro ao fazer upload da imagem')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      // Validar imagem
      const file = image
      if (!file) {
        toast.error('Por favor, selecione uma imagem')
        return
      }

      // Upload da imagem primeiro
      const imageUrl = await handleImageUpload(file)

      // Criar o curso com a URL da imagem
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price: parseFloat(price),
          affiliateCommission: enableAffiliates ? Number(affiliateCommission) : 0
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar curso')
      }

      toast.success('Curso criado com sucesso!')
      router.push('/dashboard/products/courses')
      router.refresh()
    } catch (error) {
      console.error('Erro ao criar curso:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar curso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título do Curso*
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição*
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Preço do Curso (MZN)*
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">MZN</span>
          </div>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="image" className="block mb-2">Imagem do Curso</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
        {imagePreview && (
          <div className="mt-2">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-[200px] h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Seção Programa de Afiliados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Programa de Afiliados
            </h3>
            <p className="text-sm text-gray-500">
              Permita que outros usuários promovam seu curso e ganhem comissão
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableAffiliates}
              onChange={(e) => {
                setEnableAffiliates(e.target.checked)
                if (!e.target.checked) {
                  setAffiliateCommission('0')
                } else {
                  setAffiliateCommission('30')
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {enableAffiliates && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Comissão por Venda (%)*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  value={affiliateCommission}
                  onChange={(e) => {
                    const value = e.target.value
                    if (Number(value) >= 0 && Number(value) <= 100) {
                      setAffiliateCommission(value)
                    }
                  }}
                  className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="30"
                  min="1"
                  max="100"
                  required={enableAffiliates}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Exemplo de Ganhos
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Para um curso de {Number(price).toLocaleString('pt-PT', { 
                        style: 'currency', 
                        currency: 'MZN' 
                      })},
                      os afiliados receberão {((Number(price) * Number(affiliateCommission)) / 100).toLocaleString('pt-PT', { 
                        style: 'currency', 
                        currency: 'MZN' 
                      })} por venda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Curso'}
        </button>
      </div>
    </form>
  )
} 