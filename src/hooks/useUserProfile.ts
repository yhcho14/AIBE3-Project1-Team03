import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface UserProfileType {
    name: string
    nickname: string
    introduce: string
    interests: string[]
    birthDate: string
    gender: string | null
    profile_img?: string
    is_deleted?: boolean
}

export function useUserProfile() {
    // 프로필 관련 상태
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<UserProfileType | null>(null)
    const [editForm, setEditForm] = useState<UserProfileType | null>(null)
    const [isNicknameFocused, setIsNicknameFocused] = useState(false)
    const [newInterest, setNewInterest] = useState('')
    const [nicknameError, setNicknameError] = useState<string | null>(null)

    // 비밀번호 변경 관련 상태
    const [showPasswordChange, setShowPasswordChange] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
    const [currentPasswordValid, setCurrentPasswordValid] = useState<boolean | null>(null)
    const [newPasswordValid, setNewPasswordValid] = useState<boolean | null>(null)
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)

    // 프로필 불러오기
    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) {
                setProfile(null)
                return
            }
            const { data } = await supabase.from('user_profile').select('*').eq('user_id', user.id).single()
            if (data) {
                setProfile({
                    name: user.user_metadata?.name ?? '사용자',
                    nickname: data.nickname ?? '',
                    introduce: data.introduce ?? '',
                    interests: data.interests ? data.interests.split(',') : [],
                    birthDate: data.birth_date ?? '',
                    gender: data.gender ?? 'private',
                    profile_img: data.profile_img ?? '',
                    is_deleted: data.is_deleted ?? false,
                })
            }
        }
        fetchProfile()
    }, [])

    useEffect(() => {
        if (profile) setEditForm(profile)
    }, [profile])

    // 프로필 저장
    const handleSave = async () => {
        if (!editForm) return
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return
        const { error } = await supabase.from('user_profile').upsert(
            [
                {
                    user_id: user.id,
                    nickname: editForm.nickname,
                    introduce: editForm.introduce,
                    interests: (editForm.interests ?? []).join(','),
                    birth_date: editForm.birthDate,
                    gender: editForm.gender,
                    profile_img: editForm.profile_img ?? '',
                },
            ],
            { onConflict: 'user_id' },
        )
        if (error) {
            alert('저장 실패: ' + error.message)
            return
        }
        setProfile(editForm)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditForm(profile)
        setIsEditing(false)
    }

    // 닉네임 중복 체크
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

    // 프로필 이미지 업로드
    const handleImageUpload = async (file: File) => {
        if (!file || !editForm) return
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
            alert('로그인이 필요합니다.')
            return
        }
        const filePath = `profile/${user.id}_${Date.now()}`
        const { error } = await supabase.storage.from('profile-image').upload(filePath, file, { upsert: true })
        if (error) {
            alert('이미지 업로드 실패: ' + error.message)
            return
        }
        const { data: publicUrlData } = supabase.storage.from('profile-image').getPublicUrl(filePath)
        setEditForm({ ...editForm, profile_img: publicUrlData.publicUrl })
    }

    // 관심사 추가/삭제
    const handleAddCustomInterest = () => {
        if (!newInterest.trim() || !editForm) return
        if (editForm.interests.includes(newInterest.trim())) {
            alert('이미 추가된 관심사입니다.')
            return
        }
        setEditForm({
            ...editForm,
            interests: [...editForm.interests, newInterest.trim()],
        })
        setNewInterest('')
    }
    const handleRemoveInterest = (index: number) => {
        if (!editForm) return
        setEditForm({
            ...editForm,
            interests: editForm.interests.filter((_, i) => i !== index),
        })
    }

    // 계정 삭제
    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
        if (!confirmed) return
        const password = window.prompt('계정 삭제를 위해 비밀번호를 입력하세요.')
        if (!password) {
            alert('비밀번호를 입력해야 계정이 삭제됩니다.')
            return
        }
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) return
        if (!user.email) {
            alert('이메일 정보를 찾을 수 없습니다.')
            return
        }
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password,
        })
        if (signInError) {
            alert('비밀번호가 올바르지 않습니다.')
            return
        }
        await supabase
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
        await supabase.auth.signOut()
        window.location.href = '/'
    }

    // 비밀번호 변경
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
        setShowPasswordChange(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    // 현재 비밀번호 확인
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

    // 새 비밀번호 유효성 검사
    const validateNewPassword = (pw: string) => {
        const valid =
            pw.length >= 8 &&
            /[A-Za-z]/.test(pw) &&
            /[0-9]/.test(pw) &&
            /[!@#$%^&*(),.?":{}|<>_\-\\[\]=+~`';/]/.test(pw)
        setNewPasswordValid(valid)
    }

    return {
        isEditing,
        setIsEditing,
        profile,
        editForm,
        setEditForm,
        handleSave,
        handleCancel,
        isNicknameFocused,
        setIsNicknameFocused,
        newInterest,
        setNewInterest,
        handleImageUpload,
        handleAddCustomInterest,
        handleRemoveInterest,
        nicknameError,
        setNicknameError,
        checkNicknameDuplicate,
        handleDeleteAccount,
        showPasswordChange,
        setShowPasswordChange,
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
