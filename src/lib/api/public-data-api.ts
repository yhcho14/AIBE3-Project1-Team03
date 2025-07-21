import { PublicApiData } from '../types/common-api-response'
import { PlaceDetailData } from '../types/placeDetailType'

const API_BASE_PATH = '/api/public-data-proxy'

function getBaseUrl(): string {
    // 클라이언트 사이드에서는 현재 도메인 사용
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    // 서버 사이드에서 배포 환경 URL 처리
    // 여러 배포 플랫폼 지원
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }
    
    if (process.env.NETLIFY_URL) {
        return process.env.NETLIFY_URL
    }
    
    if (process.env.RENDER_EXTERNAL_URL) {
        return process.env.RENDER_EXTERNAL_URL
    }
    
    // 커스텀 배포 URL 환경변수
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL
    }
    
    // NODE_ENV가 production이면 상대 경로 사용 (현재 도메인 기준)
    if (process.env.NODE_ENV === 'production') {
        // 프로덕션에서는 상대 경로로 API 호출하도록 빈 문자열 반환
        return ''
    }

    // 서버 사이드에서 개발 환경
    return 'http://localhost:3000'
}

export default async function getPlacesList<T>(params: string): Promise<PublicApiData<T> | null> {
    try {
        const baseUrl = getBaseUrl()
        const url = `${baseUrl}${API_BASE_PATH}?${params}`

        console.log('API 요청 URL:', url)

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API 에러 (getPlacesList):', {
                status: response.status,
                statusText: response.statusText,
                url,
                errorText,
            })
            throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('API 응답 성공, 데이터 수:', data?.response?.body?.items?.item?.length || 0)
        return data
    } catch (error) {
        console.error('네트워크 또는 파싱 오류 (getPlacesList):', error)
        throw error
    }
}

export async function getPlaceDetail(contentId: string): Promise<PlaceDetailData | null> {
    try {
        const baseUrl = getBaseUrl()
        const url = `${baseUrl}${API_BASE_PATH}/${contentId}`

        console.log('장소 상세 API 요청 URL:', url)

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API 에러 (getPlaceDetail):', {
                status: response.status,
                statusText: response.statusText,
                url,
                errorText,
            })
            throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('장소 상세 API 응답 성공')
        return data
    } catch (error) {
        console.error('네트워크 또는 파싱 오류 (getPlaceDetail):', error)
        throw error
    }
}
