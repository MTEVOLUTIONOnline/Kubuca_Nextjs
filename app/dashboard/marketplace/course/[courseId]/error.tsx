'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Algo deu errado!</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => reset()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
} 