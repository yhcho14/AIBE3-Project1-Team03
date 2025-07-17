"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function PostWrite() {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 이미지 업로드 함수
  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase
      .storage
      .from('post-img')
      .upload(fileName, file);
    if (error) throw error;
    const { data: publicUrlData } = supabase
      .storage
      .from('post-img')
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('로그인이 필요합니다.');
      setLoading(false);
      return;
    }
    let imageUrl = '';
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (err) {
        alert('이미지 업로드에 실패했습니다.');
        setLoading(false);
        return;
      }
    }
    const { error } = await supabase.from('posts').insert({
      title,
      contents,
      category,
      location,
      tags,
      image: imageUrl,
      user_id: user.id,
    });
    setLoading(false);
    if (error) {
      alert('게시글 작성에 실패했습니다.');
    } else {
      alert('게시글이 등록되었습니다!');
      router.push('/board');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">게시글 작성</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <textarea
          placeholder="내용"
          value={contents}
          onChange={e => setContents(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={6}
          required
        />
        <input
          type="text"
          placeholder="카테고리"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="여행지(위치)"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="태그 (쉼표로 구분)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border rounded"
        />
        {imageFile && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="미리보기"
              className="w-full h-40 object-cover rounded"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded font-bold"
          disabled={loading}
        >
          {loading ? '작성 중...' : '작성하기'}
        </button>
      </form>
    </div>
  );
} 