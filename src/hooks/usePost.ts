import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export interface Post {
  id: number;
  title: string;
  contents: string;
  created_at: string;
  user_id: string;
  image?: string;
  tags?: string[] | string;
  location?: string;
}

export interface PostFormData {
  title: string;
  contents: string;
  location: string;
  tags: string;
  image: string;
}

export function usePost(postId: string) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();
      
      if (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
        setError('게시글을 찾을 수 없습니다.');
      } else if (data) {
        setPost(data);
      } else {
        setError('게시글을 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('게시글 조회 중 오류:', err);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        alert('게시글 삭제 중 오류가 발생했습니다.');
        return false;
      }

      alert('게시글이 삭제되었습니다.');
      router.push('/board');
      return true;
    } catch (err) {
      alert('게시글 삭제 중 오류가 발생했습니다.');
      return false;
    }
  };

  const updatePost = async (formData: PostFormData) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: formData.title,
          contents: formData.contents,
          location: formData.location,
          tags: formData.tags.split(',').map((tag) => tag.trim()).filter(tag => tag),
          image: formData.image,
        })
        .eq('id', postId);

      if (error) {
        alert('게시글 수정 중 오류가 발생했습니다.');
        return false;
      }

      alert('게시글이 수정되었습니다!');
      router.push(`/board/${postId}`);
      return true;
    } catch (err) {
      alert('게시글 수정 중 오류가 발생했습니다.');
      return false;
    }
  };

  const formatTagsForForm = (tags: string[] | string | undefined): string => {
    if (Array.isArray(tags)) {
      return tags.join(', ');
    } else if (typeof tags === 'string') {
      return tags.replace(/\[|\]|"/g, '').replace(/,/g, ', ');
    }
    return '';
  };

  const formatTagsForDisplay = (tags: string[] | string | undefined): string[] => {
    if (Array.isArray(tags)) {
      return tags;
    } else if (typeof tags === 'string') {
      return tags.replace(/\[|\]|"/g, '').split(',').map(tag => tag.trim());
    }
    return [];
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return {
    post,
    loading,
    error,
    fetchPost,
    deletePost,
    updatePost,
    formatTagsForForm,
    formatTagsForDisplay,
    router,
  };
} 