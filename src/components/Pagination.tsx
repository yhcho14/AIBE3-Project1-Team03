import React from 'react'

export interface PaginationProps {
    currentPage: number
    totalCount: number
    pageSize: number
    pageGroupSize: number
    onPageChange: (page: number) => void
}

export default function Pagination({
    currentPage,
    totalCount,
    pageSize,
    pageGroupSize,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalCount / pageSize)
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize)
    const groupStart = currentGroup * pageGroupSize + 1
    const groupEnd = Math.min(groupStart + pageGroupSize - 1, totalPages)
    const pageNumbers = []
    for (let i = groupStart; i <= groupEnd; i++) pageNumbers.push(i)
    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <button
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={() => onPageChange(Math.max(1, groupStart - pageGroupSize))}
                disabled={groupStart === 1}
            >
                <i className="ri-arrow-left-line"></i>
            </button>
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        page === currentPage ? 'bg-blue-500 text-white' : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            <button
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={() => onPageChange(Math.min(totalPages, groupStart + pageGroupSize))}
                disabled={groupEnd === totalPages}
            >
                <i className="ri-arrow-right-line"></i>
            </button>
        </div>
    )
}
