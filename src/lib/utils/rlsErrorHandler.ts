import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

export interface RLSError extends Error {
    code?: string
    details?: string
    hint?: string
}

export const isRLSError = (error: any): boolean => {
    return (
        error?.message?.includes('row-level security') ||
        error?.code === 'PGRST116' || // Row level security violation
        error?.code === '42501'
    ) // Insufficient privilege
}

export const isAuthError = (error: any): boolean => {
    return error?.message?.includes('JWT') || error?.message?.includes('authentication') || error?.code === 'PGRST301' // JWT malformed
}

export const handleDatabaseError = async (
    error: any,
    router?: ReturnType<typeof useRouter>,
    showAlert: boolean = true,
): Promise<void> => {
    console.error('Database error:', error)

    if (isAuthError(error)) {
        if (showAlert) {
            alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
        }

        // 토큰 정리 후 로그인 페이지로 이동
        await supabase.auth.signOut()
        router?.push('/login')
        return
    }

    if (isRLSError(error)) {
        if (showAlert) {
            alert('접근 권한이 없습니다. 로그인 상태를 확인해주세요.')
        }

        // 현재 사용자 상태 확인
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user && router) {
            router.push('/login')
        }
        return
    }

    // 일반적인 데이터베이스 에러
    if (showAlert) {
        alert('데이터 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
}

export const withAuth = async <T>(
    operation: () => Promise<T>,
    router?: ReturnType<typeof useRouter>,
): Promise<T | null> => {
    try {
        // 사용자 인증 상태 확인
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            if (router) {
                alert('로그인이 필요합니다.')
                router.push('/login')
            }
            return null
        }

        return await operation()
    } catch (error) {
        await handleDatabaseError(error, router)
        return null
    }
}

export const safeQuery = async <T>(
    query: () => Promise<{ data: T | null; error: any }>,
    fallbackData: T,
    showError: boolean = false,
): Promise<T> => {
    try {
        const { data, error } = await query()

        if (error) {
            if (showError) {
                await handleDatabaseError(error, undefined, false)
            }
            return fallbackData
        }

        return data ?? fallbackData
    } catch (error) {
        if (showError) {
            await handleDatabaseError(error, undefined, false)
        }
        return fallbackData
    }
}
