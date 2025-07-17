'use client';

import { useState } from 'react';

const samplePost = {
  id: 1,
  title: '제주도 3박 4일 가족여행 후기',
  author: '김여행',
  authorAvatar: 'K',
  date: '2024-01-15',
  views: 1247,
  likes: 89,
  comments: 23,
  location: '제주도',
  tags: ['가족여행', '자연', '힐링'],
  images: [
    'https://readdy.ai/api/search-image?query=Beautiful%20Jeju%20Island%20family%20travel%20scene%20with%20Hallasan%20mountain%2C%20orange%20groves%2C%20and%20family%20enjoying%20peaceful%20vacation%2C%20warm%20natural%20lighting%20travel%20photography&width=800&height=500&seq=detail1&orientation=landscape',
    'https://readdy.ai/api/search-image?query=Jeju%20Island%20beautiful%20beach%20scene%20with%20clear%20blue%20water%2C%20white%20sand%2C%20and%20family%20activities%2C%20tropical%20paradise%20atmosphere%2C%20travel%20photography&width=800&height=500&seq=detail2&orientation=landscape',
    'https://readdy.ai/api/search-image?query=Jeju%20traditional%20market%20with%20local%20food%2C%20tangerines%2C%20and%20authentic%20Korean%20cultural%20experience%2C%20vibrant%20colors%20and%20bustling%20atmosphere&width=800&height=500&seq=detail3&orientation=landscape'
  ],
  content: `안녕하세요! 오랜만에 가족과 함께 제주도로 3박 4일 여행을 다녀왔어요. 정말 오랜만의 가족여행이라 모두 설레는 마음으로 출발했답니다.

## 1일차 - 도착 및 중문 관광단지

오전에 김포공항에서 출발해서 11시쯤 제주도에 도착했어요. 렌터카를 빌려서 바로 숙소로 향했습니다. 중문 관광단지 근처 펜션에서 머물렀는데, 바다가 한눈에 보이는 멋진 전망이었어요.

점심은 흑돼지 맛집에서 먹었는데 정말 맛있더라고요. 아이들도 좋아했어요. 오후에는 중문해수욕장에서 시간을 보냈는데, 날씨가 좋아서 산책하기 딱 좋았답니다.

## 2일차 - 한라산 등반

둘째 날에는 한라산 등반에 도전했어요! 아이들이 있어서 윗세오름 코스로 갔는데, 생각보다 힘들지 않아서 온 가족이 즐겁게 등반할 수 있었어요.

정상에서 보는 제주도 전경이 정말 장관이었습니다. 아이들도 처음 보는 풍경에 감탄사를 연발했어요. 하산 후에는 근처 맛집에서 고기국수를 먹었는데 등반 후 먹는 따뜻한 국물이 정말 최고였어요.

## 3일차 - 동부 해안 드라이브

셋째 날에는 동부 해안을 따라 드라이브를 했어요. 성산일출봉, 섭지코지, 우도 등을 둘러봤습니다.

특히 우도에서 보낸 시간이 가장 인상 깊었어요. 자전거를 빌려서 섬을 한 바퀴 돌았는데, 아이들이 너무 좋아했어요. 우도 땅콩 아이스크림도 먹고, 해변에서 뛰어노는 시간이 정말 행복했답니다.

## 4일차 - 서귀포 시장과 출발

마지막 날은 서귀포 매일올레시장에서 쇼핑을 했어요. 한라봉, 감귤 등 제주도 특산품들을 잔뜩 샀습니다. 아이들은 제주도 캐릭터 인형도 하나씩 골랐어요.

공항으로 가는 길에 아쉬움이 많이 남더라고요. 가족 모두 "다음에 또 오자"고 약속했답니다.

## 여행 팁

1. **렌터카 필수**: 대중교통으로는 한계가 있어요
2. **날씨 체크**: 바람이 많이 불 수 있으니 겉옷 준비
3. **맛집 예약**: 인기 맛집들은 미리 예약하는 게 좋아요
4. **충분한 일정**: 3박 4일도 아쉬울 정도로 볼 것이 많아요

정말 오랜만에 가족들과 좋은 시간을 보낼 수 있어서 너무 행복한 여행이었어요. 제주도의 아름다운 자연과 맛있는 음식, 그리고 무엇보다 가족과 함께한 소중한 시간들이 평생 기억에 남을 것 같아요.

다음에는 더 오래 머물면서 제주도 곳곳을 더 자세히 둘러보고 싶어요!`,
  schedule: [
    { day: 1, title: '중문 관광단지', activities: ['도착', '흑돼지 맛집', '중문해수욕장'] },
    { day: 2, title: '한라산 등반', activities: ['윗세오름 코스', '정상 등반', '고기국수'] },
    { day: 3, title: '동부 해안', activities: ['성산일출봉', '섭지코지', '우도 관광'] },
    { day: 4, title: '서귀포 쇼핑', activities: ['매일올레시장', '특산품 구매', '출발'] }
  ]
};

