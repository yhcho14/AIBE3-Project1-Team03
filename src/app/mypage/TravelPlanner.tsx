
'use client';

import { useState } from 'react';

interface TravelPlan {
  id: number;
  title: string;
  numTravelers?: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  transportation: string;
  accommodation: string;
  estimatedCost: number;
  notes: string;
  createdAt: string;
  status: 'draft' | 'confirmed' | 'completed';
  schedule?: {
    title: string;
    startTime: Date;
    endTime: Date;
    note: string;
  }[];
}

const samplePlans: TravelPlan[] = [
  {
    id: 1,
    title: '부산 바다 여행',
    numTravelers: 2,
    startDate: '2024-07-16',
    endDate: '2024-07-18',
    durationDays: 3,
    transportation: 'KTX',
    accommodation: '해운대 호텔',
    estimatedCost: 450000,
    notes: 'AI 추천으로 생성된 부산 여행 계획입니다.',
    createdAt: '2024-01-15',
    status: 'draft',
    schedule: [
      {
        title: '부산 바다 여행',
        startTime: new Date('2024-07-16T10:00:00'),
        endTime: new Date('2024-07-18T18:00:00'),
        note: '부산 바다 여행 계획입니다.',
      },
    ],
  },
  {
    id: 2,
    title: '제주도 힐링 여행',
    numTravelers: 4,
    startDate: '2024-08-10',
    endDate: '2024-08-13',
    durationDays: 4,
    transportation: '항공편',
    accommodation: '서귀포 펜션',
    estimatedCost: 680000,
    notes: '가족과 함께하는 제주도 여행',
    createdAt: '2024-01-10',
    status: 'confirmed',
    schedule: [
      {
        title: '제주도 힐링 여행',
        startTime: new Date('2024-08-10T10:00:00'),
        endTime: new Date('2024-08-13T18:00:00'),
        note: '제주도 힐링 여행 계획입니다.',
      },
    ],
  },
  {
    id: 3,
    title: '경주 역사 탐방',
    numTravelers: 4,
    startDate: '2023-12-20',
    endDate: '2023-12-22',
    durationDays: 3,
    transportation: '고속버스',
    accommodation: '경주 게스트하우스',
    estimatedCost: 280000,
    notes: '역사와 문화를 체험하는 여행',
    createdAt: '2023-12-01',
    status: 'completed',
    schedule: [
      {
        title: '경주 역사 탐방',
        startTime: new Date('2023-12-20T10:00:00'),
        endTime: new Date('2023-12-22T18:00:00'),
        note: '경주 역사 탐방 계획입니다.',
      },
    ],
  },
];

