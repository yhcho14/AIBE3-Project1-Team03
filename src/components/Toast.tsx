'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
    onClose: () => void
    duration?: number
}

export default function Toast({ message, type, isVisible, onClose, duration = 1300 }: ToastProps) {
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true)
            const timer = setTimeout(() => {
                setIsAnimating(false)
                setTimeout(onClose, 300)
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    if (!isVisible) return null

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'ri-check-line'
            case 'error':
                return 'ri-error-warning-line'
            case 'info':
                return 'ri-information-line'
            default:
                return 'ri-information-line'
        }
    }

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500'
            case 'error':
                return 'bg-red-500'
            case 'info':
                return 'bg-blue-500'
            default:
                return 'bg-blue-500'
        }
    }

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={`${getBgColor()} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <i className={`${getIcon()} text-lg`}></i>
                <span className="font-medium">{message}</span>
                <button
                    onClick={() => {
                        setIsAnimating(false)
                        setTimeout(onClose, 300)
                    }}
                    className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                >
                    <i className="ri-close-line"></i>
                </button>
            </div>
        </div>
    )
}
