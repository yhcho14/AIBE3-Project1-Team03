'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AISearchBar() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      router.push('/mypage');
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            AI와 함께 계획하는 완벽한 여행
          </h2>
          <p className="text-gray-600 text-lg">
            어디로 떠나고 싶으신가요? AI가 맞춤형 여행 계획을 추천해드립니다.
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
            <div className="pl-6 pr-4">
              <i className="ri-map-pin-line text-gray-400 text-xl"></i>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 제주도에서 3박 4일 가족여행, 부산 맛집 투어, 유럽 배낭여행 계획해줘"
              className="flex-1 py-4 px-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>AI 분석 중...</span>
                </>
              ) : (
                <>
                  <i className="ri-sparkling-fill"></i>
                  <span>AI 추천 받기</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {['제주도 힐링 여행', '서울 맛집 투어', '부산 해변 여행', '강원도 스키장', '경주 역사 탐방'].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm whitespace-nowrap"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}