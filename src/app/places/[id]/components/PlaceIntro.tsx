import { CommonPlaceIntroInfo } from '../../../../lib/data/normalizePlaceIntroData'
import React from 'react'

interface PlaceIntroProps {
    additionalIntroData: CommonPlaceIntroInfo
}

interface InfoItemProps {
    icon: string // Remix Icon 클래스 이름을 문자열로 받음 (예: "ri-time-line")
    label: string
    value?: string
}

function InfoItem({ icon, label, value }: InfoItemProps) {
    // 값이 없거나 공백만 있는 경우 렌더링하지 않음
    if (!value || value.trim() === '') return null
    return (
        <p className="text-gray-700 mb-2 flex items-center gap-2">
            {/* 아이콘을 Remix Icon 클래스로 렌더링 */}
            <i className={`${icon} text-gray-500`}></i>
            <span className="font-semibold">{label}:</span>
            <span>{value}</span>
        </p>
    )
}

export default function PlaceIntro({ additionalIntroData }: PlaceIntroProps) {
    const data = additionalIntroData

    // 카테고리별 정보 정의
    const sections = [
        {
            title: '기본 정보',
            items: [
                { icon: 'ri-time-line', label: '이용 시간', value: data.usageTime },
                { icon: 'ri-calendar-line', label: '휴무일', value: data.restDate },
                { icon: 'ri-phone-line', label: '문의 및 안내', value: data.infoCenter },
                { icon: 'ri-book-open-line', label: '체험 안내', value: data.expGuide },
                { icon: 'ri-calendar-check-line', label: '개장일', value: data.openDate },
                { icon: 'ri-hourglass-line', label: '소요 시간', value: data.duration },
                { icon: 'ri-money-dollar-circle-line', label: '이용 요금', value: data.entranceFee },
                { icon: 'ri-ticket-line', label: '할인 정보', value: data.discountInfo },
                { icon: 'ri-bookmark-line', label: '예약 안내', value: data.reservationInfo },
                { icon: 'ri-links-line', label: '예약 홈페이지', value: data.reservationUrl },
                { icon: 'ri-building-line', label: '규모', value: data.scale },
                { icon: 'ri-refund-2-line', label: '환불 규정', value: data.refundRegulation },
                { icon: 'ri-cake-line', label: '개업일', value: data.establishmentDate },
                { icon: 'ri-toilet-line', label: '화장실 정보', value: data.restroomInfo },
            ],
        },
        {
            title: '편의시설 및 서비스',
            items: [
                { icon: 'ri-group-line', label: '수용 인원', value: data.capacity },
                { icon: 'ri-baby-carriage-line', label: '유모차 대여', value: data.strollerRental },
                { icon: 'ri-footprint-line', label: '애완동물 동반', value: data.petFriendly },
                { icon: 'ri-user-star-line', label: '가능 연령', value: data.ageLimit },
                { icon: 'ri-child-line', label: '어린이 놀이방', value: data.kidsFacility },
                { icon: 'ri-kitchen-line', label: '객실 내 취사', value: data.cookingAllowed },
                { icon: 'ri-car-line', label: '픽업 서비스', value: data.pickupService },
                { icon: 'ri-door-line', label: '객실 수', value: data.roomCount },
                { icon: 'ri-home-4-line', label: '객실 유형', value: data.roomType },
                { icon: 'ri-smoking-line', label: '금연/흡연', value: data.smokingAllowed },
                { icon: 'ri-archive-line', label: '포장 가능', value: data.packagingAvailable },
                { icon: 'ri-seat-line', label: '좌석 수', value: data.seatCount },
            ],
        },
        {
            title: '부대시설',
            items: [
                { icon: 'ri-building-3-line', label: '기타 부대시설', value: data.amenities },
                { icon: 'ri-fire-line', label: '바비큐장', value: data.barbecue },
                { icon: 'ri-sparkling-2-line', label: '뷰티 시설', value: data.beauty },
                { icon: 'ri-cup-line', label: '식음료장', value: data.beverage },
                { icon: 'ri-bike-line', label: '자전거 대여', value: data.bicycle },
                { icon: 'ri-tent-line', label: '캠프파이어', value: data.campfire },
                { icon: 'ri-dumbbell-line', label: '피트니스 센터', value: data.fitness },
                { icon: 'ri-mic-line', label: '노래방', value: data.karaoke },
                { icon: 'ri-shower-line', label: '공용 샤워실', value: data.publicBath },
                { icon: 'ri-computer-line', label: '공용 PC실', value: data.publicPc },
                { icon: 'ri-mist-line', label: '사우나', value: data.sauna },
                { icon: 'ri-presentation-line', label: '세미나실', value: data.seminar },
                { icon: 'ri-ping-pong-line', label: '스포츠 시설', value: data.sports },
            ],
        },
        {
            title: '주차 정보',
            items: [
                { icon: 'ri-parking-box-line', label: '주차 시설', value: data.parkingFacility },
                { icon: 'ri-coupon-line', label: '주차 요금', value: data.parkingFee },
            ],
        },
        {
            title: '결제 수단',
            items: [{ icon: 'ri-bank-card-line', label: '신용카드 가능', value: data.creditCardAccepted }],
        },
        {
            title: '기타 상세 정보',
            items: [
                { icon: 'ri-globe-line', label: '세계 문화유산', value: data.heritage1 },
                { icon: 'ri-globe-line', label: '세계 자연유산', value: data.heritage2 },
                { icon: 'ri-globe-line', label: '세계 기록유산', value: data.heritage3 },
                { icon: 'ri-map-pin-line', label: '행사 장소', value: data.eventPlace },
                { icon: 'ri-bill-line', label: '행사 프로그램', value: data.eventProgram },
                { icon: 'ri-user-settings-line', label: '주최자', value: data.sponsor1 },
                { icon: 'ri-phone-line', label: '주최자 연락처', value: data.sponsor1Tel },
                { icon: 'ri-user-settings-line', label: '주관사', value: data.sponsor2 },
                { icon: 'ri-phone-line', label: '주관사 연락처', value: data.sponsor2Tel },
                { icon: 'ri-global-line', label: '행사 홈페이지', value: data.eventHomepage },
                { icon: 'ri-calendar-2-line', label: '행사 시작일', value: data.eventStartDate },
                { icon: 'ri-calendar-2-line', label: '행사 종료일', value: data.eventEndDate },
                { icon: 'ri-medal-line', label: '축제 등급', value: data.festivalGrade },
                { icon: 'ri-navigation-line', label: '행사장 위치', value: data.eventLocationInfo },
                { icon: 'ri-bookmark-line', label: '부대 행사', value: data.subEvent },
                { icon: 'ri-shopping-bag-line', label: '판매 품목', value: data.saleItems },
                { icon: 'ri-money-dollar-circle-line', label: '품목별 가격', value: data.saleItemCost },
                { icon: 'ri-compass-line', label: '매장 안내', value: data.shopGuide },
                { icon: 'ri-link', label: '문화센터 링크', value: data.cultureCenterLink },
                { icon: 'ri-calendar-event-line', label: '장서는 날', value: data.marketFairDay },
                { icon: 'ri-restaurant-line', label: '대표 메뉴', value: data.firstMenu },
                { icon: 'ri-book-open-line', label: '취급 메뉴', value: data.mainTreatMenu },
                { icon: 'ri-file-text-line', label: '인허가 번호', value: data.licenseNo },
                { icon: 'ri-road-map-line', label: '코스 총 거리', value: data.courseDistance },
                { icon: 'ri-calendar-todo-line', label: '코스 일정', value: data.courseSchedule },
                { icon: 'ri-leaf-line', label: '코스 테마', value: data.courseTheme },
                { icon: 'ri-login-box-line', label: '입실 시간', value: data.checkinTime },
                { icon: 'ri-logout-box-line', label: '퇴실 시간', value: data.checkoutTime },
                { icon: 'ri-restaurant-2-line', label: '식음료장', value: data.foodPlace },
            ],
        },
    ]

    return (
        <div className="max-w-5xl mx-auto">
            {sections.map((section) => {
                const visibleItems = section.items.filter((row) => row.value && row.value.trim() !== '')
                if (visibleItems.length === 0) return null
                return (
                    <div key={section.title} className="mb-4 border border-gray-200 rounded-xl bg-white p-2">
                        <h4 className="text-base font-semibold text-gray-800 m-2 pl-1">{section.title}</h4>
                        <table className="w-full overflow-hidden table-fixed">
                            <colgroup>
                                <col style={{ width: '12rem' }} />
                                <col />
                            </colgroup>
                            <tbody>
                                {visibleItems.map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-2 py-1 whitespace-nowrap text-base align-middle flex items-center gap-2">
                                            {row.icon ? (
                                                <i
                                                    className={`${row.icon} text-gray-200`}
                                                    style={{ minWidth: '1.5rem', textAlign: 'center' }}
                                                />
                                            ) : (
                                                <span style={{ display: 'inline-block', minWidth: '1.5rem' }} />
                                            )}
                                            {row.label}
                                        </td>
                                        <td className="px-2 py-1 text-base whitespace-pre-wrap align-middle">
                                            {row.value?.replace(/<br\s*\/?>/g, '\n')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            })}
        </div>
    )
}
