import { createServiceRoleClient } from '../../../lib/supabase'
import PostDetailClient from './PostDetailClient'

// generateStaticParams 함수 추가 - Service Role Key 사용으로 RLS 우회
export async function generateStaticParams() {
    // 개발 환경에서는 빈 배열 반환 (동적 라우팅 사용)
    if (process.env.NODE_ENV === 'development') {
        return []
    }

    try {
        // Service Role 클라이언트로 RLS 우회
        const supabaseServiceRole = createServiceRoleClient()
        const { data, error } = await supabaseServiceRole.from('posts').select('id')

        if (error || !data) {
            console.error('게시글 ID 목록을 불러오는데 실패했습니다:', error)
            return []
        }

        return data.map((post: { id: number }) => ({
            id: String(post.id),
        }))
    } catch (error) {
        console.error('generateStaticParams 오류:', error)
        return []
    }
}

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function PostDetailPage({ params }: PageProps) {
    const { id } = await params
    return <PostDetailClient postId={id} />
}