const sampleComments = [
  {
    id: 1,
    author: '여행매니아',
    avatar: '여',
    date: '2024-01-16',
    content: '정말 자세한 후기 감사해요! 저도 가족여행 계획 중인데 많은 도움이 됐어요. 한라산 등반 코스 추천해주신 것도 참고할게요.',
    likes: 12,
    replies: [
      {
        id: 11,
        author: '김여행',
        avatar: 'K',
        date: '2024-01-16',
        content: '도움이 되셨다니 기뻐요! 윗세오름 코스는 아이들과 함께 하기에 정말 좋아요. 좋은 여행 되세요!',
        likes: 5
      }
    ]
  },
  {
    id: 2,
    author: '제주도민',
    avatar: '제',
    date: '2024-01-17',
    content: '제주도민으로서 이렇게 좋게 봐주셨다니 감사해요. 다음에 오실 때는 서쪽 지역도 가보세요. 협재해수욕장이나 한림공원도 아이들이 좋아할 거예요!',
    likes: 8,
    replies: []
  },
  {
    id: 3,
    author: '가족여행러',
    avatar: '가',
    date: '2024-01-18',
    content: '우도 자전거 투어 정보가 궁금해요. 아이들 연령대가 어떻게 되시나요? 저희 아이가 7살인데 가능할까요?',
    likes: 3,
    replies: [
      {
        id: 31,
        author: '김여행',
        avatar: 'K',
        date: '2024-01-18',
        content: '저희 아이들이 8살, 11살이에요. 7살이면 부모님과 함께 타는 자전거도 있으니까 충분히 가능할 것 같아요!',
        likes: 2
      }
    ]
  }
];

interface DetsDetailProps {
  postId: number;
  onBack: () => void;
}

export default function PostDetail({ postId, onBack }: DetsDetailProps) {
  const [post, setPost] = useState(samplePost);
  const [comments, setComments] = useState(sampleComments);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: '현재사용자',
      avatar: '현',
      date: new Date().toISOString().split('T')[0],
      content: newComment,
      likes: 0,
      replies: []
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setPost({
      ...post,
      likes: isLiked ? post.likes - 1 : post.likes + 1
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <i className="ri-arrow-left-line"></i>
        <span>목록으로 돌아가기</span>
      </button>

      {/* Post Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{post.authorAvatar}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{post.author}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{post.date}</span>
              <span className="flex items-center space-x-1">
                <i className="ri-eye-line"></i>
                <span>{post.views}</span>
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {post.location}
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={toggleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <i className={isLiked ? 'ri-heart-fill' : 'ri-heart-line'}></i>
              <span>{post.likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
              <i className="ri-share-line"></i>
              <span>공유</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
              <i className="ri-bookmark-line"></i>
              <span>저장</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">여행 사진</h3>
        <div className="space-y-4">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src={post.images[activeImageIndex]}
              alt={`여행 사진 ${activeImageIndex + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {post.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`썸네일 ${index + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>
      </div>

    </div>
  );
}