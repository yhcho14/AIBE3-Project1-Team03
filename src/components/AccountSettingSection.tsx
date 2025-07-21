import React from 'react'

interface AccountSettingSectionProps {
    showPasswordChange: boolean
    setShowPasswordChange: (v: boolean) => void
    currentPassword: string
    setCurrentPassword: (v: string) => void
    newPassword: string
    setNewPassword: (v: string) => void
    confirmPassword: string
    setConfirmPassword: (v: string) => void
    passwordError: string | null
    setPasswordError: (v: string | null) => void
    passwordSuccess: string | null
    setPasswordSuccess: (v: string | null) => void
    currentPasswordValid: boolean | null
    setCurrentPasswordValid: (v: boolean | null) => void
    newPasswordValid: boolean | null
    setNewPasswordValid: (v: boolean | null) => void
    passwordsMatch: boolean | null
    setPasswordsMatch: (v: boolean | null) => void
    handlePasswordChange: () => void
    checkCurrentPassword: () => void
    validateNewPassword: (pw: string) => void
    showDeleteAccount: boolean
    setShowDeleteAccount: (v: boolean) => void
    deletePassword: string
    setDeletePassword: (v: string) => void
    deletePasswordValid: boolean | null
    setDeletePasswordValid: (v: boolean | null) => void
    deleteError: string | null
    setDeleteError: (v: string | null) => void
    isDeleting: boolean
    setIsDeleting: (v: boolean) => void
    checkDeletePassword: () => void
    confirmDeleteAccount: () => void
    cancelDeleteAccount: () => void
}

export default function AccountSettingSection(props: AccountSettingSectionProps) {
    const {
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
    } = props
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">계정 설정</h3>
            <div className="space-y-4">
                <button
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                    <div className="flex items-center space-x-3">
                        <i className="ri-lock-line text-gray-500"></i>
                        <span>비밀번호 변경</span>
                    </div>
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                </button>
                {showPasswordChange && (
                    <div className="mt-4 space-y-2">
                        <input
                            type="password"
                            placeholder="현재 비밀번호"
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value)
                                setCurrentPasswordValid(null)
                            }}
                            onBlur={checkCurrentPassword}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        {currentPasswordValid === true && (
                            <div className="text-green-600 text-sm">비밀번호가 일치합니다.</div>
                        )}
                        {currentPasswordValid === false && (
                            <div className="text-red-500 text-sm">현재 비밀번호가 올바르지 않습니다.</div>
                        )}
                        <input
                            type="password"
                            placeholder="새 비밀번호"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value)
                                validateNewPassword(e.target.value)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        {newPasswordValid === true && (
                            <div className="text-green-600 text-sm">유효한 비밀번호입니다.</div>
                        )}
                        {newPasswordValid === false && (
                            <div className="text-red-500 text-sm">
                                8자 이상, 영문+숫자, 특수기호를 모두 포함해야 합니다.
                            </div>
                        )}
                        <input
                            type="password"
                            placeholder="새 비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                setPasswordsMatch(e.target.value === newPassword)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        {passwordsMatch === true && (
                            <div className="text-green-600 text-sm">비밀번호가 일치합니다.</div>
                        )}
                        {passwordsMatch === false && (
                            <div className="text-red-500 text-sm">비밀번호가 일치하지 않습니다.</div>
                        )}
                        {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
                        {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handlePasswordChange}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                disabled={!currentPasswordValid || !newPasswordValid || !passwordsMatch}
                            >
                                저장
                            </button>
                            <button
                                onClick={() => {
                                    setShowPasswordChange(false)
                                    setCurrentPassword('')
                                    setNewPassword('')
                                    setConfirmPassword('')
                                    setPasswordError(null)
                                    setPasswordSuccess(null)
                                    setCurrentPasswordValid(null)
                                    setNewPasswordValid(null)
                                    setPasswordsMatch(null)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                )}
                <button
                    className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-between text-red-600"
                    onClick={() => setShowDeleteAccount(true)}
                >
                    <div className="flex items-center space-x-3">
                        <i className="ri-delete-bin-line"></i>
                        <span>계정 삭제</span>
                    </div>
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                </button>
                {showDeleteAccount && (
                    <div className="mt-4 space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-700">
                            <i className="ri-error-warning-line text-lg"></i>
                            <span className="font-semibold">계정 삭제</span>
                        </div>
                        <p className="text-red-700 text-sm">
                            정말 계정을 삭제하시겠습니까?
                            <br />
                            계정 삭제후에는 복구할 수 없습니다.
                        </p>
                        <div className="space-y-3">
                            <input
                                type="password"
                                placeholder="계정 삭제를 위해 비밀번호를 입력하세요"
                                value={deletePassword}
                                onChange={(e) => {
                                    setDeletePassword(e.target.value)
                                    setDeletePasswordValid(null)
                                    setDeleteError(null)
                                }}
                                onBlur={checkDeletePassword}
                                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            {deletePasswordValid === true && (
                                <div className="text-green-600 text-sm">비밀번호가 확인되었습니다.</div>
                            )}
                            {deletePasswordValid === false && (
                                <div className="text-red-500 text-sm">비밀번호가 올바르지 않습니다.</div>
                            )}
                            {deleteError && <div className="text-red-500 text-sm">{deleteError}</div>}
                            <div className="flex gap-2">
                                <button
                                    onClick={confirmDeleteAccount}
                                    disabled={!deletePasswordValid || isDeleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>삭제 중...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-delete-bin-line"></i>
                                            <span>계정 삭제</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={cancelDeleteAccount}
                                    disabled={isDeleting}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
