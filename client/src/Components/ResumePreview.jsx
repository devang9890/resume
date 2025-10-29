import React from 'react'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} accentColor={accentColor} />
      case 'minimal':
        return <MinimalTemplate data={data} accentColor={accentColor} />
      case 'minimal-image':
        return <MinimalImageTemplate data={data} accentColor={accentColor} />
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />
    }
  }

  return (
    <div className='w-full bg-gray-100'>
      <div
        id='resume-preview'
        className={`border border-gray-200 print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}
      </div>

      <style>{`
        @page {
          size: letter;
          margin: 0.5in;
        }
        @media print {
          html,
          body {
            width: 8.5in;
            height: 11in;
            overflow: hidden;
            margin: 0;
            padding: 0;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview,
          #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          #resume-preview a {
            color: #2563eb !important;
            text-decoration: underline !important;
          }
          #resume-preview a:visited {
            color: #2563eb !important;
          }
          #resume-preview h1, #resume-preview h2, #resume-preview h3 {
            color: black !important;
            page-break-after: avoid;
          }
          #resume-preview section {
            page-break-inside: avoid;
            margin-bottom: 1rem;
          }
          #resume-preview .space-y-4 > * + * {
            margin-top: 1rem;
          }
          #resume-preview .space-y-6 > * + * {
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default ResumePreview
