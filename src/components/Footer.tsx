'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="ri-map-pin-2-fill text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-800 font-pacifico">TripleAI</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              AI와 함께하는 스마트한 여행 계획. 개인 맞춤형 추천부터 상세한 일정 관리까지, 
              완벽한 여행을 위한 모든 것을 제공합니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                <i className="ri-facebook-fill text-gray-600"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                <i className="ri-instagram-fill text-gray-600"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                <i className="ri-twitter-fill text-gray-600"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">서비스</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">AI 여행 추천</Link></li>
              <li><Link href="/mypage" className="text-gray-600 hover:text-blue-600 transition-colors">여행 플래너</Link></li>
              <li><Link href="/board" className="text-gray-600 hover:text-blue-600 transition-colors">여행 후기</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">고객지원</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">문의하기</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">이용약관</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500">© 2024 TripleAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}