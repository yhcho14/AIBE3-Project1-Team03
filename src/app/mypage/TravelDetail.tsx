import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import { supabase } from '@/src/lib/supabase'

const TravelDetail = () => {
    const [events, setEvents] = useState<any[]>([])
    const [travels, setTravels] = useState<any[]>([])
    const [selectedTravel, setSelectedTravel] = useState<number | null>(null)

    // 현재 유저의 여행 목록 불러오기 (id, title, start_date, end_date)
    useEffect(() => {
        const fetchTravels = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('travel')
                .select('id, title, start_date, end_date')
                .eq('user_id', user.id)

            if (error) {
                console.error('Error fetching travels:', error)
                return
            }
            setTravels(data)
            // 기본 선택: 여행 목록이 있을 경우 첫번째 travel의 id 지정
            if (data && data.length > 0) {
                setSelectedTravel(data[0].id)
            }
        }
        fetchTravels()
    }, [])

    // 선택한 travel의 id에 따라 일정 이벤트 불러오기 (travel_schedule 테이블)
    useEffect(() => {
        if (!selectedTravel) return

        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('travel_schedule')
                .select('id, title, start_time, end_time, travel_id, note')
                .eq('travel_id', selectedTravel)

            console.log('Fetched data:', data)
            console.log('Error:', error)
            if (data) {
                const mappedEvents = data.map((event: any) => ({
                    id: event.id.toString(),
                    travel_id: event.travel_id,
                    title: event.title,
                    start: new Date(event.start_time), // Date 객체로 변환
                    end: new Date(event.end_time), // Date 객체로 변환
                    note: event.note,
                }))
                setEvents(mappedEvents)
            } else {
                console.error(error)
            }
        }
        fetchEvents()
    }, [selectedTravel])

    // 현재 선택된 travel의 start_date, end_date, title로 이벤트 생성 후 travel_schedule 이벤트와 합치기
    const currentTravel = travels.find((travel) => travel.id === selectedTravel)
    const travelEvent = currentTravel
        ? {
              id: `travel-${currentTravel.id}`,
              title: currentTravel.title,
              start: new Date(currentTravel.start_date),
              end: new Date(
              new Date(currentTravel.end_date).setDate(
                  new Date(currentTravel.end_date).getDate() + 1
              )
          ),
              allDay: true, // 하루 종일 이벤트로 표시
          }
        : null

    const combinedEvents = travelEvent ? [...events, travelEvent] : events

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">여행 일정 계획</h2>
                        <p className="text-gray-600 mt-1">여행 일정을 세부적으로 계획하세요</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <select
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 whitespace-nowrap"
                            value={selectedTravel ?? undefined}
                            onChange={(e) => setSelectedTravel(Number(e.target.value))}
                        >
                            {travels.map((travel) => (
                                <option key={travel.id} value={travel.id}>
                                    {travel.title}
                                </option>
                            ))}
                        </select>

                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap">
                            <i className="ri-add-line"></i>
                            <span>새 일정 추가</span>
                        </button>
                    </div>
                </div>
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    events={combinedEvents}
                    slotMinTime="06:00"
                />
            </div>
        </>
    )
}

export default TravelDetail
