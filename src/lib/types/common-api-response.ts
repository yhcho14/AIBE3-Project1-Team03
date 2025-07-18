// --- 공통 인터페이스 (Header, Body, ResponseData 등) ---
export interface Header {
    resultCode: string
    resultMsg: string
}

export interface ItemsObject<T> {
    item: T[]
}

export interface Body<T> {
    numOfRows: number
    pageNo: number
    totalCount: number
    items: ItemsObject<T>
}

export interface ResponseData<T> {
    header: Header
    body: Body<T>
}

// 최종 API 데이터 인터페이스
export interface PublicApiData<T> {
    response: ResponseData<T>
}
