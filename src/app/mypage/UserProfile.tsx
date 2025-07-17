'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supsbaseClient'

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<any>(null)

    const [editForm, setEditForm] = useState(profile)

    const handleSave = () => {
        setProfile(editForm)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditForm(profile)
        setIsEditing(false)
    }

    useEffect(() => {
        const fetchProfile = async () => {
            // 1. 현재 로그인된 유저 정보 가져오기
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) return

            // 2. DB에서 추가 정보 가져오기 (예: User 테이블)
            const { data, error } = await supabase.from('User').select('*').eq('email', user.email).single()

            if (error) {
                alert('유저 정보 조회 실패')
                return
            }
            setProfile(data)
        }

        fetchProfile()
    }, [])

    if (!profile) {
        return <div className="text-center py-20 text-gray-500">프로필 정보를 불러오는 중입니다...</div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">프로필</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                        <i className="ri-edit-line"></i>
                        <span>편집</span>
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >
                            저장
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start space-x-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">{profile.name.charAt(0)}</span>
                        </div>
                        {isEditing && (
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <i className="ri-camera-line text-sm"></i>
                            </button>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                        {!isEditing ? (
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                                    <p className="text-gray-600">{profile.email}</p>
                                </div>
                                <p className="text-gray-700">{profile.bio}</p>
                                <div className="flex flex-wrap gap-2">
                                    {(profile.interests ?? []).map((interest: any) => (
                                        <span
                                            key={interest}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">자기소개</label>
                                    <textarea
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">개인 정보</h3>

                    {!isEditing ? (
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">생년월일</span>
                                <span className="text-gray-800">{profile.birthDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">성별</span>
                                <span className="text-gray-800">{profile.gender === 'male' ? '남성' : '여성'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                                <input
                                    type="date"
                                    value={editForm.birthDate}
                                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="male"
                                            checked={editForm.gender === 'male'}
                                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                            className="mr-2"
                                        />
                                        남성
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="female"
                                            checked={editForm.gender === 'female'}
                                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                            className="mr-2"
                                        />
                                        여성
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Travel Preferences */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">여행 취향</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">관심사</label>
                            {!isEditing ? (
                                <div className="flex flex-wrap gap-2">
                                    {(profile.interests ?? []).map((interest: any) => (
                                        <span
                                            key={interest}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                                        >
                                            <i
                                                className={
                                                    interests.find((i) => i.name === interest)?.icon || 'ri-star-line'
                                                }
                                            ></i>
                                            <span>{interest}</span>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {(interests ?? []).map((interest: any) => (
                                        <label key={interest.id} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editForm.interests.includes(interest.name)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setEditForm({
                                                            ...editForm,
                                                            interests: [...editForm.interests, interest.name],
                                                        })
                                                    } else {
                                                        setEditForm({
                                                            ...editForm,
                                                            interests: editForm.interests.filter(
                                                                (i) => i !== interest.name,
                                                            ),
                                                        })
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <i className={interest.icon}></i>
                                            <span className="text-sm">{interest.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">여행 스타일</label>
                            {!isEditing ? (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {travelStyles?.find((s: any) => s.id === profile.travelStyle)?.name}
                                </span>
                            ) : (
                                <div className="space-y-2">
                                    {(travelStyles ?? []).map((style: any) => (
                                        <label key={style.id} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                value={style.id}
                                                checked={editForm.travelStyle === style.id}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, travelStyle: e.target.value })
                                                }
                                                className="mr-2"
                                            />
                                            <span className="text-sm">{style.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계정 설정</h3>
                <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <i className="ri-lock-line text-gray-500"></i>
                            <span>비밀번호 변경</span>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400"></i>
                    </button>

                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <i className="ri-notification-line text-gray-500"></i>
                            <span>알림 설정</span>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400"></i>
                    </button>

                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <i className="ri-shield-line text-gray-500"></i>
                            <span>개인정보 설정</span>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400"></i>
                    </button>

                    <button className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-between text-red-600">
                        <div className="flex items-center space-x-3">
                            <i className="ri-delete-bin-line"></i>
                            <span>계정 삭제</span>
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}
