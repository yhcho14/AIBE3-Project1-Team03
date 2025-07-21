'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import TravelPlanner from './TravelPlanner'
import UserProfile from './UserProfile'
import TravelDetail from './TravelDetail'
import { useState } from 'react'

export default function MyPage() {
    const [activeTab, setActiveTab] = useState('planner')
    const [selectedTravelId, setSelectedTravelId] = useState<number | null>(null)

    const handleTravelDetailView = (travelId: number) => {
        setSelectedTravelId(travelId)
        setActiveTab('trips')
    }

    const tabs = [
        { id: 'planner', name: '여행 플래너', icon: 'ri-calendar-line' },
        { id: 'trips', name: '여행 세부계획', icon: 'ri-map-2-line' },
        { id: 'profile', name: '프로필', icon: 'ri-user-line' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">마이페이지</h1>
                        <p className="text-gray-600">여행 계획을 세우고 관리해보세요</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                        <div className="flex border-b border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <i className={`${tab.icon} mr-2`}></i>
                                    {tab.name}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'planner' && <TravelPlanner onDetailView={handleTravelDetailView} />}
                            {/* {activeTab === 'trips' && <MyTrips />} */}
                            {activeTab === 'trips' && <TravelDetail selectedTravelId={selectedTravelId} />}
                            {activeTab === 'profile' && <UserProfile />}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
