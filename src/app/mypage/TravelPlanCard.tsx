'use client'

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

interface TravelPlanCardProps {
    plan: TravelPlan
    onEdit: (plan: TravelPlan) => void
    onStatusChange: (planId: number, newStatus: 'confirmed' | 'completed') => void
    onDetailView: (planId: number) => void
    onDelete: (planId: number) => void
    getStatusColor: (status: string) => string
    getStatusText: (status: string) => string
}

export default function TravelPlanCard({
    plan,
    onEdit,
    onStatusChange,
    onDetailView,
    onDelete,
    getStatusColor,
    getStatusText,
}: TravelPlanCardProps) {
    const handleConfirm = () => {
        onStatusChange(plan.id, 'confirmed')
    }

    const handleComplete = () => {
        onStatusChange(plan.id, 'completed')
    }

    const handleDetailView = () => {
        onDetailView(plan.id)
    }

    const handleDelete = () => {
        if (
            window.confirm(
                `"${plan.title}" 여행을 정말로 삭제하시겠습니까?\n\n삭제된 여행과 관련 일정은 복구할 수 없습니다.`,
            )
        ) {
            onDelete(plan.id)
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                            {getStatusText(plan.status)}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <i className="ri-calendar-line text-blue-500"></i>
                            <span>
                                {plan.startDate} ~ {plan.endDate}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i className="ri-time-line text-green-500"></i>
                            <span>{plan.durationDays}일</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i className="ri-train-line text-purple-500"></i>
                            <span>{plan.transportation || '미정'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <i className="ri-wallet-line text-orange-500"></i>
                            <span>{plan.estimatedCost.toLocaleString()}원</span>
                        </div>
                    </div>
                    {plan.destination && (
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                            <i className="ri-map-pin-line text-red-500"></i>
                            <span>{plan.destination}</span>
                        </div>
                    )}
                    {plan.accommodation && (
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                            <i className="ri-hotel-line text-pink-500"></i>
                            <span>{plan.accommodation}</span>
                        </div>
                    )}
                    {plan.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{plan.notes}</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                    <button
                        onClick={() => onEdit(plan)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
                    >
                        <i className="ri-edit-line mr-1"></i>
                        수정
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="여행 삭제"
                    >
                        <i className="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">생성일: {plan.createdAt}</div>
                <div className="flex space-x-2">
                    {plan.status === 'draft' && (
                        <button
                            onClick={handleConfirm}
                            className="px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors whitespace-nowrap"
                        >
                            확정하기
                        </button>
                    )}
                    {plan.status === 'confirmed' && (
                        <button
                            onClick={handleComplete}
                            className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs hover:bg-purple-600 transition-colors whitespace-nowrap"
                        >
                            여행 완료
                        </button>
                    )}
                    <button
                        onClick={handleDetailView}
                        className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs hover:bg-gray-300 transition-colors whitespace-nowrap"
                    >
                        상세보기
                    </button>
                </div>
            </div>
        </div>
    )
}
