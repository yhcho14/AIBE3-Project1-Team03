import PostEditClient from "./PostEditClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostEditPage({ params }: PageProps) {
  const { id } = await params;
  return <PostEditClient postId={id} />;
} 