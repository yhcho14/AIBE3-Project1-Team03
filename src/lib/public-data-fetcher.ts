import { PublicApiData } from './types/common-api-response'

export default async function getPublicDataFromApiRoute<T>(params: string): Promise<PublicApiData<T> | null> {
    try {
        const response = await fetch(
            `${
                process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || 'http://localhost:3000'
            }/api/fetch-public-data${params ? `?${params}` : ''}`,
            { cache: 'no-store' },
        )

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Failed to fetch places:', errorData)
            return null
        }
        return await response.json()
    } catch (error) {
        console.error('Error fetching places:', error)
        return null
    }
}
