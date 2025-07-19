interface AddToTripButtonProps {
    hovered: boolean
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
}

export default function AddToTripButton({ hovered, onClick, onMouseEnter, onMouseLeave }: AddToTripButtonProps) {
    return (
        <div
            className={`absolute top-4 right-4 rounded-full flex items-center border border-gray-200 text-gray-600 bg-white/90 hover:bg-white overflow-hidden cursor-pointer group transition-all duration-300 justify-center
                ${hovered ? 'w-36 px-4' : 'w-8 px-0'}
            `}
            style={{ minWidth: 32, height: 32 }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {hovered ? (
                <span className="text-xs whitespace-nowrap">내 여행에 추가하기</span>
            ) : (
                <i className="ri-add-line text-sm"></i>
            )}
        </div>
    )
}
