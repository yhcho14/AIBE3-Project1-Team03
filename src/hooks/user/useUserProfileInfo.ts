import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export interface UserProfileType {
    user_id: string
    name: string
    nickname: string
    introduce: string
    interests: string[]
    birthDate: string
    gender: string | null
    profile_img?: string
    is_deleted?: boolean
}

export function useUserProfileInfo() {
    const [profile, setProfile] = useState<UserProfileType | null>(null)
    const [editForm, setEditForm] = useState<UserProfileType | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) {
                setProfile(null)
                setEditForm(null)
                return
            }
            const { data } = await supabase.from('user_profile').select('*').eq('user_id', user.id).single()
            if (data) {
                setProfile({
                    user_id: user.id,
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

    return {
        profile,
        editForm,
        setEditForm,
        isEditing,
        setIsEditing,
        handleSave,
        handleCancel,
    }
}
