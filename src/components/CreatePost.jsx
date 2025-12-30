import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function CreatePost() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    category: '',
    postType: 'question',
    title: '',
    content: '',
    tags: ''
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
    'Sports & Entertainment',
    'Jobs & Careers',
    'General Discussion'
  ]

  const postTypes = [
    { value: 'question', label: 'Question', color: 'green', description: 'Ask for information or advice' },
    { value: 'information', label: 'Information', color: 'purple', description: 'Share factual updates or news' },
    { value: 'opinion', label: 'Opinion', color: 'blue', description: 'Share your personal views' },
    { value: 'knowledge', label: 'Knowledge', color: 'amber', description: 'Expert educational content (verified experts only)' }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement actual post creation API call
    console.log('Creating post:', formData)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert('Post created successfully!')
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-700">
              MaarifaHub
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Post Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {postTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.postType === type.value
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postType"
                      value={type.value}
                      checked={formData.postType === type.value}
                      onChange={handleChange}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Write a clear, descriptive title"
                required
                maxLength={300}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/300 characters
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Provide details, context, and any relevant information..."
                required
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-y"
              />
              <p className="mt-1 text-sm text-gray-500">
                Be clear and respectful. Provide enough context for others to understand.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., diabetes, nutrition, prevention (comma-separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add relevant tags to help others find your post
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Community Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Be respectful and constructive</li>
                <li>Provide accurate information to the best of your knowledge</li>
                <li>Cite sources when sharing factual claims</li>
                <li>Avoid harmful, illegal, or explicit content</li>
                <li>Respect privacy and confidentiality</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? 'Publishing...' : 'Publish Post'}
              </button>
              <Link
                to="/dashboard"
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
