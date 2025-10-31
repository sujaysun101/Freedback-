import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthStore } from '../lib/store'

export default function withAuth(Component: React.ComponentType<any>) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter()
    const { user } = useAuthStore()

    useEffect(() => {
      if (!user) {
        router.push('/login')
      }
    }, [user, router])

    if (!user) {
      return null
    }

    return <Component {...props} />
  }
}
