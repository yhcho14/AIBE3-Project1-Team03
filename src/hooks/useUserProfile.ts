// import { useState, useEffect } from 'react'
// import { supabase } from '../lib/supabase'

// export interface UserProfileType {
//     user_id: string
//     name: string
//     nickname: string
//     introduce: string
//     interests: string[]
//     birthDate: string
//     gender: string | null
//     profile_img?: string
//     is_deleted?: boolean
// }

// export function useUserProfile() {
//     const [isEditing, setIsEditing] = useState(false)
//     const [profile, setProfile] = useState<UserProfileType | null>(null)
//     const [editForm, setEditForm] = useState<UserProfileType | null>(null)
//     const [isNicknameFocused, setIsNicknameFocused] = useState(false)
//     const [newInterest, setNewInterest] = useState('')
//     const [nicknameError, setNicknameError] = useState<string | null>(null)

//     const [showPasswordChange, setShowPasswordChange] = useState(false)
//     const [currentPassword, setCurrentPassword] = useState('')
//     const [newPassword, setNewPassword] = useState('')
//     const [confirmPassword, setConfirmPassword] = useState('')
//     const [passwordError, setPasswordError] = useState<string | null>(null)
//     const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
//     const [currentPasswordValid, setCurrentPasswordValid] = useState<boolean | null>(null)
//     const [newPasswordValid, setNewPasswordValid] = useState<boolean | null>(null)
//     const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)

//     const [showDeleteAccount, setShowDeleteAccount] = useState(false)
//     const [deletePassword, setDeletePassword] = useState('')
//     const [deletePasswordValid, setDeletePasswordValid] = useState<boolean | null>(null)
//     const [deleteError, setDeleteError] = useState<string | null>(null)
//     const [isDeleting, setIsDeleting] = useState(false)

//     const [checked, setChecked] = useState(false)
//     const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)

//     useEffect(() => {
//         const fetchProfile = async () => {
//             const {
//                 data: { user },
//             } = await supabase.auth.getUser()
//             if (!user) {
//                 setProfile(null)
//                 setEditForm(null)
//                 setIsLoggedIn(false)
//                 setChecked(true)
//                 return
//             }
//             setIsLoggedIn(true)
//             setChecked(true)
//             const { data } = await supabase.from('user_profile').select('*').eq('user_id', user.id).single()
//             if (data) {
//                 setProfile({
//                     user_id: user.id,
//                     name: user.user_metadata?.name ?? '사용자',
//                     nickname: data.nickname ?? '',
//                     introduce: data.introduce ?? '',
//                     interests: data.interests ? data.interests.split(',') : [],
//                     birthDate: data.birth_date ?? '',
//                     gender: data.gender ?? 'private',
//                     profile_img: data.profile_img ?? '',
//                     is_deleted: data.is_deleted ?? false,
//                 })
//             }
//         }
//         fetchProfile()
//     }, [])

//     useEffect(() => {
//         if (profile) setEditForm(profile)
//     }, [profile])

//     const handleSave = async () => {
//         if (!editForm) return
//         const {
//             data: { user },
//         } = await supabase.auth.getUser()
//         if (!user) return
//         const { error } = await supabase.from('user_profile').upsert(
//             [
//                 {
//                     user_id: user.id,
//                     nickname: editForm.nickname,
//                     introduce: editForm.introduce,
//                     interests: (editForm.interests ?? []).join(','),
//                     birth_date: editForm.birthDate,
//                     gender: editForm.gender,
//                     profile_img: editForm.profile_img ?? '',
//                 },
//             ],
//             { onConflict: 'user_id' },
//         )
//         if (error) {
//             alert('저장 실패: ' + error.message)
//             return
//         }
//         setProfile(editForm)
//         setIsEditing(false)
//     }

//     const handleCancel = () => {
//         setEditForm(profile)
//         setIsEditing(false)
//     }

//     const checkNicknameDuplicate = async (nickname: string) => {
//         if (!nickname.trim()) return
//         const { data } = await supabase.from('user_profile').select('user_id').eq('nickname', nickname).single()
//         const {
//             data: { user },
//         } = await supabase.auth.getUser()
//         if (data && data.user_id !== user?.id) {
//             setNicknameError('이미 사용 중인 닉네임입니다.')
//             return false
//         }
//         setNicknameError(null)
//         return true
//     }

