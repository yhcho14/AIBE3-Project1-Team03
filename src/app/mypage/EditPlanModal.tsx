'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface TravelPlan {
    id: number
    title: string
    numTravelers: number
    startDate: string
    endDate: string
    durationDays: number
    transportation: string
    accommodation: string
    estimatedCost: number
    notes: string
    createdAt: string
    status: 'draft' | 'confirmed' | 'completed'
    schedule?: {
        title: string
        startTime: Date
        endTime: Date
        note: string
    }[]
}

interface EditPlanModalProps {
    isOpen: boolean
    onClose: () => void
    plan: TravelPlan | null
    onSave: (updatedPlan: TravelPlan) => void
}

export default function EditPlanModal({ isOpen, onClose, plan, onSave }: EditPlanModalProps) {
    const [editedPlan, setEditedPlan] = useState<TravelPlan | null>(plan)

    useEffect(() => {
        setEditedPlan(plan)
    }, [plan])

    if (!isOpen || !editedPlan) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        let processedValue: string | number = value

        if (name === 'numTravelers' || name === 'estimatedCost') {
            processedValue = parseInt(value, 10) || 0
        }

        const newPlan = { ...editedPlan, [name]: processedValue }

        if (name === 'startDate' || name === 'endDate') {
            const newStartDate = name === 'startDate' ? value : newPlan.startDate
            const newEndDate = name === 'endDate' ? value : newPlan.endDate
            const diffTime = Math.abs(new Date(newEndDate).getTime() - new Date(newStartDate).getTime())
            newPlan.durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        }

        setEditedPlan(newPlan)
    }

    const handleSave = async () => {
        if (!editedPlan || !plan) return

        const updatedFields: { [key: string]: any } = {}

        const fieldMap: { [key: string]: string } = {
            title: 'title',
            numTravelers: 'num_travelers',
            startDate: 'start_date',
            endDate: 'end_date',
            durationDays: 'travel_duration',
            transportation: 'transportation',
            accommodation: 'accommodation',
            estimatedCost: 'budget',
            notes: 'note',
            status: 'status',
        }

        for (const key in editedPlan) {
            if (editedPlan[key as keyof TravelPlan] !== plan[key as keyof TravelPlan]) {
                const dbField = fieldMap[key]
                if (dbField) {
                    updatedFields[dbField] = editedPlan[key as keyof TravelPlan]
                }
            }
        }

        if (Object.keys(updatedFields).length > 0) {
            try {
                const { error } = await supabase.from('travel').update(updatedFields).eq('id', plan.id)

                if (error) {
                    console.error('업데이트 실패:', error.message)
                } else {
                    console.log('업데이트 성공:', updatedFields)
                    onSave({ ...plan, ...editedPlan }) // 업데이트된 값으로 반영
                }
            } catch (err) {
                console.error('예외 발생:', err)
            }
        } else {
            console.log('변경 사항이 없습니다.')
            onSave(plan)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">여행 계획 수정</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">여행 제목</label>
                        <input
                            type="text"
                            name="title"
                            value={editedPlan.title || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">여행 인원</label>
                        <input
                            type="number"
                            name="numTravelers"
                            value={editedPlan.numTravelers || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                            <input
                                type="date"
                                name="startDate"
                                value={editedPlan.startDate || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                            <input
                                type="date"
                                name="endDate"
                                value={editedPlan.endDate || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">교통편</label>
                        <input
                            type="text"
                            name="transportation"
                            value={editedPlan.transportation || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">숙박</label>
                        <input
                            type="text"
                            name="accommodation"
                            value={editedPlan.accommodation || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">예상 비용 (원)</label>
                        <input
                            type="number"
                            name="estimatedCost"
                            value={editedPlan.estimatedCost || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                        <textarea
                            name="notes"
                            value={editedPlan.notes || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    )
}
