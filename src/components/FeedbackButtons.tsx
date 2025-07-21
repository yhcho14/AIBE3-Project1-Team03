import React from 'react'

// FeedbackButtons 컴포넌트가 받을 props의 타입을 정의합니다.
interface FeedbackButtonsProps {
    // 메시지를 전송하는 함수. string을 인자로 받고 Promise<void>를 반환합니다.
    onSendMessage: (message: string) => Promise<void>
    // AI가 응답을 처리 중인지 나타내는 로딩 상태입니다.
    isLoading: boolean
}

// FeedbackButtons 컴포넌트는 이제 props를 통해 필요한 함수와 상태를 받습니다.
const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ onSendMessage, isLoading }) => {
    const feedbackOptions = ['좋아', '별로야', '모르겠어']

    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            {feedbackOptions.map((option) => (
                <button
                    key={option}
                    // 클릭 시 onSendMessage 함수를 호출하고, 버튼 텍스트를 인자로 전달합니다.
                    onClick={() => onSendMessage(option)}
                    disabled={isLoading} // 로딩 중일 때는 버튼을 비활성화합니다.
                >
                    {option}
                </button>
            ))}
        </div>
    )
}

export default FeedbackButtons
