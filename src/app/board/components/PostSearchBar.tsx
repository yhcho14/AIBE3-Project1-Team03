interface PostSearchBarProps {
    onSearch: (keyword: string) => void
    inputValue: string
    setInputValue: (value: string) => void
}

export default function PostSearchBar({ onSearch, inputValue, setInputValue }: PostSearchBarProps) {
    const handleSubmit = () => {
        onSearch(inputValue)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className="border-2 rounded-xl bg-white border-gray-200">
            <div className="flex items-center px-6 py-3">
                <i className="ri-search-line text-gray-400 text-lg mr-4"></i>
                <input
                    type="text"
                    placeholder="제목, 내용, 태그로 게시글을 검색해보세요..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                />
                {inputValue && (
                    <button
                        onClick={() => setInputValue('')}
                        className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label="입력 취소"
                        type="button"
                    >
                        <i className="ri-close-circle-fill text-2xl"></i>
                    </button>
                )}
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 whitespace-nowrap transition-colors font-medium ml-2"
                >
                    검색
                </button>
            </div>
        </div>
    )
} 