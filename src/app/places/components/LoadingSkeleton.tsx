interface LoadingSkeletonProps {
    count?: number
    paginationCount?: number
}

export default function LoadingSkeleton({ count = 12, paginationCount = 5 }: LoadingSkeletonProps) {
    return (
        <>
            <div className="mt-6">
                {/* Results Count Skeleton */}
                <div className="text-sm text-gray-600 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>

                {/* Places Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: count }).map((_, index) => (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="relative h-48">
                                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                            </div>
                            <div className="p-6">
                                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center space-x-2 py-4">
                {Array.from({ length: paginationCount }).map((_, index) => (
                    <div key={index} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                ))}
            </div>
        </>
    )
}
