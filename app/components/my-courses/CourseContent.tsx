'use client'
import { useState } from 'react'
import { Course, Module, Lesson } from '@prisma/client'

type LessonWithProgress = Lesson & {
  progress?: {
    completed: boolean
  }[]
}

type ModuleWithLessons = Module & {
  lessons: LessonWithProgress[]
}

type CourseWithContent = Course & {
  modules: ModuleWithLessons[]
  instructor: {
    name: string | null
  }
}

export default function CourseContent({ course }: { course: CourseWithContent }) {
  const [currentLesson, setCurrentLesson] = useState<LessonWithProgress | null>(
    course.modules[0]?.lessons[0] || null
  )

  const handleLessonComplete = async (lessonId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar progresso')
      }
    } catch (error) {
      console.error('Erro ao marcar aula como concluída:', error)
      alert('Erro ao atualizar progresso da aula')
    }
  }

  const calculateProgress = () => {
    let completedLessons = 0
    let totalLessons = 0

    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++
        if (lesson.progress?.[0]?.completed) {
          completedLessons++
        }
      })
    })

    return {
      completed: completedLessons,
      total: totalLessons,
      percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    }
  }

  const progress = calculateProgress()

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progresso do curso: {progress.percentage}%
          </span>
          <span className="text-sm text-gray-500">
            {progress.completed}/{progress.total} aulas
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {currentLesson ? (
            <div>
              {currentLesson.videoUrl && (
                <div className="aspect-video mb-4">
                  <video
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentLesson.videoUrl}`}
                    controls
                    className="w-full h-full rounded-lg"
                  >
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                <button
                  onClick={() => handleLessonComplete(
                    currentLesson.id,
                    !currentLesson.progress?.[0]?.completed
                  )}
                  className={`px-4 py-2 rounded ${
                    currentLesson.progress?.[0]?.completed
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } text-white transition-colors`}
                >
                  {currentLesson.progress?.[0]?.completed ? 'Concluída' : 'Marcar como concluída'}
                </button>
              </div>
              <p className="text-gray-600">{currentLesson.description}</p>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">Selecione uma aula para começar</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Conteúdo do Curso</h3>
          <div className="space-y-4">
            {course.modules.map((module) => (
              <div key={module.id}>
                <h4 className="font-medium mb-2">{module.title}</h4>
                <div className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full text-left p-2 rounded flex items-center justify-between ${
                        currentLesson?.id === lesson.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center">
                        {lesson.progress?.[0]?.completed && (
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                        {lesson.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 