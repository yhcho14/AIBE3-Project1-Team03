import { useState } from 'react'
import type { UserProfileType } from './useUserProfileInfo'

export function useInterestAdder(editForm: UserProfileType | null, setEditForm: (v: UserProfileType) => void) {
    const [newInterest, setNewInterest] = useState('')

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

    return {
        newInterest,
        setNewInterest,
        handleAddCustomInterest,
        handleRemoveInterest,
    }
}
