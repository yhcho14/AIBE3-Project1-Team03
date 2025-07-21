import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export function usePasswordChange() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
    const [currentPasswordValid, setCurrentPasswordValid] = useState<boolean | null>(null)
    const [newPasswordValid, setNewPasswordValid] = useState<boolean | null>(null)
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)

    const checkCurrentPassword = async () => {
        setPasswordError(null)
        setCurrentPasswordValid(null)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user || !user.email) {
            setPasswordError('유저 정보를 불러올 수 없습니다.')
            return
        }
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        })
        if (signInError) {
            setCurrentPasswordValid(false)
            setPasswordError('현재 비밀번호가 올바르지 않습니다.')
        } else {
            setCurrentPasswordValid(true)
            setPasswordError(null)
        }
    }

    const validateNewPassword = (pw: string) => {
        const valid =
            pw.length >= 8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*(),.?":{}|<>_\-\[\]=+~`';/]/.test(pw)
        setNewPasswordValid(valid)
    }

    const handlePasswordChange = async () => {
        setPasswordError(null)
        setPasswordSuccess(null)
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('모든 항목을 입력해주세요.')
            return
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('새 비밀번호가 일치하지 않습니다.')
            return
        }
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user || !user.email) {
            setPasswordError('유저 정보를 불러올 수 없습니다.')
            return
        }
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        })
        if (signInError) {
            setPasswordError('현재 비밀번호가 올바르지 않습니다.')
            return
        }
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        })
        if (updateError) {
            setPasswordError('비밀번호 변경에 실패했습니다.')
            return
        }
        setPasswordSuccess('비밀번호가 성공적으로 변경되었습니다.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    return {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        passwordError,
        setPasswordError,
        passwordSuccess,
        setPasswordSuccess,
        currentPasswordValid,
        setCurrentPasswordValid,
        newPasswordValid,
        setNewPasswordValid,
        passwordsMatch,
        setPasswordsMatch,
        handlePasswordChange,
        checkCurrentPassword,
        validateNewPassword,
    }
}
