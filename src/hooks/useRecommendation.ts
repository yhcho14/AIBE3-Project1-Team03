import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRecommendation(postId: string, userId: string | null) {
  const [count, setCount] = useState(0);
  const [isRecommended, setIsRecommended] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 추천 수와 본인 추천 여부 조회
  const fetchRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      // 추천 수
      const { count: total, error: countError } = await supabase
        .from('recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
      if (countError) throw countError;
      setCount(total || 0);

      // 본인 추천 여부
      let recommended = false;
      if (userId) {
        const { data, error: recError } = await supabase
          .from('recommendations')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();
        if (recError) throw recError;
        recommended = !!data;
      }
      setIsRecommended(recommended);
    } catch (err: any) {
      setError('추천 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 추천 추가
  const addRecommendation = async () => {
    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    try {
      const { error } = await supabase
        .from('recommendations')
        .insert([
          { post_id: parseInt(postId), user_id: userId },
        ]);
      if (error) throw error;
      await fetchRecommendation();
    } catch (err) {
      alert('추천 중 오류가 발생했습니다.');
    }
  };

  // 추천 취소
  const removeRecommendation = async () => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from('recommendations')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      if (error) throw error;
      await fetchRecommendation();
    } catch (err) {
      alert('추천 취소 중 오류가 발생했습니다.');
    }
  };

  // 토글
  const toggleRecommendation = async () => {
    if (isRecommended) {
      await removeRecommendation();
    } else {
      await addRecommendation();
    }
  };

  useEffect(() => {
    if (postId && userId) {
      fetchRecommendation();
    }
  }, [postId, userId]);

  return {
    count,
    isRecommended,
    loading,
    error,
    toggleRecommendation,
    fetchRecommendation,
  };
} 