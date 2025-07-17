"use client";

import { useState, useEffect } from 'react';
import { usePost, PostFormData } from '../../../../hooks/usePost';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

interface PostEditClientProps {
  postId: string;
}

export default function PostEditClient({ postId }: PostEditClientProps) {
  const {
    post,
    loading,
    error,
    updatePost,
    formatTagsForForm,
    router,
  } = usePost(postId);

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    contents: '',
    location: '',
    tags: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // 기존 게시글 데이터를 폼에 설정
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        contents: post.contents || '',
        location: post.location || '',
        tags: formatTagsForForm(post.tags),
        image: post.image || '',
      });
    }
  }, [post, formatTagsForForm]);

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

    const success = await updatePost(formData);
    setIsLoading(false);
  };

  const handleCancel = () => {
    router.push(`/board/${postId}`);
  };

  const locations = ['제주도', '부산', '서울', '강릉', '전주', '경주', '속초', '기타'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center py-20 text-gray-500">게시글을 불러오는 중...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center py-20">
              <div className="text-gray-500 mb-4">{error}</div>
              <button
                onClick={() => router.push('/board')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">게시글 수정</h1>
                <p className="text-gray-600">게시글 내용을 수정해주세요</p>
              </div>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <i className="ri-arrow-left-line"></i>
                <span>돌아가기</span>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="이미지 링크를 입력하세요 (예: https://example.com/image.jpg)"
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
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
                      <span>수정 중...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line"></i>
                      <span>수정 완료</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 