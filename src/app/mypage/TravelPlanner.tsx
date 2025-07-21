'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import EditPlanModal from './EditPlanModal'
import TravelPlanCard from './TravelPlanCard'

interface TravelPlan {
    id: number
    title: string
    destination?: string
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

interface TravelPlannerProps {
    onDetailView: (travelId: number) => void
}

export default function TravelPlanner({ onDetailView }: TravelPlannerProps) {
    const [loading, setLoading] = useState(true)
    const [plans, setPlans] = useState<TravelPlan[]>([])
    //const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingPlan, setEditingPlan] = useState<TravelPlan | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [newPlan, setNewPlan] = useState<Partial<TravelPlan>>({
        title: '',
        destination: '',
        numTravelers: 0,
        startDate: '',
        endDate: '',
        transportation: '',
        //accommodation: '',
        estimatedCost: 0,
        notes: '',
    })

    useEffect(() => {
        const fetchPlans = async () => {
            // 1. 현재 로그인된 사용자 가져오기
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser()

            if (authError || !user) {
                console.error('로그인한 유저 정보를 가져오는 데 실패했습니다:', authError?.message)
                setLoading(false)
                return
            }

            const userId = user.id
            console.log('현재 로그인한 유저 ID:', userId)
            // 2. 해당 유저의 여행 계획 불러오기
            const { data, error } = await supabase.from('travel').select('*').eq('user_id', userId)

            const travelPlans: TravelPlan[] = (data ?? []).map((item) => ({
                id: item.id,
                title: item.title,
                destination: item.destination,
                numTravelers: item.num_travelers,
                startDate: new Date(item.start_date).toISOString().slice(0, 10),
                endDate: new Date(item.end_date).toISOString().slice(0, 10),
                durationDays: item.travel_duration,
                transportation: item.transportation,
                accommodation: item.accommodation,
                estimatedCost: item.budget,
                notes: item.note,
                createdAt: new Date(item.created_at).toISOString().slice(0, 10),
                status: item.status,
                schedule: [
                    {
                        title: item.title,
                        startTime: new Date(item.start_date + 'T10:00:00'),
                        endTime: new Date(item.end_date + 'T18:00:00'),
                        note: item.notes,
                    },
                ],
            }))

            if (error) {
                console.error('여행 데이터 가져오기 실패:', error.message)
            } else {
                console.log('여행 데이터 가져오기 성공:', data)
                // 여행 시작일 기준 내림차순 정렬 (최신 여행이 위로)
                const sortedPlans = travelPlans.sort((a, b) => {
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                })
                setPlans(sortedPlans)
            }

            setLoading(false)
        }

        fetchPlans()
    }, [])

    const calculateDuration = (start: string, end: string) => {
        if (!start || !end) return 0
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }

    const handleCreatePlan = async () => {
        if (!newPlan.title || !newPlan.startDate || !newPlan.endDate) {
            alert('필수 정보를 모두 입력해주세요.')
            return
        }

        try {
            // 1. 현재 로그인된 사용자 가져오기
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser()

            if (authError || !user) {
                console.error('로그인한 유저 정보를 가져오는 데 실패했습니다:', authError?.message)
                alert('로그인이 필요합니다.')
                return
            }

            // 2. supabase에 저장할 데이터 준비
            const travelData = {
                user_id: user.id,
                title: newPlan.title,
                destination: newPlan.destination || null,
                num_travelers: newPlan.numTravelers || 1,
                start_date: newPlan.startDate,
                end_date: newPlan.endDate,
                travel_duration: calculateDuration(newPlan.startDate || '', newPlan.endDate || ''),
                transportation: newPlan.transportation || null,
                accommodation: newPlan.accommodation || null,
                budget: newPlan.estimatedCost || 0,
                note: newPlan.notes || null,
                status: 'draft',
            }

            // 3. supabase travel 테이블에 삽입
            const { data, error } = await supabase.from('travel').insert([travelData]).select()

            if (error) {
                console.error('여행 계획 저장 실패:', error.message)
                alert('여행 계획 저장에 실패했습니다. 다시 시도해주세요.')
                return
            }

            if (data && data.length > 0) {
                // 4. 저장된 데이터로 로컬 상태 업데이트
                const savedPlan = data[0]
                const plan: TravelPlan = {
                    id: savedPlan.id,
                    title: savedPlan.title,
                    destination: savedPlan.destination,
                    numTravelers: savedPlan.num_travelers,
                    startDate: new Date(savedPlan.start_date).toISOString().slice(0, 10),
                    endDate: new Date(savedPlan.end_date).toISOString().slice(0, 10),
                    durationDays: savedPlan.travel_duration,
                    transportation: savedPlan.transportation,
                    accommodation: savedPlan.accommodation,
                    estimatedCost: savedPlan.budget,
                    notes: savedPlan.note,
                    createdAt: new Date(savedPlan.created_at).toISOString().slice(0, 10),
                    status: savedPlan.status,
                    schedule: [
                        {
                            title: savedPlan.title,
                            startTime: new Date(savedPlan.start_date + 'T10:00:00'),
                            endTime: new Date(savedPlan.end_date + 'T18:00:00'),
                            note: savedPlan.note || '',
                        },
                    ],
                }

                // 새 여행을 추가하고 날짜순으로 정렬
                const newPlans = [plan, ...plans].sort((a, b) => {
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                })
                setPlans(newPlans)
                console.log('여행 계획 저장 성공:', savedPlan)
                alert('여행 계획이 성공적으로 저장되었습니다!')
            }
        } catch (err) {
            console.error('예외 발생:', err)
            alert('여행 계획 저장 중 오류가 발생했습니다.')
            return
        }

        // 5. 입력 폼 초기화
        setNewPlan({
            title: '',
            destination: '',
            numTravelers: 0,
            startDate: '',
            endDate: '',
            transportation: '',
            accommodation: '',
            estimatedCost: 0,
            notes: '',
        })
        setIsCreating(false)
    }

    const handleEditClick = (plan: TravelPlan) => {
        setEditingPlan(plan)
        setIsEditing(true)
    }

    const handleUpdatePlan = (updatedPlan: TravelPlan) => {
        const updatedPlans = plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
        // 수정 후 날짜순으로 정렬
        const sortedPlans = updatedPlans.sort((a, b) => {
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        })
        setPlans(sortedPlans)
        setIsEditing(false)
        setEditingPlan(null)
    }

    const handleStatusChange = async (planId: number, newStatus: 'confirmed' | 'completed') => {
        try {
            const { error } = await supabase.from('travel').update({ status: newStatus }).eq('id', planId)

            if (error) {
                console.error('상태 업데이트 실패:', error.message)
                alert('상태 변경에 실패했습니다. 다시 시도해주세요.')
                return
            }

            // 로컬 상태 업데이트 후 날짜순으로 정렬
            const updatedPlans = plans.map((plan) => (plan.id === planId ? { ...plan, status: newStatus } : plan))
            const sortedPlans = updatedPlans.sort((a, b) => {
                return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            })
            setPlans(sortedPlans)

            console.log('상태 업데이트 성공:', { planId, newStatus })
            alert(newStatus === 'confirmed' ? '여행이 확정되었습니다!' : '여행이 완료되었습니다!')
        } catch (err) {
            console.error('예외 발생:', err)
            alert('상태 변경 중 오류가 발생했습니다.')
        }
    }

    const handleDeletePlan = async (planId: number) => {
        try {
            // 1. 관련 여행 일정들 먼저 삭제
            const { error: scheduleError } = await supabase.from('travel_schedule').delete().eq('travel_id', planId)

            if (scheduleError) {
                console.error('여행 일정 삭제 실패:', scheduleError.message)
                alert('여행 일정 삭제에 실패했습니다.')
                return
            }

            // 2. 여행 계획 삭제
            const { error } = await supabase.from('travel').delete().eq('id', planId)

            if (error) {
                console.error('여행 계획 삭제 실패:', error.message)
                alert('여행 계획 삭제에 실패했습니다. 다시 시도해주세요.')
                return
            }

            // 3. 로컬 상태에서 삭제
            const updatedPlans = plans.filter((plan) => plan.id !== planId)
            setPlans(updatedPlans)

            console.log('여행 계획 삭제 성공:', planId)
            alert('여행이 성공적으로 삭제되었습니다.')
        } catch (err) {
            console.error('예외 발생:', err)
            alert('여행 삭제 중 오류가 발생했습니다.')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-yellow-100 text-yellow-800'
            case 'confirmed':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'draft':
                return '임시저장'
            case 'confirmed':
                return '확정'
            case 'completed':
                return '완료'
            default:
                return '알 수 없음'
        }
    }
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">여행 플래너</h2>
                    <p className="text-gray-600 mt-1">새로운 여행을 계획하고 관리하세요</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap"
                >
                    <i className="ri-add-line"></i>
                    <span>새 계획 추가</span>
                </button>
            </div>

            {/* Create New Plan Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">새 여행 계획</h3>
                            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">여행 제목</label>
                                <input
                                    type="text"
                                    value={newPlan.title || ''}
                                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                                    placeholder="예: 부산 바다 여행"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">여행지</label>
                                <input
                                    type="text"
                                    value={newPlan.destination || ''}
                                    onChange={(e) => setNewPlan({ ...newPlan, destination: e.target.value })}
                                    placeholder="예: 부산, 제주도, 경주"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">여행 인원</label>
                                <input
                                    type="number"
                                    value={newPlan.numTravelers || ''}
                                    onChange={(e) => setNewPlan({ ...newPlan, numTravelers: parseInt(e.target.value) })}
                                    placeholder="예: 4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                                    <input
                                        type="date"
                                        value={newPlan.startDate || ''}
                                        onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                                    <input
                                        type="date"
                                        value={newPlan.endDate || ''}
                                        onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">교통편</label>
                                <input
                                    type="text"
                                    value={newPlan.transportation || ''}
                                    onChange={(e) => setNewPlan({ ...newPlan, transportation: e.target.value })}
                                    placeholder="예: KTX, 항공편, 자차"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">숙박</label>
                                <input
                                    type="text"
                                    value={newPlan.accommodation || ''}
                                    onChange={(e) => setNewPlan({ ...newPlan, accommodation: e.target.value })}
                                    placeholder="예: 호텔, 펜션, 게스트하우스"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">예상 비용 (원)</label>
                                <input
                                    type="number"
                                    value={newPlan.estimatedCost || ''}
                                    onChange={(e) =>
                                        setNewPlan({ ...newPlan, estimatedCost: parseInt(e.target.value) })
                                    }
                                    placeholder="예: 500000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                                <textarea
                                    value={newPlan.notes || ''}
                                    onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                                    rows={3}
                                    placeholder="여행에 대한 메모를 남겨주세요"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleCreatePlan}
                                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <EditPlanModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                plan={editingPlan}
                onSave={handleUpdatePlan}
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold">{plans.length}</div>
                            <div className="text-blue-100">총 계획</div>
                        </div>
                        <i className="ri-calendar-line text-3xl text-blue-200"></i>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold">{plans.filter((p) => p.status === 'draft').length}</div>
                            <div className="text-yellow-100">임시저장된 계획</div>
                        </div>
                        <i className="ri-draft-line text-3xl text-yellow-200"></i>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold">
                                {plans.filter((p) => p.status === 'confirmed').length}
                            </div>
                            <div className="text-green-100">확정된 계획</div>
                        </div>
                        <i className="ri-check-line text-3xl text-green-200"></i>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold">
                                {plans.filter((p) => p.status === 'completed').length}
                            </div>
                            <div className="text-purple-100">완료된 여행</div>
                        </div>
                        <i className="ri-suitcase-2-line text-3xl text-purple-200"></i>
                    </div>
                </div>
            </div>

            {/* Plans List */}
            <div className="space-y-4">
                {plans.map((plan) => (
                    <TravelPlanCard
                        key={plan.id}
                        plan={plan}
                        onEdit={handleEditClick}
                        onStatusChange={handleStatusChange}
                        onDetailView={onDetailView}
                        onDelete={handleDeletePlan}
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                    />
                ))}
            </div>

            {/* Empty State */}
            {plans.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-calendar-line text-gray-400 text-4xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">여행 계획이 없습니다</h3>
                    <p className="text-gray-600 mb-6">새로운 여행을 계획해보세요!</p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                        첫 여행 계획하기
                    </button>
                </div>
            )}

            {/* AI Recommendation Section */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">AI 여행 추천</h3>
                        <p className="text-purple-100">
                            메인페이지에서 받은 AI 추천을 바탕으로 자동으로 여행 계획을 생성해보세요
                        </p>
                    </div>
                    <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium whitespace-nowrap">
                        <i className="ri-magic-line mr-2"></i>
                        AI 추천 받기
                    </button>
                </div>
            </div>
        </div>
    )
}
