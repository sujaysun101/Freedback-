import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Turn vague client feedback into
              <span className="text-primary-600"> clear design tasks</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Clients say "make it pop" and "needs more pizzazz" while you're left guessing. 
              FeedbackFix translates messy feedback into actionable tasks like "increase contrast by 40%" or "add 20px padding."
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Before/After Example */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            See the Magic
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-red-200">
              <h3 className="text-lg font-semibold text-red-600 mb-4">? Before</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-700 italic">
                    "make it pop"
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-700 italic">
                    "needs more pizzazz"
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-700 italic">
                    "feels empty"
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-green-200">
              <h3 className="text-lg font-semibold text-green-600 mb-4">? After</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-gray-900 font-medium">
                    Increase headline contrast by 40% using #1a1a1a on #ffffff background
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-gray-900 font-medium">
                    Evaluate 3 high-contrast color palettes for CTA buttons (test #FF5733, #4A90E2, #F5A623)
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-gray-900 font-medium">
                    Increase whitespace between sections by 40px and add subtle background pattern (opacity: 0.05)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Why FeedbackFix?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">?</div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">
                No more endless revision cycles from unclear direction. Get specific, actionable tasks instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">?</div>
              <h3 className="text-xl font-semibold mb-2">Clear Communication</h3>
              <p className="text-gray-600">
                Translate vague feedback into measurable design instructions that you can execute immediately.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">??</div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Prevent scope creep and reduce revision cycles. Track every task and communicate clearly with clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Simple Pricing
          </h2>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Solo Designer</h3>
              <div className="text-4xl font-bold text-primary-600 mb-4">$79<span className="text-lg text-gray-600">/month</span></div>
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">?</span>
                  Unlimited translations
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">?</span>
                  Unlimited projects
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">?</span>
                  Task management
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">?</span>
                  Copy tasks to clipboard
                </li>
              </ul>
              <Link href="/register" className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            ? 2024 FeedbackFix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
