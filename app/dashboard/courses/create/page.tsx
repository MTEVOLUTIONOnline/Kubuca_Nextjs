import CourseForm from '@/app/components/CourseForm'
// import CourseForm from '@/app/components/courses/CourseForm'

export default function CreateCoursePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Curso</h1>
      <CourseForm />
      {/* CourseForm */}
    </div>
  )
} 