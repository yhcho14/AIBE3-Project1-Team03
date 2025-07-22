'use client'

import { useSearchParams } from 'next/navigation'
import PlaceList from '../PlaceList'

export default function PlacesContent() {
    const searchParams = useSearchParams()
    const areaCode = searchParams.get('areaCode')
    const sigungu = searchParams.get('sigungu')

    return <PlaceList initialAreaCode={areaCode} initialSigungu={sigungu} />
}
