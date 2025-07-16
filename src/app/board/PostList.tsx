'use client';

import { useState } from 'react';

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
  {
    id: 2,
    title: '부산 해운대 맛집 투어 완전 정복!',
    author: '맛집탐험가',
    date: '2024-01-12',
    views: 892,
    likes: 56,
    comments: 18,
    location: '부산',
    tags: ['맛집', '해산물', '로컬푸드'],
    image: 'https://readdy.ai/api/search-image?query=Busan%20Haeundae%20delicious%20seafood%20restaurant%20scene%20with%20fresh%20sashimi%2C%20grilled%20fish%2C%20and%20beautiful%20ocean%20view%20dining%20experience%2C%20appetizing%20food%20photography&width=400&height=250&seq=post2&orientation=landscape',
    excerpt: '부산 현지인이 추천하는 진짜 맛집들을 찾아다녔어요. 회센터부터 골목 맛집까지...'
  },
  {
    id: 3,
    title: '경주 역사 문화 체험 여행',
    author: '역사마니아',
    date: '2024-01-10',
    views: 734,
    likes: 43,
    comments: 12,
    location: '경주',
    tags: ['역사', '문화', '체험'],
    image: 'https://readdy.ai/api/search-image?query=Gyeongju%20historical%20cultural%20sites%20with%20ancient%20Korean%20temples%2C%20stone%20pagodas%2C%20and%20traditional%20architecture%2C%20peaceful%20heritage%20atmosphere%20with%20soft%20lighting&width=400&height=250&seq=post3&orientation=landscape',
    excerpt: '천년 고도 경주에서 우리나라 역사를 직접 체험할 수 있었어요. 불국사와 석굴암...'
  },
  {
    id: 4,
    title: '강릉 바다와 커피 여행',
    author: '커피러버',
    date: '2024-01-08',
    views: 1089,
    likes: 72,
    comments: 29,
    location: '강릉',
    tags: ['바다', '커피', '힐링'],
    image: 'https://readdy.ai/api/search-image?query=Gangneung%20beautiful%20beach%20cafe%20scene%20with%20ocean%20view%2C%20artisan%20coffee%2C%20and%20peaceful%20seaside%20atmosphere%2C%20cozy%20travel%20photography%20with%20warm%20morning%20light&width=400&height=250&seq=post4&orientation=landscape',
    excerpt: '강릉의 아름다운 바다를 보며 마시는 커피 한 잔의 여유로움을 만끽했어요...'
  },
  {
    id: 5,
    title: '전주 한옥마을 야경 사진 찍기',
    author: '사진작가',
    date: '2024-01-05',
    views: 945,
    likes: 68,
    comments: 15,
    location: '전주',
    tags: ['사진', '야경', '한옥'],
    image: 'https://readdy.ai/api/search-image?query=Jeonju%20Hanok%20village%20beautiful%20night%20scene%20with%20traditional%20Korean%20houses%2C%20warm%20lantern%20lighting%2C%20and%20atmospheric%20evening%20photography%2C%20cultural%20heritage%20mood&width=400&height=250&seq=post5&orientation=landscape',
    excerpt: '전주 한옥마을의 밤은 정말 아름다워요. 전통 가옥들 사이로 스며드는 은은한 조명...'
  },
  {
    id: 6,
    title: '속초 동해바다 일출 여행',
    author: '일출헌터',
    date: '2024-01-03',
    views: 678,
    likes: 41,
    comments: 8,
    location: '속초',
    tags: ['일출', '바다', '자연'],
    image: 'https://readdy.ai/api/search-image?query=Sokcho%20East%20Sea%20beautiful%20sunrise%20scene%20with%20golden%20light%20reflecting%20on%20ocean%20waves%2C%20peaceful%20morning%20atmosphere%2C%20breathtaking%20natural%20landscape%20photography&width=400&height=250&seq=post6&orientation=landscape',
    excerpt: '속초 해변에서 본 일출이 정말 장관이었어요. 새해 첫 일출을 보며 소원을 빌었답니다...'
  }
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
          
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap">
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