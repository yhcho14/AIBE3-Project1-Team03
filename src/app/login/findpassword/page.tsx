'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function FindPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFindPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                setError('올바른 이메일 형식을 입력해주세요.')
                setIsLoading(false)
                return
            }

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login/reset-password`,
            })

            if (resetError) {
                if (resetError.message.includes('User not found')) {
                    setError('해당 이메일로 등록된 계정을 찾을 수 없습니다.')
                } else {
                    setError('비밀번호 재설정 이메일 발송에 실패했습니다.')
                }
                setIsLoading(false)
                return
            }

            setIsEmailSent(true)
            setIsLoading(false)
        } catch (error) {
            setError('비밀번호 찾기 중 오류가 발생했습니다.')
            setIsLoading(false)
        }
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">비밀번호 찾기</h1>
                        <p className="text-gray-600">가입하신 이메일을 입력해주세요</p>
                    </div>

                    {!isEmailSent ? (
                        <form onSubmit={handleFindPassword} className="space-y-6">
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
                                        placeholder="가입하신 이메일을 입력하세요"
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>발송 중...</span>
                                    </>
                                ) : (
                                    <span>비밀번호 재설정 이메일 발송</span>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <i className="ri-mail-send-line text-green-600 text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">이메일이 발송되었습니다!</h2>
                                <p className="text-gray-600 mb-4">{email}로 비밀번호 재설정 링크를 발송했습니다.</p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        이메일을 확인하여 비밀번호를 재설정해주세요.
                                        <br />
                                        스팸 메일함도 확인해보세요.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 text-center space-y-3">
                        <Link href="/login" className="block text-blue-600 hover:text-blue-500 font-medium">
                            로그인으로 돌아가기
                        </Link>
                        <div>
                            <span className="text-gray-600">계정이 없으신가요? </span>
                            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                                회원가입
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
