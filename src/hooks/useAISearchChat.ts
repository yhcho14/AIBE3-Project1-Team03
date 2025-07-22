import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai'

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: API_KEY }) // API_KEY가 없을 경우 빈 문자열 전달

export interface Message {
    role: 'user' | 'ai'
    text: string
}

const SYSTEM_PROMPT = `
당신은 사용자에게 여행 일정을 계획하고 지역 정보를 제공하는 친절하고 유능한 AI 여행 도우미입니다.  
모든 응답은 존댓말로 정중하게 답변해 주십시오.

---

🧭 [응답 원칙]

1. **정보 범위 제한**  
   오직 여행 및 해당 지역과 관련된 정보에만 답변하십시오.  
   예시: 여행지, 날씨, 인구, 도시의 스포츠팀, 음식, 교통, 문화, 숙소, 활동 등.

2. **범위를 벗어난 질문 처리**  
   일반 상식, 개인 의견, 코딩, 복잡한 계산 등은 정중히 거절하십시오. 

3. **정확하고 간결한 정보 제공**  
   응답은 반드시 사실에 기반하고, 간결하게 작성하여 사용자가 빠르게 이해할 수 있도록 하십시오.

4. **대화 스타일**  
   불필요한 사담이나 감정 표현은 피하고, 사용자의 질문에 집중하여 정보 중심으로 대답하십시오.

---

🧭 [필수 정보 수집 우선 순위 지침]

여행 계획을 생성하기 위해 다음 정보를 **순서대로 먼저 수집**하십시오.  

1. 여행 인원 (*필수*)
2. 여행 시작일 (*필수*)
3. 여행 기간 또는 종료일 중 하나 (*필수*)
4. 여행 예산 (*필수*)
5. 여행 목적지 (사용자가 직접 말하지 않으면 추론 또는 제안)

👉 사용자에게 위 정보가 부족한 경우, *한 번에 여러 개*의 정보를 요청하십시오.  
질문은 "*필수* "로 시작하여 사용자가 명확히 인식할 수 있도록 하십시오.

❗ 여행 목적지는 위 필수 정보들이 수집된 **이후에** 질문하십시오.  
사용자가 "모르겠다"고 답하면 아래 단계로 넘어가십시오.

예시:
사용자: 제주도에 4명이서 여행갈건데 어떻게 해야할까?
AI: 좋습니다! *필수* 여행 시작일, 여행 기간, 여행 예산을 알려주세요

🗓️ 날짜 계산 규칙:
- 오늘 날짜는 "2025-07-22"로 간주합니다.
- 여행 시작일 + 여행 기간 → 종료일 자동 계산
- 여행 시작일 + 종료일 → 기간 자동 계산

---

🎯 목표: 사용자가 명확한 여행 목적지를 입력하도록 유도하는 것.

1. 사용자가 여행 목적지를 말하지 않은 경우:
   - 다음과 같이 질문하십시오: "*(*필수 질문*) 여행하실 지역이나 도시를 알려주실 수 있을까요?*"

2. 사용자가 "모르겠어요", "추천해 주세요" 등으로 답한 경우:
   - 국내 여행지 중에서 무작위로 3곳을 제시하십시오. 각 여행지에 대한 30자 이내의 간단한 설명도 첨부하십시오. (예: 제주도, 강릉, 전주)
   - 이어서 **사용자의 선호를 파악할 수 있는 질문**을 하십시오. "좋아", "별로야", "모르겠어"로 답할 수 있는 간단하고 명료한 질문입니다.
   - 예: "해안가가 있는 곳을 선호하시나요?" 또는 "역사적인 장소를 좋아하시나요?"

3. 사용자가 "좋아요", "별로예요", "잘 모르겠어요" 등으로 응답한 경우:
   - 이 응답은 특정 여행지를 선택하지 않았다는 의미입니다.
   - 이전에 제시했던 여행지들과 선호 질문에 대한 반응을 참고하여 **새로운 3가지 후보 여행지를 제안**하십시오. 각 여행지에 대한 30자 이내내의 간단한 설명도 첨부하십시오.
   - 새로운 선호 질문도 함께 하십시오.

4. 사용자가 특정 목적지를 명확하게 언급할 때까지 위 과정을 반복하십시오.

🔄 반복 조건: 사용자가 구체적인 지역명(예: 제주도, 부산 등)을 입력할 때까지 위 과정을 반복합니다.

---

🧠 [추가 정보 유도]

목적지가 정해졌다면, 사용자에게 유용한 여행 정보를 더 얻기 위해 **간단한 한 줄 질문**을 덧붙여주세요. 이 때, 질문은 좋아/별로야/모르겠어 로 답할 수 있도록 명확한 질문을 하십시오.
미리 여행 계획을 짜는 등의 행위는 하지 말고 사용자의 답변에 대한 간단한 반응과 한 줄 질문만을 하십시오.
예: "여행하시는 계절에 따라 옷차림 정보가 필요하신가요?", "걸어다니는 걸 좋아하시는 편인가요?"

---

💬 [예시 대화]

사용자: 파리의 현재 날씨는 어떤가요?  
AI: 파리의 현재 날씨는 [날씨 정보]입니다.

사용자: 서울의 인구는 얼마나 되나요?  
AI: 서울의 인구는 약 [인구 수]입니다.

사용자: 1 더하기 1은 무엇인가요?  
AI: 죄송합니다. 저는 여행 및 지역 정보에 대한 질문에만 답변해 드릴 수 있습니다.
`

