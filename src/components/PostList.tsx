import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaComment } from "react-icons/fa";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  auth_users_id: string;
  like_count: number;
  comment_count: number;
  image_url?: string;
  additional_photos?: string[];
  age?: number;
  breed?: string;
  vaccination_status?: boolean;
  location?: string;
  size?: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  temperament?: string[];
  health_info?: string;
  status?: 'Available' | 'Pending' | 'Adopted';
  name?: string;
  user_id?: string;
  avatar_url?: string;
  community_id?: number;
}

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchLikedPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Fetch all likes
      const { data: likesData } = await supabase
        .from("likes")
        .select("post_id");

      // Fetch all comments
      const { data: commentsData } = await supabase
        .from("comments")
        .select("post_id");

      // Count likes and comments manually
      const likeCounts = new Map<string, number>();
      const commentCounts = new Map<string, number>();

      likesData?.forEach(like => {
        const count = likeCounts.get(like.post_id) || 0;
        likeCounts.set(like.post_id, count + 1);
      });

      commentsData?.forEach(comment => {
        const count = commentCounts.get(comment.post_id) || 0;
        commentCounts.set(comment.post_id, count + 1);
      });

      // Combine the data
      const enrichedPosts = postsData?.map(post => ({
        ...post,
        like_count: likeCounts.get(post.id.toString()) || 0,
        comment_count: commentCounts.get(post.id.toString()) || 0
      })) || [];

      setPosts(enrichedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedPosts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", user.id);

    if (data) {
      setLikedPosts(data.map(like => parseInt(like.post_id)));
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) return;

    try {
      const { data: existingLike } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId.toString())
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId.toString())
          .eq("user_id", user.id);
        setLikedPosts(prev => prev.filter(id => id !== postId));
      } else {
        await supabase.from("likes").insert([
          {
            post_id: postId.toString(),
            user_id: user.id,
          },
        ]);
        setLikedPosts(prev => [...prev, postId]);
      }

      // Refresh posts to update counts
      fetchPosts();
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Link to={`/post/${post.id}`}>
            <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
            <p className="text-gray-300 mb-4">{post.content}</p>
          </Link>
          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleLike(post.id);
                }}
                className={`flex items-center space-x-1 ${
                  likedPosts.includes(post.id) ? "text-red-500" : ""
                }`}
              >
                <FaHeart />
                <span>{post.like_count}</span>
              </button>
              <div className="flex items-center space-x-1">
                <FaComment />
                <span>{post.comment_count}</span>
              </div>
            </div>
            <span className="text-sm">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
