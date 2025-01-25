type Course = {
  id: string
  title: string
  description: string
  imageUrl: string | null
  price: number
  instructor: {
    name: string | null
  }
}

export default function PaymentSummary({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Resumo da Compra</h2>
      
      <div className="flex gap-4 mb-6">
        {course.imageUrl && (
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${course.imageUrl}`}
            alt={course.title}
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <div>
          <h3 className="font-medium">{course.title}</h3>
          <p className="text-sm text-gray-600">
            Instrutor: {course.instructor.name}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Preço do curso</span>
          <span>{course.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</span>
        </div>
        
        <div className="flex justify-between font-semibold text-lg mt-4">
          <span>Total</span>
          <span className="text-green-600">{course.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}</span>
        </div>
      </div>
    </div>
  )
} 