//     const handleImageUpload = async (file: File) => {
//         if (!file || !editForm) return
//         const {
//             data: { user },
//         } = await supabase.auth.getUser()
//         if (!user) {
//             alert('로그인이 필요합니다.')
//             return
//         }
//         const filePath = `profile/${user.id}_${Date.now()}`
//         const { error } = await supabase.storage.from('profile-image').upload(filePath, file, { upsert: true })
//         if (error) {
//             alert('이미지 업로드 실패: ' + error.message)
//             return
//         }
//         const { data: publicUrlData } = supabase.storage.from('profile-image').getPublicUrl(filePath)
//         setEditForm({ ...editForm, profile_img: publicUrlData.publicUrl })
//     }

//     const handleAddCustomInterest = () => {
//         if (!newInterest.trim() || !editForm) return
//         if (editForm.interests.includes(newInterest.trim())) {
//             alert('이미 추가된 관심사입니다.')
//             return
//         }
//         setEditForm({
//             ...editForm,
//             interests: [...editForm.interests, newInterest.trim()],
//         })
//         setNewInterest('')
//     }
//     const handleRemoveInterest = (index: number) => {
//         if (!editForm) return
//         setEditForm({
//             ...editForm,
//             interests: editForm.interests.filter((_, i) => i !== index),
//         })
//     }

//     const handleDeleteAccount = async () => {
//         setShowDeleteAccount(true)
//         setDeletePassword('')
//         setDeletePasswordValid(null)
//         setDeleteError(null)
//     }

//     const checkDeletePassword = async () => {
//         setDeleteError(null)
//         setDeletePasswordValid(null)

//         if (!deletePassword.trim()) {
//             setDeletePasswordValid(false)
//             setDeleteError('비밀번호를 입력해주세요.')
//             return
//         }

//         const {
//             data: { user },
//         } = await supabase.auth.getUser()
//         if (!user || !user.email) {
//             setDeleteError('유저 정보를 불러올 수 없습니다.')
//             return
//         }

//         const { error: signInError } = await supabase.auth.signInWithPassword({
//             email: user.email,
//             password: deletePassword,
//         })

//         if (signInError) {
//             setDeletePasswordValid(false)
//             setDeleteError('비밀번호가 올바르지 않습니다.')
//         } else {
//             setDeletePasswordValid(true)
//             setDeleteError(null)
//         }
//     }

//     const confirmDeleteAccount = async () => {
//         if (!deletePasswordValid) {
//             setDeleteError('비밀번호를 확인해주세요.')
//             return
//         }

//         setIsDeleting(true)
//         setDeleteError(null)

//         try {
//             const {
//                 data: { user },
//             } = await supabase.auth.getUser()
//             if (!user) {
//                 setDeleteError('유저 정보를 불러올 수 없습니다.')
//                 return
//             }

//             const { error: profileError } = await supabase
//                 .from('user_profile')
//                 .update({
//                     nickname: '',
//                     introduce: '',
//                     interests: '',
//                     birth_date: null,
//                     gender: null,
//                     profile_img: '',
//                     is_deleted: true,
//                 })
//                 .eq('user_id', user.id)

//             if (profileError) {
//                 setDeleteError('프로필 삭제에 실패했습니다.')
//                 return
//             }

//             await supabase.auth.signOut()
//             window.location.href = '/'
//         } catch (error) {
//             setDeleteError('계정 삭제 중 오류가 발생했습니다.')
//         } finally {
//             setIsDeleting(false)
//         }
//     }

//     const cancelDeleteAccount = () => {
//         setShowDeleteAccount(false)
//         setDeletePassword('')
//         setDeletePasswordValid(null)
//         setDeleteError(null)
//         setIsDeleting(false)
//     }

//     const handlePasswordChange = async () => {
//         setPasswordError(null)
//         setPasswordSuccess(null)
//         if (!currentPassword || !newPassword || !confirmPassword) {
//             setPasswordError('모든 항목을 입력해주세요.')
//             return
//         }
//         if (newPassword !== confirmPassword) {
//             setPasswordError('새 비밀번호가 일치하지 않습니다.')
//             return
//         }
//         const {
//             data: { user },
//         } = await supabase.auth.getUser()
//         if (!user || !user.email) {
//             setPasswordError('유저 정보를 불러올 수 없습니다.')
//             return
//         }
//         const { error: signInError } = await supabase.auth.signInWithPassword({
//             email: user.email,
//             password: currentPassword,
//         })
//         if (signInError) {
//             setPasswordError('현재 비밀번호가 올바르지 않습니다.')
//             return
//         }
//         const { error: updateError } = await supabase.auth.updateUser({
//             password: newPassword,
//         })
//         if (updateError) {
//             setPasswordError('비밀번호 변경에 실패했습니다.')
//             return
//         }
//         setPasswordSuccess('비밀번호가 성공적으로 변경되었습니다.')
//         setShowPasswordChange(false)
//         setCurrentPassword('')
//         setNewPassword('')
//         setConfirmPassword('')
//     }

