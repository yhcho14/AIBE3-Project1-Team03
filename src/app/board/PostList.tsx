'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, getUserNames } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Dropdown from '../../components/Dropdown'
import PostSearchBar from './components/PostSearchBar'

import NoResultsMessage from './components/NoResultsMessage'


interface Post {
    id: number
    title: string
    contents: string
    created_at: string
    category: string
    user_id: string
    location: string
    tags: string | null
    image: string | null
    comment_count?: number
    like_count?: number
    user_name?: string
}

const PAGE_SIZE = 12

// 정렬 옵션
const sortOptions = [
    { value: 'created_at_desc', label: '최신순' },
    { value: 'created_at_asc', label: '오래된순' },
    { value: 'title_asc', label: '제목순' },
    { value: 'comment_count_desc', label: '댓글순' },
    { value: 'like_count_desc', label: '좋아요순' },
]



export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [page, setPage] = useState(1)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [inputValue, setInputValue] = useState('')
    const [sortBy, setSortBy] = useState(sortOptions[0].value)


    const [totalCount, setTotalCount] = useState(0)
    const router = useRouter()
    const loader = useRef<HTMLDivElement | null>(null)

    // 게시글 불러오기 (페이지 단위)
    const fetchPosts = useCallback(async (currentSearchKeyword = searchKeyword, currentSortBy = sortBy) => {
        setLoading(true)
        const from = (page - 1) * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        
        let query = supabase.from('posts').select('*')
        
        // 검색 필터 적용
        if (currentSearchKeyword) {
            query = query.or(`title.ilike.%${currentSearchKeyword}%,contents.ilike.%${currentSearchKeyword}%,tags.ilike.%${currentSearchKeyword}%`)
        }
        

        

        
        // 정렬 적용 (댓글 수, 좋아요 수는 클라이언트에서 처리)
        switch (currentSortBy) {
            case 'created_at_desc':
                query = query.order('created_at', { ascending: false })
                break
            case 'created_at_asc':
                query = query.order('created_at', { ascending: true })
                break
            case 'title_asc':
                query = query.order('title', { ascending: true })
                break
            default:
                query = query.order('created_at', { ascending: false })
        }
        
        const { data: postsData, error } = await query.range(from, to)
        


        if (!error && postsData) {
            // 각 게시글별 댓글 수, 좋아요 수 불러오기
            const postsWithCounts = await Promise.all(
                postsData.map(async (post: Post) => {
                    // 댓글 수
                    const { count: commentCount } = await supabase
                        .from('comments')
                        .select('*', { count: 'exact', head: true })
                        .eq('post_id', post.id)
                    // 좋아요 수
                    const { count: likeCount } = await supabase
                        .from('post_recommends')
                        .select('*', { count: 'exact', head: true })
                        .eq('post_id', post.id)
                    return { ...post, comment_count: commentCount ?? 0, like_count: likeCount ?? 0 }
                }),
            )

            // 사용자 이름 가져오기
            const userIds = postsWithCounts.map(post => post.user_id);
            const userNames = await getUserNames(userIds);
            
            // 게시글에 사용자 이름 추가
            const postsWithUserNames = postsWithCounts.map(post => ({
                ...post,
                user_name: userNames[post.user_id] || '익명'
            }));

            // 댓글 수, 좋아요 수로 정렬 (클라이언트에서 처리)
            let sortedPosts = postsWithUserNames
            if (currentSortBy === 'comment_count_desc') {
                sortedPosts = postsWithUserNames.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0))
            } else if (currentSortBy === 'like_count_desc') {
                sortedPosts = postsWithUserNames.sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
            }

            setPosts((prev) => {
                // 첫 페이지이거나 필터가 변경된 경우 기존 목록을 교체
                if (page === 1) {
                    return sortedPosts
                } else {
                    // 무한 스크롤의 경우 기존 목록에 추가
                    const ids = new Set(prev.map((p) => p.id))
                    return [...prev, ...sortedPosts.filter((p) => !ids.has(p.id))]
                }
            })
            setHasMore(postsData.length === PAGE_SIZE)
            setInputValue(currentSearchKeyword) // 검색어와 입력값 동기화
            
            // 첫 페이지일 때만 총 개수 업데이트
            if (page === 1) {
                // 검색 조건에 맞는 총 게시글 수 조회
                let countQuery = supabase.from('posts').select('*', { count: 'exact', head: true })
                if (currentSearchKeyword) {
                    countQuery = countQuery.or(`title.ilike.%${currentSearchKeyword}%,contents.ilike.%${currentSearchKeyword}%,tags.ilike.%${currentSearchKeyword}%`)
                }


                const { count } = await countQuery
                setTotalCount(count || 0)
            }
        }
        setLoading(false)
    }, [page, searchKeyword, sortBy])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    // 무한 스크롤 감지
    useEffect(() => {
        if (!hasMore || loading) return
        const observer = new window.IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1)
                }
            },
            { threshold: 1 },
        )
        if (loader.current) observer.observe(loader.current)
        return () => {
            if (loader.current) observer.unobserve(loader.current)
        }
    }, [hasMore, loading])

    // 검색, 정렬 변경 시 즉시 초기화
    useEffect(() => {
        setPage(1)
        setPosts([])
        setHasMore(true)
        setTotalCount(0)
    }, [searchKeyword, sortBy])



    useEffect(() => {
        const checkLogin = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setIsLoggedIn(!!user)
        } // check login

        checkLogin()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    if (posts.length === 0 && loading) {
        return <div className="text-center py-20 text-gray-500">게시글을 불러오는 중...</div>
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <PostSearchBar onSearch={setSearchKeyword} inputValue={inputValue} setInputValue={setInputValue} />

            {/* Filters */}
            <div className="flex justify-end">
                <div className="flex flex-row items-center space-x-2">
                    <Dropdown options={sortOptions} selected={sortBy} onSelect={setSortBy} />
                    {isLoggedIn && (
                        <button
                            onClick={() => router.push('/board/write')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap"
                        >
                            <i className="ri-add-line"></i>
                            <span>글쓰기</span>
                        </button>
                    )}
                </div>
            </div>
            
            {/* Results Count */}
            {posts.length > 0 && (
                <div className="text-sm text-gray-600">총 {totalCount.toLocaleString()}개의 게시글을 찾았습니다.</div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => router.push(`/board/${post.id}`)}
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
                            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.contents}</p>
                            {post.tags && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(() => {
                                        let tagsArr: string[] = []
                                        try {
                                            tagsArr = JSON.parse(post.tags)
                                            if (!Array.isArray(tagsArr)) tagsArr = []
                                        } catch {
                                            tagsArr = post.tags.split(',').map((t) => t.replace(/["'\[\]]/g, '').trim())
                                        }
                                        return tagsArr.filter(Boolean).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                                            >
                                                #{tag}
                                            </span>
                                        ))
                                    })()}
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{post.created_at?.slice(0, 10)}</span>
                                <span>작성자: {post.user_name || '익명'}</span>
                                <span>댓글: {post.comment_count ?? 0}</span>
                                <span>좋아요: {post.like_count ?? 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* No Results */}
            {!loading && posts.length === 0 && (
                <NoResultsMessage 
                    searchKeyword={searchKeyword} 
                />
            )}

            {/* 무한스크롤 로딩/감지용 div */}
            <div ref={loader} />
            {loading && <div className="text-center py-6 text-gray-400">로딩 중...</div>}
            {!hasMore && posts.length > 0 && <div className="text-center py-6 text-gray-400">모든 게시글을 불러왔습니다.</div>}
        </div>
    )
}
