interface NoResultsMessageProps {
    searchKeyword?: string
    filterCategory?: string
}

export default function NoResultsMessage({ searchKeyword, filterCategory }: NoResultsMessageProps) {
    const getMessage = () => {
        if (searchKeyword && filterCategory) {
            return `"${searchKeyword}" 검색어와 "${filterCategory}" 카테고리에 해당하는 게시글이 없습니다.`
        } else if (searchKeyword) {
            return `"${searchKeyword}" 검색어에 해당하는 게시글이 없습니다.`
        } else if (filterCategory) {
            return `"${filterCategory}" 카테고리에 해당하는 게시글이 없습니다.`
        }
        return '게시글이 없습니다.'
    }

    return (
        <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
                <i className="ri-file-search-line text-6xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">{getMessage()}</p>
        </div>
    )
} 