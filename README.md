# 🧭 여행 계획 추천 플랫폼 - Team_3

---

## 📅 개발기간  
**2025년 7월 14일 ~ 2025년 7월 22일**

---

## 🛠️ 협업

- ERDCloud
  https://www.erdcloud.com/team/L4ydcGYcCE8nYE7yW

- 팀 GitHub 저장소  
  [GitHub - prgrms-aibe-devcourse/AIBE3-Project1-Team03](https://github.com/prgrms-aibe-devcourse/AIBE3-Project1-Team03)

- Supabase 프로젝트  
  https://supabase.com/dashboard/org/apqwwcdackfqjowjqhdm

- Figma 와이어 프레임  
  https://www.figma.com/design/GB3ZCwImVjbL9IIx5obRd4/Untitled?node-id=0-1&p=f&t=fO2m2fxWTfL5CYZh-0
  
---

## 🎯 제작 목적

- 사용자들에게 많은 관광지 정보 중 적합한 관광지 추천  
- 여행을 가고 싶지만 어디를 가야할지 모르는 사람들에게 지역 추천  
- 여행 계획이 서투른 사람들에게 AI가 자동으로 경로 추천  

---

## 🌟 핵심 서비스

- 최적의 여행 경로 추천  
- 주변 숙박 업소 추천  
- 여행 일정 간 해당 지역의 날씨 확인  
- 이용 가능한 교통편 안내  
- 예상 총 여행 비용 제공  
- 여행 일정을 관리할 수 있는 **여행 플래너**  
- 유저 간 소통을 위한 **공유 게시판**  

---

## 🔧 주요 기능

- 여행지 추천  
- AI 추천 일정 생성  
- 관광지/숙소 추천  
- 북마크 기능 (내 여행 일정으로 저장)  
- 여행지별 후기 페이지 CRUD + 검색/필터/추천  
- 로그인 / 회원가입  
- 여행 일정 생성 및 편집 (캘린더)  
- 프로필 수정 및 조회  
- 여행 사진 및 후기 작성 기능  

---

## ⚠ 예상 문제점

- AI 일정 생성 시 사용자의 의도를 정확히 반영하기 어려움  
- 외부 API 호출 시 응답 지연 또는 일시적 장애 가능성  
- 위치 기반 서비스 사용 시 브라우저 권한 문제  
- 사용자 일정 데이터의 보안 및 저장 처리 이슈  

---

## 👨‍👩‍👧‍👦 팀원 및 업무 분담

| 기능                     | 담당자   | 주요 작업 항목 |
|--------------------------|----------|----------------|
| 후기 페이지 CRUD         | 이해민   | 후기 CRUD, 객체 스토리지 파일 업로드/관리, 후기 댓글 기능 보완 |
| 관광지/숙소 검색 및 조회 | 이지연   | 추천 여행지 기반 관광지/숙소 검색 및 상세 페이지, 북마크 기능 |
| AI 추천 일정 생성        | 김찬종   | Google Gemini 연동을 통한 AI 일정 자동 생성 |
| 회원 관리                | 이병진   | 로그인/회원가입, 프로필 수정 및 조회 |
| 후기 페이지 CRUD         | 유승재   | 후기 페이지 CRUD 보완 |
| 마이페이지               | 조용현   | 여행일정/세부계획 생성 및 편집, Vercel 배포 |

---

## 🛠 사용 기술

| 파트     | 기술                          | 설명                              |
|----------|-------------------------------|-----------------------------------|
| **BE**   | Supabase                      | 인증, DB 관리, API 자동 생성     |
| **FE**   | TypeScript, Readdy, Tailwind CSS | UI 구현 및 빠른 프로토타이핑 |
| **협업** | Notion, GitHub, Google Docs   | 역할 분담, 버전 관리, 문서 작성  |
| **ETC**  | Figma, PowerPoint             | 와이어프레임, 발표 자료 제작     |

---

## 📁 프로젝트 구조

```
src/
└── app/
    ├── api/
    │   └── public-data-proxy/
    │       └── [id]/
    │           └── route.ts         # 특정 id에 대한 외부 API 프록시 호출
    │       └── route.ts             # 기본 프록시 라우터
    │
    ├── board/                       # 게시판 (후기, 게시글 CRUD 등)
    │   ├── [id]/
    │   │   ├── edit/
    │   │   │   └── page.tsx         # 게시글 수정 페이지
    │   │   └── PostDetailClient.tsx # 게시글 상세 클라이언트 컴포넌트
    │   ├── components/              # 게시판 전용 컴포넌트
    │   │   ├── NoResultsMessage.tsx
    │   │   └── PostSearchBar.tsx
    │   ├── write/
    │   │   └── page.tsx             # 게시글 작성 페이지
    │   ├── page.tsx                 # 게시판 메인 페이지
    │   ├── PostDetail.tsx           # 게시글 상세 페이지
    │   ├── PostList.tsx             # 게시글 목록
    │   └── PostWrite.tsx            # 게시글 작성 컴포넌트
    │
    ├── login/
    │   └── page.tsx                 # 로그인 페이지
    │
    ├── mypage/                      # 마이페이지 (일정 및 프로필 관리)
    │   ├── EditPlanModal.tsx        # 일정 편집 모달
    │   ├── page.tsx                 # 마이페이지 메인
    │   ├── TravelDetail.tsx         # 여행 상세 페이지
    │   ├── TravelPlanCard.tsx       # 여행 계획 카드
    │   ├── TravelPlanner.tsx        # 여행 플래너
    │   └── UserProfile.tsx          # 사용자 프로필 조회/수정
    │
    ├── places/                      # 관광지 및 숙소 추천
    │   ├── [id]/                    # 관광지 상세
    │   │   ├── components/
    │   │   │   └── page.tsx
    │   │   └── PlaceDetail.tsx      # 장소 상세 컴포넌트
    │   ├── components/              # 장소 추천 관련 컴포넌트
    │   │   ├── AddToTravelButton.tsx
    │   │   ├── LoadingSkeleton.tsx
    │   │   ├── LocationSelector.tsx
    │   │   ├── NoResultsMessage.tsx
    │   │   ├── PlaceCard.tsx
    │   │   └── SearchBar.tsx
    │   ├── page.tsx                 # 장소 추천 메인 페이지
    │   └── PlaceList.tsx            # 추천 장소 리스트
    │
    ├── signup/
    │   └── page.tsx                 # 회원가입 페이지
    │
    ├── components/                  # 공통 UI 컴포넌트
    │   ├── AISearchBar.tsx          # AI 검색 바
    │   ├── Comments.tsx             # 댓글 기능
    │   ├── Dropdown.tsx             # 공통 드롭다운
    │   ├── Footer.tsx               # 푸터
    │   ├── Header.tsx               # 헤더 + 네비게이션
    │   ├── Pagination.tsx           # 페이지네이션
    │   ├── PopularDestinations.tsx  # 인기 관광지
    │   ├── PopularPosts.tsx         # 인기 게시글
    │   ├── RecommendationButton.tsx # AI 추천 버튼
    │   └── recommendedDestinations.tsx
    │
    ├── hooks/                       # 커스텀 훅 모음
    │   ├── useAISearchChat.ts       # AI 검색 관련 훅
    │   ├── useComments.ts           # 댓글 처리 훅
    │   ├── usePost.ts               # 게시글 CRUD 훅
    │   ├── useRecommendation.ts     # 추천 로직 훅
    │   ├── useTravelPlans.ts        # 여행 계획 관련 훅
    │   └── useUserProfile.ts        # 사용자 프로필 훅
    │
    ├── globals.css                  # 전역 스타일 정의
    ├── layout.tsx                   # 공통 레이아웃
    ├── not-found.tsx                # 404 페이지
    └── page.tsx                     # 루트(index) 페이지
```

---

## 📢 발표 자료 제작 예정

Figma를 활용한 와이어프레임 및 Canva를 활용하여 발표자료 제작
