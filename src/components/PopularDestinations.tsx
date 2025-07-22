'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPopularLocations } from '../lib/supabase'

// 지역명 -> 대표 이미지/설명/코드 매핑
const locationMeta: { [key: string]: { name: string; image: string; description: string; code: string; sigungu?: string } } = {
    '제주도': {
        name: '제주도',
        description: '아름다운 자연과 독특한 문화가 공존하는 섬',
        image: 'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20landscape%20with%20Hallasan%20mountain%2C%20orange%20groves%2C%20and%20coastal%20scenery%2C%20clean%20minimal%20composition%20with%20soft%20natural%20lighting%2C%20travel%20destination%20photography%20style&width=400&height=300&seq=jeju1&orientation=landscape',
        code: '39',
    },
    '부산': {
        name: '부산',
        description: '바다와 도시가 어우러진 항구 도시',
        image: 'https://readdy.ai/api/search-image?query=Busan%20city%20skyline%20with%20Haeundae%20beach%2C%20colorful%20Gamcheon%20cultural%20village%20houses%2C%20and%20modern%20buildings%2C%20vibrant%20coastal%20city%20atmosphere%2C%20travel%20photography%20style&width=400&height=300&seq=busan1&orientation=landscape',
        code: '6',
    },
    '서울': {
        name: '서울',
        description: '전통과 현대가 조화로운 대한민국의 수도',
        image: 'https://readdy.ai/api/search-image?query=Seoul%20city%20featuring%20Gyeongbokgung%20palace%20with%20modern%20skyscrapers%20in%20background%2C%20traditional%20Korean%20architecture%20mixed%20with%20contemporary%20urban%20landscape%2C%20clean%20travel%20photography&width=400&height=300&seq=seoul1&orientation=landscape',
        code: '1',
    },
    '강릉': {
        name: '강릉',
        description: '동해안의 아름다운 해변과 커피 문화',
        image: 'https://readdy.ai/api/search-image?query=Gangneung%20beach%20with%20clean%20sand%20and%20pine%20trees%2C%20charming%20seaside%20cafe%20culture%2C%20peaceful%20East%20Sea%20coastline%20with%20morning%20sunlight%2C%20serene%20travel%20destination&width=400&height=300&seq=gangneung1&orientation=landscape',
        code: '32', sigungu: '1',
    },
    '전주': {
        name: '전주',
        description: '한국 전통 문화의 중심지',
        image: 'https://readdy.ai/api/search-image?query=Jeonju%20Hanok%20village%20with%20traditional%20Korean%20houses%2C%20stone%20pathways%2C%20and%20people%20in%20hanbok%2C%20authentic%20cultural%20heritage%20atmosphere%2C%20warm%20lighting%20travel%20photography&width=400&height=300&seq=jeonju1&orientation=landscape',
        code: '37', sigungu: '12',
    },
    '경주': {
        name: '경주',
        description: '천년 고도의 역사와 문화유산',
        image: 'https://readdy.ai/api/search-image?query=Gyeongju%20historical%20sites%20with%20ancient%20Korean%20temples%2C%20stone%20pagodas%2C%20and%20cherry%20blossoms%2C%20peaceful%20cultural%20heritage%20landscape%2C%20soft%20spring%20lighting&width=400&height=300&seq=gyeongju1&orientation=landscape',
        code: '35', sigungu: '2',
    },
}
const defaultMeta = {
    name: '',
    description: '인기 여행지',
    image: '/globe.svg',
    code: '',
}

export default function PopularDestinations() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [popularLocations, setPopularLocations] = useState<any[]>([])
    const itemsPerView = 3
    const router = useRouter()

    useEffect(() => {
        (async () => {
            const result = await getPopularLocations(6)
            setPopularLocations(result)
        })()
    }, [])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + itemsPerView >= popularLocations.length ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? Math.max(popularLocations.length - itemsPerView, 0) : prev - 1))
    }

    const goToPlaceList = (areaCode?: string | null, sigungu?: string | null) => {
        const query = new URLSearchParams()
        if (areaCode) query.set('areaCode', areaCode)
        if (sigungu) query.set('sigungu', sigungu)
        router.push(`/places?${query.toString()}`)
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">인기 여행지</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        다른 여행자들이 가장 많이 찾는 여행지를 확인해보세요
                    </p>
                </div>

                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <i className="ri-arrow-left-line text-gray-600 text-xl"></i>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        <i className="ri-arrow-right-line text-gray-600 text-xl"></i>
                    </button>

                    {/* Destinations Grid */}
                    <div className="overflow-hidden mx-12">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                        >
                            {popularLocations.map((loc, idx) => {
                                const meta = locationMeta[loc.location] || { ...defaultMeta, name: loc.location }
                                return (
                                    <div
                                        key={loc.location}
                                        className="w-1/3 flex-shrink-0 px-4"
                                        onClick={() => goToPlaceList(meta.code, meta.sigungu)}
                                    >
                                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={meta.image}
                                                    alt={meta.name}
                                                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-gray-800">{meta.name}</h3>
                                                </div>
                                                <p className="text-gray-600 mb-4">{meta.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: Math.ceil(popularLocations.length / itemsPerView) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index * itemsPerView)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    Math.floor(currentIndex / itemsPerView) === index ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
