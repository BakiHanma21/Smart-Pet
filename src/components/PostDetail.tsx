// import { PostList } from "../components/PostList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Post } from "./PostList";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { FaPaw, FaMapMarkerAlt, FaSyringe, FaRuler, FaArrowLeft, FaTrash } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const fetchPostById = async (postId: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data;
};

const deletePost = async (post: Post) => {
  try {
    // First delete all comments for this post
    const { error: commentsError } = await supabase
      .from("comments")
      .delete()
      .eq("post_id", post.id);

    if (commentsError) throw new Error(commentsError.message);

    // Delete all votes for this post
    const { error: votesError } = await supabase
      .from("votes")
      .delete()
      .eq("post_id", post.id);

    if (votesError) throw new Error(votesError.message);

    // Delete the main image
    if (post.image_url) {
      const mainImagePath = post.image_url.split('/').pop();
      if (mainImagePath) {
        await supabase.storage
          .from("post-images")
          .remove([mainImagePath]);
      }
    }

    // Delete additional photos
    if (post.additional_photos) {
      const additionalImagePaths = post.additional_photos.map(url => url.split('/').pop());
      await supabase.storage
        .from("post-images")
        .remove(additionalImagePaths.filter(Boolean) as string[]);
    }

    // Delete vaccination proof if it exists in health_info
    const vaccinationProofMatch = post.health_info?.match(/Vaccination Proof: (https:\/\/[^\s]+)/);
    if (vaccinationProofMatch) {
      const vaccinationProofPath = vaccinationProofMatch[1].split('/').pop();
      if (vaccinationProofPath) {
        await supabase.storage
          .from("post-images")
          .remove([vaccinationProofPath]);
      }
    }

    // Finally, delete the post record
    const { error: postError } = await supabase
      .from("post")
      .delete()
      .eq("id", post.id);

    if (postError) throw new Error(postError.message);
  } catch (error) {
    console.error("Error in deletePost:", error);
    throw error;
  }
};

export const PostDetail = ({ postId }: { postId: string }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["PostID", postId],
    queryFn: () => fetchPostById(parseInt(postId)),
  });

  const handleDelete = async () => {
    if (!data || !user || user.id !== data.user_id) {
      alert("You don't have permission to delete this post");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await deletePost(data);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Adopted':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to extract vaccination proof URL from health_info
  const extractVaccinationProof = (healthInfo: string) => {
    if (!healthInfo) return null;
    const match = healthInfo.match(/Vaccination Proof: (https:\/\/[^\s]+)/);
    return match ? match[1] : null;
  };

  // Function to get clean health info without the vaccination proof URL
  const getCleanHealthInfo = (healthInfo: string) => {
    if (!healthInfo) return '';
    return healthInfo.replace(/Vaccination Proof: https:\/\/[^\s]+/g, '').trim();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const vaccinationProofUrl = data?.health_info ? extractVaccinationProof(data.health_info) : null;
  const cleanHealthInfo = data?.health_info ? getCleanHealthInfo(data.health_info) : '';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Navigation and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Posts</span>
        </button>

        {user && data && user.id === data.user_id && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaTrash />
            <span>Delete Post</span>
          </button>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
        {/* Header with Avatar and Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {data?.avatar_url ? (
              <img
                src={data.avatar_url}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div>
              <h2 className="text-3xl font-bold text-white">{data?.name}</h2>
              {data?.breed && (
                <div className="text-gray-400 flex items-center">
                  <MdPets className="mr-1" />
                  {data.breed}
                </div>
              )}
            </div>
          </div>
          {data?.status && (
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(data.status)} text-white`}>
              {data.status}
            </span>
          )}
        </div>

        {/* Main Image */}
        {data?.image_url && (
          <div className="mb-6">
            <img
              src={data.image_url}
              alt={data.name}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Additional Photos Gallery */}
        {data?.additional_photos && data.additional_photos.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">Additional Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.additional_photos.map((photo: string, index: number) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Additional photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Pet Details Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Location and Age */}
          <div className="bg-gray-800 p-4 rounded-lg">
            {data?.location && (
              <div className="flex items-center text-gray-300 mb-2">
                <FaMapMarkerAlt className="mr-2" />
                <span>Location: {data.location}</span>
              </div>
            )}
            {data?.age && (
              <div className="flex items-center text-gray-300">
                <FaPaw className="mr-2" />
                <span>Age: {data.age} months</span>
              </div>
            )}
          </div>

          {/* Size and Vaccination Status */}
          <div className="bg-gray-800 p-4 rounded-lg">
            {data?.size && (
              <div className="flex items-center text-gray-300 mb-2">
                <FaRuler className="mr-2" />
                <span>Size: {data.size}</span>
              </div>
            )}
            {data?.vaccination_status !== undefined && (
              <div className="flex items-center text-gray-300">
                <FaSyringe className="mr-2" />
                <span>{data.vaccination_status ? 'Vaccinated' : 'Not vaccinated'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Health Information and Vaccination Proof Section */}
        {(cleanHealthInfo || (vaccinationProofUrl && data?.vaccination_status)) && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">Health Information</h3>
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
              {/* Health Info Text */}
              {cleanHealthInfo && (
                <div className="text-gray-300">
                  <p className="whitespace-pre-wrap">{cleanHealthInfo}</p>
                </div>
              )}

              {/* Vaccination Proof Image */}
              {vaccinationProofUrl && data?.vaccination_status && (
                <div>
                  <h4 className="text-lg font-medium text-purple-300 mb-2 flex items-center">
                    <FaSyringe className="mr-2" />
                    Vaccination Proof
                  </h4>
                  <img
                    src={vaccinationProofUrl}
                    alt="Vaccination Proof"
                    className="w-full max-h-[300px] object-contain rounded-lg border border-gray-700"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Temperament Tags */}
        {data?.temperament && data.temperament.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">Temperament</h3>
            <div className="flex flex-wrap gap-2">
              {data.temperament.map((trait: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
          <p className="text-gray-300 bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
            {data?.content}
          </p>
        </div>

        {/* Posted Date */}
        <p className="text-sm text-gray-500 mb-6">
          Posted on: {data?.created_at
            ? new Date(data.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Date not available"}
        </p>

        {/* Like Button */}
        <div className="mt-4 flex items-center space-x-4">
          <LikeButton postId={parseInt(postId)} />
        </div>

        {/* Comments Section */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h3 className="text-xl font-semibold text-white mb-3">Comments</h3>
          <CommentSection postId={parseInt(postId)} />
        </div>
      </div>
    </div>
  );
};
