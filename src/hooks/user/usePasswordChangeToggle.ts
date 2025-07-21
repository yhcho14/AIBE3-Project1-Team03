import { useState } from 'react'

export function usePasswordChangeToggle() {
    const [showPasswordChange, setShowPasswordChange] = useState(false)
    return { showPasswordChange, setShowPasswordChange }
}
