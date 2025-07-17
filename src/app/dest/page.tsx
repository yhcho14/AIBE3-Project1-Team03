'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DestList from './DestList'
import DestDetail from './DestDetail';
import { useState } from 'react'

export default function DestPage() {
    const [selectedPost, setSelectedPost] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">관광지/숙소</h1>
                    </div>

                    {selectedPost ? (
                        <DestDetail postId={selectedPost} onBack={() => setSelectedPost(null)} />
                    ) : (
                        <DestList onSelectPost={setSelectedPost} />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
