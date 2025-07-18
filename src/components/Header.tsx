'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supsbaseClient'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            setIsLoggedIn(!!session)
            setUser(session?.user || null)
        }
        getSession()
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setIsLoggedIn(!!session)
            setUser(session?.user || null)
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        alert('로그아웃 되었습니다.')
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <i className="ri-map-pin-2-fill text-white text-lg"></i>
                        </div>
                        <span className="text-xl font-bold text-gray-800 font-pacifico">TripAI</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                            홈
                        </Link>
                        <Link href="/board" className="text-gray-600 hover:text-blue-600 transition-colors">
                            여행 후기
                        </Link>
                        <Link href="/mypage" className="text-gray-600 hover:text-blue-600 transition-colors">
                            마이페이지
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    로그인
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                                >
                                    회원가입
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/mypage">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <i className="ri-user-fill text-gray-600"></i>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