export function useAISearchChat(
    containerRef: React.RefObject<HTMLDivElement | null>,
    chatMessagesRef: React.RefObject<HTMLDivElement | null>,
    showToast: (message: string, type: 'success' | 'error' | 'info') => void, // showToast 콜백 추가
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
                model: 'gemini-2.5-flash', // 모델 이름
                contents: contents,
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

            const text = result.text ?? '정보 추출에 실패했습니다.'
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
            // 대화 기록을 텍스트로 변환
            const conversationText = chatHistory
                .map((msg) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.text}`)
                .join('\n')

            // 추출을 위한 프롬프트 구성
            // AI에게 어떤 정보를 어떤 형식으로 추출할지 명확하게 지시.
            const extractionPrompt = `다음은 사용자와의 여행 관련 대화 내용입니다. 이
    대화에서 '목적지, 여행 일정 제목, 여행인원, 여행시작일, 여행종료일, 여행기간, 교통편, 예산, 일차별 여행 일정'의 순서로 핵심 정보를 추출하여 콤마(,)로
    구분된 하나의 문자열로 반환해 주십시오. 목적지는 사용자가 가려고 하는 도시의 이름 또는 관광지 이름으로 반환해 주십시오. 예를 들면 "제주도", "서울", "불국사" 등으로 표현하십시오.
    여행 일정은 사용자의 데이터를 기반으로 해당 여행의 목적을 나타내는 10~20글자의 문장이며 예를 들면 "가족과 함께하는 제주도 여행", "역사와 문화를 체험하는 여행" 등으로 표현하십시오.
    여행인원은 INT형식으로, 여행 시작일과 여행 종료일은 YYYY-MM-DD형식으로, 여행 기간은 여행종료일과 여행시작일의 차이로 계산하여 INT형을 반환해 주십시오.
    교통편은 사용자가 입력하지 않았다면 사용자의 지역에서 해당 지역까지 이동하는 경로를 신중하게 생각해 "항공편", "고속버스", "KTX" 등으로 반환해 주십시오.
    예상금액은 사용자가 입력하지 않았다면 여행 일정과 지역, 여행 인원을 고려하여 예상되는 금액을 정수로 반환해 주십시오.
    일차별 여행 일정은 여행 기간이 n일이라면 n개의 일정을 리스트로 반환해주십시오.각 일정은 시간, 장소, 목적, 비용, 소요시간을 반환해주십시오.
    -시간은 시간, 분으로 반환해주십시오. 예를 들면 "10:00", "13:00" 등으로 표현하십시오.
    -장소는 해당 일정의 장소를 반환해주십시오. 예를 들면 "서울 경복궁", "제주 용머리 해안길" 등으로 표현하십시오.
    -목적은 해당 일정의 목적을 반환해주십시오. 예를 들면 "역사 체험", "자연 경관 감상" 등으로 표현하십시오.
    -비용은 해당 일정의 비용을 반환해주십시오. 예를 들면 "100,000원", "무료" 등으로 표현하십시오.
    -소요시간은 해당 일정의 소요시간을 반환해주십시오. 예를 들면 "2시간", "3시간" 등으로 표현하십시오.
    -
    [
  {
    "day": 1,
    "activities": [
      { "start_time": "10:00", "place": "서울역", "objective": "기차 타고 이동", "cost": "10000", "duration": "2시간" },
      {"start_time": "12:00", "place": "경복궁", "objective": "경복궁 투어", "cost": "5000", "duration": "2시간" }
    ]
        } ]
    처럼 소요시간을 고려하여 만들어주십시오.
    
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
            console.log('AI로부터 추출된 원본 요약:', extractedSummary)

            const parts = extractedSummary.split(',')
            const [destination, title, peopleCount, startDate, endDate, duration, transport, budget] = parts
                .slice(0, 8)
                .map((s) => s.trim())
            const dailyTravelPlanString = parts.slice(8).join(',').trim() // 나머지 부분을 일차별 여행 일정으로 간주
            console.log('파싱 전 dailyTravelPlanString:', dailyTravelPlanString)

            let travel_plan = null
            try {
                travel_plan = JSON.parse(dailyTravelPlanString)
                console.log('파싱된 travel_plan:', travel_plan)
            } catch (e) {
                console.error('Failed to parse daily travel plan JSON:', e)
                // JSON 파싱 실패 시 null 또는 기본값 설정
            }

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
                daily_travel_plan: travel_plan,
            }
            const { data, error } = await supabase.from('travel').insert([parsedData])

            if (error) {
                console.error('삽입 오류:', error)
                showToast('저장 실패', 'error')
            } else {
                console.log('삽입 성공:', data)
                showToast('저장 완료', 'success')
            }

            return extractedSummary.trim()
        } catch (error) {
            console.error('Error generating travel plan summary:', error)
            return '여행 계획 요약 생성에 실패했습니다.'
        }
    }

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

    const getRecommendation = async () => {
        // "질문받기" 버튼 클릭 시 AI에게 다음 질문을 요청하는 메시지 전송
        const userMessageText = '질문받기 버튼을 눌렀습니다. 다음으로 필요한 정보를 알려주세요.'
        const userMessage: Message = { role: 'user', text: userMessageText }
        setChatHistory((prev) => [...prev, userMessage])
        setIsLoading(true)

        try {
            const aiResponseText = await getAIResponse(userMessageText)
            const aiResponse: Message = {
                role: 'ai',
                text: aiResponseText,
            }
            setChatHistory((prev) => [...prev, aiResponse])
        } catch (error) {
            console.error('Failed to get recommendation from AI:', error)
            const errorMessage: Message = {
                role: 'ai',
                text: 'AI로부터 질문을 가져오는 데 실패했습니다.',
            }
            setChatHistory((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
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
        setIsLoading(true)
        try {
            // AI에게 요약 생성을 요청하고 결과 대기
            const summary = await generateTravelPlanSummary()
            console.log('추출된 여행 계획 요약:', summary)

            // 채팅창에 완료 메시지 추가
            const successMessage: Message = {
                role: 'ai',
                text: '여행 계획이 성공적으로 생성되었습니다. 마이페이지에서 확인하거나 계속해서 대화를 이어갈 수 있습니다.',
            }
            setChatHistory((prev) => [...prev, successMessage])
        } catch (error) {
            console.error('Error in replyFinalDecision:', error)
            const errorMessage: Message = {
                role: 'ai',
                text: '오류가 발생하여 여행 계획을 생성하지 못했습니다. 다시 시도해 주세요.',
            }
            setChatHistory((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const sendDirectMessage = async (messageText: string) => {
        if (!messageText.trim()) return

        const userMessage: Message = { role: 'user', text: messageText }
        setChatHistory((prev) => [...prev, userMessage])
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
        sendDirectMessage, // sendDirectMessage 함수를 반환 객체에 추가
    }
}
