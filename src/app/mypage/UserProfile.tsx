'use client'

import { useUserProfile } from '../../hooks/useUserProfile'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Users, Users2 } from 'lucide-react'
import { UserProfileType } from '../../hooks/useUserProfile'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
    const {
        isEditing,
        setIsEditing,
        profile,
        editForm,
        setEditForm,
        handleSave,
        handleCancel,
        isNicknameFocused,
        setIsNicknameFocused,
        newInterest,
        setNewInterest,
        handleImageUpload,
        handleAddCustomInterest,
        handleRemoveInterest,
        nicknameError,
        setNicknameError,
        checkNicknameDuplicate,
        handleDeleteAccount,
        showPasswordChange,
        setShowPasswordChange,
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        passwordError,
        setPasswordError,
        passwordSuccess,
        setPasswordSuccess,
        currentPasswordValid,
        setCurrentPasswordValid,
        newPasswordValid,
        setNewPasswordValid,
        passwordsMatch,
        setPasswordsMatch,
        handlePasswordChange,
        checkCurrentPassword,
        validateNewPassword,
    } = useUserProfile()

    const router = useRouter()

    const safeProfile: UserProfileType = profile ?? {
        name: '',
        nickname: '',
        introduce: '',
        interests: [],
        birthDate: '',
        gender: 'private',
        profile_img: '',
        is_deleted: false,
    }
    const safeEditForm: UserProfileType = editForm ?? safeProfile

    const genderOptions = [
        { value: 'male', label: '남자' },
        { value: 'female', label: '여자' },
        { value: 'private', label: '비공개' },
    ]

    const interestGroups = [
        {
            label: '여행 스타일',
            options: ['혼자', '커플', '친구', '가족'],
        },
        {
            label: '여행 테마',
            options: ['등산', '바다', '호캉스', '힐링링'],
        },
        {
            label: '취미/활동',
            options: ['사진촬영', '액티비티', '쇼핑', '먹방', '카페투어'],
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

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                            {safeEditForm.profile_img ? (
                                <img
                                    src={safeEditForm.profile_img}
                                    alt="프로필 이미지"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-2xl font-bold">
                                    {(safeEditForm.nickname || safeEditForm.name).charAt(0)}
                                </span>
                            )}
                        </div>
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            await handleImageUpload(file)
                                        }
                                    }}
                                    className="mt-2 w-full"
                                />
                            </>
                        )}
                    </div>

                    <div className="flex-1">
                        {!isEditing ? (
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {safeProfile.nickname || safeProfile.name}
                                    </h3>
                                </div>
                                <p className="text-gray-700">{safeProfile.introduce}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={safeEditForm.nickname}
                                                onChange={(e) =>
                                                    setEditForm({ ...safeEditForm, nickname: e.target.value })
                                                }
                                                onBlur={() => {
                                                    checkNicknameDuplicate(safeEditForm.nickname)
                                                    setIsNicknameFocused(false)
                                                }}
                                                placeholder={safeEditForm.name}
                                                onFocus={() => setIsNicknameFocused(true)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            {nicknameError && (
                                                <div className="text-red-500 text-xs mt-1">{nicknameError}</div>
                                            )}
                                            {isNicknameFocused && (
                                                <div
                                                    className="absolute left-0 -top-10 bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-10
                                                        before:content-[''] before:absolute before:left-4 before:-bottom-2 before:border-8 before:border-x-transparent before:border-t-gray-800 before:border-b-transparent"
                                                >
                                                    설정하지 않으면 기본으로 이름이 표시됩니다
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            이름(변경 불가)
                                        </label>
                                        <input
                                            type="text"
                                            value={safeEditForm.name}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">자기소개</label>
                                    <textarea
                                        value={safeEditForm.introduce}
                                        onChange={(e) => setEditForm({ ...safeEditForm, introduce: e.target.value })}
                                        rows={3}
                                        placeholder="여행 스타일, 취미, 성격 등 자유롭게 적어주세요."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">개인 정보</h3>

                    {!isEditing ? (
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">생년월일</span>
                                <span className="text-gray-800">{safeProfile.birthDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">성별</span>
                                <span className="text-gray-800">
                                    {genderOptions.find((opt) => opt.value === safeProfile.gender)?.label || '비공개'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                                <input
                                    type="date"
                                    value={safeEditForm.birthDate}
                                    min="1900-01-01"
                                    max="2020-12-31"
                                    onChange={(e) => setEditForm({ ...safeEditForm, birthDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                                <select
                                    value={safeEditForm.gender ?? ''}
                                    onChange={(e) => setEditForm({ ...safeEditForm, gender: e.target.value as any })}
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

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">여행 취향</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">관심사</label>
                            {!isEditing ? (
                                <div className="flex flex-wrap gap-2">
                                    {(safeProfile.interests ?? []).map((interest: any) => (
                                        <span
                                            key={interest}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                                        >
                                            <span>{interest}</span>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {interestGroups.map((group) => (
                                            <div
                                                key={group.label}
                                                className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm"
                                            >
                                                <div className="font-semibold text-blue-700 mb-3 text-base">
                                                    {group.label}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {group.options.map((option) => {
                                                        const checked = safeEditForm.interests.includes(option)
                                                        return (
                                                            <label
                                                                key={option}
                                                                className={`flex items-center cursor-pointer px-3 py-1 rounded-full border transition
                                                                    ${
                                                                        checked
                                                                            ? 'bg-blue-500 text-white border-blue-500'
                                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                                                                    }
                                                                `}
                                                                style={{ userSelect: 'none' }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setEditForm({
                                                                                ...safeEditForm,
                                                                                interests: [
                                                                                    ...safeEditForm.interests,
                                                                                    option,
                                                                                ],
                                                                            })
                                                                        } else {
                                                                            setEditForm({
                                                                                ...safeEditForm,
                                                                                interests:
                                                                                    safeEditForm.interests.filter(
                                                                                        (i: string) => i !== option,
                                                                                    ),
                                                                            })
                                                                        }
                                                                    }}
                                                                    className="hidden"
                                                                />
                                                                <span className="text-sm">{option}</span>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="또는 직접 입력해주세요!"
                                                value={newInterest}
                                                onChange={(e) => setNewInterest(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick={handleAddCustomInterest}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                추가
                                            </button>
                                        </div>
                                    </div>

                                    {safeEditForm.interests.length > 0 && (
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                선택된 관심사 ({safeEditForm.interests.length}개)
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {safeEditForm.interests.map((interest, index) => (
                                                    <span
                                                        key={`${interest}-${index}`}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                                                    >
                                                        <span>{interest}</span>
                                                        <button
                                                            onClick={() => handleRemoveInterest(index)}
                                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계정 설정</h3>
                <div className="space-y-4">
                    <button
                        className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                        onClick={() => setShowPasswordChange((prev) => !prev)}
                    >
                        <div className="flex items-center space-x-3">
                            <i className="ri-lock-line text-gray-500"></i>
                            <span>비밀번호 변경</span>
                        </div>
                        <i className="ri-arrow-down-s-line text-gray-400"></i>
                    </button>
                    {showPasswordChange && (
                        <div className="mt-4 space-y-2">
                            <input
                                type="password"
                                placeholder="현재 비밀번호"
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value)
                                    setCurrentPasswordValid(null)
                                }}
                                onBlur={checkCurrentPassword}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            {currentPasswordValid === true && (
                                <div className="text-green-600 text-sm">비밀번호가 일치합니다.</div>
                            )}
                            {currentPasswordValid === false && (
                                <div className="text-red-500 text-sm">현재 비밀번호가 올바르지 않습니다.</div>
                            )}
                            <input
                                type="password"
                                placeholder="새 비밀번호"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value)
                                    validateNewPassword(e.target.value)
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            {newPasswordValid === true && (
                                <div className="text-green-600 text-sm">유효한 비밀번호입니다.</div>
                            )}
                            {newPasswordValid === false && (
                                <div className="text-red-500 text-sm">
                                    8자 이상, 영문+숫자, 특수기호를 모두 포함해야 합니다.
                                </div>
                            )}
                            <input
                                type="password"
                                placeholder="새 비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    setPasswordsMatch(e.target.value === newPassword)
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            {passwordsMatch === true && (
                                <div className="text-green-600 text-sm">비밀번호가 일치합니다.</div>
                            )}
                            {passwordsMatch === false && (
                                <div className="text-red-500 text-sm">비밀번호가 일치하지 않습니다.</div>
                            )}
                            {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
                            {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handlePasswordChange}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    disabled={!currentPasswordValid || !newPasswordValid || !passwordsMatch}
                                >
                                    저장
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPasswordChange(false)
                                        setCurrentPassword('')
                                        setNewPassword('')
                                        setConfirmPassword('')
                                        setPasswordError(null)
                                        setPasswordSuccess(null)
                                        setCurrentPasswordValid(null)
                                        setNewPasswordValid(null)
                                        setPasswordsMatch(null)
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    )}
                    <button
                        className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-between text-red-600"
                        onClick={handleDeleteAccount}
                    >
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
