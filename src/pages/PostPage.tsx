import { useParams } from "react-router-dom";
import { PostDetail } from "../components/PostDetail";

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Post not found</div>;
  }

  return <PostDetail postId={id} />;
};
