'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import getPlacesList from '../../lib/api/public-data-api'
import { Place } from '../../lib/types/placeType'
import Dropdown from '../../components/Dropdown'
import Pagination from '../../components/Pagination'
import SearchBar from './components/SearchBar'
import LocationSelector from './components/LocationSelector'
import PlaceCard from './components/PlaceCard'
import LoadingSkeleton from './components/LoadingSkeleton'
import NoResultsMessage from './components/NoResultsMessage'

export const PLACE_CONTENT_TYPE_MAP = new Map<string, string>([
    ['12', '관광지'],
    ['25', '여행코스'],
    ['32', '숙박'],
    ['39', '음식점'],
    ['14', '문화시설'],
    ['15', '축제행사'],
    ['28', '레포츠'],
    ['38', '쇼핑'],
])

const sortOptions = [
    { value: 'R', label: '등록일순' },
    { value: 'O', label: '제목순' },
    { value: 'Q', label: '수정일순' },
]

const categories = Array.from(PLACE_CONTENT_TYPE_MAP)
const categoryOptions = [
    { value: '', label: '유형 전체' },
    ...categories.map((cat) => ({ value: cat[0].toString(), label: cat[1] })),
]

const API_TYPE_AREA_BASED_LIST = 'areaBasedList2'
const API_TYPE_SEARCH_KEYWORD_LIST = 'searchKeyword2'

interface PlaceListProps {
    initialAreaCode?: string | null
    initialSigungu?: string | null
}

export default function PlaceList({ initialAreaCode, initialSigungu }: PlaceListProps) {
    const [places, setPlaces] = useState<Place[]>([])
    const [sortBy, setSortBy] = useState(sortOptions[0].value)
    const [selectedAreaCode, setSelectedAreaCode] = useState<string | null>(null)
    const [selectedSigunguCode, setSelectedSigunguCode] = useState<string | null>(null)
    const [filterCategory, setFilterCategory] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [searchKeyword, setSearchKeyword] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const pageSize = 12
    const pageGroupSize = 5
    const topRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (initialAreaCode) {
            setSelectedAreaCode(initialAreaCode)
        }
    }, [initialAreaCode])
    useEffect(() => {
        if (initialSigungu) {
            setSelectedSigunguCode(initialSigungu)
        }
    }, [initialSigungu])

    useEffect(() => {
        const queryParams = [
            searchKeyword
                ? `apiType=${API_TYPE_SEARCH_KEYWORD_LIST}&keyword=${encodeURIComponent(searchKeyword)}`
                : `apiType=${API_TYPE_AREA_BASED_LIST}`,
            `pageNo=${currentPage}`,
            `numOfRows=${pageSize}`,
            sortBy ? `arrange=${sortBy}` : '',
            filterCategory !== '' ? `contentTypeId=${filterCategory}` : '',
            selectedAreaCode ? `areaCode=${selectedAreaCode}` : '',
            selectedSigunguCode ? `sigunguCode=${selectedSigunguCode}` : '',
        ]
            .filter(Boolean)
            .join('&')

        setIsLoading(true)
        getPlacesList<Place>(queryParams).then((data) => {
            const items = data?.response?.body?.items?.item || []
            setPlaces(items)
            setTotalCount(Number(data?.response?.body?.totalCount) || 0)
            setIsLoading(false)
            setInputValue(searchKeyword)
        })
    }, [currentPage, sortBy, selectedAreaCode, selectedSigunguCode, filterCategory, searchKeyword])

    const handleAddToTravel = (placeId: string) => {
        console.log('Add to travel:', placeId)
    }

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword)
        setCurrentPage(1)
    }

    const handleLocationChange = (areaCode: string | null, sigunguCode: string | null) => {
        setSelectedAreaCode(areaCode)
        setSelectedSigunguCode(sigunguCode)
        setCurrentPage(1)
    }

    const handleSortChange = (value: string) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    const handleCategoryChange = (value: string) => {
        setFilterCategory(value)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number, byArrow?: boolean) => {
        setCurrentPage(page)
        if (!byArrow) {
            topRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div ref={topRef} className="space-y-6">
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} inputValue={inputValue} setInputValue={setInputValue} />

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <LocationSelector
                    selectedAreaCode={selectedAreaCode}
                    selectedSigunguCode={selectedSigunguCode}
                    onLocationSelect={handleLocationChange}
                />
                <div className="flex flex-row items-center space-x-2">
                    <Dropdown options={categoryOptions} selected={filterCategory} onSelect={handleCategoryChange} />
                    <Dropdown options={sortOptions} selected={sortBy} onSelect={handleSortChange} />
                </div>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingSkeleton />}
            {!isLoading && (
                <>
                    {/* Results Count */}
                    <div className="text-sm text-gray-600">총 {totalCount.toLocaleString()}개의 결과를 찾았습니다.</div>

                    {/* Places Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {places.map((place) => (
                            <PlaceCard
                                key={place.contentid}
                                place={place}
                                filterCategory={filterCategory}
                                PLACE_CONTENT_TYPE_MAP={PLACE_CONTENT_TYPE_MAP}
                                hoveredPlaceId={hoveredPlaceId}
                                onAddToTravel={handleAddToTravel}
                                setHoveredPlaceId={setHoveredPlaceId}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* No Results */}
            {!isLoading && places.length === 0 && <NoResultsMessage />}

            {/* Pagination */}
            {!isLoading && totalCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    pageGroupSize={pageGroupSize}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
}
