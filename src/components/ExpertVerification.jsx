import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, PaperClipIcon } from '@heroicons/react/24/outline'

function ExpertVerification() {
  const [formData, setFormData] = useState({
    fullName: '',
    profession: '',
    category: '',
    organization: '',
    credentialsDescription: '',
    linkedinUrl: '',
    otherUrls: '',
    educationProof: null,
    certifications: []
  })
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    'Health & Well-being',
    'Finance & Business',
    'Education & Knowledge',
    'Technology',
    'Law',
    'Agriculture & Environment',
    'Religion & Ethics',
    'Community Development',
    'Sports & Entertainment'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (name === 'educationProof') {
      setFormData({ ...formData, educationProof: files[0] })
    } else if (name === 'certifications') {
      setFormData({ ...formData, certifications: Array.from(files) })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement actual verification submission API call
    console.log('Verification submission:', formData)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert('Verification request submitted! Our team will review it within 2-3 business days.')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Expert Verification</h1>
            <p className="text-gray-600">
              Submit your credentials for verification. This process helps maintain trust and credibility on MaarifaHub.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What you need to provide:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Professional credentials and qualifications</li>
              <li>Education certificates or diplomas</li>
              <li>Professional certifications (if applicable)</li>
              <li>LinkedIn profile or other professional profiles</li>
              <li>Proof of current practice or employment</li>
            </ul>
            <p className="text-sm text-blue-800 mt-3">
              ⏱️ Reviews typically take 2-3 business days. You'll be notified via email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Legal Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="As shown on official documents"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Profession */}
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                Profession/Title *
              </label>
              <input
                id="profession"
                name="profession"
                type="text"
                value={formData.profession}
                onChange={handleChange}
                placeholder="e.g., Medical Doctor, Financial Advisor, Software Engineer"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Primary Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Select your expertise category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Organization */}
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                Current Organization/Institution (Optional)
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Where you currently work or practice"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Credentials Description */}
            <div>
              <label htmlFor="credentialsDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Credentials & Qualifications *
              </label>
              <textarea
                id="credentialsDescription"
                name="credentialsDescription"
                value={formData.credentialsDescription}
                onChange={handleChange}
                placeholder="Describe your education, certifications, licenses, and professional experience..."
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-y"
              />
            </div>

            {/* Education Proof Upload */}
            <div>
              <label htmlFor="educationProof" className="block text-sm font-medium text-gray-700 mb-2">
                Education Certificate/Diploma *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                <div className="space-y-1 text-center">
                  <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="educationProof"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="educationProof"
                        name="educationProof"
                        type="file"
                        required
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                  {formData.educationProof && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.educationProof.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Certifications Upload */}
            <div>
              <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-2">
                Professional Certifications (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                <div className="space-y-1 text-center">
                  <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="certifications"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="certifications"
                        name="certifications"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">Multiple files accepted</p>
                  {formData.certifications.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.certifications.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* LinkedIn URL */}
            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile URL *
              </label>
              <input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Other URLs */}
            <div>
              <label htmlFor="otherUrls" className="block text-sm font-medium text-gray-700 mb-2">
                Other Professional URLs (Optional)
              </label>
              <textarea
                id="otherUrls"
                name="otherUrls"
                value={formData.otherUrls}
                onChange={handleChange}
                placeholder="Personal website, professional portfolio, ResearchGate, etc. (one per line)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-y"
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Privacy Notice:</strong> Your personal information and documents will be reviewed by our 
                verification team only. We will not share your documents publicly. Once verified, only your 
                professional credentials and expertise category will be visible to other users.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? 'Submitting...' : 'Submit for Verification'}
              </button>
              <Link
                to="/dashboard"
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Save as Draft
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ExpertVerification
