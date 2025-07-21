import { NextResponse } from 'next/server'
import axios from 'axios'
import { API_PUBLIC_DATA_BASE_URL } from '../../../lib/constants'

const BASE_URL = API_PUBLIC_DATA_BASE_URL

// CORS 헤더 설정 함수
function setCorsHeaders(response: NextResponse) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return response
}

// OPTIONS 메서드 처리
export async function OPTIONS() {
    return setCorsHeaders(new NextResponse(null, { status: 200 }))
}

export async function GET(request: Request) {
    try {
        const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY
        if (!SERVICE_KEY) {
            return setCorsHeaders(NextResponse.json({ message: 'API Service Key is not configured.' }, { status: 500 }))
        }

        const { searchParams } = new URL(request.url)

        const apiType = searchParams.get('apiType')
        if (!apiType) {
            return setCorsHeaders(NextResponse.json({ message: 'apiType is required.' }, { status: 400 }))
        }
        const API_ENDPOINT = BASE_URL + apiType

        const numOfRows = searchParams.get('numOfRows') || '12'
        const pageNo = searchParams.get('pageNo') || '1'
        const arrange = searchParams.get('arrange') || 'Q'
        const contentTypeId = searchParams.get('contentTypeId') || ''
        const areaCode = searchParams.get('areaCode') || ''
        const sigunguCode = searchParams.get('sigunguCode') || ''
        const keyword = searchParams.get('keyword') || ''

        const params: any = {
            serviceKey: SERVICE_KEY,
            MobileOS: 'WEB',
            MobileApp: 'AppTest',
            _type: 'json',
            numOfRows: numOfRows,
            pageNo: pageNo,
            arrange: arrange,
        }

        if (contentTypeId) {
            params.contentTypeId = contentTypeId
        }
        if (areaCode) {
            params.areaCode = areaCode
            if (sigunguCode) {
                params.sigunguCode = sigunguCode
            }
        }
        if (keyword) {
            params.keyword = keyword
        }

        const response = await axios.get(API_ENDPOINT, { params })

                return setCorsHeaders(NextResponse.json(response.data))
    } catch (error: any) {
        console.error('Error fetching or parsing public data:', error)
        if (axios.isAxiosError(error)) {
            console.error('Axios Error Details:', error.response?.data || error.message)
        }
        return setCorsHeaders(NextResponse.json(
            { message: 'Failed to fetch or parse public data', error: error.message },
            { status: 500 },
        ))
    }
}
