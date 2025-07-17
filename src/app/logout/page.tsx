'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supsbaseClient'

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        const handleLogout = async () => {
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('로그아웃 에러:', error)
                alert('로그아웃 중 오류가 발생했습니다.')
                return
            }

            alert('로그아웃 되었습니다.')
            router.push('/')
        }

        handleLogout()
    }, [router])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">로그아웃 중...</p>
            </div>
        </div>
    )
}
