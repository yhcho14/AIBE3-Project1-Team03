import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API_KEY || '') // API_KEY가 없을 경우 빈 문자열 전달

export interface Message {
    role: 'user' | 'ai'
    text: string
}

const SYSTEM_PROMPT = `당신은 사용자에게 여행 및 지역 정보를 제공하는 친절하고 유능한
      AI 여행 도우미입니다. 사용자의 질문에 대해 존댓말을 사용하여 정중하게 답변해 주십시오.
   
      **응답 규칙:**
   1.  **정보 범위:** 오직 여행 및 해당 지역과 관련된 정보(예: 여행지, 날씨, 인구, 그 도시의
      스포츠팀, 음식, 교통, 문화, 숙소, 활동 등)에 대해서만 답변합니다.
   2.  **범위 외 질문 처리:** 만약 사용자의 질문이 여행 및 지역 정보 범위를 벗어나는 경우(예: 일반
   상식, 개인적인 의견, 코딩, 복잡한 계산 등), "죄송합니다. 저는 여행 및 지역 정보에 대한 질문에만
      답변해 드릴 수 있습니다."와 같이 정중하게 답변을 거절합니다. 범위를 벗어나는 질문에 대해서는
      어떠한 정보도 제공하지 않습니다.
   3.  **정확성 및 간결성:** 답변은 사실에 기반하여 정확하고 간결하게 제공하여 사용자가 필요한
      정보를 빠르게 얻을 수 있도록 합니다.
   4.  **대화 스타일:** 불필요한 사담이나 개인적인 감정 표현은 삼가고, 오직 정보 제공에
      집중합니다.
   
   **예시 대화:**
   
   사용자: 파리의 현재 날씨는 어떤가요?
   AI: 파리의 현재 날씨는 [날씨 정보]입니다.
   
   사용자: 뉴욕 양키스는 어떤 스포츠팀인가요?
   AI: 뉴욕 양키스는 뉴욕을 연고로 하는 메이저리그 야구팀입니다.
   
   사용자: 서울의 인구는 얼마나 되나요?
   AI: 서울의 인구는 약 [인구 수]입니다.
   
   사용자: 1 더하기 1은 무엇인가요?
   AI: 죄송합니다. 저는 여행 및 지역 정보에 대한 질문에만 답변해 드릴 수 있습니다.`

export function useAISearchChat(
    containerRef: React.RefObject<HTMLDivElement>,
    chatMessagesRef: React.RefObject<HTMLDivElement>,
) {
    const [query, setQuery] = useState('')
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [input, setInput] = useState('')
    const [chatHistory, setChatHistory] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    // 채팅 내역이 업데이트될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        const el = chatMessagesRef.current
        if (el) {
            requestAnimationFrame(() => {
                el.scrollTop = el.scrollHeight
            })
        }
    }, [chatHistory])

    // AI 응답을 가져오는 비동기 함수
    const getAIResponse = async (userMessageText: string): Promise<string> => {
        if (!API_KEY) {
            console.error('Gemini API Key is not set. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.')
            return 'API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: SYSTEM_PROMPT }],
                    },

                    ...chatHistory.map((msg) => ({
                        role: msg.role === 'user' ? 'user' : 'model', // Gemini API는 'model' 역할을 사용
                        parts: [{ text: msg.text }],
                    })),
                ],
                generationConfig: {
                    maxOutputTokens: 200,
                },
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                ],
            })

            const result = await chat.sendMessage(userMessageText)
            const response = await result.response
            const text = response.text()
            return text
        } catch (error) {
            console.error('Error getting AI response:', error)
            return 'AI 응답을 가져오는 데 실패했습니다.'
        }
    }

    const generateTravelPlanSummary = async (): Promise<string> => {
        if (!API_KEY) {
            console.error('Gemini API Key is not set.')
            return 'API 키가 설정되지 않았습니다.'
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

            // 대화 기록을 텍스트로 변환
            // SYSTEM_PROMPT는 이미 chatHistory에 포함되어 있으므로, 여기서는 순수 대화 내용만 사용합니다.
            const conversationText = chatHistory
                .map((msg) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.text}`)
                .join('\n')

            // 추출을 위한 프롬프트 구성
            // AI에게 어떤 정보를 어떤 형식으로 추출할지 명확하게 지시합니다.
            const extractionPrompt = `다음은 사용자와의 여행 관련 대화 내용입니다. 이
    대화에서 '여행지,경비,추천교통편,행사,반려동물가능여부'의 순서로 핵심 정보를 추출하여 콤마(,)로
    구분된 하나의 문자열로 반환해 주십시오. 만약 특정 정보가 대화에 명시적으로 언급되지 않았다면
    '정보 없음'으로 표시하십시오.
    
    --- 대화 내용 ---
    ${conversationText}
    --- 추출 결과 ---`

            // generateContent를 사용하여 한 번의 요청으로 정보 추출
            const result = await model.generateContent(extractionPrompt)
            const response = await result.response
            const extractedSummary = response.text()
            return extractedSummary.trim()
        } catch (error) {
            console.error('Error generating travel plan summary:', error)
            return '여행 계획 요약 생성에 실패했습니다.'
        }
    }

    // ... (기존 handleSend, openChat, useEffect 등)

    // 반환 객체에 generateTravelPlanSummary 추가

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = { role: 'user', text: input }
        setChatHistory((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const aiResponseText = await getAIResponse(userMessage.text)
            console.log(aiResponseText)
            const aiResponse: Message = {
                role: 'ai',
                text: aiResponseText,
            }
            setChatHistory((prev) => [...prev, aiResponse])
        } catch (error) {
            console.error('Failed to send message to AI:', error)
            const errorMessage: Message = {
                role: 'ai',
                text: '메시지 전송에 실패했습니다.',
            }
            setChatHistory((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    //input 클릭 시 채팅창 열기
    const openChat = () => {
        setIsChatOpen(true)
        setTimeout(() => {
            inputRef.current?.focus()
        }, 100)
    }

    // 외부 클릭 시 채팅 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsChatOpen(false)
            }
        }

        if (isChatOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isChatOpen, containerRef])

    const getRecommendation = () => {
        console.log('temp')
    }

    const replyGood = () => {
        console.log('good')
    }

    const replyBad = () => {
        console.log('bad')
    }

    const replyIDK = () => {
        console.log('i dont know')
    }

    const replyFinalDecision = async () => {
        console.log('일정 생성 버튼 클릭됨')
        // AI에게 요약 생성을 요청하고 결과 대기.
        const summary = await generateTravelPlanSummary()
        console.log('추출된 여행 계획 요약:', summary)
        // 추출된 요약
        alert(`생성된 여행 계획 요약:\n${summary}`) // 예시 alert
    }

    return {
        query,
        setQuery,
        isChatOpen,
        input,
        setInput,
        chatHistory,
        isLoading,
        inputRef,
        handleSend,
        openChat,
        getRecommendation,
        replyGood,
        replyBad,
        replyIDK,
        replyFinalDecision,
        generateTravelPlanSummary,
    }
}
