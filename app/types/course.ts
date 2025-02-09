export interface Course {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
  affiliateCommission: number
  instructor: {
    name: string
    email: string
  }
  modules: Array<{
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      duration: number
    }>
  }>
  affiliates: Array<{
    affiliateCode: string
  }>
  _count: {
    students: number
    lessons: number
  }
}

export interface CourseData {
  course: Course
  purchase?: {
    id: string
    status: string
  }
} 