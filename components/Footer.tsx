import { Youtube, Coffee } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 bg-opacity-80 py-6 px-4 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-yellow-400 font-wow text-lg mb-4 sm:mb-0">
          Join the Bot-Slaying Movement!
        </p>
        <div className="flex space-x-6">
          <Link 
            href="https://www.youtube.com/channel/your-channel-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-400 transition-colors duration-300 flex items-center"
          >
            <Youtube className="w-6 h-6 mr-2" />
            <span className="font-wow">Watch Our Adventures</span>
          </Link>
          <Link 
            href="https://www.buymeacoffee.com/your-username" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-400 transition-colors duration-300 flex items-center"
          >
            <Coffee className="w-6 h-6 mr-2" />
            <span className="font-wow">Support Our Cause</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

