'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    const [loginSuccess, setLoginSuccess] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setLoginError(null)
        setLoginSuccess(false)

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            if (error.message.includes('User not found')) {
                setLoginError('존재하지 않는 아이디 입니다. 회원가입을 진행 해주세요')
            } else if (error.message.includes('Invalid login credentials')) {
                setLoginError('이메일 또는 비밀번호가 틀렸습니다. 다시 확인해주세요')
            } else {
                setLoginError(error.message)
            }
            setIsLoading(false)
            return
        }
        setIsLoading(false)

        if (data?.user) {
            // user_profile row가 있는지 확인
            const { data: profile } = await supabase
                .from('user_profile')
                .select('user_id')
                .eq('user_id', data.user.id)
                .single()
            if (!profile) {
                await supabase.from('user_profile').insert([
                    {
                        user_id: data.user.id,
                        nickname: '',
                        introduce: '',
                        interests: '',
                        birth_date: null,
                        gender: null,
                        profile_img: '',
                    },
                ])
            }
            // 기존 is_deleted 체크 등 이하 생략
            const { data: profileCheck } = await supabase
                .from('user_profile')
                .select('is_deleted')
                .eq('user_id', data.user.id)
                .single()
            if (profileCheck?.is_deleted) {
                await supabase.auth.signOut()
                setLoginError('삭제된 계정입니다. 회원가입을 다시 해주세요.')
                setIsLoading(false)
                return
            }
        }

        setLoginSuccess(true)
        // 잠시 후 홈페이지로 이동
        setTimeout(() => {
            router.push('/')
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
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

                    {loginSuccess ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <i className="ri-check-line text-green-600 text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">로그인 성공!</h2>
                                <p className="text-gray-600 mb-4">홈페이지로 이동합니다...</p>
                            </div>
                            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    ) : (
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
                                <label className="flex items-center"></label>
                                <Link href="/login/findpassword" className="text-sm text-blue-600 hover:text-blue-500">
                                    비밀번호 찾기
                                </Link>
                            </div>

                            {loginError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-2">
                                        <i className="ri-error-warning-line text-red-500"></i>
                                        <span className="text-red-700 text-sm">{loginError}</span>
                                    </div>
                                </div>
                            )}

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
                    )}

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
