'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [passwordValid, setPasswordValid] = useState<boolean | null>(null)
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)
    const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session) {
                setError('비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다. 다시 비밀번호 찾기를 시도해주세요.')
                setIsSessionValid(false)
                return
            }

            setIsSessionValid(true)
        }

        checkSession()
    }, [])

    const validatePassword = (pw: string) => {
        const valid =
            pw.length >= 8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*(),.?":{}|<>_\-\\[\]=+~`';]/.test(pw)
        setPasswordValid(valid)
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!passwordValid || !passwordsMatch) {
            setError('비밀번호 조건을 확인해주세요.')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            })

            if (updateError) {
                setError('비밀번호 변경에 실패했습니다: ' + updateError.message)
                setIsLoading(false)
                return
            }

            setSuccess(true)
            setIsLoading(false)
        } catch (error) {
            setError('비밀번호 변경 중 오류가 발생했습니다.')
            setIsLoading(false)
        }
    }

    if (isSessionValid === false) {
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
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">링크 만료</h1>
                            <p className="text-gray-600">비밀번호 재설정 링크가 유효하지 않습니다</p>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <i className="ri-error-warning-line text-red-600 text-2xl"></i>
                            </div>
                            <p className="text-red-600">{error}</p>
                            <div className="space-y-3">
                                <Link
                                    href="/login/findpassword"
                                    className="block w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    비밀번호 찾기 다시 시도
                                </Link>
                                <Link
                                    href="/login"
                                    className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    로그인으로 돌아가기
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isSessionValid === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">링크를 확인하는 중...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">비밀번호 재설정</h1>
                        <p className="text-gray-600">새로운 비밀번호를 입력해주세요</p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <i className="ri-lock-line text-gray-400"></i>
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            validatePassword(e.target.value)
                                            setPasswordsMatch(e.target.value === confirmPassword)
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="새 비밀번호를 입력하세요"
                                        required
                                    />
                                </div>
                                {passwordValid === true && (
                                    <div className="text-green-600 text-sm mt-1">유효한 비밀번호입니다.</div>
                                )}
                                {passwordValid === false && (
                                    <div className="text-red-500 text-sm mt-1">
                                        8자 이상, 영문+숫자, 특수기호를 모두 포함해야 합니다.
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <i className="ri-lock-line text-gray-400"></i>
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            setPasswordsMatch(e.target.value === password)
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                        required
                                    />
                                </div>
                                {passwordsMatch === true && (
                                    <div className="text-green-600 text-sm mt-1">비밀번호가 일치합니다.</div>
                                )}
                                {passwordsMatch === false && (
                                    <div className="text-red-500 text-sm mt-1">비밀번호가 일치하지 않습니다.</div>
                                )}
                            </div>

                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                            <button
                                type="submit"
                                disabled={isLoading || !passwordValid || !passwordsMatch}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>변경 중...</span>
                                    </>
                                ) : (
                                    <span>비밀번호 변경</span>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <i className="ri-check-line text-green-600 text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">비밀번호가 변경되었습니다!</h2>
                                <p className="text-gray-600 mb-4">새로운 비밀번호로 로그인할 수 있습니다.</p>
                            </div>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                로그인하기
                            </button>
                        </div>
                    )}

                    {!success && (
                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                                로그인으로 돌아가기
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
