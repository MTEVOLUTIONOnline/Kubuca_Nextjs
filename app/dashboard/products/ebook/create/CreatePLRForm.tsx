'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, FileImage } from 'lucide-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

interface Course {
  id: string
  title: string
}

interface CreatePLRFormProps {
  courses: Course[]
}

export default function CreatePLRForm({ courses }: CreatePLRFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [price, setPrice] = useState(0)
  const [affiliateCommission, setAffiliateCommission] = useState(0)

  if (!session?.user) {
    router.push('/login')
    return null
  }

  
  const userId = (session.user as any).id  // type assertion temporário

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return


    setUploading(true)
    const files = Array.from(e.target.files)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
          method: 'POST',
          body: formData
        })

        if (!res.ok) {
          console.error('Erro na resposta:', await res.text())
          throw new Error(`Erro ao fazer upload: ${res.statusText}`)
        }

        const data = await res.json()
        console.log('Resposta do servidor:', data)

        if (!data.fileUrl) {
          throw new Error('URL do arquivo não retornada pelo servidor')
        }

        setUploadedFiles(prev => [...prev, data.fileUrl])
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload dos arquivos. Verifique o console para mais detalhes.')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    setUploadingThumbnail(true)
    const file = e.target.files[0]

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error(`Erro ao fazer upload: ${res.statusText}`)
      }

      const data = await res.json()
      setThumbnailUrl(data.fileUrl)
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da thumbnail')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/plr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: formData.get('title'),
          description: formData.get('description'),
          price: parseFloat(formData.get('price') as string),
          terms: formData.get('terms'),
          ebookUrls: uploadedFiles,
          thumbnailUrl: thumbnailUrl,
          affiliateCommission: parseFloat(formData.get('affiliateCommission') as string) || 0,
        })
      })

      if (!res.ok) {
        throw new Error('Erro ao criar PLR')
      }

      router.push('/dashboard/products/ebook')
    } catch (error) {
      console.error('Erro ao criar PLR:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setPrice(value)
  }

  const handleAffiliateCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setAffiliateCommission(value)
  }

  const affiliateEarnings = ((price * affiliateCommission) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título do Pacote PLR
        </label>
        <input
          type="text"
          name="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preço
        </label>
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
          onChange={handlePriceChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Termos e Condições
        </label>
        <textarea
          name="terms"
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comissão de Afiliado (%)
        </label>
        <input
          type="number"
          name="affiliateCommission"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
          min="0"
          step="0.01"
          onChange={handleAffiliateCommissionChange}
        />
      </div>

      {/* Exemplo de Ganhos */}
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800">Exemplo de Ganhos</h3>
        <p className="mt-2 text-sm text-blue-700">
          Para um preço de {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}, 
          os afiliados receberão {affiliateEarnings} por venda.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload de Ebooks (PDF)
        </label>
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="ebook-upload"
        />
        <label
          htmlFor="ebook-upload"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          <Upload className="w-5 h-5 mr-2" />
          Selecionar Arquivos
        </label>

        {uploading && (
          <p className="mt-2 text-sm text-gray-500">
            Fazendo upload...
          </p>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600">
                  {decodeURIComponent(file.split('/').pop() || '')}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail do Ebook
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
            id="thumbnail-upload"
          />
          <label
            htmlFor="thumbnail-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <FileImage className="w-5 h-5 mr-2" />
            {thumbnailUrl ? 'Trocar Imagem' : 'Selecionar Imagem'}
          </label>
          {uploadingThumbnail && (
            <span className="text-sm text-gray-500">Fazendo upload...</span>
          )}
        </div>

        {thumbnailUrl && (
          <div className="mt-4 relative w-48">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${thumbnailUrl}`}
              alt="Thumbnail"
              width={200}
              height={200}
              className="rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={() => setThumbnailUrl('')}
              className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || uploading || uploadedFiles.length === 0}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {loading ? 'Criando...' : 'Criar PLR'}
      </button>
    </form>
  )
}