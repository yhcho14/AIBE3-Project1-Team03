'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import PostList from './PostList'
import { } from 'react'

export default function BoardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">여행 후기</h1>
                        <p className="text-gray-600">다른 여행자들의 소중한 경험을 나누어보세요</p>
                    </div>

                    <PostList />
                </div>
            </div>

            <Footer />
        </div>
    )
}
