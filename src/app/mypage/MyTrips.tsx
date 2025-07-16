'use client';

import { useState } from 'react';

const sampleTrips = [
  {
    id: 1,
    title: '제주도 힐링 여행',
    destination: '제주도',
    startDate: '2024-02-15',
    endDate: '2024-02-18',
    status: 'upcoming',
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20sunset%20with%20Hallasan%20mountain%20in%20background%2C%20peaceful%20orange%20sky%20and%20natural%20landscape%2C%20travel%20destination%20photography%20style%20with%20warm%20lighting&width=400&height=250&seq=trip1&orientation=landscape',
    participants: 4,
    budget: 800000
  },
  {
    id: 2,
    title: '부산 바다 여행',
    destination: '부산',
    startDate: '2024-01-10',
    endDate: '2024-01-13',
    status: 'completed',
    image: 'https://readdy.ai/api/search-image?query=Busan%20Haeundae%20beach%20with%20blue%20ocean%20waves%20and%20city%20skyline%2C%20beautiful%20coastal%20scenery%20with%20clear%20sky%2C%20modern%20travel%20photography%20style&width=400&height=250&seq=trip2&orientation=landscape',
    participants: 2,
    budget: 600000
  },
  {
    id: 3,
    title: '서울 문화 탐방',
    destination: '서울',
    startDate: '2023-12-20',
    endDate: '2023-12-23',
    status: 'completed',
    image: 'https://readdy.ai/api/search-image?query=Seoul%20Gyeongbokgung%20palace%20with%20traditional%20Korean%20architecture%2C%20beautiful%20autumn%20colors%20and%20cultural%20heritage%20atmosphere%2C%20travel%20photography&width=400&height=250&seq=trip3&orientation=landscape',
    participants: 3,
    budget: 450000
  }
];

export default function MyTrips() {
  const [trips, setTrips] = useState(sampleTrips);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTrips = filterStatus === 'all' 
    ? trips 
    : trips.filter(trip => trip.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return '예정';
      case 'ongoing': return '진행중';
      case 'completed': return '완료';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">내 여행</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap">
          <i className="ri-add-line"></i>
          <span>새 여행 추가</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'all', name: '전체', count: trips.length },
          { id: 'upcoming', name: '예정', count: trips.filter(t => t.status === 'upcoming').length },
          { id: 'ongoing', name: '진행중', count: trips.filter(t => t.status === 'ongoing').length },
          { id: 'completed', name: '완료', count: trips.filter(t => t.status === 'completed').length }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
              filterStatus === filter.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <span>{filter.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filterStatus === filter.id ? 'bg-white/20' : 'bg-gray-300'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                  {getStatusText(trip.status)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">{trip.title}</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="ri-more-2-line"></i>
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="ri-map-pin-line mr-2"></i>
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="ri-calendar-line mr-2"></i>
                  <span>{trip.startDate} ~ {trip.endDate}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="ri-group-line mr-2"></i>
                  <span>{trip.participants}명</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="ri-wallet-line mr-2"></i>
                  <span>{trip.budget.toLocaleString()}원</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm whitespace-nowrap">
                  상세보기
                </button>
                {trip.status === 'upcoming' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
                    수정
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-suitcase-line text-gray-400 text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">여행이 없습니다</h3>
          <p className="text-gray-600 mb-6">새로운 여행을 계획해보세요!</p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap">
            첫 여행 계획하기
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">여행 통계</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{trips.length}</div>
            <div className="text-sm text-gray-600">총 여행</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {trips.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">완료된 여행</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {trips.reduce((acc, trip) => acc + trip.participants, 0)}
            </div>
            <div className="text-sm text-gray-600">총 참가자</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(trips.reduce((acc, trip) => acc + trip.budget, 0) / 10000).toFixed(0)}만원
            </div>
            <div className="text-sm text-gray-600">총 예산</div>
          </div>
        </div>
      </div>
    </div>
  );
}