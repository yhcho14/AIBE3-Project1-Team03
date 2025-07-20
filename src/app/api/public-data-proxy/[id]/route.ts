import { NextResponse } from 'next/server'
import axios from 'axios'
import { API_PUBLIC_DATA_BASE_URL } from '../../../../lib/constants'
import { CourseInfoData, PlaceDetailData } from '../../../../lib/types/placeDetailType'
import { normalizeIntroData } from '../../../../lib/data/normalizePlaceIntroData'

const BASE_URL = API_PUBLIC_DATA_BASE_URL
const API_TYPE_DETAIL_COMMON = 'detailCommon2'
const API_TYPE_DETAIL_INTRO = 'detailIntro2'
const API_TYPE_DETAIL_INFO = 'detailInfo2'
const API_TYPE_DETAIL_LCLS_SYSTM_CODE = 'lclsSystmCode2'

// const formatValue = (value: string | undefined): string | null => {
//     return value && value.trim() !== '' ? value : null
// }

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY
        if (!SERVICE_KEY) {
            return NextResponse.json({ message: 'API Service Key is not configured.' }, { status: 500 })
        }

        const { id: contentId } = await params
        if (!contentId) {
            return NextResponse.json({ message: 'contentId is required.' }, { status: 400 })
        }

        const baseParams = {
            serviceKey: SERVICE_KEY,
            MobileOS: 'WEB',
            MobileApp: 'AppTest',
            _type: 'json',
        }

        const commonResponse = await axios.get(BASE_URL + API_TYPE_DETAIL_COMMON, {
            params: { ...baseParams, contentId },
        })
        const commonData = commonResponse.data.response?.body?.items?.item?.[0]
        if (!commonData) {
            return NextResponse.json({ message: 'Common data not found for this contentId.' }, { status: 404 })
        }

        const contentTypeId = commonData.contenttypeid
        const lclsSystm1 = commonData.lclsSystm1
        const lclsSystm2 = commonData.lclsSystm2
        const lclsSystm3 = commonData.lclsSystm3

        const promises = [
            axios.get(BASE_URL + API_TYPE_DETAIL_LCLS_SYSTM_CODE, {
                params: { ...baseParams, lclsSystm1, lclsSystm2, lclsSystm3 },
            }),
            axios.get(BASE_URL + API_TYPE_DETAIL_INTRO, {
                params: { ...baseParams, contentId, contentTypeId },
            }),
        ]

        // contentTypeId가 25(여행코스)인 경우에만 detailInfo2 호출
        if (contentTypeId === '25') {
            promises.push(
                axios.get(BASE_URL + API_TYPE_DETAIL_INFO, {
                    params: { ...baseParams, contentId, contentTypeId },
                }),
            )
        }

        const results = await Promise.allSettled(promises)

        const tagRes = results[0]
        // console.log('🏷️ tagRes', tagRes)
        const introRes = results[1]
        const infoRes = results.length > 2 ? results[2] : undefined // detailInfo2가 호출되지 않았다면 undefined

        const tagData = tagRes.status === 'fulfilled' ? tagRes.value.data.response?.body?.items?.item?.[0] : undefined
        const introData =
            introRes.status === 'fulfilled' ? introRes.value.data.response?.body?.items?.item?.[0] : undefined
        let infoData: CourseInfoData[] = []
        if (infoRes?.status === 'fulfilled') {
            infoData = infoRes.value.data.response?.body?.items?.item || []
        }

        // console.log('👍 commonData', commonData)
        // console.log('👍 tagData', tagData) // { code: 'FD050200', name: '찻집', rnum: 1 }
        // console.log('👍 introData', introData)
        // console.log('👍 infoData', infoData)

        const finalData: Partial<PlaceDetailData> = {
            contentid: commonData.contentid,
            contenttypeid: commonData.contenttypeid,
            title: commonData.title,
            firstimage: commonData.firstimage,
            homepage: commonData.homepage,
            overview: commonData.overview,
            addr1: commonData.addr1,
            addr2: commonData.addr2,
            tel: commonData.tel,
            areacode: commonData.areacode,
            // sigungucode: commonData.sigungucode,
            mapx: commonData.mapx,
            mapy: commonData.mapy,
            mlevel: commonData.mlevel,
            tag: tagData?.name || '',
        }

        finalData.additionalIntroData = normalizeIntroData(introData, contentTypeId)
        if (contentTypeId === '25') finalData.additionalCourseInfoData = infoData

        // let additionalDisplayInfo: DisplayDataItem[] = []

        // switch (contentTypeId) {
        //     case '25': // 여행코스
        //         const courseIntro = introData as CourseIntroData
        //         additionalDisplayInfo.push(
        //             { label: '코스총거리', value: formatValue(courseIntro.distance) },
        //             { label: '문의 및 안내', value: formatValue(courseIntro.infocentertourcourse) },
        //             { label: '코스일정', value: formatValue(courseIntro.schedule) },
        //             { label: '코스총소요시간', value: formatValue(courseIntro.taketime) },
        //             { label: '코스테마', value: formatValue(courseIntro.theme) },
        //         )
        //         // 여행코스 반복정보 조회 (상세정보3)
        //         finalData.additionalCourseInfo = infoData
        //         break
        //     case '12': // 관광지
        //         const attractionIntro = introData as AttractionIntroData
        //         additionalDisplayInfo.push(
        //             { label: '수용인원', value: formatValue(attractionIntro.accomcount) },
        //             { label: '유모차대여정보', value: formatValue(attractionIntro.chkbabycarriage) },
        //             { label: '신용카드가능정보', value: formatValue(attractionIntro.chkcreditcard) },
        //             { label: '애완동물동반가능정보', value: formatValue(attractionIntro.chkpet) },
        //             { label: '체험가능연령', value: formatValue(attractionIntro.expagerange) },
        //             { label: '체험안내', value: formatValue(attractionIntro.expguide) },
        //             { label: '세계문화유산유무', value: formatValue(attractionIntro.heritage1) },
        //             { label: '세계자연유산유무', value: formatValue(attractionIntro.heritage2) },
        //             { label: '세계기록유산유무', value: formatValue(attractionIntro.heritage3) },
        //             { label: '문의 및 안내', value: formatValue(attractionIntro.infocenter) },
        //             { label: '개장일', value: formatValue(attractionIntro.opendate) },
        //             { label: '쉬는날', value: formatValue(attractionIntro.restdate) },
        //             { label: '이용시간', value: formatValue(attractionIntro.usetime) },
        //             { label: '주차시설', value: formatValue(attractionIntro.parking) },
        //         )
        //         break
        //     case '14': // 문화시설
        //         const cultureIntro = introData as CultureIntroData
        //         additionalDisplayInfo.push(
        //             { label: '수용인원', value: formatValue(cultureIntro.accomcountculture) },
        //             { label: '유모차대여정보', value: formatValue(cultureIntro.chkbabycarriageculture) },
        //             { label: '신용카드가능정보', value: formatValue(cultureIntro.chkcreditcardculture) },
        //             { label: '애완동물동반가능정보', value: formatValue(cultureIntro.chkpetculture) },
        //             { label: '할인정보', value: formatValue(cultureIntro.discountinfo) },
        //             { label: '문의 및 안내', value: formatValue(cultureIntro.infocenterculture) },
        //             { label: '주차시설', value: formatValue(cultureIntro.parkingculture) },
        //             { label: '주차요금', value: formatValue(cultureIntro.parkingfee) },
        //             { label: '쉬는날', value: formatValue(cultureIntro.restdateculture) },
        //             { label: '이용요금', value: formatValue(cultureIntro.usefee) },
        //             { label: '이용시간', value: formatValue(cultureIntro.usetimeculture) },
        //             { label: '규모', value: formatValue(cultureIntro.scale) },
        //             { label: '관람소요시간', value: formatValue(cultureIntro.spendtime) },
        //         )
        //         break
        //     case '15': // 축제/공연/행사
        //         const eventIntro = introData as EventIntroData
        //         additionalDisplayInfo.push(
        //             { label: '관람가능연령', value: formatValue(eventIntro.agelimit) },
        //             { label: '예매처', value: formatValue(eventIntro.bookingplace) },
        //             { label: '할인정보', value: formatValue(eventIntro.discountinfofestival) },
        //             { label: '행사종료일', value: formatValue(eventIntro.eventenddate) },
        //             { label: '행사홈페이지', value: formatValue(eventIntro.eventhomepage) },
        //             { label: '행사장소', value: formatValue(eventIntro.eventplace) },
        //             { label: '행사시작일', value: formatValue(eventIntro.eventstartdate) },
        //             { label: '축제등급', value: formatValue(eventIntro.festivalgrade) },
        //             { label: '행사장위치안내', value: formatValue(eventIntro.placeinfo) },
        //             { label: '공연시간', value: formatValue(eventIntro.playtime) },
        //             { label: '행사프로그램', value: formatValue(eventIntro.program) },
        //             { label: '관람소요시간', value: formatValue(eventIntro.spendtimefestival) },
        //             { label: '주최자정보', value: formatValue(eventIntro.sponsor1) },
        //             { label: '주최자연락처', value: formatValue(eventIntro.sponsor1tel) },
        //             { label: '주관사정보', value: formatValue(eventIntro.sponsor2) },
        //             { label: '주관사연락처', value: formatValue(eventIntro.sponsor2tel) },
        //             { label: '부대행사', value: formatValue(eventIntro.subevent) },
        //             { label: '이용요금', value: formatValue(eventIntro.usetimefestival) },
        //         )
        //         break
        //     case '28': // 레포츠
        //         const recreationIntro = introData as RecreationIntroData
        //         additionalDisplayInfo.push(
        //             { label: '수용인원', value: formatValue(recreationIntro.accomcountleports) },
        //             { label: '유모차대여정보', value: formatValue(recreationIntro.chkbabycarriageleports) },
        //             { label: '신용카드가능정보', value: formatValue(recreationIntro.chkcreditcardleports) },
        //             { label: '애완동물동반가능정보', value: formatValue(recreationIntro.chkpetleports) },
        //             { label: '체험가능연령', value: formatValue(recreationIntro.expagerangeleports) },
        //             { label: '문의 및 안내', value: formatValue(recreationIntro.infocenterleports) },
        //             { label: '개장기간', value: formatValue(recreationIntro.openperiod) },
        //             { label: '주차요금', value: formatValue(recreationIntro.parkingfeeleports) },
        //             { label: '주차시설', value: formatValue(recreationIntro.parkingleports) },
        //             { label: '예약안내', value: formatValue(recreationIntro.reservation) },
        //             { label: '쉬는날', value: formatValue(recreationIntro.restdateleports) },
        //             { label: '규모', value: formatValue(recreationIntro.scaleleports) },
        //             { label: '입장료', value: formatValue(recreationIntro.usefeeleports) },
        //             { label: '이용시간', value: formatValue(recreationIntro.usetimeleports) },
        //         )
        //         break
        //     case '32': // 숙박
        //         const accommodationIntro = introData as AccommodationIntroData
        //         additionalDisplayInfo.push(
        //             { label: '수용가능인원', value: formatValue(accommodationIntro.accomcountlodging) },
        //             { label: '입실시간', value: formatValue(accommodationIntro.checkintime) },
        //             { label: '퇴실시간', value: formatValue(accommodationIntro.checkouttime) },
        //             { label: '객실내취사여부', value: formatValue(accommodationIntro.chkcooking) },
        //             { label: '식음료장', value: formatValue(accommodationIntro.foodplace) },
        //             { label: '문의 및 안내', value: formatValue(accommodationIntro.infocenterlodging) },
        //             { label: '주차시설', value: formatValue(accommodationIntro.parkinglodging) },
        //             { label: '픽업서비스', value: formatValue(accommodationIntro.pickup) },
        //             { label: '객실수', value: formatValue(accommodationIntro.roomcount) },
        //             { label: '예약안내', value: formatValue(accommodationIntro.reservationlodging) },
        //             { label: '예약안내홈페이지', value: formatValue(accommodationIntro.reservationurl) },
        //             { label: '객실유형', value: formatValue(accommodationIntro.roomtype) },
        //             { label: '규모', value: formatValue(accommodationIntro.scalelodging) },
        //             { label: '부대시설', value: formatValue(accommodationIntro.subfacility) },
        //             { label: '바비큐장여부', value: formatValue(accommodationIntro.barbecue) },
        //             { label: '뷰티시설정보', value: formatValue(accommodationIntro.beauty) },
        //             { label: '식음료장여부', value: formatValue(accommodationIntro.beverage) },
        //             { label: '자전거대여여부', value: formatValue(accommodationIntro.bicycle) },
        //             { label: '캠프파이어여부', value: formatValue(accommodationIntro.campfire) },
        //             { label: '휘트니스센터여부', value: formatValue(accommodationIntro.fitness) },
        //             { label: '노래방여부', value: formatValue(accommodationIntro.karaoke) },
        //             { label: '공용샤워실여부', value: formatValue(accommodationIntro.publicbath) },
        //             { label: '공용 PC실여부', value: formatValue(accommodationIntro.publicpc) },
        //             { label: '사우나실여부', value: formatValue(accommodationIntro.sauna) },
        //             { label: '세미나실여부', value: formatValue(accommodationIntro.seminar) },
        //             { label: '스포츠시설여부', value: formatValue(accommodationIntro.sports) },
        //             { label: '환불규정', value: formatValue(accommodationIntro.refundregulation) },
        //         )
        //         break
        //     case '38': // 쇼핑
        //         const shoppingIntro = introData as ShoppingIntroData
        //         additionalDisplayInfo.push(
        //             { label: '유모차대여정보', value: formatValue(shoppingIntro.chkbabycarriageshopping) },
        //             { label: '신용카드가능정보', value: formatValue(shoppingIntro.chkcreditcard) },
        //             { label: '애완동물동반가능정보', value: formatValue(shoppingIntro.chkpet) },
        //             { label: '문화센터바로가기', value: formatValue(shoppingIntro.culturecenter) },
        //             { label: '장서는날', value: formatValue(shoppingIntro.fairday) },
        //             { label: '문의및안내', value: formatValue(shoppingIntro.infocentershopping) },
        //             { label: '개장일', value: formatValue(shoppingIntro.opendateshopping) },
        //             { label: '영업시간', value: formatValue(shoppingIntro.opentime) },
        //             { label: '주차시설', value: formatValue(shoppingIntro.parkingshopping) },
        //             { label: '쉬는날', value: formatValue(shoppingIntro.restdateshopping) },
        //             { label: '화장실설명', value: formatValue(shoppingIntro.restroom) },
        //             { label: '판매품목', value: formatValue(shoppingIntro.saleitem) },
        //             { label: '판매품목별가격', value: formatValue(shoppingIntro.saleitemcost) },
        //             { label: '규모', value: formatValue(shoppingIntro.scaleshopping) },
        //             { label: '매장안내', value: formatValue(shoppingIntro.shopguide) },
        //         )
        //         break
        //     case '39': // 음식점
        //         const restaurantIntro = introData as RestaurantIntroData
        //         additionalDisplayInfo.push(
        //             { label: '신용카드가능정보', value: formatValue(restaurantIntro.chkcreditcardfood) },
        //             { label: '할인정보', value: formatValue(restaurantIntro.discountinfofood) },
        //             { label: '대표메뉴', value: formatValue(restaurantIntro.firstmenu) },
        //             { label: '문의및안내', value: formatValue(restaurantIntro.infocenterfood) },
        //             { label: '어린이놀이방여부', value: formatValue(restaurantIntro.kidsfacility) },
        //             { label: '개업일', value: formatValue(restaurantIntro.opendatefood) },
        //             { label: '영업시간', value: formatValue(restaurantIntro.opentimefood) },
        //             { label: '포장가능', value: formatValue(restaurantIntro.packing) },
        //             { label: '주차시설', value: formatValue(restaurantIntro.parkingfood) },
        //             { label: '예약안내', value: formatValue(restaurantIntro.reservationfood) },
        //             { label: '쉬는날', value: formatValue(restaurantIntro.restdatefood) },
        //             { label: '규모', value: formatValue(restaurantIntro.scalefood) },
        //             { label: '좌석수', value: formatValue(restaurantIntro.seat) },
        //             { label: '금연/흡연여부', value: formatValue(restaurantIntro.smoking) },
        //             { label: '취급메뉴', value: formatValue(restaurantIntro.treatmenu) },
        //             { label: '인허가번호', value: formatValue(restaurantIntro.lcnsno) },
        //         )
        //         break
        //     default:
        //         console.warn(`Unhandled contentTypeId: ${contentTypeId}`)
        //         additionalDisplayInfo.push({
        //             label: '추가 정보',
        //             value: '이 콘텐츠 타입에 대한 상세 정보가 준비되지 않았습니다.',
        //         })
        //         break
        // }

        // finalData.additionalDisplayInfo = additionalDisplayInfo

        return NextResponse.json(finalData)
    } catch (error: any) {
        console.error('Error fetching or parsing public data:', error)
        if (axios.isAxiosError(error)) {
            console.error('Axios Error Details:', error.response?.data || error.message)
        }
        return NextResponse.json(
            { message: 'Failed to fetch or parse public data', error: error.message },
            { status: 500 },
        )
    }
}
