import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

interface TravelPlan {
    id: number
    title: string
    destination?: string
    start_date: string
    end_date: string
    status: string
}

interface UseAddToTravelProps {
    placeTitle: string
}

export default function useAddToTravel({ placeTitle }: UseAddToTravelProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    // 사용자 정보 확인
    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
    }, [])

    const openAddToTravelModal = async () => {
        if (!user) {
            alert('로그인이 필요합니다.')
            // TODO: 로그인 페이지로 리다이렉트
            return
        }

        setIsModalOpen(true)
        await fetchUserTravelPlans()
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setTravelPlans([])
    }

    // 사용자의 여행 계획 가져오기
    const fetchUserTravelPlans = async () => {
        if (!user) return

        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('travel')
                .select('id, title, destination,start_date, end_date, status')
                .eq('user_id', user.id)
                .in('status', ['draft', 'confirmed']) // 진행중인 여행 계획만
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching travel plans:', error)
                return
            }

            setTravelPlans(data || [])
        } catch (error) {
            console.error('Error fetching travel plans:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleTravelPlanSelect = (travelPlanId: string) => {
        //
    }

    return {
        isModalOpen,
        travelPlans,
        isLoading,
        user,
        openAddToTravelModal,
        closeModal,
        handleTravelPlanSelect,
    }
}
