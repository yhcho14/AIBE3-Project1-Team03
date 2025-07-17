'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

interface PostWriteProps {
  onBack: () => void;
}

export default function PostWrite({ onBack }: PostWriteProps) {
  const [formData, setFormData] = useState({
    title: '',
    contents: '',
    location: '',
    tags: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name === 'image_url' ? 'image' : name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Supabase에 게시글 저장
    const { data, error } = await supabase.from('posts').insert([
      {
        title: formData.title,
        contents: formData.contents,
        location: formData.location,
        tags: formData.tags.split(',').map((tag) => tag.trim()),
        image: formData.image,
        // user_id는 auth.uid() 기본값 사용
      },
    ]).select();

    setIsLoading(false);
    if (error) {
      alert('게시글 저장 중 오류가 발생했습니다.');
      return;
    }
    
    // 새로 생성된 게시글의 ID를 받아서 상세 페이지로 이동
    if (data && data[0]) {
      alert('게시글이 작성되었습니다!');
      router.push(`/board/${data[0].id}`);
    } else {
      alert('게시글이 작성되었습니다!');
      onBack();
    }
  };

  const locations = ['제주도', '부산', '서울', '강릉', '전주', '경주', '속초', '기타'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">게시글 작성</h1>
            <p className="text-gray-600">소중한 여행 경험을 다른 여행자들과 나누어보세요</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            <span>목록으로</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="여행 후기 제목을 입력하세요"
              required
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              여행 후기 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="contents"
              value={formData.contents}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="여행 경험을 자세히 작성해주세요. 어떤 곳을 갔는지, 무엇을 먹었는지, 어떤 느낌이었는지 등등..."
              required
            />
          </div>

          {/* 이미지 미리보기 */}
          {formData.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 미리보기
              </label>
              <div className="relative h-48 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.image}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* 여행지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              여행지 <span className="text-red-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">여행지를 선택해주세요</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예: 맛집, 뷰, 체험"
            />
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 URL (선택사항)
            </label>
            <textarea
              name="image_url"
              value={formData.image}
              onChange={handleChange}
              rows={2}
              autoComplete="off"
              spellCheck="false"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2ocus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="이미지 링크를 입력하세요 (예: https://example.com/image.jpg)"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>작성 중...</span>
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line"></i>
                  <span>게시글 작성</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 