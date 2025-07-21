import React from 'react'
import type { UserProfileType } from '../hooks/user/useUserProfileInfo'

const pastelBgMap: Record<string, string> = {
    '여행 스타일': 'bg-blue-50',
    '여행 테마': 'bg-green-50',
    '취미/활동': 'bg-pink-50',
}

interface TravelPreferenceSectionProps {
    isEditing: boolean
    safeProfile: UserProfileType
    safeEditForm: UserProfileType
    setEditForm: (v: UserProfileType) => void
    interestGroups: { label: string; options: string[] }[]
    newInterest: string
    setNewInterest: (v: string) => void
    handleAddCustomInterest: () => void
    handleRemoveInterest: (index: number) => void
}

export default function TravelPreferenceSection({
    isEditing,
    safeProfile,
    safeEditForm,
    setEditForm,
    interestGroups,
    newInterest,
    setNewInterest,
    handleAddCustomInterest,
    handleRemoveInterest,
}: TravelPreferenceSectionProps) {
    const selectedByGroup = interestGroups.map((group) => ({
        label: group.label,
        selected: (safeProfile.interests ?? []).filter((i) => group.options.includes(i)),
    }))

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">여행 취향</h3>
            <div className="space-y-4">
                {isEditing
                    ? interestGroups.map((group) => (
                          <div
                              key={group.label}
                              className={`rounded-xl p-4 border border-gray-200 shadow mb-2 ${
                                  pastelBgMap[group.label]
                              }`}
                          >
                              <div className="font-semibold text-gray-700 mb-2">{group.label}</div>
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
                                                              interests: [...safeEditForm.interests, option],
                                                          })
                                                      } else {
                                                          setEditForm({
                                                              ...safeEditForm,
                                                              interests: safeEditForm.interests.filter(
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
                              {isEditing && group.label === '취미/활동' && (
                                  <div className="mt-2 flex gap-2">
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
                              )}
                              {safeEditForm.interests.length > 0 && isEditing && group.label === '취미/활동' && (
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
                          </div>
                      ))
                    : selectedByGroup.map((group) => (
                          <div
                              key={group.label}
                              className={`rounded-xl p-4 border border-gray-200 shadow mb-2 ${
                                  pastelBgMap[group.label]
                              }`}
                          >
                              <div className="font-semibold text-gray-700 mb-2">{group.label}</div>
                              {group.selected.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                      {group.selected.map((interest) => (
                                          <span
                                              key={interest}
                                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                                          >
                                              <span>{interest}</span>
                                          </span>
                                      ))}
                                  </div>
                              ) : (
                                  <div className="text-gray-400 text-sm">선택된 관심사가 없습니다.</div>
                              )}
                          </div>
                      ))}
            </div>
        </div>
    )
}
