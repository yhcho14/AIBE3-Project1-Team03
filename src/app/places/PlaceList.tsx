'use client'

import { useState, useEffect, useRef } from 'react'

import getPublicDataFromApiRoute from '../../lib/public-data-fetcher'
import { Place } from '../../lib/types/place'
import Dropdown from '../../components/Dropdown'
import Pagination from '../../components/Pagination'

interface PlaceListProps {
    onSelectPlace: (placeId: number) => void
    selectedPlaceId: number | null
    onAddToTrip?: (placeId: number) => void
}

type PlaceItem = {
    id: number
    category: string
    areaCode: number
    title: string
    addr: string
    tags: string[]
    tags2: string[]
    image: string
    // description: string
    createdTime: string
    modifiedTime: string
}

const contentTypeMap = new Map<string, string>([
    ['12', '관광지'],
    ['14', '문화시설'],
    ['15', '축제행사'],
    ['25', '여행코스'],
    ['28', '레포츠'],
    ['32', '숙박'],
    ['38', '쇼핑'],
    ['39', '음식점'],
])

const locations = ['all', '제주도', '부산', '서울', '강릉', '전주', '경주', '속초']
const sortOptions = [
    { value: 'title', label: '제목순' },
    { value: 'modified', label: '최신순' }, // 수정일순
    { value: 'created', label: '등록일순' },
]

const categories = Array.from(contentTypeMap)
const categoryOptions = [
    { value: '0', label: '유형 전체' },
    ...categories.map((cat) => ({ value: cat[0], label: cat[1] })),
]

const API_TYPE_AREA_BASED_LIST = 'areaBasedList2'

export default function PlaceList({ onSelectPlace, selectedPlaceId, onAddToTrip }: PlaceListProps) {
    const [places, setPlaces] = useState<PlaceItem[]>([])
    const [sortBy, setSortBy] = useState(sortOptions[0].value)
    const [filterLocation, setFilterLocation] = useState(locations[0])
    const [filterCategory, setFilterCategory] = useState('0')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [hoveredPlaceId, setHoveredPlaceId] = useState<number | null>(null)
    const pageSize = 12
    const pageGroupSize = 5
    const topRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const params = [
            `contentType=${API_TYPE_AREA_BASED_LIST}`,
            `pageNo=${currentPage}`,
            `pageSize=${pageSize}`,
            sortBy ? `sort=${sortBy}` : '',
            filterLocation && filterLocation !== 'all' ? `location=${encodeURIComponent(filterLocation)}` : '',
        ]
            .filter(Boolean)
            .join('&')
        const query = params ? `?${params}` : ''

        getPublicDataFromApiRoute<Place>(query).then((data) => {
            const items = data?.response?.body?.items?.item || []
            setPlaces(
                items.map((item: Place) => ({
                    id: item.contentid,
                    category: contentTypeMap.get(item.contenttypeid.toString()) || '',
                    areaCode: item.areacode,
                    title: item.title,
                    addr: item.addr1,
                    tags: [item.cat1, item.cat2, item.cat3],
                    tags2: [item.lclsSystm1, item.lclsSystm2, item.lclsSystm3],
                    image: item.firstimage,
                    createdTime: item.createdtime,
                    modifiedTime: item.modifiedtime,
                })),
            )
            setTotalCount(Number(data?.response?.body?.totalCount) || 0)
        })
    }, [currentPage, sortBy, filterLocation, filterCategory])

    // 정렬/필터 변경 시 페이지를 1로 리셋
    const handleSortChange = (value: string) => {
        setSortBy(value)
        setCurrentPage(1)
    }
    const handleFilterChange = (value: string) => {
        setFilterLocation(value)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        topRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div ref={topRef} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex flex-wrap gap-2">
                    {locations.map((location) => (
                        <button
                            key={location}
                            onClick={() => handleFilterChange(location)}
                            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                                filterLocation === location
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {location === 'all' ? '전체' : location}
                        </button>
                    ))}
                </div>
                <div className="flex flex-row items-center space-x-2">
                    <Dropdown options={categoryOptions} selected={filterCategory} onSelect={setFilterCategory} />
                    <Dropdown options={sortOptions} selected={sortBy} onSelect={handleSortChange} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place) => (
                    <div
                        key={place.id}
                        onClick={() => onSelectPlace(place.id)}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <div className="relative h-48">
                            <img
                                src={place.image}
                                alt={place.title}
                                className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute top-4 left-4">
                                {place.category && (
                                    <span className="px-3 py-1 bg-black/70 text-white rounded-full text-xs">
                                        {place.category}
                                    </span>
                                )}
                            </div>

                            <AddToTripButton
                                hovered={hoveredPlaceId === place.id}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (onAddToTrip) onAddToTrip(place.id)
                                }}
                                onMouseEnter={() => setHoveredPlaceId(place.id)}
                                onMouseLeave={() => setHoveredPlaceId(null)}
                            />
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{place.title}</h3>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <i className="ri-user-line mr-1"></i>
                                    <span>5.5M</span>
                                </div>
                            </div>

                            {place.addr && (
                                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                    <i className="ri-map-pin-line text-gray-400"></i>
                                    <span>{place.addr}</span>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                                {place.tags.map((tag: string) => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {place.tags2.map((tag: string) => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
                pageGroupSize={pageGroupSize}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

type AddToTripButtonProps = {
    hovered: boolean
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
}

function AddToTripButton({ hovered, onClick, onMouseEnter, onMouseLeave }: AddToTripButtonProps) {
    return (
        <div
            className={`absolute top-4 right-4 rounded-full flex items-center border border-gray-200 text-gray-600 bg-white/90 hover:bg-white overflow-hidden cursor-pointer group transition-all duration-300 justify-center
                ${hovered ? 'w-36 px-4' : 'w-8 px-0'}
            `}
            style={{ minWidth: 32, height: 32 }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {hovered ? (
                <span className="text-xs whitespace-nowrap">내 여행에 추가하기</span>
            ) : (
                <i className="ri-add-line text-sm"></i>
            )}
        </div>
    )
}
