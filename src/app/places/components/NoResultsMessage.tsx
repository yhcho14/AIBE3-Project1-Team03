export default function NoResultsMessage() {
    return (
        <div className="text-center py-12">
            <i className="ri-search-line text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-600">검색 결과가 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">다른 키워드로 검색해보세요.</p>
        </div>
    )
}
