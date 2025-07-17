<<<<<<< HEAD
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
=======
'use client'

import { useRef } from 'react'
import { useAISearchChat } from '../hooks/useAISearchChat'

interface Message {
    role: 'user' | 'ai'
    text: string
}

export default function AISearchExpandableInput() {
    // input 박스 ref (포커스 관리용)
    const containerRef = useRef<HTMLDivElement>(null)
    const chatMessagesRef = useRef<HTMLDivElement>(null)

    const {
        query,
        setQuery,
        isChatOpen,
        input,
        setInput,
        chatHistory,
        isLoading,
        inputRef,
        handleSend,
        openChat,
        getRecommendation,
        replyGood,
        replyBad,
        replyIDK,
        replyFinalDecision,
        generateTravelPlanSummary,
    } = useAISearchChat(containerRef, chatMessagesRef)

    return (
        <div
            ref={containerRef} //외부 클릭 감지를 위한 ref 연결
            className="w-full max-w-5xl mx-auto p-0 bg-white rounded-2xl shadow-xl border border-gray-100"
        >
            {/* 전체 컨테이너: 높이 자동 조절 + 부드러운 애니메이션 */}
            <div
                className={`border-2 rounded-xl bg-gray-50 border-gray-200 transition-all duration-300 ease-in-out ${
                    isChatOpen ? 'pb-0' : 'pb-0'
                }`}
            >
                {/* 기존 input 박스 */}
                <div className="flex items-center px-6 py-4" style={{ cursor: 'text' }} onClick={openChat}>
                    <i className="ri-map-pin-line text-gray-400 text-xl mr-4"></i>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="예: 제주도에서 3박 4일 가족여행, 부산 맛집 투어, 유럽 배낭여행 계획해줘"
                        className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
                        onFocus={openChat}
                        readOnly // 클릭해서 열리는 용도로만 사용
                    />
                    <button
                        onClick={getRecommendation}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm whitespace-nowrap"
                    >
                        추천받기
                    </button>
                </div>

                {/* input 아래에 자연스럽게 확장되는 채팅 UI */}
                <div
                    className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
                        isChatOpen ? 'max-h-[400px]' : 'max-h-0'
                    }`}
                >
                    <div className="p-6 bg-white border-t border-gray-300 rounded-b-xl flex flex-col h-[300px]">
                        <div ref={chatMessagesRef} className="flex-1 overflow-y-auto mb-4 space-y-3">
                            {chatHistory.length === 0 && (
                                <p className="text-gray-400 text-center">여기에 AI와 채팅이 표시됩니다.</p>
                            )}
                            {chatHistory.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`max-w-[80%] p-3 rounded-xl text-sm ${
                                        msg.role === 'user'
                                            ? 'bg-blue-100 self-end text-right'
                                            : 'bg-gray-100 self-start text-left'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {isLoading && <div className="text-gray-400 text-sm">AI가 응답을 작성 중입니다...</div>}
                        </div>
                        {/* 채팅 입력창 */}
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 border px-4 py-3 rounded-xl focus:outline-none"
                                placeholder="메시지를 입력하세요"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                전송
                            </button>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                {['좋아', '별로야', '모르겠어'].map((label, idx) => {
                                    let onClickHandler
                                    if (label === '좋아') {
                                        onClickHandler = replyGood
                                    } else if (label === '별로야') {
                                        onClickHandler = replyBad
                                    } else {
                                        // label === '모르겠어'
                                        onClickHandler = replyIDK
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={generateTravelPlanSummary} // onClick 핸들러 연결
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                                        >
                                            {label}
                                        </button>
                                    )
                                })}
                            </div>
                            <button
                                onClick={replyFinalDecision}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap"
                            >
                                즉시 AI 플랜 생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
>>>>>>> develop
