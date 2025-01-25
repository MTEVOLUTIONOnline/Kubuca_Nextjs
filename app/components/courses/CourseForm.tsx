'use client'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

type FormData = {
  title: string
  description: string
  price: number
  affiliateCommission: number
  enableAffiliates: boolean
  shortDescription: string
  requirements: string
  targetAudience: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  imageFile: FileList
}

export default function CourseForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [enableAffiliates, setEnableAffiliates] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      affiliateCommission: 30,
      enableAffiliates: true,
      level: 'BEGINNER'
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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

  const handleImageUpload = async (file: File): Promise<string> => {
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

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (!data.imageFile?.[0]) {
        toast.error('Por favor, selecione uma imagem')
        return
      }

      // Upload da imagem primeiro
      const imageUrl = await handleImageUpload(data.imageFile[0])

      // Criar o curso com a URL da imagem
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          shortDescription: data.shortDescription,
          price: Number(data.price),
          level: data.level,
          requirements: data.requirements,
          targetAudience: data.targetAudience,
          imageUrl, // URL retornada pelo upload
          affiliateCommission: enableAffiliates ? Number(data.affiliateCommission) : 0
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao criar curso')
      }

      const course = await response.json()
      toast.success('Curso criado com sucesso!')
      router.push(`/dashboard/courses/${course.id}/modules`)
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar curso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
      {/* Seção Informações Básicas */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h2>
        
        <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
              Título do Curso*
        </label>
        <input
          type="text"
              {...register('title', { 
                required: 'Título é obrigatório',
                minLength: { value: 5, message: 'Mínimo de 5 caracteres' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
              Descrição Curta*
        </label>
            <input
              type="text"
              {...register('shortDescription', { 
                required: 'Descrição curta é obrigatória',
                maxLength: { value: 150, message: 'Máximo de 150 caracteres' }
              })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Uma breve descrição que aparecerá nos cards do curso"
        />
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
              Descrição Completa*
            </label>
            <textarea
              {...register('description', { 
                required: 'Descrição é obrigatória',
                minLength: { value: 100, message: 'Mínimo de 100 caracteres' }
              })}
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Descreva detalhadamente o que os alunos aprenderão"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Seção Detalhes do Curso */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Detalhes do Curso</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nível do Curso*
            </label>
            <select
              {...register('level', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="BEGINNER">Iniciante</option>
              <option value="INTERMEDIATE">Intermediário</option>
              <option value="ADVANCED">Avançado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pré-requisitos
            </label>
            <textarea
              {...register('requirements')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Ex: Conhecimento básico em programação, Computador com Windows/Mac"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Público-alvo*
            </label>
            <textarea
              {...register('targetAudience', { required: 'Público-alvo é obrigatório' })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Para quem é este curso?"
            />
            {errors.targetAudience && (
              <p className="mt-1 text-sm text-red-600">{errors.targetAudience.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Seção Preço e Afiliação */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Preço e Afiliação</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preço (R$)*
        </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
        <input
          type="number"
          step="0.01"
                {...register('price', { 
                  required: 'Preço é obrigatório',
                  min: { value: 0, message: 'Preço não pode ser negativo' }
                })}
                className="mt-1 block w-full pl-12 rounded-md border-gray-300 shadow-sm"
              />
            </div>
        {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

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
                  setValue('affiliateCommission', 0)
                } else {
                  setValue('affiliateCommission', 30)
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
                  {...register('affiliateCommission', { 
                    required: enableAffiliates,
                        min: { value: 1, message: 'Mínimo de 1%' },
                        max: { value: 100, message: 'Máximo de 100%' }
                  })}
                      className="block w-full rounded-md border-gray-300 pl-3 pr-12"
                  placeholder="30"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
              {errors.affiliateCommission && (
                <p className="mt-1 text-sm text-red-600">
                      {errors.affiliateCommission.message}
                </p>
              )}
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
                      Para um curso de {watch('price', 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })},
                      os afiliados receberão {((watch('price', 0) * watch('affiliateCommission', 30)) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por venda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        </div>
      </div>

      {/* Seção Imagem */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Imagem do Curso</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagem de Capa*
          </label>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                {...register('imageFile', { 
                  required: 'Por favor, selecione uma imagem de capa',
                  validate: {
                    fileSize: (files) => {
                      if (!files?.[0]) return true
                      return files[0].size <= 5 * 1024 * 1024 || 'Imagem muito grande. Máximo: 5MB'
                    },
                    fileType: (files) => {
                      if (!files?.[0]) return true
                      return files[0].type.startsWith('image/') || 'Por favor, selecione uma imagem válida'
                    }
                  }
                })}
                onChange={(e) => {
                  handleImageChange(e)
                  // Trigger validação manual após mudança
                  register('imageFile').onChange(e)
                }}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG ou JPEG (máx. 5MB)
              </p>
              {errors.imageFile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.imageFile.message}
                </p>
              )}
            </div>
            
            {imagePreview && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
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


// Imagem de capa é obrigatória