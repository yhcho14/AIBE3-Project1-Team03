//travel테이블 -> 여행 플래너에 출력하는 기능 분리 중... 아직 적용 x
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface TravelPlan {
    id: number
    title: string
    numTravelers: number
    startDate: string
    endDate: string
    durationDays: number
    transportation: string
    accommodation: string
    estimatedCost: number
    notes: string
    createdAt: string
    status: 'draft' | 'confirmed' | 'completed'
    schedule?: {
        title: string
        startTime: Date
        endTime: Date
        note: string
    }[]
}

const samplePlans: TravelPlan[] = [
    {
        id: 1,
        title: '부산 바다 여행',
        numTravelers: 2,
        startDate: '2024-07-16',
        endDate: '2024-07-18',
        durationDays: 3,
        transportation: 'KTX',
        accommodation: '해운대 호텔',
        estimatedCost: 450000,
        notes: 'AI 추천으로 생성된 부산 여행 계획입니다.',
        createdAt: '2024-01-15',
        status: 'draft',
        schedule: [
            {
                title: '부산 바다 여행',
                startTime: new Date('2024-07-16T10:00:00'),
                endTime: new Date('2024-07-18T18:00:00'),
                note: '부산 바다 여행 계획입니다.',
            },
        ],
    },
    {
        id: 2,
        title: '제주도 힐링 여행',
        numTravelers: 4,
        startDate: '2024-08-10',
        endDate: '2024-08-13',
        durationDays: 4,
        transportation: '항공편',
        accommodation: '서귀포 펜션',
        estimatedCost: 680000,
        notes: '가족과 함께하는 제주도 여행',
        createdAt: '2024-01-10',
        status: 'confirmed',
        schedule: [
            {
                title: '제주도 힐링 여행',
                startTime: new Date('2024-08-10T10:00:00'),
                endTime: new Date('2024-08-13T18:00:00'),
                note: '제주도 힐링 여행 계획입니다.',
            },
        ],
    },
    {
        id: 3,
        title: '경주 역사 탐방',
        numTravelers: 4,
        startDate: '2023-12-20',
        endDate: '2023-12-22',
        durationDays: 3,
        transportation: '고속버스',
        accommodation: '경주 게스트하우스',
        estimatedCost: 280000,
        notes: '역사와 문화를 체험하는 여행',
        createdAt: '2023-12-01',
        status: 'completed',
        schedule: [
            {
                title: '경주 역사 탐방',
                startTime: new Date('2023-12-20T10:00:00'),
                endTime: new Date('2023-12-22T18:00:00'),
                note: '경주 역사 탐방 계획입니다.',
            },
        ],
    },
]

export function useTravelPlans(initialPlans: TravelPlan[] = []) {
    const [plans, setPlans] = useState<TravelPlan[]>(initialPlans)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPlans = async () => {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser()

            if (authError || !user) {
                setError(authError?.message || '로그인된 유저 없음')
                setLoading(false)
                return
            }

            const { data, error } = await supabase.from('travel').select('*').eq('user_id', user.id)

            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }

            const travelPlans: TravelPlan[] = (data ?? []).map((item) => ({
                id: item.id,
                title: item.title,
                numTravelers: item.num_travelers,
                startDate: new Date(item.start_date).toISOString().slice(0, 10),
                endDate: new Date(item.end_date).toISOString().slice(0, 10),
                durationDays: item.travel_duration,
                transportation: item.transportation,
                accommodation: item.accommodation,
                estimatedCost: item.budget,
                notes: item.note,
                createdAt: new Date(item.created_at).toISOString().slice(0, 10),
                status: item.status,
                schedule: [
                    {
                        title: item.title,
                        startTime: new Date(item.start_date + 'T10:00:00'),
                        endTime: new Date(item.end_date + 'T18:00:00'),
                        note: item.note,
                    },
                ],
            }))

            setPlans(travelPlans)
            setLoading(false)
        }

        fetchPlans()
    }, [])

    return { plans, loading, error }
}
