'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import AISearchBar from '../components/AISearchBar'
import PopularDestinations from '../components/PopularDestinations'
import PopularPosts from '../components/PopularPosts'

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section
                className="relative min-h-screen flex items-center justify-center pt-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Beautiful%20travel%20destination%20background%20with%20mountains%2C%20clear%20blue%20sky%2C%20and%20peaceful%20landscape%2C%20soft%20natural%20lighting%20perfect%20for%20text%20overlay%2C%20wanderlust%20adventure%20theme%2C%20clean%20minimal%20composition&width=1920&height=1080&seq=hero1&orientation=landscape')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="container mx-auto px-6 text-center w-full">
                    <div className="max-w-4xl mx-auto mb-8">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            AI와 함께 떠나는
                            <br />
                            <span className="text-blue-400">완벽한 여행</span>
                        </h1>
                        <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
                            개인 맞춤형 AI 추천으로 특별한 여행을 계획하고, 다른 여행자들과 소중한 경험을 나누어보세요
                        </p>
                    </div>

                    <AISearchBar />
                </div>
            </section>

            {/* Popular Destinations */}
            <PopularDestinations />

            {/* Popular Posts */}
            <PopularPosts />

            <Footer />
        </div>
    )
}
