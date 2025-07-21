import {
    AttractionIntroData,
    CultureIntroData,
    EventIntroData,
    CourseIntroData,
    RecreationIntroData,
    AccommodationIntroData,
    ShoppingIntroData,
    RestaurantIntroData,
    AllIntroData, // 이전에 정의한 모든 IntroData 유니온 타입
} from '../types/placeDetailType' // 타입 정의 경로 확인

/**
 * 정규화된 공통 장소 소개 정보 인터페이스
 * - 모든 content type ID의 intro 데이터에서 공통되거나 유사한 필드를 표준화된 이름으로 정의합니다.
 * - 이 인터페이스는 렌더링 시 카테고리별 그룹핑에 활용될 수 있도록 필드를 포함합니다.
 */
export interface CommonPlaceIntroInfo {
    // --- 기본 정보 ---
    // 공통적으로 사용되는 이용 시간 (usetime, usetimeculture, opentime, usetimeleports, playtime 등)
    usageTime?: string
    // 공통적으로 사용되는 휴무일 (restdate, restdateculture, restdateleports, restdateshopping, restdatefood 등)
    restDate?: string
    // 공통적으로 사용되는 문의 및 안내 (infocenter, infocenterculture, infocenterleports, infocentershopping, infocenterfood 등)
    infoCenter?: string
    // 체험 안내 (expguide) - AttractionIntroData
    expGuide?: string
    // 개장일 (opendate, opendatefood, opendateshopping, openperiod 등)
    openDate?: string
    // 관람/체험/코스 총 소요 시간 (spendtime, spendtimefestival, taketime)
    duration?: string
    // 이용 요금/입장료 (usefee, usefeeleports, usetimefestival 등)
    entranceFee?: string
    // 할인 정보 (discountinfo, discountinfofestival, discountinfofood 등)
    discountInfo?: string
    // 예약 안내 (reservation, reservationlodging, reservationfood, bookingplace 등)
    reservationInfo?: string
    // 예약 URL (reservationurl) - AccommodationIntroData
    reservationUrl?: string
    // 규모 (scale, scalelodging, scaleshopping, scalefood, scaleleports 등)
    scale?: string
    // 환불 규정 (refundregulation) - AccommodationIntroData
    refundRegulation?: string
    // 개업일 (opendatefood) - RestaurantIntroData
    establishmentDate?: string
    // 화장실 설명 (restroom) - ShoppingIntroData
    restroomInfo?: string

    // --- 편의시설 및 서비스 ---
    // 수용 인원 (accomcount, accomcountculture, accomcountleports, accomcountlodging 등)
    capacity?: string
    // 유모차 대여 정보 (chkbabycarriage, chkbabycarriageculture, chkbabycarriageleports, chkbabycarriageshopping 등)
    strollerRental?: string
    // 애완동물 동반 가능 정보 (chkpet, chkpetculture, chkpetleports, chkpetshopping 등)
    petFriendly?: string
    // 체험/관람 가능 연령 (expagerange, agelimit, expagerangeleports 등)
    ageLimit?: string
    // 어린이 놀이방 여부 (kidsfacility) - RestaurantIntroData
    kidsFacility?: string
    // 객실 내 취사 여부 (chkcooking) - AccommodationIntroData
    cookingAllowed?: string
    // 픽업 서비스 (pickup) - AccommodationIntroData
    pickupService?: string
    // 객실 수 (roomcount) - AccommodationIntroData
    roomCount?: string
    // 객실 유형 (roomtype) - AccommodationIntroData
    roomType?: string
    // 금연/흡연 여부 (smoking) - RestaurantIntroData
    smokingAllowed?: string
    // 포장 가능 (packing) - RestaurantIntroData
    packagingAvailable?: string
    // 좌석 수 (seat) - RestaurantIntroData
    seatCount?: string

