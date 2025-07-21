'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPlaceDetail } from '../../../lib/api/public-data-api'
import { PlaceDetailData } from '../../../lib/types/placeDetailType'
import { AREA_CODE_MAP } from '../../../lib/constants'
import { PLACE_CONTENT_TYPE_MAP } from '../PlaceList'
import AddToTravelButton from '../components/AddToTravelButton'
import PlaceIntro from './components/PlaceIntro'
import CourseInfo from './components/CourseInfo'
import PlaceDetailSkeleton from './components/PlaceDetailSkeleton'

function parseId(param: string | string[] | undefined): string | null {
    if (typeof param === 'string') {
        return param
    }
    return null
}

interface PlaceDetailProps {
    onBack: () => void
}

export default function PlaceDetail({ onBack }: PlaceDetailProps) {
    const [placeDetail, setPlaceDetail] = useState<PlaceDetailData | null | undefined>()

    const placeId = parseId(useParams().id)

    useEffect(() => {
        if (placeId === null) {
            setPlaceDetail(null)
            return
        }
        getPlaceDetail(placeId)
            .then((data) => {
                setPlaceDetail(data || null)
            })
            .catch(() => {
                setPlaceDetail(null)
            })
    }, [placeId])

    const handleAddToTravel = (placeId: string) => {
        console.log('Add to travel:', placeId)
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="mb-8 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
                <i className="ri-arrow-left-line text-lg group-hover:-translate-x-1 transition-transform"></i>
                <span className="font-medium">목록으로 돌아가기</span>
            </button>

            {placeDetail === undefined && <PlaceDetailSkeleton />}
            {placeDetail === null && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-500 text-lg font-semibold">
                    존재하지 않거나 조회할 수 없는 장소입니다.
                </div>
            )}
            {placeDetail && (
                <>
                    {/* Content Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-4">
                        <div>
                            {/* Header */}
                            <div className="flex items-center justify-between gap-4 mb-4 flex-nowrap">
                                <h1 className="text-4xl font-bold text-gray-900 leading-tight flex-1">
                                    {placeDetail.title}
                                </h1>
                                <AddToTravelButton
                                    placeId={placeDetail.contentid}
                                    placeName={placeDetail.title}
                                    className="border-2 border-blue-500 flex-shrink-0"
                                />
                            </div>
                            {/* Category Tags */}
                            {placeDetail.contenttypeid && (
                                <div className="flex flex-wrap gap-2 my-2">
                                    <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                        <i className="ri-price-tag-3-line mr-2"></i>
                                        {PLACE_CONTENT_TYPE_MAP.get(placeDetail.contenttypeid)}
                                    </span>
                                    {placeDetail.tag &&
                                        placeDetail.tag !== PLACE_CONTENT_TYPE_MAP.get(placeDetail.contenttypeid) && (
                                            <span className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium">
                                                <i className="ri-arrow-right-s-line mr-1"></i>
                                                {placeDetail.tag}
                                            </span>
                                        )}
                                </div>
                            )}
                            {/* Summary Row */}
                            {(placeDetail.addr1 || placeDetail.tel || placeDetail.homepage) && (
                                <div className="flex flex-wrap gap-6 items-center text-gray-700 text-base mt-4 mb-2">
                                    {placeDetail.addr1 && (
                                        <div className="flex items-center gap-1">
                                            <i className="ri-map-pin-line text-blue-500"></i>
                                            <span>
                                                {placeDetail.addr1} {placeDetail.addr2}
                                            </span>
                                        </div>
                                    )}
                                    {placeDetail.tel && (
                                        <div className="flex items-center gap-1">
                                            <i className="ri-phone-line text-green-500"></i>
                                            <span>{placeDetail.tel}</span>
                                        </div>
                                    )}
                                    {placeDetail.homepage && (
                                        <div className="flex items-center gap-1">
                                            <i className="ri-external-link-line text-blue-600"></i>
                                            <a
                                                href={placeDetail.homepage.match(/href="([^"]*)"/)?.[1] || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline hover:text-blue-800"
                                            >
                                                홈페이지
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Hero Section with Image and Overview in a single card */}
                    <div className="max-w-5xl mx-auto mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        {placeDetail.firstimage ? (
                            <div className="relative rounded-2xl overflow-hidden mb-6 flex justify-center items-center bg-gray-100">
                                <img
                                    src={placeDetail.firstimage}
                                    alt={placeDetail.title}
                                    className="w-full h-auto object-cover"
                                    style={{ maxHeight: '500px' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                {/* Location Badge */}
                                {placeDetail.areacode && (
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-sm font-medium border border-gray-200">
                                            <i className="ri-map-pin-line mr-1"></i>
                                            {AREA_CODE_MAP.get(placeDetail.areacode)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            placeDetail.areacode && (
                                <div className="mb-6">
                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-sm font-medium border border-gray-200">
                                        <i className="ri-map-pin-line mr-1"></i>
                                        {AREA_CODE_MAP.get(placeDetail.areacode)}
                                    </span>
                                </div>
                            )
                        )}
                        {/* Overview */}
                        {placeDetail.overview && (
                            <div>
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                                        {placeDetail.overview.replace(/<br\s*\/?>/g, '\n')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Additional Course Info Section */}
                    {placeDetail.additionalCourseInfoData && (
                        <div className="max-w-5xl mx-auto mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-8">
                            <div className="space-y-8">
                                {placeDetail.additionalCourseInfoData.map((info, index) => (
                                    <CourseInfo
                                        key={info.subnum}
                                        info={info}
                                        isLast={index === (placeDetail.additionalCourseInfoData?.length || 0) - 1}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Additional Info Section */}
                    {placeDetail.additionalIntroData && (
                        <div className="max-w-5xl mx-auto mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <PlaceIntro additionalIntroData={placeDetail.additionalIntroData} />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
