import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { supabase } from '@/src/lib/supabase'

const TravelDetail = () => {
    const [events, setEvents] = useState<any[]>([])
    const [travels, setTravels] = useState<any[]>([])
    const [selectedTravel, setSelectedTravel] = useState<number | null>(null)
    const [isAddingEvent, setIsAddingEvent] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newStart, setNewStart] = useState('')
    const [newEnd, setNewEnd] = useState('')
    const [newNote, setNewNote] = useState('')
    const [selectedEventDetail, setSelectedEventDetail] = useState<any>(null)

    useEffect(() => {
        const fetchTravels = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('travel')
                .select(
                    'id, title, destination, num_travelers, start_date, end_date, travel_duration, transportation, budget, note, status',
                )
                .eq('user_id', user.id)
            if (data) {
                setTravels(data)
                if (data.length > 0) {
                    setSelectedTravel(data[0].id)
                }
            }
        }
        fetchTravels()
    }, [])

    useEffect(() => {
        if (!selectedTravel) return

        const fetchEvents = async () => {
            const { data } = await supabase
                .from('travel_schedule')
                .select('id, title, start_time, end_time, travel_id, note')
                .eq('travel_id', selectedTravel)
            if (data) {
                const mappedEvents = data.map((event: any) => ({
                    id: event.id.toString(),
                    travel_id: event.travel_id,
                    title: event.title,
                    start: new Date(event.start_time),
                    end: new Date(event.end_time),
                    note: event.note,
                }))
                setEvents(mappedEvents)
            }
        }
        fetchEvents()
    }, [selectedTravel])

    const currentTravel = travels.find((travel) => travel.id === selectedTravel)
    const travelEvent = currentTravel
        ? {
              id: `travel-${currentTravel.id}`,
              title: currentTravel.title,
              start: new Date(currentTravel.start_date),
              end: new Date(new Date(currentTravel.end_date).setDate(new Date(currentTravel.end_date).getDate() + 1)),
              allDay: true,
              extendedProps: {
                  destination: currentTravel.destination,
                  numTravelers: currentTravel.num_travelers,
                  travelDuration: currentTravel.travel_duration,
                  transportation: currentTravel.transportation,
                  budget: currentTravel.budget,
                  note: currentTravel.note,
                  status: currentTravel.status,
              },
          }
        : null

    const combinedEvents = travelEvent ? [...events, travelEvent] : events

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedTravel) return

        const { error } = await supabase.from('travel_schedule').insert([
            {
                title: newTitle,
                start_time: newStart,
                end_time: newEnd,
                travel_id: selectedTravel,
                note: newNote,
            },
        ])
        if (!error) {
            const { data: updatedData } = await supabase
                .from('travel_schedule')
                .select('id, title, start_time, end_time, travel_id, note')
                .eq('travel_id', selectedTravel)
            if (updatedData) {
                const mappedEvents = updatedData.map((event: any) => ({
                    id: event.id.toString(),
                    travel_id: event.travel_id,
                    title: event.title,
                    start: new Date(event.start_time),
                    end: new Date(event.end_time),
                    note: event.note,
                }))
                setEvents(mappedEvents)
            }
            setIsAddingEvent(false)
            setNewTitle('')
            setNewStart('')
            setNewEnd('')
            setNewNote('')
        }
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">여행 일정 계획</h2>
                        <p className="text-gray-600 mt-1">나의 여행 일정을 세부적으로 계획하세요</p>
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
                        <button
                            onClick={() => setIsAddingEvent(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 whitespace-nowrap"
                        >
                            <i className="ri-add-line"></i>
                            <span>새 일정 추가</span>
                        </button>
                    </div>
                </div>
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    events={combinedEvents}
                    firstDay={1}
                    slotMinTime="06:00"
                    eventContent={(arg) => {
                        const event = arg.event
                        const commonStyle =
                            'display: block; white-space: normal; word-break: break-all; overflow-wrap: break-word;'
                        if (event.allDay) {
                            const startDate = event.start ? event.start.toLocaleDateString() : ''
                            const endDate = event.end
                                ? new Date(event.end.getTime() - 86400000).toLocaleDateString()
                                : startDate
                            return {
                                html: `<div style="${commonStyle}">
                                            <div style="line-height: 1; margin-bottom: 2px;">${event.title}</div>
                                            <div style="font-size: 0.9em; font-weight: bold; color: yellow; line-height: 1; margin-top: 0; display: inline-block; min-width: 50px; min-height: 20px;">
                                                ${startDate} ~ ${endDate}
                                            </div>
                                       </div>`,
                            }
                        } else {
                            const startTime = event.start
                                ? event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : ''
                            const endTime = event.end
                                ? event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : ''
                            return {
                                html: `<div style="${commonStyle}">
                                            <div style="line-height: 1; margin-bottom: 2px;">${event.title}</div>
                                            <div style="font-size: 0.9em; font-weight: bold; color: yellow; line-height: 1; margin-top: 0; display: inline-block;">
                                                ${startTime} - ${endTime}
                                            </div>
                                       </div>`,
                            }
                        }
                    }}
                    eventClick={(arg) => {
                        const event = arg.event
                        setSelectedEventDetail({
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            allDay: event.allDay,
                            note: event.extendedProps.note || '',
                            destination: event.extendedProps.destination,
                            numTravelers: event.extendedProps.numTravelers,
                            travelDuration: event.extendedProps.travelDuration,
                            transportation: event.extendedProps.transportation,
                            budget: event.extendedProps.budget,
                            status: event.extendedProps.status,
                        })
                    }}
                />
            </div>
            {isAddingEvent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-xl font-bold mb-4">새 일정 추가</h3>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">제목</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">시작 시간</label>
                                <input
                                    type="datetime-local"
                                    value={newStart}
                                    onChange={(e) => setNewStart(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">끝 시간</label>
                                <input
                                    type="datetime-local"
                                    value={newEnd}
                                    onChange={(e) => setNewEnd(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">메모</label>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingEvent(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    추가
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {selectedEventDetail && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h3 className="text-xl font-bold mb-4">일정 상세 정보</h3>
                        <div className="space-y-2">
                            <div>
                                <strong>제목: </strong>
                                {selectedEventDetail.title}
                            </div>
                            <div>
                                <strong>시작: </strong>
                                {selectedEventDetail.start ? new Date(selectedEventDetail.start).toLocaleString() : ''}
                            </div>
                            <div>
                                <strong>끝: </strong>
                                {selectedEventDetail.end ? new Date(selectedEventDetail.end).toLocaleString() : ''}
                            </div>
                            {selectedEventDetail.destination && (
                                <div>
                                    <strong>목적지: </strong>
                                    {selectedEventDetail.destination}
                                </div>
                            )}
                            {selectedEventDetail.numTravelers !== undefined && (
                                <div>
                                    <strong>여행 인원: </strong>
                                    {selectedEventDetail.numTravelers}명
                                </div>
                            )}
                            {selectedEventDetail.travelDuration && (
                                <div>
                                    <strong>여행 기간: </strong>
                                    {selectedEventDetail.travelDuration}일
                                </div>
                            )}
                            {selectedEventDetail.transportation && (
                                <div>
                                    <strong>교통편: </strong>
                                    {selectedEventDetail.transportation}
                                </div>
                            )}
                            {selectedEventDetail.budget !== undefined && (
                                <div>
                                    <strong>예산: </strong>
                                    {selectedEventDetail.budget.toLocaleString()}원
                                </div>
                            )}
                            {selectedEventDetail.note && (
                                <div>
                                    <strong>메모: </strong>
                                    {selectedEventDetail.note}
                                </div>
                            )}
                            {selectedEventDetail.status && (
                                <div>
                                    <strong>상태: </strong>
                                    {selectedEventDetail.status}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => setSelectedEventDetail(null)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx global>{`
                .fc-timegrid-event {
                    min-height: 40px !important;
                }
            `}</style>
        </>
    )
}

export default TravelDetail
