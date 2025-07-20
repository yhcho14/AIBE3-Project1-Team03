import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { supabase } from '@/src/lib/supabase'

interface TravelDetailProps {
    selectedTravelId?: number | null
}

const TravelDetail = ({ selectedTravelId }: TravelDetailProps) => {
    const [events, setEvents] = useState<any[]>([])
    const [travels, setTravels] = useState<any[]>([])
    const [selectedTravel, setSelectedTravel] = useState<number | null>(null)
    const [isAddingEvent, setIsAddingEvent] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newStart, setNewStart] = useState('')
    const [newEnd, setNewEnd] = useState('')
    const [newNote, setNewNote] = useState('')
    const [selectedEventDetail, setSelectedEventDetail] = useState<any>(null)
    const [isEditingEvent, setIsEditingEvent] = useState(false)
    const [editTitle, setEditTitle] = useState('')
    const [editStart, setEditStart] = useState('')
    const [editEnd, setEditEnd] = useState('')
    const [editNote, setEditNote] = useState('')

    // 선택된 여행 정보 가져오기
    const selectedTravelInfo = travels.find((travel) => travel.id === selectedTravel)

    // 날짜 범위 계산 (datetime-local 형식으로 변환)
    const getDateTimeLocalRange = () => {
        if (!selectedTravelInfo || !selectedTravelInfo.start_date || !selectedTravelInfo.end_date) {
            return { min: '', max: '' }
        }

        // 날짜 문자열에서 날짜 부분만 추출 (YYYY-MM-DD)
        const getDateOnly = (dateStr: string) => {
            return dateStr.split('T')[0] // 시간 부분 제거
        }

        const startDateStr = getDateOnly(selectedTravelInfo.start_date)
        const endDateStr = getDateOnly(selectedTravelInfo.end_date)

        // 날짜 문자열을 Date 객체로 변환
        const startDate = new Date(startDateStr + 'T00:00:00')
        const endDate = new Date(endDateStr + 'T23:59:59')

        // 날짜 유효성 검사
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid travel dates:', startDateStr, endDateStr)
            return { min: '', max: '' }
        }

        // 로컬 시간대로 변환하여 datetime-local 형식으로 포맷
        const formatDateTimeLocal = (date: Date) => {
            if (isNaN(date.getTime())) {
                return ''
            }
            const offset = date.getTimezoneOffset() * 60000
            const localTime = new Date(date.getTime() - offset)
            return localTime.toISOString().slice(0, 16)
        }

        const min = formatDateTimeLocal(startDate)
        const max = formatDateTimeLocal(endDate)

        return { min, max }
    }

    const { min: minDateTime, max: maxDateTime } = getDateTimeLocalRange()

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
                // selectedTravelId가 있으면 그것을 선택, 없으면 첫 번째 여행 선택
                if (selectedTravelId && data.some((travel) => travel.id === selectedTravelId)) {
                    setSelectedTravel(selectedTravelId)
                } else if (data.length > 0) {
                    setSelectedTravel(data[0].id)
                }
            }
        }
        fetchTravels()
    }, [selectedTravelId])

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

        if (!selectedTravel) {
            alert('여행을 선택해주세요.')
            return
        }

        // 날짜 범위 검증
        if (selectedTravelInfo) {
            const startDate = new Date(newStart)
            const endDate = new Date(newEnd)

            // 입력된 날짜 유효성 검사
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                alert('올바른 날짜와 시간을 입력해주세요.')
                return
            }

            // 날짜 문자열에서 날짜 부분만 추출
            const getDateOnly = (dateStr: string) => {
                return dateStr.split('T')[0] // 시간 부분 제거
            }

            const travelStartDateStr = getDateOnly(selectedTravelInfo.start_date)
            const travelEndDateStr = getDateOnly(selectedTravelInfo.end_date)

            // 여행 날짜를 Date 객체로 변환 (시작은 00:00, 종료는 23:59로 설정)
            const travelStartDate = new Date(travelStartDateStr + 'T00:00:00')
            const travelEndDate = new Date(travelEndDateStr + 'T23:59:59')

            // 여행 날짜 유효성 검사
            if (isNaN(travelStartDate.getTime()) || isNaN(travelEndDate.getTime())) {
                alert('여행 날짜 정보에 오류가 있습니다.')
                return
            }

            if (startDate < travelStartDate || startDate > travelEndDate) {
                alert(`일정 시작일은 여행 기간(${travelStartDateStr} ~ ${travelEndDateStr}) 내에 있어야 합니다.`)
                return
            }

            if (endDate < travelStartDate || endDate > travelEndDate) {
                alert(`일정 종료일은 여행 기간(${travelStartDateStr} ~ ${travelEndDateStr}) 내에 있어야 합니다.`)
                return
            }

            if (startDate >= endDate) {
                alert('시작 시간은 끝 시간보다 이전이어야 합니다.')
                return
            }
        }

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

    const handleEditEvent = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedEventDetail?.id) {
            alert('수정할 일정을 찾을 수 없습니다.')
            return
        }

        // 날짜 범위 검증
        if (selectedTravelInfo) {
            const startDate = new Date(editStart)
            const endDate = new Date(editEnd)

            // 입력된 날짜 유효성 검사
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                alert('올바른 날짜와 시간을 입력해주세요.')
                return
            }

            // 날짜 문자열에서 날짜 부분만 추출
            const getDateOnly = (dateStr: string) => {
                return dateStr.split('T')[0] // 시간 부분 제거
            }

            const travelStartDateStr = getDateOnly(selectedTravelInfo.start_date)
            const travelEndDateStr = getDateOnly(selectedTravelInfo.end_date)

            // 여행 날짜를 Date 객체로 변환 (시작은 00:00, 종료는 23:59로 설정)
            const travelStartDate = new Date(travelStartDateStr + 'T00:00:00')
            const travelEndDate = new Date(travelEndDateStr + 'T23:59:59')

            // 여행 날짜 유효성 검사
            if (isNaN(travelStartDate.getTime()) || isNaN(travelEndDate.getTime())) {
                alert('여행 날짜 정보에 오류가 있습니다.')
                return
            }

            if (startDate < travelStartDate || startDate > travelEndDate) {
                alert(`일정 시작일은 여행 기간(${travelStartDateStr} ~ ${travelEndDateStr}) 내에 있어야 합니다.`)
                return
            }

            if (endDate < travelStartDate || endDate > travelEndDate) {
                alert(`일정 종료일은 여행 기간(${travelStartDateStr} ~ ${travelEndDateStr}) 내에 있어야 합니다.`)
                return
            }

            if (startDate >= endDate) {
                alert('시작 시간은 끝 시간보다 이전이어야 합니다.')
                return
            }
        }

        const { error } = await supabase
            .from('travel_schedule')
            .update({
                title: editTitle,
                start_time: editStart,
                end_time: editEnd,
                note: editNote,
            })
            .eq('id', selectedEventDetail.id)

        if (!error) {
            // 이벤트 목록 새로고침
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
            setIsEditingEvent(false)
            setSelectedEventDetail(null)
            alert('일정이 성공적으로 수정되었습니다.')
        } else {
            console.error('수정 실패:', error.message)
            alert('일정 수정에 실패했습니다.')
        }
    }

    const handleDeleteEvent = async () => {
        if (!selectedEventDetail?.id) {
            alert('삭제할 일정을 찾을 수 없습니다.')
            return
        }

        // all-day 이벤트는 삭제할 수 없음
        if (selectedEventDetail.allDay) {
            alert('여행 전체 기간은 삭제할 수 없습니다. 여행 플래너에서 여행 자체를 삭제해주세요.')
            return
        }

        if (!confirm('정말로 이 일정을 삭제하시겠습니까?')) {
            return
        }

        const { error } = await supabase.from('travel_schedule').delete().eq('id', selectedEventDetail.id)

        if (!error) {
            // 이벤트 목록 새로고침
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
            setSelectedEventDetail(null)
            alert('일정이 성공적으로 삭제되었습니다.')
        } else {
            console.error('삭제 실패:', error.message)
            alert('일정 삭제에 실패했습니다.')
        }
    }

    const startEditing = () => {
        if (selectedEventDetail) {
            // all-day 이벤트는 수정할 수 없음
            if (selectedEventDetail.allDay) {
                alert('여행 전체 기간은 수정할 수 없습니다. 여행 플래너에서 수정해주세요.')
                return
            }

            setEditTitle(selectedEventDetail.title || '')

            // 로컬 시간대로 변환하여 datetime-local 형식으로 설정
            const formatDateTimeLocal = (date: Date) => {
                if (!date || isNaN(date.getTime())) {
                    return ''
                }
                const offset = date.getTimezoneOffset() * 60000 // 분을 밀리초로 변환
                const localTime = new Date(date.getTime() - offset)
                return localTime.toISOString().slice(0, 16)
            }

            const startDateObj = selectedEventDetail.start ? new Date(selectedEventDetail.start) : null
            const endDateObj = selectedEventDetail.end ? new Date(selectedEventDetail.end) : null

            setEditStart(startDateObj ? formatDateTimeLocal(startDateObj) : '')
            setEditEnd(endDateObj ? formatDateTimeLocal(endDateObj) : '')
            setEditNote(selectedEventDetail.note || '')
            setIsEditingEvent(true)
        }
    }

    const cancelEditing = () => {
        setIsEditingEvent(false)
        setEditTitle('')
        setEditStart('')
        setEditEnd('')
        setEditNote('')
    }

    const closeModal = () => {
        setSelectedEventDetail(null)
        setIsEditingEvent(false)
        setEditTitle('')
        setEditStart('')
        setEditEnd('')
        setEditNote('')
    }

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
                    key={selectedTravel} // 여행 변경 시 달력 재렌더링
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    initialDate={selectedTravelInfo ? selectedTravelInfo.start_date : undefined}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek,timeGridDay',
                    }}
                    events={combinedEvents}
                    firstDay={1}
                    slotMinTime="06:00"
                    height="auto"
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
                            id: event.id,
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
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg mx-4">
                        <h3 className="text-xl font-bold mb-6">새 일정 추가</h3>
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
                                    min={minDateTime}
                                    max={maxDateTime}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                                {selectedTravelInfo && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        여행 기간: {selectedTravelInfo.start_date} ~ {selectedTravelInfo.end_date}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">끝 시간</label>
                                <input
                                    type="datetime-local"
                                    value={newEnd}
                                    onChange={(e) => setNewEnd(e.target.value)}
                                    min={minDateTime}
                                    max={maxDateTime}
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
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg mx-4">
                        <h3 className="text-xl font-bold mb-6">{isEditingEvent ? '일정 수정' : '일정 상세 정보'}</h3>

                        {isEditingEvent ? (
                            // 수정 모드
                            <form onSubmit={handleEditEvent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">제목</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">시작 시간</label>
                                    <input
                                        type="datetime-local"
                                        value={editStart}
                                        onChange={(e) => setEditStart(e.target.value)}
                                        min={minDateTime}
                                        max={maxDateTime}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                    {selectedTravelInfo && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            여행 기간: {selectedTravelInfo.start_date} ~ {selectedTravelInfo.end_date}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">끝 시간</label>
                                    <input
                                        type="datetime-local"
                                        value={editEnd}
                                        onChange={(e) => setEditEnd(e.target.value)}
                                        min={minDateTime}
                                        max={maxDateTime}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">메모</label>
                                    <textarea
                                        value={editNote}
                                        onChange={(e) => setEditNote(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        rows={3}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end space-x-2 mt-6">
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        저장
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // 읽기 전용 모드
                            <div>
                                <div className="space-y-2">
                                    <div>
                                        <strong>제목: </strong>
                                        {selectedEventDetail.title}
                                    </div>
                                    <div>
                                        <strong>시작: </strong>
                                        {selectedEventDetail.start
                                            ? new Date(selectedEventDetail.start).toLocaleString()
                                            : ''}
                                    </div>
                                    <div>
                                        <strong>끝: </strong>
                                        {selectedEventDetail.end
                                            ? new Date(selectedEventDetail.end).toLocaleString()
                                            : ''}
                                    </div>
                                    {selectedEventDetail.note && (
                                        <div>
                                            <strong>메모: </strong>
                                            {selectedEventDetail.note}
                                        </div>
                                    )}
                                    {/* all-day 이벤트인 경우 여행 정보 표시 */}
                                    {selectedEventDetail.allDay && (
                                        <>
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
                                            {selectedEventDetail.status && (
                                                <div>
                                                    <strong>상태: </strong>
                                                    {selectedEventDetail.status}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-between mt-6">
                                    {/* all-day 이벤트가 아닌 경우에만 수정/삭제 버튼 표시 */}
                                    {!selectedEventDetail.allDay ? (
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={startEditing}
                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                수정
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDeleteEvent}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <span className="text-sm text-gray-500 italic">
                                                여행 전체 기간 정보입니다. 여행 플래너에서 수정 가능합니다.
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>
                        )}
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
