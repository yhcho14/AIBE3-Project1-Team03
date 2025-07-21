import React from 'react'
import type { UserProfileType } from '../hooks/user/useUserProfileInfo'

interface PersonalInfoSectionProps {
    isEditing: boolean
    safeProfile: UserProfileType
    safeEditForm: UserProfileType
    setEditForm: (v: UserProfileType) => void
    genderOptions: { value: string; label: string }[]
}

export default function PersonalInfoSection({
    isEditing,
    safeProfile,
    safeEditForm,
    setEditForm,
    genderOptions,
}: PersonalInfoSectionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">개인 정보</h3>
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
    )
}
