import React from 'react'
import type { UserProfileType } from '../hooks/user/useUserProfileInfo'

interface ProfileHeaderProps {
    isEditing: boolean
    setIsEditing: (v: boolean) => void
    safeProfile: UserProfileType
    safeEditForm: UserProfileType
    setEditForm: (v: UserProfileType) => void
    isNicknameFocused: boolean
    setIsNicknameFocused: (v: boolean) => void
    nicknameError: string | null
    checkNicknameDuplicate: (nickname: string) => void
    handleImageUpload: (file: File) => void
    handleSave: () => void
    handleCancel: () => void
}

export default function ProfileHeader({
    isEditing,
    setIsEditing,
    safeProfile,
    safeEditForm,
    setEditForm,
    isNicknameFocused,
    setIsNicknameFocused,
    nicknameError,
    checkNicknameDuplicate,
    handleImageUpload,
    handleSave,
    handleCancel,
}: ProfileHeaderProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow p-8 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 ml-5">프로필</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
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
            <div className="flex items-start space-x-8">
                <div className="relative">
                    <div className="w-28 h-28 rounded-full border-4 border-blue-200 shadow flex items-center justify-center overflow-hidden bg-white">
                        {safeEditForm.profile_img ? (
                            <img
                                src={safeEditForm.profile_img}
                                alt="프로필 이미지"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-400 text-3xl font-bold">
                                {(safeEditForm.nickname || safeEditForm.name).charAt(0)}
                            </span>
                        )}
                    </div>
                    {isEditing && (
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
                            <p className="text-gray-700 whitespace-pre-line">{safeProfile.introduce}</p>
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
                                            onChange={(e) => setEditForm({ ...safeEditForm, nickname: e.target.value })}
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
    )
}