    // --- 부대시설 --- (subfacility와 상세 부대시설 포함)
    // 부대시설 (subfacility) - AccommodationIntroData (숙박에만 있는 필드이지만, 공통적으로 편의시설/서비스에 포함될 수 있음)
    amenities?: string
    barbecue?: string // 바비큐장여부 - AccommodationIntroData
    beauty?: string // 뷰티시설정보 - AccommodationIntroData
    beverage?: string // 식음료장여부 - AccommodationIntroData
    bicycle?: string // 자전거대여여부 - AccommodationIntroData
    campfire?: string // 캠프파이어여부 - AccommodationIntroData
    fitness?: string // 휘트니스센터여부 - AccommodationIntroData
    karaoke?: string // 노래방여부 - AccommodationIntroData
    publicBath?: string // 공용샤워실여부 - AccommodationIntroData
    publicPc?: string // 공용 PC실여부 - AccommodationIntroData
    sauna?: string // 사우나실여부 - AccommodationIntroData
    seminar?: string // 세미나실여부 - AccommodationIntroData
    sports?: string // 스포츠시설여부 - AccommodationIntroData

    // --- 주차 ---
    // 주차시설 (parking, parkingculture, parkingleports, parkingshopping, parkingfood 등)
    parkingFacility?: string
    // 주차요금 (parkingfee, parkingfeeleports 등)
    parkingFee?: string

    // --- 결제수단 ---
    // 신용카드 가능 정보 (chkcreditcard, chkcreditcardculture, chkcreditcardleports, chkcreditcardfood 등)
    creditCardAccepted?: string

    // --- 기타 특정 타입 고유 정보 --- (콘텐츠 타입별 고유한 정보)
    // 관광지: 세계유산 정보 (heritage1, heritage2, heritage3)
    heritage1?: string // 세계문화유산유무
    heritage2?: string // 세계자연유산유무
    heritage3?: string // 세계기록유산유무

    // 행사: (eventenddate, eventhomepage, eventplace, eventstartdate, festivalgrade, placeinfo, playtime, program, sponsor1, sponsor1tel, sponsor2, sponsor2tel, subevent, spendtimefestival)
    eventPlace?: string // 행사장소
    eventProgram?: string // 행사프로그램
    sponsor1?: string // 주최자정보
    sponsor1Tel?: string // 주최자연락처
    sponsor2?: string // 주관사정보
    sponsor2Tel?: string // 주관사연락처
    eventEndDate?: string // 행사종료일
    eventHomepage?: string // 행사홈페이지
    eventStartDate?: string // 행사시작일
    festivalGrade?: string // 축제등급
    eventLocationInfo?: string // 행사장위치안내 (placeinfo)
    subEvent?: string // 부대행사 (subevent)

    // 쇼핑: (chkbabycarriageshopping, chkcreditcard, chkpet, culturecenter, fairday, infocentershopping, opendateshopping, opentime, parkingshopping, restdateshopping, restroom, saleitem, saleitemcost, scaleshopping, shopguide)
    saleItems?: string // 판매품목
    saleItemCost?: string // 판매품목별가격
    shopGuide?: string // 매장안내
    cultureCenterLink?: string // 문화센터바로가기 (culturecenter)
    marketFairDay?: string // 장서는날 (fairday)

    // 음식점: (chkcreditcardfood, discountinfofood, firstmenu, infocenterfood, kidsfacility, opendatefood, opentimefood, packing, parkingfood, reservationfood, restdatefood, scalefood, seat, smoking, treatmenu, lcnsno)
    firstMenu?: string // 대표메뉴
    mainTreatMenu?: string // 취급메뉴 (treatmenu)
    licenseNo?: string // 인허가번호 (lcnsno)

    // 여행코스: (distance, infocentertourcourse, schedule, taketime, theme)
    courseDistance?: string // 코스총거리
    courseSchedule?: string // 코스일정
    courseTheme?: string // 코스테마

