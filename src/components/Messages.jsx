import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  HomeIcon, 
  QuestionMarkCircleIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PaperAirplaneIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'

function Messages() {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    reputation: 245
  })

  const [selectedChat, setSelectedChat] = useState(1)
  const [messageText, setMessageText] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const messagesEndRef = useRef(null)
  const notificationRef = useRef(null)

  // State for conversations and messages
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Dr. Amina Kamau',
      lastMessage: 'Thank you for the follow-up question!',
      time: '2h ago',
      unread: 2
    },
    {
      id: 2,
      name: 'Prof. James Omondi',
      lastMessage: 'I can help you with that...',
      time: '5h ago',
      unread: 0
    },
    {
      id: 3,
      name: 'Mary Wanjiru',
      lastMessage: 'Here are some resources that might help',
      time: '1d ago',
      unread: 1
    }
  ])

  const [chatMessages, setChatMessages] = useState({
    1: [
      {
        id: 1,
        sender: 'Dr. Amina Kamau',
        text: 'Hello! I saw your question about diabetes management.',
        time: '10:30 AM',
        isOwn: false
      },
      {
        id: 2,
        sender: 'You',
        text: 'Hi! Yes, I would appreciate your expert advice.',
        time: '10:35 AM',
        isOwn: true
      },
      {
        id: 3,
        sender: 'Dr. Amina Kamau',
        text: 'Thank you for the follow-up question!',
        time: '10:40 AM',
        isOwn: false
      }
    ],
    2: [
      {
        id: 1,
        sender: 'Prof. James Omondi',
        text: 'I can help you with that research topic.',
        time: '9:15 AM',
        isOwn: false
      }
    ],
    3: [
      {
        id: 1,
        sender: 'Mary Wanjiru',
        text: 'Here are some resources that might help',
        time: 'Yesterday',
        isOwn: false
      }
    ]
  })

  // Get current chat messages
  const messages = chatMessages[selectedChat] || []

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: 'message',
      text: 'Dr. Amina Kamau replied to your message',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'answer',
      text: 'Your question received a new answer',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'upvote',
      text: 'Your answer was upvoted',
      time: '3 hours ago',
      unread: false
    }
  ]

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Format current time
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messageText.trim()) {
      const currentTime = getCurrentTime()
      
      // Create new message
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: messageText.trim(),
        time: currentTime,
        isOwn: true
      }

      // Update chat messages
      setChatMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMessage]
      }))

      // Update conversation list with last message
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedChat) {
          return {
            ...conv,
            lastMessage: messageText.trim(),
            time: 'Just now'
          }
        }
        return conv
      }))

      // Clear input
      setMessageText('')

      // Simulate receiving a response after 2-3 seconds
      setTimeout(() => {
        simulateResponse()
      }, 2000 + Math.random() * 1000)
    }
  }

  const simulateResponse = () => {
    const responses = [
      "That's a great question! Let me provide you with some information.",
      "I understand your concern. Here's what I recommend...",
      "Thank you for reaching out. I'll be happy to help with that.",
      "That's an interesting perspective. Have you considered...",
      "I appreciate your follow-up. Here are some additional resources.",
      "Great to hear from you! Let's discuss this further."
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    const currentTime = getCurrentTime()
    const selectedConv = conversations.find(c => c.id === selectedChat)

    const responseMessage = {
      id: (chatMessages[selectedChat]?.length || 0) + 1,
      sender: selectedConv?.name || 'Expert',
      text: randomResponse,
      time: currentTime,
      isOwn: false
    }

    // Add response message
    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), responseMessage]
    }))

    // Update conversation list
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat) {
        return {
          ...conv,
          lastMessage: randomResponse,
          time: 'Just now',
          unread: conv.unread + 1
        }
      }
      return conv
    }))
  }

  // Mark messages as read when opening a chat
  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId)
    
    // Mark as read
    setConversations(prev => prev.map(conv => {
      if (conv.id === chatId) {
        return { ...conv, unread: 0 }
      }
      return conv
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-primary-700">MaarifaHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
              >
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>
              
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                >
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div>
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                            notif.unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-900 dark:text-white">{notif.text}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="block p-3 text-center text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/settings" className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Cog6ToothIcon className="h-6 w-6" />
              </Link>
              
              <Link to="/profile" className="flex items-center space-x-2 pl-3 border-l dark:border-gray-700 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">⭐ {user.reputation} reputation</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-primary-700">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/questions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Questions</span>
              </Link>
              
              <Link
                to="/jobs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BriefcaseIcon className="h-5 w-5" />
                <span>Jobs</span>
              </Link>
              
              <Link
                to="/experts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>Find Experts</span>
              </Link>
              
              <Link
                to="/messages"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span className="font-medium">Messages</span>
              </Link>
              
              <div className="pt-4 mt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    navigate('/')
                  }}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r dark:border-gray-700">
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Conversations</h3>
              </div>
              <div className="overflow-y-auto" style={{ height: 'calc(600px - 73px)' }}>
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectChat(conv.id)}
                    className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedChat === conv.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{conv.name}</h4>
                          {conv.unread > 0 && (
                            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">{conv.lastMessage}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{conv.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {conversations.find(c => c.id === selectedChat)?.name}
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(600px - 145px)' }}>
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.isOwn
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          {!msg.isOwn && (
                            <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender}</p>
                          )}
                          <p>{msg.text}</p>
                          <span className={`text-xs mt-1 block ${
                            msg.isOwn ? 'text-primary-100' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
