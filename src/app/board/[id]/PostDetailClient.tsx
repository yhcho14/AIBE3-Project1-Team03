'use client'

import { usePost } from '../../../hooks/usePost'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Comments from '../../../components/Comments'
import { useEffect, useState } from 'react'
import { supabase, getUserName } from '../../../lib/supabase'

interface PostDetailClientProps {
    postId: string
}

export default function PostDetailClient({ postId }: PostDetailClientProps) {
    const { post, loading, error, fetchPost, deletePost, formatTagsForDisplay, router } = usePost(postId)

    // 좋아요 상태
    const [likeCount, setLikeCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [userName, setUserName] = useState<string>('익명')

    // 유저 정보 가져오기
    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUserId(user?.id ?? null)
        }
        getUser()
    }, [])

    // 작성자 이름 가져오기
    useEffect(() => {
        const fetchUserName = async () => {
            if (post?.user_id) {
                const name = await getUserName(post.user_id)
                setUserName(name)
            }
        }
        fetchUserName()
    }, [post?.user_id])

    // 좋아요 개수 및 내 좋아요 여부 불러오기
    useEffect(() => {
        const fetchLikes = async () => {
            // 좋아요 개수
            const { count } = await supabase
                .from('post_recommends')
                .select('*', { count: 'exact', head: true })
                .eq('post_id', postId)
            setLikeCount(count ?? 0)
            // 내가 좋아요 눌렀는지
            if (userId) {
                const { data } = await supabase
                    .from('post_recommends')
                    .select('id')
                    .eq('post_id', postId)
                    .eq('user_id', userId)
                    .single()
                setIsLiked(!!data)
            }
        }
        if (postId) fetchLikes()
    }, [postId, userId])

    // 좋아요 토글
    const handleLike = async () => {
        if (!userId) {
            alert('로그인이 필요합니다.')
            return
        }
        setLikeLoading(true)
        if (isLiked) {
            // 좋아요 취소
            await supabase.from('post_recommends').delete().eq('post_id', postId).eq('user_id', userId)
            setIsLiked(false)
            setLikeCount((c) => c - 1)
        } else {
            // 좋아요 추가
            await supabase.from('post_recommends').insert({ post_id: postId, user_id: userId })
            setIsLiked(true)
            setLikeCount((c) => c + 1)
        }
        setLikeLoading(false)
    }

    const handleBack = () => {
        router.push('/board')
    }

    const handleEdit = () => {
        router.push(`/board/${postId}/edit`)
    }

    const handleDelete = async () => {
        await deletePost()
    }

    const handleRetry = () => {
        fetchPost()
    }

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
        )
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center py-20">
                            <div className="text-gray-50 mb-4">{error || '게시글을 찾을 수 없습니다.'}</div>
                            <div className="space-x-4">
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    다시 시도
                                </button>
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    목록으로 돌아가기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    const displayTags = formatTagsForDisplay(post.tags)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <i className="ri-arrow-left-line"></i>
                        <span>목록으로 돌아가기</span>
                    </button>

                    {/* Post Header */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">{userName?.slice(0, 1)}</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{userName}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>{post.created_at?.slice(0, 10)}</span>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center space-x-2">
                                {post.location && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {post.location}
                                    </span>
                                )}
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
                        {displayTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {displayTags.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Post Content */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.contents}</p>
                        </div>
                    </div>
                    {/* Image */}
                    {post.image && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">여행 사진</h3>
                            <div className="relative h-96 rounded-lg overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>
                    )}

                    {/* 댓글 위 좋아요 버튼 */}
                    <div className="mb-6 flex justify-end">
                        <button
                            onClick={handleLike}
                            disabled={likeLoading}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                                isLiked
                                    ? 'bg-pink-100 border-pink-300 text-pink-600'
                                    : 'bg-gray-50 border-gray-200 text-gray-600'
                            } disabled:opacity-50`}
                        >
                            <span>{isLiked ? '❤️' : '🤍'}</span>
                            <span>좋아요 {likeCount}</span>
                        </button>
                    </div>

                    {/* Comments */}
                    <Comments postId={postId} />

                    {/* Action Buttons */}
                    {userId === post.user_id && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={handleEdit}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                                >
                                    <i className="ri-edit-line"></i>
                                    <span>수정</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                                >
                                    <i className="ri-delete-bin-line"></i>
                                    <span>삭제</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
