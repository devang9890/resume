import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeftIcon, Loader } from 'lucide-react'
import ResumePreview from '../Components/ResumePreview'
import api from '../configs/api' // ✅ make sure api is imported
import { dummyResumeData } from '../assets/assets'

const Preview = () => {
  const { resumeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  const loadResume = async () => {
    try {
      // ✅ fixed string interpolation
      const { data } = await api.get(`/api/resumes/public/${resumeId}`)
      setResumeData(data.resume)
    } catch (error) {
      // Error handled silently for better UX
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadResume()
  }, [resumeId]) // ✅ include resumeId in dependencies

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-green-500" size={40} />
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-center text-4xl text-slate-400 font-medium">
          Resume not found
        </p>
        <a
          href="/"
          className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-2 size-4" /> Go to Home Page
        </a>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  )
}

export default Preview
