'use client'

import { useState, useEffect, useRef } from 'react'
import { AREA_CODE_MAP, SIGUNGU_CODE_MAP } from '../../../lib/constants'

interface LocationSelectorProps {
    selectedAreaCode: string | null
    selectedSigunguCode: string | null
    onLocationSelect: (areaCode: string | null, sigunguCode: string | null) => void
}

export default function LocationSelector({
    selectedAreaCode,
    selectedSigunguCode,
    onLocationSelect,
}: LocationSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [tempSelectedProvince, setTempSelectedProvince] = useState<string>('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const sigunguSectionRef = useRef<HTMLDivElement>(null)

    const quickAccessLocations = [
        { code: null, name: '전체' },
        { code: '39', name: '제주도' },
        { code: '6', name: '부산' },
        { code: '1', name: '서울' },
        { code: '32', name: '강릉', sigungu: '1' },
        { code: '37', name: '전주', sigungu: '12' },
        { code: '35', name: '경주', sigungu: '2' },
        { code: '32', name: '속초', sigungu: '5' },
    ]

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // 드롭다운 내부에서 지역 선택 시 최종 onLocationSelect 호출
    const handleLocationSelect = (areaCode: string | null, sigunguCode: string | null = null) => {
        onLocationSelect(areaCode, sigunguCode)
        setIsOpen(false)
        setTempSelectedProvince('')
    }

    // 드롭다운 열릴 때 현재 선택된 지역에 따라 임시 시도 설정
    useEffect(() => {
        if (isOpen) {
            if (selectedAreaCode && !selectedSigunguCode) {
                setTempSelectedProvince(selectedAreaCode)
            } else if (selectedAreaCode && selectedSigunguCode) {
                setTempSelectedProvince(selectedAreaCode)
            } else {
                setTempSelectedProvince('')
            }
        }
    }, [isOpen, selectedAreaCode, selectedSigunguCode])

    // 시도 버튼 클릭 시 시군구 목록으로 스크롤
    useEffect(() => {
        if (isOpen && tempSelectedProvince && sigunguSectionRef.current) {
            sigunguSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [tempSelectedProvince, isOpen])

    // 현재 선택된 지역 정보 표시를 위한 텍스트 생성
    const getCurrentSelectionText = () => {
        if (!selectedAreaCode) {
            return <i className="ri-more-fill"></i> // '전체' 또는 아무것도 선택 안 됨
        }

        const province = AREA_CODE_MAP.get(selectedAreaCode)
        if (!province) return <i className="ri-more-fill"></i>

        if (selectedSigunguCode) {
            const sigungu = SIGUNGU_CODE_MAP.get(selectedAreaCode)?.find((s) => s.code === selectedSigunguCode)
            return `${province} ${sigungu?.name || ''}`
        } else {
            return province
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 자주 사용하는 지역 버튼들 */}
            <div className="flex flex-wrap gap-2">
                {quickAccessLocations.map((loc) => (
                    <button
                        key={loc.name} // 고유한 key 사용
                        onClick={() => handleLocationSelect(loc.code, loc.sigungu || null)}
                        className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                            selectedAreaCode === loc.code && selectedSigunguCode === (loc.sigungu || null)
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {loc.name}
                    </button>
                ))}

                {/* '더보기' (More) 버튼 - 현재 선택된 지역 표시 */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                            selectedAreaCode &&
                            !quickAccessLocations.some(
                                (loc) => loc.code === selectedAreaCode && (loc.sigungu || null) === selectedSigunguCode,
                            )
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {getCurrentSelectionText()}
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-3">지역 선택</h3>

                                {/* 시도 선택 */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-medium text-gray-500 mb-2">시도</h4>
                                    <div className="grid grid-cols-2 gap-1 p-1">
                                        {Array.from(AREA_CODE_MAP.entries()).map(([code, name]) => (
                                            <button
                                                key={code}
                                                onClick={() => {
                                                    if (code === '8') {
                                                        // 세종특별자치시 (시군구 없음)
                                                        handleLocationSelect(code)
                                                    } else {
                                                        setTempSelectedProvince(code)
                                                    }
                                                }}
                                                className={`text-left px-2 py-1 text-sm rounded transition-colors ${
                                                    tempSelectedProvince === code
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 시군구 선택 */}
                                {tempSelectedProvince && SIGUNGU_CODE_MAP.get(tempSelectedProvince) && (
                                    <div ref={sigunguSectionRef}>
                                        <h4 className="text-xs font-medium text-gray-500 mb-2">
                                            {AREA_CODE_MAP.get(tempSelectedProvince)} 시군구
                                        </h4>
                                        <div className="grid grid-cols-2 gap-1 p-1">
                                            <button
                                                onClick={() => handleLocationSelect(tempSelectedProvince)} // 시도 전체 선택
                                                className={`text-left px-2 py-1 text-sm rounded transition-colors ${
                                                    selectedAreaCode === tempSelectedProvince && !selectedSigunguCode
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {AREA_CODE_MAP.get(tempSelectedProvince)} 전체
                                            </button>
                                            {SIGUNGU_CODE_MAP.get(tempSelectedProvince)?.map((sigungu) => (
                                                <button
                                                    key={sigungu.code}
                                                    onClick={() =>
                                                        handleLocationSelect(tempSelectedProvince, sigungu.code)
                                                    }
                                                    className={`text-left px-2 py-1 text-sm rounded transition-colors ${
                                                        selectedAreaCode === tempSelectedProvince &&
                                                        selectedSigunguCode === sigungu.code
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'hover:bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {sigungu.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
