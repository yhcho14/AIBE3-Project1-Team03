"use client";

import { useRecommendation } from '../hooks/useRecommendation';

interface RecommendationButtonProps {
  postId: string;
  userId: string | null;
}

export default function RecommendationButton({ postId, userId }: RecommendationButtonProps) {
  const {
    count,
    isRecommended,
    loading,
    toggleRecommendation,
  } = useRecommendation(postId, userId);

  return (
    <button
      type="button"
      onClick={toggleRecommendation}
      disabled={loading || !userId}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors
        ${isRecommended ? 'bg-pink-100 border-pink-300 text-pink-600' : 'bg-white border-gray-300 text-gray-600'}
        ${!userId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-50 hover:border-pink-400'}
      `}
      title={userId ? (isRecommended ? '추천 취소' : '추천하기') : '로그인 후 이용'}
    >
      <span className="text-xl">
        {isRecommended ? '❤️' : '🤍'}
      </span>
      <span className="font-semibold">{count}</span>
      <span className="text-sm">추천</span>
    </button>
  );
} 