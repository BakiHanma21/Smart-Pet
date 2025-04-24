import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  name: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
  age?: number;
  breed?: string;
  vaccination_status?: boolean;
  location?: string;
  size?: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  temperament?: string[];
  health_info?: string;
  status?: 'Available' | 'Pending' | 'Adopted';
  additional_photos?: string[];
  community_id?: number;
  user_id?: string;
}

interface VoteCount {
  post_id: string;
  count: number;
}

interface CommentCount {
  post_id: string;
  count: number;
}

// Fetch posts with all fields and counts
const fetchPosts = async (): Promise<Post[]> => {
  // First get all posts with their details
  const { data: posts, error: postsError } = await supabase
    .from("post")
    .select("*")
    .order("created_at", { ascending: false });

  if (postsError) throw new Error(postsError.message);

  // Get vote counts using a simpler query
  const { data: voteCounts, error: votesError } = await supabase
    .from('votes')
    .select('post_id, id')
    .then(({ data }) => ({
      data: data?.reduce((acc: VoteCount[], curr) => {
        const existingCount = acc.find(v => v.post_id === curr.post_id);
        if (existingCount) {
          existingCount.count++;
        } else {
          acc.push({ post_id: curr.post_id, count: 1 });
        }
        return acc;
      }, []),
      error: null as Error | null
    }));

  if (votesError) throw votesError;

  // Get comment counts using a simpler query
  const { data: commentCounts, error: commentsError } = await supabase
    .from('comments')
    .select('post_id, id')
    .then(({ data }) => ({
      data: data?.reduce((acc: CommentCount[], curr) => {
        const existingCount = acc.find(c => c.post_id === curr.post_id);
        if (existingCount) {
          existingCount.count++;
        } else {
          acc.push({ post_id: curr.post_id, count: 1 });
        }
        return acc;
      }, []),
      error: null as Error | null
    }));

  if (commentsError) throw commentsError;

  // Create a map of vote counts and comment counts
  const voteCountMap = new Map(
    voteCounts?.map(v => [v.post_id, v.count])
  );
  const commentCountMap = new Map(
    commentCounts?.map(c => [c.post_id, c.count])
  );

  // Combine all the data
  return (posts as Post[]).map(post => ({
    ...post,
    like_count: voteCountMap.get(post.id) || 0,
    comment_count: commentCountMap.get(post.id) || 0
  }));
};

export const PostList = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("realtime_posts") // Create a unique channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post" },
        (payload) => {
          console.log("Real-time update received:", payload);
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};
