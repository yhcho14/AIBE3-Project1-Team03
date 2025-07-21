import { useState } from 'react'
import { CourseInfoData } from '../../../../lib/types/placeDetailType'

interface CourseInfoProps {
    info: CourseInfoData
    isLast?: boolean
}

export default function CourseInfo({ info, isLast = false }: CourseInfoProps) {
    const [expanded, setExpanded] = useState(false)
    const isLong = info.subdetailoverview && info.subdetailoverview.length > 120

    return (
        <div className="relative flex items-start gap-6">
            {/* 코스 번호 (카드 밖, 왼쪽) */}
            <div className="flex-shrink-0 relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{Number(info.subnum) + 1}</span>
                </div>
            </div>

            {/* 코스 연결선 */}
            {!isLast && (
                <div className="absolute left-8 top-16 w-0.5 h-full bg-gradient-to-b from-blue-400 to-blue-200 z-0" />
            )}

            {/* 카드 내용 */}
            <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="flex flex-col lg:flex-row items-start gap-6 p-6">
                    {/* 이미지 */}
                    <div className="w-full lg:w-48 h-32 lg:h-32 bg-gray-100 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                        {info.subdetailimg ? (
                            <img
                                src={info.subdetailimg}
                                alt={info.subdetailalt || info.subname}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                <i className="ri-image-2-line text-2xl text-blue-400 font-light" />
                            </div>
                        )}
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{info.subname}</h3>
                                {info.subdetailalt && (
                                    <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full self-start sm:self-auto">
                                        {info.subdetailalt}
                                    </span>
                                )}
                            </div>
                            <div
                                className={
                                    !expanded && isLong
                                        ? 'text-gray-700 whitespace-pre-line line-clamp-3 max-h-18 overflow-hidden'
                                        : 'text-gray-700 whitespace-pre-line'
                                }
                            >
                                {info.subdetailoverview}
                            </div>
                            {isLong && (
                                <button
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700 mt-2 transition-colors duration-200"
                                    onClick={() => setExpanded((v) => !v)}
                                    type="button"
                                >
                                    {expanded ? '접기' : '더보기'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
