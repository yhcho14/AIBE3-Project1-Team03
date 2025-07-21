import { PublicApiData } from '../types/common-api-response'
import { PlaceDetailData } from '../types/placeDetailType'

const API_BASE_PATH = '/api/public-data-proxy'

export default async function getPlacesList<T>(params: string): Promise<PublicApiData<T> | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || 'http://localhost:3000'
        const url = `${baseUrl}${API_BASE_PATH}?${params}`

        const response = await fetch(url, { cache: 'no-store' })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error (getPlacesList):', response.status, errorText)
            return null
        }
        return await response.json()
    } catch (error) {
        console.error('Network or Parsing Error (getPlacesList):', error)
        return null
    }
}

export async function getPlaceDetail(contentId: string): Promise<PlaceDetailData | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || 'http://localhost:3000'
        const url = `${baseUrl}${API_BASE_PATH}/${contentId}`

        const response = await fetch(url, { cache: 'no-store' })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error (getPlaceDetail):', response.status, errorText)
            return null
        }

        return await response.json()
    } catch (error) {
        console.error('Network or Parsing Error (getPlaceDetail):', error)
        return null
    }
}
