'use client';

import { useState } from 'react';

// 12


const samplePosts = [
  {
    id: 1,
    title: '제주도 3박 4일 가족여행 후기',
    author: '김여행',
    date: '2024-01-15',
    views: 1247,
    likes: 89,
    comments: 23,
    location: '제주도',
    tags: ['가족여행', '자연', '힐링'],
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20family%20travel%20scene%20with%20Hallasan%20mountain%2C%20orange%20groves%2C%20and%20family%20enjoying%20peaceful%20vacation%2C%20warm%20natural%20lighting%20travel%20photography&width=400&height=250&seq=post1&orientation=landscape',
    excerpt: '가족과 함께한 제주도 여행이 정말 좋았어요. 한라산 등반부터 오름 트레킹까지...'
  },
];

interface PostListProps {
  onSelectPost: (postId: number) => void;
}

export default function PostList({ onSelectPost }: PostListProps) {
  const [posts, setPosts] = useState(samplePosts);
  const [sortBy, setSortBy] = useState('latest');
  const [filterLocation, setFilterLocation] = useState('all');

  const locations = ['all', '제주도', '부산', '서울', '강릉', '전주', '경주', '속초'];
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'views', label: '조회순' }
  ];

  const filteredAndSortedPosts = posts
    .filter(post => filterLocation === 'all' || post.location === filterLocation)
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

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
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post.id)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative h-48">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/70 text-white rounded-full text-xs">
                  {post.location}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <i className="ri-user-line"></i>
                    <span>{post.author}</span>
                  </span>
                  <span>{post.date}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <i className="ri-eye-line"></i>
                    <span>{post.views}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <i className="ri-heart-line"></i>
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <i className="ri-message-2-line"></i>
                    <span>{post.comments}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
          <i className="ri-arrow-left-line"></i>
        </button>
        
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`px-4 py-2 rounded-lg transition-colors ${
              page === 1
                ? 'bg-blue-500 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <i className="ri-arrow-right-line"></i>
        </button>
      </div>
    </div>
  );
}