'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        setIsLoading(false)
        if (error) {
            alert(error.message)
            return
        }

        alert('로그인 되었습니다')
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <i className="ri-map-pin-2-fill text-white text-xl"></i>
                            </div>
                            <span className="text-2xl font-bold text-gray-800 font-pacifico">TripAI</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">로그인</h1>
                        <p className="text-gray-600">AI와 함께하는 여행을 시작해보세요</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <i className="ri-mail-line text-gray-400"></i>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="이메일을 입력하세요"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <i className="ri-lock-line text-gray-400"></i>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                {/* <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span> */}
                            </label>
                            <Link href="#" className="text-sm text-blue-600 hover:text-blue-500">
                                비밀번호 찾기
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>로그인 중...</span>
                                </>
                            ) : (
                                <span>로그인</span>
                            )}
                        </button>
                    </form>

                    {/* Social Login */}
                    {/* <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">또는</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 whitespace-nowrap">
                                <i className="ri-google-fill text-red-500 mr-2"></i>
                                Google
                            </button>
                            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 whitespace-nowrap">
                                <i className="ri-kakao-talk-fill text-yellow-500 mr-2"></i>
                                Kakao
                            </button>
                        </div>
                    </div> */}

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-600">계정이 없으신가요? </span>
                        <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                            회원가입
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
