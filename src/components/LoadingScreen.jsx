import { useEffect, useState } from 'react'

function LoadingScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onLoadingComplete()
          }, 300)
          return 100
        }
        return prev + 10
      })
    }, 150)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#2c3e5f] via-[#253147] to-[#1a1f2e] flex items-center justify-center z-[9999]">
      <div className="text-center">
        {/* Logo Container */}
        <div className="relative mb-8 animate-pulse">
          {/* Outer gold ring */}
          <div className="absolute inset-0 w-64 h-64 mx-auto">
            <div className="w-full h-full rounded-full border-8 border-[#d4a574] animate-spin-slow" style={{ animationDuration: '8s' }}></div>
          </div>
          
          {/* Inner circle with logo */}
          <div className="relative w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-[#2c3e5f] to-[#1a1f2e] border-4 border-[#1a1f2e] flex items-center justify-center shadow-2xl">
            {/* Logo SVG */}
            <div className="text-center p-8">
              {/* Title */}
              <h1 className="text-4xl font-bold text-white tracking-widest mb-2">
                MAARIFAHUB
              </h1>
              <p className="text-sm text-[#d4a574] tracking-wider mb-6">
                KNOWLEDGE SEEKING
              </p>
              
              {/* Book with circuit design */}
              <div className="relative mb-6">
                <svg viewBox="0 0 120 100" className="w-32 h-24 mx-auto">
                  {/* Open book */}
                  <path d="M 20,30 L 20,80 L 57,85 L 57,35 Z" fill="#d4a574" opacity="0.9"/>
                  <path d="M 100,30 L 100,80 L 63,85 L 63,35 Z" fill="#d4a574" opacity="0.9"/>
                  
                  {/* Circuit tree */}
                  <line x1="60" y1="35" x2="60" y2="10" stroke="#d4a574" strokeWidth="2"/>
                  <line x1="60" y1="20" x2="45" y2="12" stroke="#d4a574" strokeWidth="1.5"/>
                  <line x1="60" y1="20" x2="75" y2="12" stroke="#d4a574" strokeWidth="1.5"/>
                  <circle cx="45" cy="12" r="2" fill="#d4a574"/>
                  <circle cx="75" cy="12" r="2" fill="#d4a574"/>
                  <circle cx="60" cy="10" r="2" fill="#d4a574"/>
                  
                  {/* Stars */}
                  <path d="M 35,5 L 33,8 L 30,8 L 33,10 L 32,13 L 35,11 L 38,13 L 37,10 L 40,8 L 37,8 Z" fill="#d4a574"/>
                  <path d="M 85,5 L 83,8 L 80,8 L 83,10 L 82,13 L 85,11 L 88,13 L 87,10 L 90,8 L 87,8 Z" fill="#d4a574"/>
                  <path d="M 60,2 L 58,5 L 55,5 L 58,7 L 57,10 L 60,8 L 63,10 L 62,7 L 65,5 L 62,5 Z" fill="#d4a574"/>
                </svg>
              </div>
              
              {/* Compass */}
              <div className="flex justify-center">
                <svg viewBox="0 0 40 40" className="w-12 h-12">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#d4a574" strokeWidth="1.5"/>
                  <line x1="20" y1="7" x2="20" y2="33" stroke="#d4a574" strokeWidth="1"/>
                  <line x1="7" y1="20" x2="33" y2="20" stroke="#d4a574" strokeWidth="1"/>
                  <text x="20" y="5" fontSize="6" fill="#d4a574" textAnchor="middle">W</text>
                  <text x="36" y="22" fontSize="6" fill="#d4a574" textAnchor="middle">E</text>
                  <text x="20" y="38" fontSize="6" fill="#d4a574" textAnchor="middle">S</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8">
          <p className="text-white text-xl font-semibold mb-4 animate-pulse">
            Loading...
          </p>
          
          {/* Progress bar */}
          <div className="w-64 mx-auto bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#d4a574] to-[#f0d9b5] h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-[#d4a574] text-sm mt-3">
            Connecting you with experts across Africa
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
