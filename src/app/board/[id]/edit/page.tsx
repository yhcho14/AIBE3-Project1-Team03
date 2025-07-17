import PostEditClient from "./PostEditClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PostEditPage({ params }: PageProps) {
  return <PostEditClient postId={params.id} />;
} 