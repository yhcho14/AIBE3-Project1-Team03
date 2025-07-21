import { useState } from 'react'

interface AddToTravelButtonProps {
    placeId: string
    onAddToTravel?: (placeId: string) => void
    className?: string
}

export default function AddToTravelButton({ placeId, onAddToTravel, className }: AddToTravelButtonProps) {
    const [hovered, setHovered] = useState(false)

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        if (onAddToTravel) onAddToTravel(placeId)
    }

    return (
        <div
            className={`rounded-full flex items-center text-gray-600 bg-white/90 hover:bg-white overflow-hidden cursor-pointer group transition-all duration-300 justify-center
                ${hovered ? 'w-36 px-4' : 'w-8 px-0'}
                ${className || ''}
            `}
            style={{ minWidth: 32, height: 32 }}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered ? (
                <span className="text-sm whitespace-nowrap">내 여행에 추가하기</span>
            ) : (
                <i className="ri-add-line text-sm"></i>
            )}
        </div>
    )
}