    // 숙박: (accomcountlodging, checkintime, checkouttime, chkcooking, foodplace, infocenterlodging, parkinglodging, pickup, roomcount, reservationlodging, reservationurl, roomtype, scalelodging, subfacility, barbecue, beauty, beverage, bicycle, campfire, fitness, karaoke, publicbath, publicpc, sauna, seminar, sports, refundregulation)
    checkinTime?: string // 입실시간
    checkoutTime?: string // 퇴실시간
    foodPlace?: string // 식음료장 (foodplace)
}

/**
 * 다양한 content type ID에 따른 intro 데이터를 표준화된 CommonPlaceIntroInfo 형식으로 변환합니다.
 * @param data - 특정 content type ID에 해당하는 intro 데이터 (예: AttractionIntroData)
 * @param contentTypeId - 데이터의 content type ID
 * @returns CommonPlaceIntroInfo 타입의 정규화된 데이터 객체
 */
export function normalizeIntroData(data: AllIntroData, contentTypeId: string): CommonPlaceIntroInfo {
    const commonInfo: CommonPlaceIntroInfo = {}

    switch (contentTypeId) {
        case '12': {
            // 관광지 (AttractionIntroData)
            const attractionData = data as AttractionIntroData
            commonInfo.usageTime = attractionData.usetime ?? ''
            commonInfo.restDate = attractionData.restdate ?? ''
            commonInfo.openDate = attractionData.opendate ?? ''
            commonInfo.infoCenter = attractionData.infocenter ?? ''
            commonInfo.expGuide = attractionData.expguide ?? '' // expGuide 필드 추가
            commonInfo.capacity = attractionData.accomcount ?? ''
            commonInfo.strollerRental = attractionData.chkbabycarriage ?? ''
            commonInfo.petFriendly = attractionData.chkpet ?? ''
            commonInfo.ageLimit = attractionData.expagerange ?? ''
            commonInfo.parkingFacility = attractionData.parking ?? ''
            commonInfo.creditCardAccepted = attractionData.chkcreditcard ?? ''
            commonInfo.heritage1 = attractionData.heritage1 ?? ''
            commonInfo.heritage2 = attractionData.heritage2 ?? ''
            commonInfo.heritage3 = attractionData.heritage3 ?? ''
            break
        }
        case '14': {
            // 문화시설 (CultureIntroData)
            const cultureData = data as CultureIntroData
            commonInfo.usageTime = cultureData.usetimeculture ?? ''
            commonInfo.restDate = cultureData.restdateculture ?? ''
            commonInfo.duration = cultureData.spendtime ?? ''
            commonInfo.entranceFee = cultureData.usefee ?? ''
            commonInfo.infoCenter = cultureData.infocenterculture ?? ''
            commonInfo.scale = cultureData.scale ?? ''
            commonInfo.capacity = cultureData.accomcountculture ?? ''
            commonInfo.strollerRental = cultureData.chkbabycarriageculture ?? ''
            commonInfo.petFriendly = cultureData.chkpetculture ?? ''
            commonInfo.discountInfo = cultureData.discountinfo ?? ''
            commonInfo.creditCardAccepted = cultureData.chkcreditcardculture ?? ''
            commonInfo.parkingFacility = cultureData.parkingculture ?? ''
            commonInfo.parkingFee = cultureData.parkingfee ?? ''
            break
        }
        case '15': {
            // 행사/공연/축제 (EventIntroData)
            const eventData = data as EventIntroData
            commonInfo.ageLimit = eventData.agelimit ?? ''
            commonInfo.reservationInfo = eventData.bookingplace ?? ''
            commonInfo.discountInfo = eventData.discountinfofestival ?? ''
            commonInfo.usageTime = eventData.playtime ?? '' // 공연시간
            commonInfo.entranceFee = eventData.usetimefestival ?? '' // 이용요금 (행사)
            commonInfo.eventPlace = eventData.eventplace ?? ''
            commonInfo.eventProgram = eventData.program ?? ''
            commonInfo.sponsor1 = eventData.sponsor1 ?? ''
            commonInfo.sponsor1Tel = eventData.sponsor1tel ?? ''
            commonInfo.sponsor2 = eventData.sponsor2 ?? ''
            commonInfo.sponsor2Tel = eventData.sponsor2tel ?? ''
            commonInfo.duration = eventData.spendtimefestival ?? '' // 관람소요시간
            commonInfo.eventEndDate = eventData.eventenddate ?? '' // 추가
            commonInfo.eventHomepage = eventData.eventhomepage ?? '' // 추가
            commonInfo.eventStartDate = eventData.eventstartdate ?? '' // 추가
            commonInfo.festivalGrade = eventData.festivalgrade ?? '' // 추가
            commonInfo.eventLocationInfo = eventData.placeinfo ?? '' // 추가 (placeinfo -> eventLocationInfo)
            commonInfo.subEvent = eventData.subevent ?? '' // 추가
            break
        }
        case '25': {
            // 여행코스 (CourseIntroData)
            const courseData = data as CourseIntroData
            commonInfo.infoCenter = courseData.infocentertourcourse ?? ''
            commonInfo.duration = courseData.taketime ?? ''
            commonInfo.courseDistance = courseData.distance ?? '' // 추가
            commonInfo.courseSchedule = courseData.schedule ?? '' // 추가
            commonInfo.courseTheme = courseData.theme ?? '' // 추가
            break
        }
        case '28': {
            // 레포츠 (RecreationIntroData)
            const recreationData = data as RecreationIntroData
            commonInfo.capacity = recreationData.accomcountleports ?? ''
            commonInfo.strollerRental = recreationData.chkbabycarriageleports ?? ''
            commonInfo.creditCardAccepted = recreationData.chkcreditcardleports ?? ''
            commonInfo.petFriendly = recreationData.chkpetleports ?? ''
            commonInfo.ageLimit = recreationData.expagerangeleports ?? ''
            commonInfo.infoCenter = recreationData.infocenterleports ?? ''
            commonInfo.openDate = recreationData.openperiod ?? ''
            commonInfo.parkingFee = recreationData.parkingfeeleports ?? ''
            commonInfo.parkingFacility = recreationData.parkingleports ?? ''
            commonInfo.reservationInfo = recreationData.reservation ?? ''
            commonInfo.restDate = recreationData.restdateleports ?? ''
            commonInfo.scale = recreationData.scaleleports ?? ''
            commonInfo.entranceFee = recreationData.usefeeleports ?? ''
            commonInfo.usageTime = recreationData.usetimeleports ?? ''
            break
        }
        case '32': {
            // 숙박 (AccommodationIntroData)
            const accommodationData = data as AccommodationIntroData
            commonInfo.capacity = accommodationData.accomcountlodging ?? ''
            commonInfo.checkinTime = accommodationData.checkintime ?? '' // 추가
            commonInfo.checkoutTime = accommodationData.checkouttime ?? '' // 추가
            commonInfo.cookingAllowed = accommodationData.chkcooking ?? '' // 추가
            commonInfo.foodPlace = accommodationData.foodplace ?? '' // 추가
            commonInfo.infoCenter = accommodationData.infocenterlodging ?? ''
            commonInfo.parkingFacility = accommodationData.parkinglodging ?? ''
            commonInfo.pickupService = accommodationData.pickup ?? '' // 추가
            commonInfo.roomCount = accommodationData.roomcount ?? '' // 추가
            commonInfo.reservationInfo = accommodationData.reservationlodging ?? ''
            commonInfo.reservationUrl = accommodationData.reservationurl ?? '' // 추가
            commonInfo.roomType = accommodationData.roomtype ?? '' // 추가
            commonInfo.scale = accommodationData.scalelodging ?? ''
            commonInfo.amenities = accommodationData.subfacility ?? ''
            commonInfo.barbecue = accommodationData.barbecue ?? ''
            commonInfo.beauty = accommodationData.beauty ?? ''
            commonInfo.beverage = accommodationData.beverage ?? ''
            commonInfo.bicycle = accommodationData.bicycle ?? ''
            commonInfo.campfire = accommodationData.campfire ?? ''
            commonInfo.fitness = accommodationData.fitness ?? ''
            commonInfo.karaoke = accommodationData.karaoke ?? ''
            commonInfo.publicBath = accommodationData.publicbath ?? ''
            commonInfo.publicPc = accommodationData.publicpc ?? ''
            commonInfo.sauna = accommodationData.sauna ?? ''
            commonInfo.seminar = accommodationData.seminar ?? ''
            commonInfo.sports = accommodationData.sports ?? ''
            commonInfo.refundRegulation = accommodationData.refundregulation ?? '' // 추가
            break
        }
        case '38': {
            // 쇼핑 (ShoppingIntroData)
            const shoppingData = data as ShoppingIntroData
            commonInfo.strollerRental = shoppingData.chkbabycarriageshopping ?? ''
            commonInfo.creditCardAccepted = shoppingData.chkcreditcard ?? ''
            commonInfo.petFriendly = shoppingData.chkpet ?? ''
            commonInfo.cultureCenterLink = shoppingData.culturecenter ?? '' // 추가
            commonInfo.marketFairDay = shoppingData.fairday ?? '' // 추가
            commonInfo.infoCenter = shoppingData.infocentershopping ?? ''
            commonInfo.openDate = shoppingData.opendateshopping ?? ''
            commonInfo.usageTime = shoppingData.opentime ?? ''
            commonInfo.parkingFacility = shoppingData.parkingshopping ?? ''
            commonInfo.restDate = shoppingData.restdateshopping ?? ''
            commonInfo.restroomInfo = shoppingData.restroom ?? '' // 추가
            commonInfo.saleItems = shoppingData.saleitem ?? ''
            commonInfo.saleItemCost = shoppingData.saleitemcost ?? '' // 추가
            commonInfo.scale = shoppingData.scaleshopping ?? ''
            commonInfo.shopGuide = shoppingData.shopguide ?? ''
            break
        }
        case '39': {
            // 음식점 (RestaurantIntroData)
            const restaurantData = data as RestaurantIntroData
            commonInfo.creditCardAccepted = restaurantData.chkcreditcardfood ?? ''
            commonInfo.discountInfo = restaurantData.discountinfofood ?? ''
            commonInfo.firstMenu = restaurantData.firstmenu ?? ''
            commonInfo.infoCenter = restaurantData.infocenterfood ?? ''
            commonInfo.kidsFacility = restaurantData.kidsfacility ?? ''
            commonInfo.establishmentDate = restaurantData.opendatefood ?? '' // 추가 (opendatefood -> establishmentDate)
            commonInfo.usageTime = restaurantData.opentimefood ?? ''
            commonInfo.packagingAvailable = restaurantData.packing ?? '' // 추가
            commonInfo.parkingFacility = restaurantData.parkingfood ?? ''
            commonInfo.reservationInfo = restaurantData.reservationfood ?? ''
            commonInfo.restDate = restaurantData.restdatefood ?? ''
            commonInfo.scale = restaurantData.scalefood ?? ''
            commonInfo.seatCount = restaurantData.seat ?? '' // 추가
            commonInfo.smokingAllowed = restaurantData.smoking ?? '' // 추가
            commonInfo.mainTreatMenu = restaurantData.treatmenu ?? '' // 추가 (treatmenu -> mainTreatMenu)
            commonInfo.licenseNo = restaurantData.lcnsno ?? '' // 추가
            break
        }
        default:
            console.warn(`Unknown contentTypeId: ${contentTypeId} for intro data normalization.`)
            break
    }
    return commonInfo
}
