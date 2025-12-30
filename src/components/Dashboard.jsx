import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  HomeIcon, 
  QuestionMarkCircleIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  ScaleIcon,
  GlobeAltIcon,
  BookOpenIcon,
  UsersIcon,
  TrophyIcon
} from '@heroicons/react/24/solid'

function Dashboard() {
  const [user] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    role: 'community_member',
    reputation: 245,
    isVerified: false
  })

  const categories = [
    { name: 'Health & Well-being', icon: HeartIcon, color: 'text-green-600', posts: 1234 },
    { name: 'Finance & Business', icon: CurrencyDollarIcon, color: 'text-blue-600', posts: 892 },
    { name: 'Education & Knowledge', icon: AcademicCapIcon, color: 'text-purple-600', posts: 756 },
    { name: 'Technology', icon: ComputerDesktopIcon, color: 'text-indigo-600', posts: 1543 },
    { name: 'Law', icon: ScaleIcon, color: 'text-red-600', posts: 423 },
    { name: 'Agriculture & Environment', icon: GlobeAltIcon, color: 'text-green-500', posts: 567 },
    { name: 'Religion & Ethics', icon: BookOpenIcon, color: 'text-amber-600', posts: 345 },
    { name: 'Community Development', icon: UsersIcon, color: 'text-pink-600', posts: 234 },
    { name: 'Sports & Entertainment', icon: TrophyIcon, color: 'text-orange-600', posts: 678 }
  ]

  const recentPosts = [
    {
      id: 1,
      type: 'question',
      title: 'What are the best practices for diabetes management?',
      author: 'healthseeker',
      category: 'Health & Well-being',
      replies: 12,
      upvotes: 24,
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'knowledge',
      title: 'Understanding Climate-Smart Agriculture in East Africa',
      author: 'Dr. Amina K.',
      category: 'Agriculture & Environment',
      replies: 8,
      upvotes: 45,
      time: '4 hours ago',
      isExpert: true
    },
    {
      id: 3,
      type: 'information',
      title: 'New Fintech Regulations in Kenya',
      author: 'financeexpert',
      category: 'Finance & Business',
      replies: 15,
      upvotes: 38,
      time: '6 hours ago'
    }
  ]

  const getPostTypeColor = (type) => {
    const colors = {
      question: 'bg-green-100 text-green-800',
      information: 'bg-purple-100 text-purple-800',
      opinion: 'bg-blue-100 text-blue-800',
      knowledge: 'bg-amber-100 text-amber-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-700">MaarifaHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link to="/settings" className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <Cog6ToothIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2 pl-3 border-l">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">⭐ {user.reputation} reputation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-1">
              <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary-50 text-primary-700">
                <HomeIcon className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link to="/questions" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Questions</span>
              </Link>
              <Link to="/jobs" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                <BriefcaseIcon className="h-5 w-5" />
                <span>Jobs</span>
              </Link>
              <Link to="/experts" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                <UserGroupIcon className="h-5 w-5" />
                <span>Find Experts</span>
              </Link>
              <Link to="/messages" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span>Messages</span>
              </Link>
              <Link to="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 mt-4 border-t pt-4">
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Sign Out</span>
              </Link>
            </div>

            {/* Verification Card */}
            {!user.isVerified && user.role.includes('expert') && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2">Verify Your Expertise</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Complete verification to unlock expert features
                </p>
                <Link 
                  to="/verify" 
                  className="block text-center bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
                >
                  Start Verification
                </Link>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <Link 
                to="/create-post"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 transition-colors"
              >
                What would you like to share or ask today?
              </Link>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
                  >
                    <category.icon className={`h-8 w-8 ${category.color} mb-2`} />
                    <span className="text-sm font-medium text-gray-900 text-center">{category.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{category.posts} posts</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Discussions</h2>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getPostTypeColor(post.type)}`}>
                        {post.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{post.time}</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <span className="font-medium">
                            {post.author}
                            {post.isExpert && <span className="ml-1 text-amber-500">⭐</span>}
                          </span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{post.category}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span>↑ {post.upvotes}</span>
                        <span>💬 {post.replies}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
