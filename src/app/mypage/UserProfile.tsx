'use client'

import { useUserProfile } from '../../hooks/useUserProfile'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Users, Users2 } from 'lucide-react'

export default function UserProfile() {
    const { isEditing, setIsEditing, profile, editForm, setEditForm, handleSave, handleCancel } = useUserProfile()

    if (!profile || !editForm) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">프로필</h2>
                </div>
                <div className="text-center py-20 text-gray-500">프로필 정보를 불러오는 중입니다...</div>
            </div>
        )
    }

    // gender select 옵션
    const genderOptions = [
        { value: 'male', label: '남자' },
        { value: 'female', label: '여자' },
        { value: 'private', label: '비공개' },
    ]

    // interests 예시 (실제 프로젝트에 맞게 수정 가능)
    const interestGroups = [
        {
            label: '여행 스타일',
            options: ['혼자', '커플', '가족'],
        },
        {
            label: '여행 테마',
            options: ['등산', '바다', '호캉스'],
        },
        {
            label: '취미/활동',
            options: ['사진촬영', '액티비티'],
        },
    ]

    return (
        <div className="space-y-6">
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
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                            {editForm.profile_img ? (
                                <img
                                    src={editForm.profile_img}
                                    alt="프로필 이미지"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-2xl font-bold">
                                    {(editForm.nickname || editForm.name).charAt(0)}
                                </span>
                            )}
                        </div>
                        {isEditing && (
                            <input
                                type="text"
                                placeholder="프로필 이미지 URL"
                                value={editForm.profile_img || ''}
                                onChange={(e) => setEditForm({ ...editForm, profile_img: e.target.value })}
                                className="mt-2 w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                        {!isEditing ? (
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {profile.nickname || profile.name}
                                    </h3>
                                </div>
                                <p className="text-gray-700">{profile.introduce}</p>
                                <div className="flex flex-wrap gap-2">
                                    {(profile.interests ?? []).map((interest: any) => (
                                        <span
                                            key={interest}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                                        >
                                            <span>{interest}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                                        <input
                                            type="text"
                                            value={editForm.nickname}
                                            onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                                            placeholder={editForm.name}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            이름(변경 불가)
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">자기소개</label>
                                    <textarea
                                        value={editForm.introduce}
                                        onChange={(e) => setEditForm({ ...editForm, introduce: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* -----------------프로필 정보--------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ----------------------개인 정보--------------------------- */}
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
                                <span className="text-gray-800">
                                    {genderOptions.find((opt) => opt.value === profile.gender)?.label || '비공개'}
                                </span>
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
                                <select
                                    value={editForm.gender}
                                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {genderOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
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
                                            <span>{interest}</span>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {interestGroups.map((group) => (
                                        <div key={group.label} className="mb-2">
                                            <div className="font-semibold text-gray-700 mb-1">{group.label}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {group.options.map((option) => (
                                                    <label
                                                        key={option}
                                                        className="flex items-center space-x-2 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={editForm.interests.includes(option)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setEditForm({
                                                                        ...editForm,
                                                                        interests: [...editForm.interests, option],
                                                                    })
                                                                } else {
                                                                    setEditForm({
                                                                        ...editForm,
                                                                        interests: editForm.interests.filter(
                                                                            (i) => i !== option,
                                                                        ),
                                                                    })
                                                                }
                                                            }}
                                                        />
                                                        <span>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
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
