'use client'
import { useState } from 'react'
import { Course } from '@prisma/client'


type AffiliateWithDetails = {
  id: string;
  affiliateCode: string;
  userId: string;
  courseId?: string; // Opcional, pois pode ser um link de ebook
  plrId?: string; // Opcional, pois pode ser um link de curso
  type: "course" | "ebook"; // Tipo para identificar se é curso ou ebook
  course?: Course; // Dados do curso (se for um link de curso)
  plr?: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    price: number;
    affiliateCommission: number;
  }; // Dados do ebook (se for um link de ebook)
  _count: {
    purchases: number;
  };
  earnings: number; // Adicione isso se necessário
};

export default function AffiliateLinksTable({ links }: { links: AffiliateWithDetails[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (affiliateCode: string, productId: string, type: 'course' | 'ebook') => {
    const affiliateLink = `${process.env.NEXT_PUBLIC_APP_URL}/${
      type === 'course' ? 'courses' : 'ebooks'
    }/${productId}/checkout?ref=${affiliateCode}`;

    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopiedId(affiliateCode);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comissão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ganhos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* link._count.purchases */}
            {links.map((link) => {
              const product = link.type === 'course' ? link.course : link.plr;
              const potentialEarnings =
                ((product?.price || 0) * (product?.affiliateCommission || 0)) / 100;

              return (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product?.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product?.price?.toLocaleString('pt-PT', {
                          style: 'currency',
                          currency: 'MZN',
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {potentialEarnings.toLocaleString('pt-PT', {
                        style: 'currency',
                        currency: 'MZN',
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product?.affiliateCommission}% por venda
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* {link._count.purchases} vendas */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {link.earnings.toLocaleString('pt-PT', {
                        style: 'currency',
                        currency: 'MZN',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() =>
                        handleCopy(link.affiliateCode, link.type === 'course' ? link.courseId! : link.plrId!, link.type)
                      }
                      className={`inline-flex items-center px-3 py-1 rounded-md transition ${
                        copiedId === link.affiliateCode
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {copiedId === link.affiliateCode ? (
                        <>
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                          Copiado!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                          </svg>
                          Copiar Link
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// Corrigir a combinação dos links
// const affiliateLinks = [
//   ...courseAffiliates.map((link) => ({
//     ...link,
//     type: 'course' as 'course', // Garantir que seja do tipo 'course'
//   })),
//   ...ebookAffiliates.map((link) => ({
//     ...link,
//     type: 'ebook' as 'ebook', // Garantir que seja do tipo 'ebook'
//   })),
// ];
