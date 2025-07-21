'use client'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import PlaceDetail from './PlaceDetail'

export default function PlaceDetailPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <PlaceDetail onBack={() => window.history.back()} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
