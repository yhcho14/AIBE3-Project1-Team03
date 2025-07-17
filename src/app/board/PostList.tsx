'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  contents: string;
  created_at: string;
  user_id: string;
  image?: string;
  tags?: string[];
  location?: string;
}

interface PostListProps {
  onWritePost: () => void;
}

export default function PostList({ onWritePost }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [filterLocation, setFilterLocation] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const locations = ['all', '제주도', '부산', '서울', '강릉', '전주', '경주', '속초'];
  const sortOptions = [
    { value: 'latest', label: '최신순' },
  ];

  const filteredAndSortedPosts = posts
    .sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (loading) {
    return <div className="text-center py-20 text-gray-500">게시글을 불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setFilterLocation(location)}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                filterLocation === location
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {location === 'all' ? '전체' : location}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors pr-8">
              <span className="text-sm text-gray-600">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <i className="ri-arrow-down-s-line text-gray-400"></i>
            </button>
          </div>
          <button
            onClick={onWritePost}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            <span>글쓰기</span>
          </button>
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => router.push(`/board/${post.id}`)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            {post.image && (
              <div className="relative h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover object-top"
                />
                {post.location && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/70 text-white rounded-full text-xs">
                      {post.location}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.contents.slice(0, 60)}
              </p>
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(post.tags)
                    ? post.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="text-gray-600 text-xs">
                          {tag}
                        </span>
                      ))
                    : (typeof post.tags === 'string'
                        ? (post.tags as string).replace(/\[|\]|"/g, "").split(',').map((tag: string, idx: number) => (
                            <span key={idx} className="text-gray-600 text-xs">
                              {tag.trim()}
                            </span>
                          ))
                        : null)
                  }
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.created_at?.slice(0, 10)}</span>
                <span>작성자: {post.user_id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* 페이지네이션 제거됨 */}
    </div>
  );
}