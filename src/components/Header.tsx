'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Toast from './Toast'

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()
    const [profileImg, setProfileImg] = useState<string>('')
    const [toast, setToast] = useState<{
        message: string
        type: 'success' | 'error' | 'info'
        isVisible: boolean
    }>({
        message: '',
        type: 'info',
        isVisible: false,
    })

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

    useEffect(() => {
        const fetchProfileImg = async () => {
            if (!user) {
                setProfileImg('')
                return
            }
            const { data } = await supabase.from('user_profile').select('profile_img').eq('user_id', user.id).single()
            setProfileImg(data?.profile_img ?? '')
        }
        fetchProfileImg()
        router.refresh()
    }, [user])

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({
            message,
            type,
            isVisible: true,
        })
    }

    const hideToast = () => {
        setToast((prev) => ({ ...prev, isVisible: false }))
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            showToast('로그아웃되었습니다.', 'success')
            router.push('/')
        } catch (error) {
            showToast('로그아웃 중 오류가 발생했습니다.', 'error')
        }
    }

    return (
        <>
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <i className="ri-map-pin-2-fill text-white text-lg"></i>
                            </div>
                            <span className="text-xl font-bold text-gray-800 font-pacifico">TripleAI</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                                홈
                            </Link>
                            <Link href="/places" className="text-gray-600 hover:text-blue-600 transition-colors">
                                여행지
                            </Link>
                            <Link href="/board" className="text-gray-600 hover:text-blue-600 transition-colors">
                                여행 후기
                            </Link>
                            {isLoggedIn && (
                                <Link href="/mypage" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    마이페이지
                                </Link>
                            )}
                        </nav>

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
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                                            {profileImg ? (
                                                <img
                                                    src={profileImg}
                                                    alt="프로필 이미지"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <i className="ri-user-3-line text-white text-lg"></i>
                                            )}
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

            <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
        </>
    )
}
