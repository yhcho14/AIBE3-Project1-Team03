import React from 'react'

export default function PlaceDetailSkeleton() {
    return (
        <div className="max-w-5xl mx-auto animate-pulse">
            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-4 flex-nowrap">
                    <div className="h-10 w-2/3 bg-gray-200 rounded" />
                    <div className="h-8 w-32 bg-gray-200 rounded-full" />
                </div>
                {/* Category Tags */}
                <div className="flex gap-2 mb-2">
                    <div className="h-7 w-24 bg-gray-100 rounded-full" />
                    <div className="h-7 w-16 bg-gray-100 rounded-full" />
                </div>
                {/* Summary Row */}
                <div className="flex gap-6 items-center text-base mb-2">
                    <div className="h-5 w-32 bg-gray-100 rounded" />
                    <div className="h-5 w-24 bg-gray-100 rounded" />
                    <div className="h-5 w-24 bg-gray-100 rounded" />
                </div>
            </div>

            {/* Hero Section with Image and Overview */}
            <div className="max-w-5xl mx-auto mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="relative rounded-2xl overflow-hidden mb-6 flex justify-center items-center bg-gray-100 h-64">
                    <div className="w-full h-full bg-gray-200" />
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
                    <div className="h-5 w-1/2 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Course Info Section (Skeleton 2개) */}
            <div className="max-w-5xl mx-auto mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-8">
                <div className="space-y-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-full bg-gray-200" />
                            <div className="flex-1 bg-gray-50 rounded-xl p-6">
                                <div className="h-6 w-1/3 bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-2/3 bg-gray-100 rounded mb-1" />
                                <div className="h-4 w-1/2 bg-gray-100 rounded mb-1" />
                                <div className="h-4 w-1/4 bg-gray-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
