import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai'

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: API_KEY }) // API_KEY가 없을 경우 빈 문자열 전달

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
   4.  **대화 스타일:** 불필요한 사담이나 개인적인 감정 표현은 삼가고, 오직 사용자의 질문에 대한 정보 제공에만
      집중합니다.
   5.  **필수 답변 유도:** 다음 필수 정보 중 없는 정보가 있다면 우선으로 질문해주십시오. "목적지, 여행인원, 여행시작일, 여행기간, 예산"
   여행 시작일은 오늘을 "2025-07-18"로 계산하고 여행 시작일과 여행 종료일을 계산해 주십시오.
   여행 종료일은 여행 시작일과 여행 기간이 주어졌다면 두 개를 더한 날짜로 계산해 주십시오.
   6.  **추가 답변 유도:** 사용자의 질문에 대답한 후, 더 나은 여행 경험을 위해 필요한 정보가 있다면 간단하지만 명확하게 한 줄로 질문해 주십시오.
   **예시 대화:**
   
   사용자: 파리의 현재 날씨는 어떤가요?
   AI: 파리의 현재 날씨는 [날씨 정보]입니다.
   
   사용자: 뉴욕 양키스는 어떤 스포츠팀인가요?
   AI: 뉴욕 양키스는 뉴욕을 연고로 하는 메이저리그 야구팀입니다.
   
   사용자: 서울의 인구는 얼마나 되나요?
   AI: 서울의 인구는 약 [인구 수]입니다.
   
   사용자: 1 더하기 1은 무엇인가요?
   AI: 죄송합니다. 저는 여행 및 지역 정보에 대한 질문에만 답변해 드릴 수 있습니다.
   `

export function useAISearchChat(
    containerRef: React.RefObject<HTMLDivElement | null>,
    chatMessagesRef: React.RefObject<HTMLDivElement | null>,
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
            //const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

            const contents = [
                // 시스템 프롬프트를 대화의 첫 번째 메시지로 추가
                {
                    role: 'user',
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                // 기존 채팅 기록을 이어서 추가
                // Gemini API는 'model' 역할을 사용하므로 'ai'를 'model'로 매핑
                ...chatHistory.map((msg) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                })),
                // 현재 사용자 메시지 추가
                {
                    role: 'user',
                    parts: [{ text: userMessageText }],
                },
            ]

            // chat.sendMessage 대신 genAI.models.generateContent 직접 호출
            const result = await genAI.models.generateContent({
                model: 'gemini-2.5-flash', // 모델 이름 직접 지정
                contents: contents, // 구성된 contents 배열 전달
                // generationConfig: {
                //     maxOutputTokens: 200,
                // },
                // safetySettings: [
                //     {
                //         category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                //         threshold: HarmBlockThreshold.BLOCK_NONE,
                //     },
                //     {
                //         category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                //         threshold: HarmBlockThreshold.BLOCK_NONE,
                //     },
                //     {
                //         category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                //         threshold: HarmBlockThreshold.BLOCK_NONE,
                //     },
                //     {
                //         category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                //         threshold: HarmBlockThreshold.BLOCK_NONE,
                //     },
                // ],
                config: {
                    responseMimeType: 'text/plain',
                },
            })

            // const response = await result.response // 이 줄은 제거되었습니다.
            const text = result.text ?? '정보 추출에 실패했습니다.' // result에서 직접 text() 호출
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
            //const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

            // 대화 기록을 텍스트로 변환
            // SYSTEM_PROMPT는 이미 chatHistory에 포함되어 있으므로, 여기서는 순수 대화 내용만 사용
            const conversationText = chatHistory
                .map((msg) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.text}`)
                .join('\n')

            // 추출을 위한 프롬프트 구성
            // AI에게 어떤 정보를 어떤 형식으로 추출할지 명확하게 지시.
            const extractionPrompt = `다음은 사용자와의 여행 관련 대화 내용입니다. 이
    대화에서 '목적지, 여행 일정 제목, 여행인원, 여행시작일, 여행종료일, 여행기간, 교통편, 예산'의 순서로 핵심 정보를 추출하여 콤마(,)로
    구분된 하나의 문자열로 반환해 주십시오. 목적지는 사용자가 가려고 하는 도시의 이름 또는 관광지 이름으로 반환해 주십시오. 예를 들면 "제주도", "서울", "불국사" 등으로 표현하십시오.
    여행 일정은 사용자의 데이터를 기반으로 해당 여행의 목적을 나타내는 10~20글자의 문장이며 예를 들면 "가족과 함께하는 제주도 여행", "역사와 문화를 체험하는 여행" 등으로 표현하십시오.
    여행인원은 INT형식으로, 여행 시작일과 여행 종료일은 YYYY-MM-DD형식으로, 여행 기간은 여행종료일과 여행시작일의 차이로 계산하여 INT형을 반환해 주십시오.
    교통편은 사용자가 입력하지 않았다면 사용자의 지역에서 해당 지역까지 이동하는 경로를 신중하게 생각해 "항공편", "고속버스", "KTX" 등으로 반환해 주십시오.
    예상금액은 사용자가 입력하지 않았다면 여행 일정과 지역, 여행 인원을 고려하여 예상되는 금액을 반환해 주십시오.
    
    --- 대화 내용 ---
    ${conversationText}
    --- 추출 결과 ---`

            // generateContent를 사용하여 한 번의 요청으로 정보 추출
            const result = await genAI.models.generateContent({
                // 이 부분을 수정
                model: 'gemini-2.5-flash', // 모델 이름
                contents: extractionPrompt, // 추출 프롬프트 전달
                config: {
                    responseMimeType: 'text/plain',
                },
            })
            const extractedSummary = result.text ?? '정보 추출에 실패했습니다.'

            const [destination, title, peopleCount, startDate, endDate, duration, transport, budget] = extractedSummary
                .split(',')
                .map((s) => s.trim())

            //로그인했는지 확인, 추후 변경
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser()
            const userId = user?.id
            if (user) {
                console.log('로그인한 유저 ID:', userId)
            }

            const parsedData = {
                user_id: userId,
                destination,
                title,
                num_travelers: Number(peopleCount),
                start_date: startDate,
                end_date: endDate,
                travel_duration: Number(duration),
                transportation: transport,
                budget: Number(budget),
                status: 'draft',
                //accommodation_id: 1,
            }
            const { data, error } = await supabase.from('travel').insert([parsedData])

            if (error) {
                console.error('삽입 오류:', error)
                alert('저장 실패')
            } else {
                console.log('삽입 성공:', data)
                alert('저장 완료')
            }

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
