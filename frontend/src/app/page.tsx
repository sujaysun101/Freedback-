import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Save $$$, Stop Guessing</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn <span className="text-blue-600">&quot;Make It Pop&quot;</span><br />
            Into Clear Design Tasks
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Freedback uses AI to translate vague client feedback into specific, 
            actionable design tasks. No more endless revisions or scope creep.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/demo"
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Before/After Example */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <div className="text-red-600 font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">??</span> Vague Feedback
              </div>
              <p className="text-gray-700 italic">
                &quot;Can you make the design more modern? It needs more pizzazz. 
                Also, the colors feel off. Make it pop!&quot;
              </p>
            </div>

            {/* After */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <div className="text-green-600 font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Clear, Actionable Tasks
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Increase headline contrast from 4.5:1 to 7:1</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Replace muted blue (#94A3B8) with electric blue (#3B82F6)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Add 20px padding around CTA button</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI-Powered Translation</h3>
            <p className="text-gray-600">
              Advanced AI understands design terminology and client intent
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Results</h3>
            <p className="text-gray-600">
              Get specific tasks in seconds, not hours of back-and-forth
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Workflow Integration</h3>
            <p className="text-gray-600">
              Coming soon: Direct integration with Figma, Asana, and Trello
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 mb-12">Choose the plan that works for you</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
              <h3 className="font-semibold text-xl mb-2">Per Project</h3>
              <div className="text-4xl font-bold mb-4">$25<span className="text-xl text-gray-500">/project</span></div>
              <p className="text-gray-600 mb-6">Perfect for occasional use</p>
              <Link href="/sign-up" className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Get Started
              </Link>
            </div>
            
            <div className="bg-blue-600 text-white rounded-lg p-8 border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="font-semibold text-xl mb-2">Monthly</h3>
              <div className="text-4xl font-bold mb-4">$79<span className="text-xl opacity-75">/month</span></div>
              <p className="opacity-90 mb-6">Unlimited projects & translations</p>
              <Link href="/sign-up" className="block w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
