import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export function useAccountDelete() {
    const [showDeleteAccount, setShowDeleteAccount] = useState(false)
    const [deletePassword, setDeletePassword] = useState('')
    const [deletePasswordValid, setDeletePasswordValid] = useState<boolean | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const checkDeletePassword = async () => {
        setDeleteError(null)
        setDeletePasswordValid(null)
        if (!deletePassword.trim()) {
            setDeletePasswordValid(false)
            setDeleteError('비밀번호를 입력해주세요.')
            return
        }
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user || !user.email) {
            setDeleteError('유저 정보를 불러올 수 없습니다.')
            return
        }
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: deletePassword,
        })
        if (signInError) {
            setDeletePasswordValid(false)
            setDeleteError('비밀번호가 올바르지 않습니다.')
        } else {
            setDeletePasswordValid(true)
            setDeleteError(null)
        }
    }

    const confirmDeleteAccount = async () => {
        if (!deletePasswordValid) {
            setDeleteError('비밀번호를 확인해주세요.')
            return
        }
        setIsDeleting(true)
        setDeleteError(null)
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) {
                setDeleteError('유저 정보를 불러올 수 없습니다.')
                return
            }
            const { error: profileError } = await supabase
                .from('user_profile')
                .update({
                    nickname: '',
                    introduce: '',
                    interests: '',
                    birth_date: null,
                    gender: null,
                    profile_img: '',
                    is_deleted: true,
                })
                .eq('user_id', user.id)
            if (profileError) {
                setDeleteError('프로필 삭제에 실패했습니다.')
                return
            }
            await supabase.auth.signOut()
            window.location.href = '/'
        } catch (error) {
            setDeleteError('계정 삭제 중 오류가 발생했습니다.')
        } finally {
            setIsDeleting(false)
        }
    }

    const cancelDeleteAccount = () => {
        setShowDeleteAccount(false)
        setDeletePassword('')
        setDeletePasswordValid(null)
        setDeleteError(null)
        setIsDeleting(false)
    }

    return {
        showDeleteAccount,
        setShowDeleteAccount,
        deletePassword,
        setDeletePassword,
        deletePasswordValid,
        setDeletePasswordValid,
        deleteError,
        setDeleteError,
        isDeleting,
        setIsDeleting,
        checkDeletePassword,
        confirmDeleteAccount,
        cancelDeleteAccount,
    }
}
