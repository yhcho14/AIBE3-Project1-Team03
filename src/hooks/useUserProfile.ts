import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface UserProfileType {
    name: string
    nickname: string
    introduce: string
    interests: string[]
    birthDate: string
    gender: 'male' | 'female' | 'private'
    profile_img?: string
}

export function useUserProfile() {
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<UserProfileType | null>(null)
    const [editForm, setEditForm] = useState<UserProfileType | null>(null)

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
            // user_profile 테이블에서 가져오기
            const { data, error } = await supabase.from('user_profile').select('*').eq('user_id', user.id).single()
            if (data) {
                setProfile({
                    name: user.user_metadata?.name ?? '사용자',
                    nickname: data.nickname ?? '',
                    introduce: data.introduce ?? '',
                    interests: data.interests ? data.interests.split(',') : [],
                    birthDate: data.birth_date ?? '',
                    gender: data.gender ?? 'private',
                    profile_img: data.profile_img ?? '',
                })
            } else {
                // 테이블에 없으면 auth 정보로 기본값 세팅
                setProfile({
                    name: user.user_metadata?.name ?? '사용자',
                    nickname: '',
                    introduce: user.user_metadata?.introduce ?? '',
                    interests: Array.isArray(user.user_metadata?.interests) ? user.user_metadata.interests : [],
                    birthDate: user.user_metadata?.birthDate ?? '',
                    gender: user.user_metadata?.gender ?? 'private',
                    profile_img: user.user_metadata?.profile_img ?? '',
                })
            }
        }
        fetchProfile()
    }, [])

    // profile이 바뀌면 editForm도 동기화
    useEffect(() => {
        if (profile) setEditForm(profile)
    }, [profile])

    // 저장
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
    // 취소
    const handleCancel = () => {
        setEditForm(profile)
        setIsEditing(false)
    }

    return {
        isEditing,
        setIsEditing,
        profile,
        editForm,
        setEditForm,
        handleSave,
        handleCancel,
    }
}
