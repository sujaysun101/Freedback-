import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../lib/store'
import { api } from '../lib/api'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function Subscribe() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login first')
      return
    }

    setIsLoading(true)
    try {
      // In production, create a checkout session on your backend
      // For now, this is a placeholder
      const response = await api.post('/api/stripe/create-checkout-session', {
        price_id: 'price_1234567890', // Replace with your Stripe price ID
      })

      const stripe = await stripePromise
      if (stripe && response.data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId })
      }
    } catch (error: any) {
      toast.error('Failed to start checkout. Please contact support.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to FeedbackFix</h1>
          <p className="text-gray-600 mb-8">
            Get unlimited access to translate client feedback into actionable design tasks.
          </p>

          <div className="border-2 border-primary-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">Solo Designer Plan</h3>
                <p className="text-gray-600">Perfect for freelancers and solo designers</p>
              </div>
              <div className="text-3xl font-bold text-primary-600">$79<span className="text-lg">/mo</span></div>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">?</span>
                Unlimited feedback translations
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">?</span>
                Unlimited projects
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">?</span>
                Task management and tracking
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">?</span>
                Copy tasks to clipboard
              </li>
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={isLoading || user?.subscription_status === 'active'}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {user?.subscription_status === 'active'
                ? 'Already Subscribed'
                : isLoading
                ? 'Loading...'
                : 'Subscribe Now'}
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  )
}
