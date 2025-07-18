import { NextResponse } from 'next/server'
import axios from 'axios'

const BASE_URL = 'http://apis.data.go.kr/B551011/KorService2/'

export async function GET(request: Request) {
    try {
        const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY
        if (!SERVICE_KEY) {
            return NextResponse.json({ message: 'API Service Key is not configured.' }, { status: 500 })
        }

        // 쿼리 파라미터에서 가져오기
        const { searchParams } = new URL(request.url)

        const contentType = searchParams.get('contentType')
        if (!contentType) {
            return NextResponse.json({ message: 'contentType is required.' }, { status: 400 })
        }
        const API_ENDPOINT = BASE_URL + contentType

        const arrange = searchParams.get('arrange') || 'O'
        const pageNo = searchParams.get('pageNo') || '1'
        const pageSize = searchParams.get('pageSize') || '12'

        const params = {
            serviceKey: SERVICE_KEY,
            MobileOS: 'WEB',
            MobileApp: 'AppTest',
            _type: 'json',
            arrange: arrange,
            numOfRows: pageSize,
            pageNo: pageNo,
        }

        const response = await axios.get(API_ENDPOINT, {
            params,
        })

        // const data = response.data
        // console.log('데이터: ', data.response.body.items.item)

        // // -- 분류체계 코드 조회 --
        // const lclsSystmCodeResponse = await axios.get(BASE_URL + 'lclsSystmCode2', {
        //     params: {
        //         serviceKey: SERVICE_KEY,
        //         MobileOS: 'WEB',
        //         MobileApp: 'AppTest',
        //         _type: 'json',
        //         // lclsSystmListYn: 'Y',
        //         lclsSystm1: 'SH', // '백화점', '쇼핑몰', '대형마트', 면세점', ..., SH06은 '시장'
        //         // lclsSystm2: 'SH06', // '비상설시장', '상설시장'
        //         // lclsSystm3: 'SH060200', // 상설시장
        //     },
        // })
        // // 숙박 > 켐필 > 일반야영장
        // // 숙박 > 캠핑 > 오토캠핑장
        // // 숙박 > 팬션/민박 > 농어촌민박
        // // 목록조회할 때는 3층만 보여주고, 상세조회때 1 > 2 > 3 이렇게 보여주기.
        // console.log('👍 lclsSystmCode', lclsSystmCodeResponse.data.response.body.items.item) // totalCount: 245

        // // -- 서비스 분류코드 조회 --
        // const categoryCodeResponse = await axios.get(BASE_URL + 'categoryCode2', {
        //     params: {
        //         serviceKey: SERVICE_KEY,
        //         MobileOS: 'WEB',
        //         MobileApp: 'AppTest',
        //         _type: 'json',
        //         // contentTypeId: 12,
        //         cat1: 'A04', // 쇼핑 // ContentType
        //         // cat2: 'A0401', // '5일장', '상설시장', '백화점', ...
        //         // cat3: 'A04010200', // 상설시장
        //     },
        // })
        // console.log('👍 categoryCode', categoryCodeResponse.data)

        // // -- 공통정보 조회 (상세정보1) --
        // const detailCommonResponse = await axios.get(BASE_URL + 'detailCommon2', {
        //     params: {
        //         serviceKey: SERVICE_KEY,
        //         MobileOS: 'WEB',
        //         MobileApp: 'AppTest',
        //         _type: 'json',
        //         contentId: 1433504, // 2901530 // 2465071
        //     },
        // })
        // console.log('👍 detailCommon', detailCommonResponse.data.response.body.items.item)

        return NextResponse.json(response.data)
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

function getSpotParams(params: any) {
    // 관광지 정보에 필요한 추가 파라미터 설정

    return params
}
