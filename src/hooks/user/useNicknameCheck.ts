import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export function useNicknameCheck() {
    const [nicknameError, setNicknameError] = useState<string | null>(null)
    const checkNicknameDuplicate = async (nickname: string) => {
        if (!nickname.trim()) return
        const { data } = await supabase.from('user_profile').select('user_id').eq('nickname', nickname).single()
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (data && data.user_id !== user?.id) {
            setNicknameError('이미 사용 중인 닉네임입니다.')
            return false
        }
        setNicknameError(null)
        return true
    }
    return { nicknameError, setNicknameError, checkNicknameDuplicate }
}