//     const checkCurrentPassword = async () => {
//         setPasswordError(null)
//         setCurrentPasswordValid(null)
//         const {
//             data: { user },
//         } = await supabase.auth.getUser()
//         if (!user || !user.email) {
//             setPasswordError('유저 정보를 불러올 수 없습니다.')
//             return
//         }
//         const { error: signInError } = await supabase.auth.signInWithPassword({
//             email: user.email,
//             password: currentPassword,
//         })
//         if (signInError) {
//             setCurrentPasswordValid(false)
//             setPasswordError('현재 비밀번호가 올바르지 않습니다.')
//         } else {
//             setCurrentPasswordValid(true)
//             setPasswordError(null)
//         }
//     }

//     const validateNewPassword = (pw: string) => {
//         const valid =
//             pw.length >= 8 &&
//             /[A-Za-z]/.test(pw) &&
//             /[0-9]/.test(pw) &&
//             /[!@#$%^&*(),.?":{}|<>_\-\\[\]=+~`';/]/.test(pw)
//         setNewPasswordValid(valid)
//     }

//     if (checked && !isLoggedIn) {
//         return {
//             isEditing: false,
//             setIsEditing: () => {},
//             profile: null,
//             editForm: null,
//             setEditForm: () => {},
//             handleSave: () => {},
//             handleCancel: () => {},
//             isNicknameFocused: false,
//             setIsNicknameFocused: () => {},
//             newInterest: '',
//             setNewInterest: () => {},
//             handleImageUpload: () => {},
//             handleAddCustomInterest: () => {},
//             handleRemoveInterest: () => {},
//             nicknameError: null,
//             setNicknameError: () => {},
//             checkNicknameDuplicate: async () => false,
//             handleDeleteAccount: () => {},
//             showPasswordChange: false,
//             setShowPasswordChange: () => {},
//             currentPassword: '',
//             setCurrentPassword: () => {},
//             newPassword: '',
//             setNewPassword: () => {},
//             confirmPassword: '',
//             setConfirmPassword: () => {},
//             passwordError: null,
//             setPasswordError: () => {},
//             passwordSuccess: null,
//             setPasswordSuccess: () => {},
//             currentPasswordValid: null,
//             setCurrentPasswordValid: () => {},
//             newPasswordValid: null,
//             setNewPasswordValid: () => {},
//             passwordsMatch: null,
//             setPasswordsMatch: () => {},
//             handlePasswordChange: () => {},
//             checkCurrentPassword: () => {},
//             validateNewPassword: () => {},
//             showDeleteAccount: false,
//             setShowDeleteAccount: () => {},
//             deletePassword: '',
//             setDeletePassword: () => {},
//             deletePasswordValid: null,
//             setDeletePasswordValid: () => {},
//             deleteError: null,
//             setDeleteError: () => {},
//             isDeleting: false,
//             setIsDeleting: () => {},
//             checkDeletePassword: () => {},
//             confirmDeleteAccount: () => {},
//             cancelDeleteAccount: () => {},
//         }
//     }

//     const userId = profile?.user_id || ''

//     return {
//         isEditing,
//         setIsEditing,
//         profile,
//         editForm,
//         setEditForm,
//         handleSave,
//         handleCancel,
//         isNicknameFocused,
//         setIsNicknameFocused,
//         newInterest,
//         setNewInterest,
//         handleImageUpload,
//         handleAddCustomInterest,
//         handleRemoveInterest,
//         nicknameError,
//         setNicknameError,
//         checkNicknameDuplicate,
//         handleDeleteAccount,
//         showPasswordChange,
//         setShowPasswordChange,
//         currentPassword,
//         setCurrentPassword,
//         newPassword,
//         setNewPassword,
//         confirmPassword,
//         setConfirmPassword,
//         passwordError,
//         setPasswordError,
//         passwordSuccess,
//         setPasswordSuccess,
//         currentPasswordValid,
//         setCurrentPasswordValid,
//         newPasswordValid,
//         setNewPasswordValid,
//         passwordsMatch,
//         setPasswordsMatch,
//         handlePasswordChange,
//         checkCurrentPassword,
//         validateNewPassword,
//         showDeleteAccount,
//         setShowDeleteAccount,
//         deletePassword,
//         setDeletePassword,
//         deletePasswordValid,
//         setDeletePasswordValid,
//         deleteError,
//         setDeleteError,
//         isDeleting,
//         setIsDeleting,
//         checkDeletePassword,
//         confirmDeleteAccount,
//         cancelDeleteAccount,
//     }
// }
