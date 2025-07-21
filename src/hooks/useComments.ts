import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Comment {
    id: number
    content: string
    title?: string
    user_id: string
    post_id: number
    created_at: string
    modified_at: string
}

export interface CommentFormData {
    content: string
    title?: string
}

export function useComments(postId: string) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchComments = async () => {
        if (!postId) return
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('댓글을 불러오는데 실패했습니다:', error)
                setError('댓글을 불러오는데 실패했습니다.')
            } else {
                setComments(data || [])
            }
        } catch (err) {
            console.error('댓글 조회 중 오류:', err)
            setError('댓글을 불러오는 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    const addComment = async (formData: CommentFormData) => {
        if (!formData.content.trim()) {
            alert('댓글 내용을 입력해주세요.')
            return false
        }

        setIsSubmitting(true)
        try {
            // 현재 로그인된 사용자 확인
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser()

            if (authError || !user) {
                alert('로그인이 필요합니다.')
                return false
            }

            const { error } = await supabase.from('comments').insert([
                {
                    content: formData.content.trim(),
                    title: formData.title?.trim() || null,
                    post_id: parseInt(postId),
                    user_id: user.id, // user_id 명시적으로 설정
                },
            ])

            if (error) {
                console.error('댓글 작성 에러:', error)
                alert(`댓글 작성 중 오류가 발생했습니다. 에러: ${error.message}`)
                return false
            }

            // 댓글 목록 새로고침
            await fetchComments()
            return true
        } catch (err: any) {
            console.error('댓글 작성 예외:', err)
            alert(`댓글 작성 중 오류가 발생했습니다. 에러: ${err.message || err}`)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const updateComment = async (commentId: number, formData: CommentFormData) => {
        if (!formData.content.trim()) {
            alert('댓글 내용을 입력해주세요.')
            return false
        }

        try {
            const { error } = await supabase
                .from('comments')
                .update({
                    content: formData.content.trim(),
                    title: formData.title?.trim() || null,
                    modified_at: new Date().toISOString(),
                })
                .eq('id', commentId)

            if (error) {
                alert('댓글 수정 중 오류가 발생했습니다.')
                return false
            }

            // 댓글 목록 새로고침
            await fetchComments()
            return true
        } catch (err) {
            alert('댓글 수정 중 오류가 발생했습니다.')
            return false
        }
    }

    const deleteComment = async (commentId: number) => {
        if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            return false
        }

        try {
            const { error } = await supabase.from('comments').delete().eq('id', commentId)

            if (error) {
                alert('댓글 삭제 중 오류가 발생했습니다.')
                return false
            }

            // 댓글 목록 새로고침
            await fetchComments()
            return true
        } catch (err) {
            alert('댓글 삭제 중 오류가 발생했습니다.')
            return false
        }
    }

    useEffect(() => {
        fetchComments()
    }, [postId])

    return {
        comments,
        loading,
        error,
        isSubmitting,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
    }
}
