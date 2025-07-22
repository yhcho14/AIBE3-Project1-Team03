import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import useAddToTravel from '../../../hooks/useAddToTravel'

interface AddToTravelButtonProps {
    placeId: string
    placeName?: string
    className?: string
}

const TravelDetail = dynamic(() => import('../../mypage/TravelDetail'), { ssr: false })

export default function AddToTravelButton({ placeId, placeName, className }: AddToTravelButtonProps) {
    const [hovered, setHovered] = useState(false)
    const [modalStep, setModalStep] = useState<'select' | 'add'>('select')
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
    const { isModalOpen, travelPlans, isLoading, user, openAddToTravelModal, closeModal } = useAddToTravel({
        placeTitle: placeName || '',
    })

    // 새 계획 만들러 가기
    const goToMyPage = () => {
        window.location.href = '/mypage'
    }

    // 새 일정 추가하기 버튼 클릭
    const handleAddEvent = () => {
        setModalStep('add')
    }

    // 모달 닫기 시 상태 초기화
    const handleCloseModal = () => {
        closeModal()
        setModalStep('select')
        setSelectedPlanId(null)
    }

    // 카드 클릭 핸들러
    const handlePlanSelect = (planId: number) => {
        setSelectedPlanId(planId)
    }

    return (
        <>
            <div
                className={`rounded-full flex items-center text-gray-600 bg-white/90 hover:bg-white overflow-hidden cursor-pointer group transition-all duration-300 justify-center
                    ${hovered ? 'w-36 px-4' : 'w-8 px-0'}
                    ${className || ''}
                `}
                style={{ minWidth: 32, height: 32 }}
                onClick={(e) => {
                    e.stopPropagation()
                    openAddToTravelModal()
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {hovered ? (
                    <span className="text-sm whitespace-nowrap">내 여행에 추가하기</span>
                ) : (
                    <i className="ri-add-line text-sm"></i>
                )}
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className={`bg-white rounded-xl p-6 mx-4 overflow-y-auto relative transition-all duration-300
                        ${modalStep === 'add' ? 'max-w-3xl w-full max-h-[95vh]' : 'max-w-md w-full max-h-[90vh]'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <i className="ri-close-line text-xl"></i>
                        </button>
                        {modalStep === 'select' && (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">여행 계획 선택</h3>
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <i className="ri-loader-4-line text-3xl text-blue-500 animate-spin mb-2"></i>
                                        <span className="text-gray-600">여행 계획을 불러오는 중...</span>
                                    </div>
                                ) : travelPlans.length === 0 ? (
                                    <div className="text-center py-8">
                                        <i className="ri-calendar-line text-4xl text-gray-300 mb-2"></i>
                                        <p className="text-gray-500">진행중인 여행 계획이 없습니다.</p>
                                        <button
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            onClick={goToMyPage}
                                        >
                                            새 계획 만들러 가기
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-600 mb-4">
                                            &quot;{placeName}&quot;을(를) 추가할 여행 계획을 선택해주세요.
                                        </p>
                                        <div className="space-y-2 mb-6">
                                            {travelPlans.map((plan) => (
                                                <div
                                                    key={plan.id}
                                                    className={`p-3 border rounded-lg cursor-pointer transition-colors flex flex-col ${
                                                        selectedPlanId === plan.id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => handlePlanSelect(plan.id)}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="font-medium text-gray-900">{plan.title}</div>
                                                        {plan.destination && (
                                                            <div className="text-xs px-2 py-1 rounded-full inline-flex items-center bg-gray-100 text-gray-500">
                                                                <i className="ri-map-pin-line mr-1 text-blue-400 text-xs"></i>
                                                                {plan.destination}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {plan.start_date} ~ {plan.end_date}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                                                selectedPlanId
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                            disabled={!selectedPlanId}
                                            onClick={handleAddEvent}
                                        >
                                            새 일정 추가하기
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                        {modalStep === 'add' && selectedPlanId && (
                            <div className="pt-2">
                                <div className="text-xl font-bold text-gray-900 mb-2">
                                    &quot;{placeName}&quot;을(를) 일정에 추가해보세요.
                                </div>
                                <div className="border-b border-gray-200 mb-4"></div>
                                <Suspense
                                    fallback={
                                        <div className="py-8 text-center text-gray-500">
                                            일정 추가 화면을 불러오는 중...
                                        </div>
                                    }
                                >
                                    <TravelDetail selectedTravelId={selectedPlanId} />
                                </Suspense>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
