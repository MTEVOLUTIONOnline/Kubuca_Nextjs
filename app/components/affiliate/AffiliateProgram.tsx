'use client'
import { useState } from 'react'
import { Course, AffiliateProgram as AffiliateProgramType } from '@prisma/client'

type Props = {
  course: Course & {
    affiliateProgram: AffiliateProgramType & {
      affiliates: Array<{
        user: {
          name: string
          email: string
        }
        totalSales: number
        totalCommission: number
      }>
    }
  }
}

export default function AffiliateProgram({ course }: Props) {
  const [commission, setCommission] = useState(course.affiliateProgram?.commission || 30)
  const [isEnabled, setIsEnabled] = useState(!!course.affiliateProgram)

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/courses/${course.id}/affiliate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commission,
          enabled: isEnabled,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar programa de afiliados')
      }

      // Atualizar UI ou mostrar mensagem de sucesso
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar configurações')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Configurações do Programa</h2>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Habilitar programa de afiliados</span>
            </label>
          </div>

          {isEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Comissão (%)
              </label>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
                max="100"
              />
            </div>
          )}

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Salvar Configurações
          </button>
        </div>
      </div>

      {course.affiliateProgram && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Afiliados</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Afiliado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vendas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Comissão Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {course.affiliateProgram.affiliates.map((affiliate) => (
                  <tr key={affiliate.user.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {affiliate.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {affiliate.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {affiliate.totalSales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {affiliate.totalCommission.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
} 