'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { useUserProfileInfo } from '../../hooks/user/useUserProfileInfo'
import { useNicknameCheck } from '../../hooks/user/useNicknameCheck'
import { useProfileImageUpload } from '../../hooks/user/useProfileImageUpload'
import { usePasswordChange } from '../../hooks/user/usePasswordChange'
import { usePasswordChangeToggle } from '../../hooks/user/usePasswordChangeToggle'
import { useAccountDelete } from '../../hooks/user/useAccountDelete'
import { useInterestAdder } from '../../hooks/user/useInterestAdder'
import type { UserProfileType } from '../../hooks/user/useUserProfileInfo'
import ProfileHeader from '../../components/ProfileHeader'
import PersonalInfoSection from '../../components/PersonalInfoSection'
import TravelPreferenceSection from '../../components/TravelPreferenceSection'
import AccountSettingSection from '../../components/AccountSettingSection'

export default function UserProfile() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const router = useRouter()
    const { showPasswordChange, setShowPasswordChange } = usePasswordChangeToggle()
    const { profile, editForm, setEditForm, isEditing, setIsEditing, handleSave, handleCancel } = useUserProfileInfo()
    const { nicknameError, setNicknameError, checkNicknameDuplicate } = useNicknameCheck()
    const { handleImageUpload } = useProfileImageUpload(setEditForm, editForm)
    const passwordChange = usePasswordChange()
    const accountDelete = useAccountDelete()
    const { newInterest, setNewInterest, handleAddCustomInterest, handleRemoveInterest } = useInterestAdder(
        editForm,
        setEditForm,
    )
    const [isNicknameFocused, setIsNicknameFocused] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            setIsLoggedIn(!!session)
        }
        checkSession()
    }, [])

    if (isLoggedIn === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <i className="ri-lock-2-line text-blue-500 text-3xl"></i>
                </div>
                <div className="text-xl font-bold text-gray-800 mb-2">로그인이 필요합니다</div>
                <div className="text-gray-600 mb-4">마이페이지를 이용하려면 로그인이 필요합니다.</div>
                <button
                    onClick={() => router.push('/login')}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    로그인 하러가기
                </button>
            </div>
        )
    }
    if (isLoggedIn === null) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    const safeProfile: UserProfileType = profile ?? {
        user_id: '',
        name: '',
        nickname: '',
        introduce: '',
        interests: [],
        birthDate: '',
        gender: 'private',
        profile_img: '',
        is_deleted: false,
    }
    const safeEditForm: UserProfileType = editForm ?? safeProfile

    const genderOptions = [
        { value: 'male', label: '남자' },
        { value: 'female', label: '여자' },
        { value: 'private', label: '비공개' },
    ]

    const interestGroups = [
        {
            label: '여행 스타일',
            options: ['혼자', '커플', '친구', '가족', '단체', '반려동물과 함께', '자유여행', '패키지여행'],
        },
        {
            label: '여행 테마',
            options: [
                '등산',
                '바다',
                '호캉스',
                '힐링',
                '캠핑',
                '도시탐방',
                '역사/문화',
                '축제/이벤트',
                '자연경관',
                '온천/스파',
                '섬여행',
                '드라이브',
                '트레킹/하이킹',
                '겨울스포츠',
                '수상레저',
            ],
        },
        {
            label: '취미/활동',
            options: [
                '사진촬영',
                '액티비티',
                '쇼핑',
                '먹방',
                '카페투어',
                '맛집탐방',
                '야시장',
                '공연/뮤지컬',
                '미술관/박물관',
                '스포츠관람',
                '서핑',
                '자전거',
                '낚시',
                '골프',
                '와이너리 투어',
            ],
        },
    ]

    const {
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
    } = passwordChange

    const {
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
    } = accountDelete

    return (
        <div className="space-y-6">
            <ProfileHeader
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                safeProfile={safeProfile}
                safeEditForm={safeEditForm}
                setEditForm={setEditForm}
                isNicknameFocused={isNicknameFocused}
                setIsNicknameFocused={setIsNicknameFocused}
                nicknameError={nicknameError}
                checkNicknameDuplicate={checkNicknameDuplicate}
                handleImageUpload={handleImageUpload}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PersonalInfoSection
                    isEditing={isEditing}
                    safeProfile={safeProfile}
                    safeEditForm={safeEditForm}
                    setEditForm={setEditForm}
                    genderOptions={genderOptions}
                />
                <TravelPreferenceSection
                    isEditing={isEditing}
                    safeProfile={safeProfile}
                    safeEditForm={safeEditForm}
                    setEditForm={setEditForm}
                    interestGroups={interestGroups}
                    newInterest={newInterest}
                    setNewInterest={setNewInterest}
                    handleAddCustomInterest={handleAddCustomInterest}
                    handleRemoveInterest={handleRemoveInterest}
                />
            </div>

            <AccountSettingSection
                showPasswordChange={showPasswordChange}
                setShowPasswordChange={setShowPasswordChange}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                passwordError={passwordError}
                setPasswordError={setPasswordError}
                passwordSuccess={passwordSuccess}
                setPasswordSuccess={setPasswordSuccess}
                currentPasswordValid={currentPasswordValid}
                setCurrentPasswordValid={setCurrentPasswordValid}
                newPasswordValid={newPasswordValid}
                setNewPasswordValid={setNewPasswordValid}
                passwordsMatch={passwordsMatch}
                setPasswordsMatch={setPasswordsMatch}
                handlePasswordChange={handlePasswordChange}
                checkCurrentPassword={checkCurrentPassword}
                validateNewPassword={validateNewPassword}
                showDeleteAccount={showDeleteAccount}
                setShowDeleteAccount={setShowDeleteAccount}
                deletePassword={deletePassword}
                setDeletePassword={setDeletePassword}
                deletePasswordValid={deletePasswordValid}
                setDeletePasswordValid={setDeletePasswordValid}
                deleteError={deleteError}
                setDeleteError={setDeleteError}
                isDeleting={isDeleting}
                setIsDeleting={setIsDeleting}
                checkDeletePassword={checkDeletePassword}
                confirmDeleteAccount={confirmDeleteAccount}
                cancelDeleteAccount={cancelDeleteAccount}
            />
        </div>
    )
}
