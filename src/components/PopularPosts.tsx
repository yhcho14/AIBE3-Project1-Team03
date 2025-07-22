"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  contents: string;
  image: string | null;
  like_count: number;
}

export default function PopularPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPopularPosts = async () => {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*');

      if (!error && postsData) {
        const postsWithLikes = await Promise.all(
          postsData.map(async (post: any) => {
            const { count } = await supabase
              .from('post_recommends')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id);
            return { ...post, like_count: count ?? 0 };
          })
        );
        postsWithLikes.sort((a, b) => b.like_count - a.like_count);
        setPosts(postsWithLikes.slice(0, 3));
      }
      setLoading(false);
    };
    fetchPopularPosts();
  }, []);

  if (loading) return <div className="text-center py-8">인기 게시글을 불러오는 중...</div>;

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">🔥 좋아요 많은 인기 게시글</h2>
      <div className="flex justify-end mb-4">
        <button
          className="text-sm text-blue-600 hover:underline font-medium"
          onClick={() => router.push('/board')}
          type="button"
        >
          게시글 더보기
        </button>
      </div>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/board/${post.id}`)}
            >
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded mb-4" />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-4">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="4" fill="#e5e7eb"/>
                    <path d="M7 17l3-3.86a1 1 0 0 1 1.54-.04L15 17m-8 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.contents}</p>
              <div className="text-sm text-pink-600 font-semibold">❤️ {post.like_count} 좋아요</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 