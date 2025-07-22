import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 클라이언트사이드용 supabase 클라이언트 (RLS 적용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버사이드용 supabase 클라이언트 (RLS 우회)
export const createServiceRoleClient = () => {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY is not configured')
        return supabase // fallback to regular client
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}

// 사용자 이름을 가져오는 유틸리티 함수 (우선순위: 프로필 닉네임 > user_metadata.name > 이메일 앞부분 > 익명)
export const getUserName = async (userId: string) => {
    try {
        // user_profile 테이블에서 사용자 정보 가져오기
        const { data: profile, error } = await supabase
            .from('user_profile') // 테이블명 수정
            .select('nickname, user_id')
            .eq('user_id', userId)
            .single()

        // 현재 로그인한 사용자 정보
        const {
            data: { user },
        } = await supabase.auth.getUser()

        // 1. 프로필 닉네임
        if (profile && profile.nickname) {
            return profile.nickname
        }
        // 2. user_metadata.name (로그인한 사용자만)
        if (user?.id === userId && user.user_metadata?.name) {
            return user.user_metadata.name
        }
        // 3. 이메일 앞부분 (로그인한 사용자만)
        if (user?.id === userId && user.email) {
            return user.email.split('@')[0]
        }
        // 4. 익명
        return '익명'
    } catch (error) {
        console.error('사용자 이름 가져오기 실패:', error)
        return '익명'
    }
}

// 여러 사용자의 이름을 한번에 가져오는 함수 (우선순위 동일)
export const getUserNames = async (userIds: string[]) => {
    const uniqueUserIds = [...new Set(userIds)]
    const userNames: { [key: string]: string } = {}
    try {
        // user_profile 테이블에서 한번에 모든 사용자 정보 가져오기
        const { data: profiles, error } = await supabase
            .from('user_profile') // 테이블명 수정
            .select('nickname, user_id')
            .in('user_id', uniqueUserIds)

        // 현재 로그인한 사용자 정보
        const {
            data: { user },
        } = await supabase.auth.getUser()

        // 프로필이 있는 사용자들
        if (!error && profiles) {
            profiles.forEach((profile) => {
                if (profile.nickname) {
                    userNames[profile.user_id] = profile.nickname
                }
            })
        }

        // 프로필이 없거나 닉네임이 없는 사용자들 처리
        const missingUserIds = uniqueUserIds.filter((id) => !userNames[id])
        missingUserIds.forEach((id) => {
            // 2. user_metadata.name (로그인한 사용자만)
            if (user?.id === id && user.user_metadata?.name) {
                userNames[id] = user.user_metadata.name
            }
            // 3. 이메일 앞부분 (로그인한 사용자만)
            else if (user?.id === id && user.email) {
                userNames[id] = user.email.split('@')[0]
            }
            // 4. 익명
            else {
                userNames[id] = '익명'
            }
        })
    } catch (error) {
        console.error('사용자 이름들 가져오기 실패:', error)
        uniqueUserIds.forEach((id) => {
            userNames[id] = '익명'
        })
    }
    return userNames
}

// 게시글 테이블과 좋아요 테이블을 조합해서 location별 좋아요 수 집계 후, 상위 6개 인기 지역을 가져오는 함수
export const getPopularLocations = async (limit = 6) => {
    // 1. 모든 좋아요(post_recommends)와 posts를 조인해서 location별로 집계
    const { data: recommends, error } = await supabase
        .from('post_recommends')
        .select('post_id')

    if (error || !recommends) return []

    // 2. post_id별로 posts에서 location을 가져옴
    const postIds = [...new Set((recommends as { post_id: number }[]).map(r => r.post_id))]
    if (postIds.length === 0) return []

    const { data: posts, error: postError } = await supabase
        .from('posts')
        .select('id, location')
        .in('id', postIds)

    if (postError || !posts) return []

    // 3. post_id -> location 매핑
    const postIdToLocation: { [key: number]: string } = Object.fromEntries((posts as { id: number, location: string }[]).map(p => [p.id, p.location]))

    // 4. location별 좋아요 수 집계
    const locationLikes: { [key: string]: number } = {}
    const recommendsArr = recommends as { post_id: number }[]
    recommendsArr.forEach((r) => {
        const loc = postIdToLocation[r.post_id]
        if (!loc) return
        locationLikes[loc] = (locationLikes[loc] || 0) + 1
    })

    // 5. 좋아요 많은 순으로 정렬 후 상위 limit개 추출
    return (Object.entries(locationLikes) as [string, number][]) // 타입 단언
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([location, totalLikes]) => ({ location, totalLikes }))
}