export default function TravelPlanner() {
  const [plans, setPlans] = useState<TravelPlan[]>(samplePlans);
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<TravelPlan>>({
    title: '',
    numTravelers: 0,
    startDate: '',
    endDate: '',
    transportation: '',
    accommodation: '',
    estimatedCost: 0,
    notes: '',
  });

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleCreatePlan = () => {
    if (!newPlan.title || !newPlan.startDate || !newPlan.endDate) return;
    const duration = calculateDuration(newPlan.startDate, newPlan.endDate);
    const plan: TravelPlan = {
      id: Date.now(),
      title: newPlan.title,
      numTravelers: newPlan.numTravelers || 0,
      startDate: newPlan.startDate,
      endDate: newPlan.endDate,
      durationDays: duration,
      transportation: newPlan.transportation || '',
      accommodation: newPlan.accommodation || '',
      estimatedCost: newPlan.estimatedCost || 0,
      notes: newPlan.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      schedule: [],
    };
    setPlans([plan, ...plans]);
    setNewPlan({});
    setIsCreating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '임시저장';
      case 'confirmed': return '확정';
      case 'completed': return '완료';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">여행 플래너</h2>
          <p className="text-gray-600 mt-1">새로운 여행을 계획하고 관리하세요</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          <span>새 계획 추가</span>
        </button>
      </div>

      {/* Create New Plan Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">새 여행 계획</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">여행 제목</label>
                <input
                  type="text"
                  value={newPlan.title || ''}
                  onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                  placeholder="예: 부산 바다 여행"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">여행 인원</label>
                <input
                  type="number"
                  value={newPlan.numTravelers || ''}
                  onChange={(e) => setNewPlan({...newPlan, numTravelers: parseInt(e.target.value)})}
                  placeholder="예: 4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                  <input
                    type="date"
                    value={newPlan.startDate || ''}
                    onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                  <input
                    type="date"
                    value={newPlan.endDate || ''}
                    onChange={(e) => setNewPlan({...newPlan, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">교통편</label>
                <input
                  type="text"
                  value={newPlan.transportation || ''}
                  onChange={(e) => setNewPlan({...newPlan, transportation: e.target.value})}
                  placeholder="예: KTX, 항공편, 자차"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">숙박</label>
                <input
                  type="text"
                  value={newPlan.accommodation || ''}
                  onChange={(e) => setNewPlan({...newPlan, accommodation: e.target.value})}
                  placeholder="예: 호텔, 펜션, 게스트하우스"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">예상 비용 (원)</label>
                <input
                  type="number"
                  value={newPlan.estimatedCost || ''}
                  onChange={(e) => setNewPlan({...newPlan, estimatedCost: parseInt(e.target.value)})}
                  placeholder="예: 500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                <textarea
                  value={newPlan.notes || ''}
                  onChange={(e) => setNewPlan({...newPlan, notes: e.target.value})}
                  rows={3}
                  placeholder="여행에 대한 메모를 남겨주세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                취소
              </button>
              <button
                onClick={handleCreatePlan}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{plans.length}</div>
              <div className="text-blue-100">총 계획</div>
            </div>
            <i className="ri-calendar-line text-3xl text-blue-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {plans.filter(p => p.status === 'draft').length}
              </div>
              <div className="text-yellow-100">임시저장</div>
            </div>
            <i className="ri-draft-line text-3xl text-yellow-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {plans.filter(p => p.status === 'confirmed').length}
              </div>
              <div className="text-green-100">확정된 계획</div>
            </div>
            <i className="ri-check-line text-3xl text-green-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {(plans.reduce((acc, plan) => acc + plan.estimatedCost, 0) / 10000).toFixed(0)}만원
              </div>
              <div className="text-purple-100">총 예산</div>
            </div>
            <i className="ri-wallet-line text-3xl text-purple-200"></i>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                    {getStatusText(plan.status)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <i className="ri-calendar-line text-blue-500"></i>
                    <span>{plan.startDate} ~ {plan.endDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-time-line text-green-500"></i>
                    <span>{plan.durationDays}일</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-train-line text-purple-500"></i>
                    <span>{plan.transportation || '미정'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="ri-wallet-line text-orange-500"></i>
                    <span>{plan.estimatedCost.toLocaleString()}원</span>
                  </div>
                </div>
                {plan.accommodation && (
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                    <i className="ri-hotel-line text-pink-500"></i>
                    <span>{plan.accommodation}</span>
                  </div>
                )}
                {plan.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{plan.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-1"></i>
                  수정
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
                  <i className="ri-share-line mr-1"></i>
                  공유
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                생성일: {plan.createdAt}
              </div>
              <div className="flex space-x-2">
                {plan.status === 'draft' && (
                  <button className="px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors whitespace-nowrap">
                    확정하기
                  </button>
                )}
                <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs hover:bg-gray-300 transition-colors whitespace-nowrap">
                  상세보기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-calendar-line text-gray-400 text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">여행 계획이 없습니다</h3>
          <p className="text-gray-600 mb-6">새로운 여행을 계획해보세요!</p>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            첫 여행 계획하기
          </button>
        </div>
      )}

      {/* AI Recommendation Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">AI 여행 추천</h3>
            <p className="text-purple-100">메인페이지에서 받은 AI 추천을 바탕으로 자동으로 여행 계획을 생성해보세요</p>
          </div>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium whitespace-nowrap">
            <i className="ri-magic-line mr-2"></i>
            AI 추천 받기
          </button>
        </div>
      </div>
    </div>
  );
}
