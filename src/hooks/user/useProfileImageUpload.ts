import { supabase } from '../../lib/supabase'

export function useProfileImageUpload(setEditForm: (v: any) => void, editForm: any) {
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
    return { handleImageUpload }
}
