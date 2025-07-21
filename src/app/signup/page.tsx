'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }
        setIsLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    name: formData.name,
                },
            },
        })
        setIsLoading(false)
        if (error) {
            if (error.status === 409 || error.message.includes('User already registered')) {
                setSignupError('이미 가입된 이메일입니다. 이메일 인증을 완료하거나, 비밀번호 찾기를 이용해 주세요.')
            } else {
                setSignupError(error.message)
            }
            setIsLoading(false)
            return
        }

        if (data?.user) {
            const { error: insertError } = await supabase.from('user_profile').insert([
                {
                    user_id: data.user.id,
                    nickname: '',
                    introduce: '',
                    interests: '',
                    birth_date: null,
                    gender: 'private',
                    profile_img: '',
                },
            ])
            if (insertError) {
                console.error('user_profile insert error:', insertError)
            }
            setSignupSuccess(true)
            return
        }

        alert('회원가입이 완료되었습니다!')
        router.push('/login')
    }

    const [passwordValid, setPasswordValid] = useState<boolean | null>(null)
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)
    const [nameValid, setNameValid] = useState<boolean | null>(null)

    const validatePassword = (pw: string) => {
        const valid =
            pw.length >= 8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*(),.?":{}|<>_\-\\[\]=+~`';]/.test(pw)
        setPasswordValid(valid)
    }

    const validateName = (name: string) => {
        // 한글만: 1~4글자, 영어만: 1~12글자
        const isKorean = /^[가-힣]+$/.test(name)
        const isEnglish = /^[A-Za-z]+$/.test(name)
        const valid = (isKorean && name.length <= 4) || (isEnglish && name.length <= 12)
        setNameValid(valid)
    }

    const [signupSuccess, setSignupSuccess] = useState(false)
    const [signupError, setSignupError] = useState<string | null>(null)

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
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">회원가입</h1>
                        <p className="text-gray-600">새로운 여행의 시작</p>
                    </div>

                    {!signupSuccess ? (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                            <i className="ri-user-line text-gray-400"></i>
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => {
                                                handleChange(e)
                                                validateName(e.target.value)
                                            }}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="이름을 입력하세요"
                                            required
                                        />
                                    </div>
                                    {nameValid === true && (
                                        <div className="text-green-600 text-sm">사용 가능한 이름입니다.</div>
                                    )}
                                    {nameValid === false && (
                                        <div className="text-red-500 text-sm">
                                            한글 4글자 이내 또는 영어 12글자 이내, 숫자/특수기호 불가
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                            <i className="ri-mail-line text-gray-400"></i>
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
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
                                            name="password"
                                            value={formData.password}
                                            onChange={(e) => {
                                                handleChange(e)
                                                validatePassword(e.target.value)
                                                setPasswordsMatch(formData.confirmPassword === e.target.value)
                                            }}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="비밀번호를 입력하세요"
                                            required
                                        />
                                    </div>
                                    {passwordValid === true && (
                                        <div className="text-green-600 text-sm">유효한 비밀번호입니다.</div>
                                    )}
                                    {passwordValid === false && (
                                        <div className="text-red-500 text-sm">
                                            8자 이상, 영문+숫자, 특수기호를 모두 포함해야 합니다.
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        비밀번호 확인
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                            <i className="ri-lock-line text-gray-400"></i>
                                        </div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={(e) => {
                                                handleChange(e)
                                                setPasswordsMatch(e.target.value === formData.password)
                                            }}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="비밀번호를 다시 입력하세요"
                                            required
                                        />
                                    </div>
                                    {passwordsMatch === true && (
                                        <div className="text-green-600 text-sm">비밀번호가 일치합니다.</div>
                                    )}
                                    {passwordsMatch === false && (
                                        <div className="text-red-500 text-sm">비밀번호가 일치하지 않습니다.</div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={
                                        isLoading || passwordValid !== true || !passwordsMatch || nameValid !== true
                                    }
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>가입 중...</span>
                                        </>
                                    ) : (
                                        <span>회원가입</span>
                                    )}
                                </button>
                            </form>

                            {signupError && <div className="text-red-500 text-sm text-center mt-2">{signupError}</div>}

                            <div className="mt-6 text-center">
                                <span className="text-gray-600">이미 계정이 있으신가요? </span>
                                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                                    로그인
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="ri-mail-check-line text-green-600 text-2xl"></i>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">회원가입 완료!</h2>
                                <p className="text-gray-600 mb-4">{formData.email}로 인증 이메일을 발송했습니다.</p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        이메일 인증을 완료한 후 로그인할 수 있습니다.
                                        <br />
                                        스팸 메일함도 확인해보세요.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    로그인 페이지로 이동
                                </button>
                                <button
                                    onClick={() => {
                                        setSignupSuccess(false)
                                        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
                                        setSignupError(null)
                                    }}
                                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    다시 회원가입
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
