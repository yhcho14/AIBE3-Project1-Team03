'use client'

import { useEffect, useState } from 'react'
import { useComments, CommentFormData } from '../hooks/useComments'
import { supabase, getUserNames } from '../lib/supabase'

interface CommentsProps {
    postId: string
}

interface CommentWithUserName {
    id: number
    content: string
    title?: string
    user_id: string
    post_id: number
    created_at: string
    modified_at: string
    user_name?: string
}

export default function Comments({ postId }: CommentsProps) {
    const { comments, loading, error, isSubmitting, addComment, updateComment, deleteComment } = useComments(postId)
    const [commentsWithNames, setCommentsWithNames] = useState<CommentWithUserName[]>([])

    const [newComment, setNewComment] = useState('')
    const [editingComment, setEditingComment] = useState<number | null>(null)
    const [editContent, setEditContent] = useState('')
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUserId(user?.id ?? null)
        }
        getUser()
    }, [])

    // 댓글에 사용자 이름 추가
    useEffect(() => {
        const fetchUserNames = async () => {
            if (comments.length > 0) {
                const userIds = comments.map(comment => comment.user_id);
                const userNames = await getUserNames(userIds);
                
                const commentsWithUserNames = comments.map(comment => ({
                    ...comment,
                    user_name: userNames[comment.user_id] || '익명'
                }));
                
                setCommentsWithNames(commentsWithUserNames);
            } else {
                setCommentsWithNames([]);
            }
        }
        
        fetchUserNames();
    }, [comments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = await addComment({ content: newComment })
        if (success) {
            setNewComment('')
        }
    }

    const handleEdit = (comment: any) => {
        setEditingComment(comment.id)
        setEditContent(comment.content)
    }

    const handleEditSubmit = async (commentId: number) => {
        const success = await updateComment(commentId, { content: editContent })
        if (success) {
            setEditingComment(null)
            setEditContent('')
        }
    }

    const handleEditCancel = () => {
        setEditingComment(null)
        setEditContent('')
    }

    const handleDelete = async (commentId: number) => {
        await deleteComment(commentId)
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">댓글</h3>
                <div className="text-center py-8 text-gray-500">댓글을 불러오는 중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">댓글</h3>
                <div className="text-center py-8 text-gray-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">댓글 ({comments.length})</h3>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex space-x-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 작성해주세요..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                    >
                        {isSubmitting ? '작성 중...' : '댓글 작성'}
                    </button>
                </div>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                    </div>
                ) : (
                    commentsWithNames.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                            {editingComment === comment.id ? (
                                // 수정 모드
                                <div className="space-y-3">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows={3}
                                        required
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditSubmit(comment.id)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                        >
                                            수정 완료
                                        </button>
                                        <button
                                            onClick={handleEditCancel}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // 일반 모드
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {comment.user_name?.slice(0, 1) || '익'}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-800">
                                                {comment.user_name || '익명'}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {comment.user_id === userId && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(comment)}
                                                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-10">
                                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                        {comment.modified_at && comment.modified_at !== comment.created_at && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                수정됨: {new Date(comment.modified_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
