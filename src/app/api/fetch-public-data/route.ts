import { NextResponse } from 'next/server'
import axios from 'axios'

const API_TYPE_AREA_BASED_LIST = 'areaBasedList2' // 지역기반 관광지정보 조회
const BASE_URL = 'http://apis.data.go.kr/B551011/KorService2/' + API_TYPE_AREA_BASED_LIST

export async function GET(request: Request) {
    try {
        const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY
        if (!SERVICE_KEY) {
            return NextResponse.json({ message: 'API Service Key is not configured.' }, { status: 500 })
        }

        // 쿼리 파라미터에서 가져오기
        const { searchParams } = new URL(request.url)

        // const contentType = searchParams.get('contentType')
        // if (!contentType) {
        //     return NextResponse.json({ message: 'contentType is required.' }, { status: 400 })
        // }
        // const API_ENDPOINT = BASE_URL + contentType

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

        const response = await axios.get(BASE_URL, {
            params,
        })

        // const data = response.data;
        // console.log("데이터: ", data);

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
