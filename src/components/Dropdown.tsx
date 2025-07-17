import React, { useState, useRef, useEffect } from 'react'

export interface DropdownProps {
    options: { value: string; label: string }[]
    selected: string
    onSelect: (value: string) => void
    className?: string
}

export default function Dropdown({ options, selected, onSelect, className }: DropdownProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open])

    return (
        <div className={`relative w-36 ${className || ''}`} ref={ref}>
            <button
                type="button"
                className="flex items-center justify-between w-36 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors pr-8"
                onClick={() => setOpen((v) => !v)}
            >
                <span className="text-sm text-gray-600 w-full text-left">
                    {options.find((opt) => opt.value === selected)?.label}
                </span>
                <i
                    className={`ri-arrow-down-s-line text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                ></i>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                                selected === option.value ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => {
                                onSelect(option.value)
                                setOpen(false)
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
