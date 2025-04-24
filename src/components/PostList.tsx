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
  comments?: { id: number }[];
  likes?: { id: number }[];
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
      console.log("Fetching posts...");
      const { data: postsData, error: postsError } = await supabase
    .from("post")
    .select("*")
    .order("created_at", { ascending: false });

      console.log("Posts data:", postsData);
      console.log("Posts error:", postsError);

      if (postsError) throw postsError;

      if (!postsData) {
        setPosts([]);
        return;
      }

      // Get comments count
      const { data: commentsData } = await supabase
        .from("comments")
        .select("post_id");

      // Get likes count
      const { data: likesData } = await supabase
        .from("likes")
        .select("post_id");

      // Count comments and likes
      const commentCounts = new Map();
      const likeCounts = new Map();

      commentsData?.forEach(comment => {
        const count = commentCounts.get(comment.post_id) || 0;
        commentCounts.set(comment.post_id, count + 1);
      });

      likesData?.forEach(like => {
        const count = likeCounts.get(like.post_id) || 0;
        likeCounts.set(like.post_id, count + 1);
      });

      // Transform the data to include counts
      const enrichedPosts = postsData.map(post => ({
        ...post,
        like_count: likeCounts.get(post.id) || 0,
        comment_count: commentCounts.get(post.id) || 0
      }));

      console.log("Enriched posts:", enrichedPosts);
      setPosts(enrichedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedPosts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setLikedPosts(data.map(like => parseInt(like.post_id)));
      }
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) return;

    try {
      // First check if the post exists
      const { data: postExists, error: postError } = await supabase
        .from("post")
        .select("id")
        .eq("id", postId)
        .single();

      if (postError || !postExists) {
        console.error("Post does not exist:", postError);
        return;
      }

      // Then check if the user has already liked the post
      const { data: existingLike, error: likeCheckError } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (likeCheckError) throw likeCheckError;

      if (existingLike) {
        // Unlike
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (deleteError) throw deleteError;
        setLikedPosts(prev => prev.filter(id => id !== postId));
      } else {
        // Like
        const { error: insertError } = await supabase
          .from("likes")
          .insert([
            {
              post_id: postId,
              user_id: user.id,
            },
          ]);

        if (insertError) throw insertError;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
      {posts.length === 0 && !loading ? (
        <div className="text-center text-gray-400 py-10 col-span-full">
          <p>No posts found. Be the first to create a post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="relative group"
          >
            <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
            <Link to={`/post/${post.id}`} className="block relative z-10">
              <div className="w-full bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-all duration-300 group-hover:bg-gray-800 group-hover:scale-[1.02] group-hover:shadow-xl">
                {/* Header: Title and Status */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{post.name || "Unnamed Pet"}</h2>
                    {post.location && (
                      <p className="text-gray-400 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {post.location}
                      </p>
                    )}
                  </div>
                  {post.status && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      post.status === 'Available' ? 'bg-green-500' :
                      post.status === 'Pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      {post.status}
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <img
                    src={post.image_url || '/default-pet.jpg'}
                    alt={post.name || "Pet"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Pet Details */}
                <div className="space-y-2">
                  {post.breed && (
                    <div className="flex items-center text-gray-300">
                      <span className="font-medium mr-2">Breed:</span>
                      <span>{post.breed}</span>
                    </div>
                  )}
                  {post.age !== undefined && post.age !== null && (
                    <div className="flex items-center text-gray-300">
                      <span className="font-medium mr-2">Age:</span>
                      <span>{post.age} months</span>
                    </div>
                  )}
                  {post.size && (
                    <div className="flex items-center text-gray-300">
                      <span className="font-medium mr-2">Size:</span>
                      <span>{post.size}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-4">
                  <p className="text-gray-300 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {post.content}
                  </p>
                </div>

                {/* Footer: Interactions and Date */}
                <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center justify-between text-gray-400">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike(post.id);
                      }}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors ${
                        likedPosts.includes(post.id) ? "text-red-500" : "text-gray-300"
                      }`}
                    >
                      <FaHeart className={`transition-transform group-hover:scale-110 ${
                        likedPosts.includes(post.id) ? "text-red-500" : ""
                      }`} />
                      <span>{post.like_count}</span>
                    </button>
                    <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-700/30">
                      <FaComment className="text-gray-300" />
                      <span>{post.comment_count}</span>
                    </div>
                  </div>
                  <span className="text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};
