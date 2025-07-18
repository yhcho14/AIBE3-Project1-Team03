'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

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
}

const PAGE_SIZE = 12

export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const loader = useRef<HTMLDivElement | null>(null)

    // 게시글 불러오기 (페이지 단위)
    const fetchPosts = useCallback(async () => {
        setLoading(true)
        const from = (page - 1) * PAGE_SIZE
        const to = from + PAGE_SIZE - 1
        const { data: postsData, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, to)

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
            setPosts((prev) => {
                const ids = new Set(prev.map((p) => p.id))
                return [...prev, ...postsWithCounts.filter((p) => !ids.has(p.id))]
            })
            setHasMore(postsData.length === PAGE_SIZE)
        }
        setLoading(false)
    }, [page])

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
            {/* 상단 컨트롤 영역 */}
            <div className="flex justify-end mb-4">
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
                                <span>작성자: {post.user_id}</span>
                                <span>댓글: {post.comment_count ?? 0}</span>
                                <span>좋아요: {post.like_count ?? 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* 무한스크롤 로딩/감지용 div */}
            <div ref={loader} />
            {loading && <div className="text-center py-6 text-gray-400">로딩 중...</div>}
            {!hasMore && <div className="text-center py-6 text-gray-400">모든 게시글을 불러왔습니다.</div>}
        </div>
    )
}
