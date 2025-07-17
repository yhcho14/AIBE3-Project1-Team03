'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  contents: string;
  created_at: string;
  category: string;
  user_id: string;
  location: string;
  tags: string | null;
  image: string | null;
  comment_count?: number;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && postsData) {
        // 각 게시글별 댓글 수 불러오기
        const postsWithComments = await Promise.all(
          postsData.map(async (post: Post) => {
            const { count } = await supabase
              .from('comments')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id);
            return { ...post, comment_count: count ?? 0 };
          })
        );
        setPosts(postsWithComments);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">게시글을 불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/board/${post.id}`)}
          >
            {post.image && (
              <div className="relative h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover object-top"
                />
                {post.location && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/70 text-white rounded-full text-xs">
                      {post.location}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.contents}
              </p>
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.created_at?.slice(0, 10)}</span>
                <span>작성자: {post.user_id}</span>
                <span>댓글: {post.comment_count ?? 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}