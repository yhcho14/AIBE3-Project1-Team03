'use client'

import { useState } from 'react'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PlaceList from './PlaceList'
import PlaceDetail from './PlaceDetail'

export default function PlacesPage() {
    const [selectedPlace, setSelectedPlace] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">여행지</h1>
                        <p className="text-gray-600">다음 여행을 위한 특별한 장소를 찾아보세요</p>
                    </div>

                    {selectedPlace ? (
                        <PlaceDetail placeId={selectedPlace} onBack={() => setSelectedPlace(null)} />
                    ) : (
                        <PlaceList onSelectPlace={setSelectedPlace} />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
