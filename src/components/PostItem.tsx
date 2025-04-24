import { Link } from "react-router-dom";
import { Post } from "./PostList";
import { FaPaw, FaMapMarkerAlt, FaSyringe, FaRuler, FaHeartbeat } from "react-icons/fa";
import { MdPets } from "react-icons/md";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
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

  const vaccinationProofUrl = post.health_info ? extractVaccinationProof(post.health_info) : null;
  const cleanHealthInfo = post.health_info ? getCleanHealthInfo(post.health_info) : '';

  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-96 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          {/* Header: Avatar and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {post.avatar_url ? (
                <img
                  src={post.avatar_url}
                  alt="User Avatar"
                  className="w-[35px] h-[35px] rounded-full object-cover"
                />
              ) : (
                <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
              )}
              <div className="flex flex-col">
                <div className="text-[20px] leading-[22px] font-semibold">
                  {post.name}
                </div>
                {post.breed && (
                  <div className="text-sm text-gray-400">
                    <MdPets className="inline mr-1" />
                    {post.breed}
                  </div>
                )}
              </div>
            </div>
            {post.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)} text-white`}>
                {post.status}
              </span>
            )}
          </div>

          {/* Image Banner */}
          <div className="mt-4">
            <img
              src={post.image_url}
              alt={post.name}
              className="w-full rounded-[20px] object-cover h-[200px]"
            />
          </div>

          {/* Pet Details */}
          <div className="mt-4 space-y-2">
            {/* Location and Age */}
            <div className="flex justify-between text-sm">
              {post.location && (
                <span className="flex items-center text-gray-300">
                  <FaMapMarkerAlt className="mr-1" />
                  {post.location}
                </span>
              )}
              {post.age && (
                <span className="flex items-center text-gray-300">
                  <FaPaw className="mr-1" />
                  {post.age} months
                </span>
              )}
            </div>

            {/* Size and Vaccination Status */}
            <div className="flex justify-between text-sm">
              {post.size && (
                <span className="flex items-center text-gray-300">
                  <FaRuler className="mr-1" />
                  {post.size}
                </span>
              )}
              {post.vaccination_status !== undefined && (
                <span className="flex items-center text-gray-300">
                  <FaSyringe className="mr-1" />
                  {post.vaccination_status ? 'Vaccinated' : 'Not vaccinated'}
                </span>
              )}
            </div>

            {/* Health Info Preview */}
            {cleanHealthInfo && (
              <div className="mt-2 text-sm">
                <div className="flex items-center text-purple-300 mb-1">
                  <FaHeartbeat className="mr-1" />
                  <span>Health Information</span>
                </div>
                <p className="text-gray-400 line-clamp-2">{cleanHealthInfo}</p>
              </div>
            )}

            {/* Vaccination Proof Preview */}
            {vaccinationProofUrl && post.vaccination_status && (
              <div className="mt-2">
                <div className="flex items-center text-purple-300 mb-1 text-sm">
                  <FaSyringe className="mr-1" />
                  <span>Vaccination Proof</span>
                </div>
                <img
                  src={vaccinationProofUrl}
                  alt="Vaccination Proof"
                  className="w-full h-20 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Temperament */}
            {post.temperament && post.temperament.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.temperament.map((trait, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}

            {/* Description Preview */}
            {post.content && (
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                {post.content}
              </p>
            )}
          </div>

          {/* Interaction Stats */}
          <div className="flex justify-around items-center mt-4 pt-4 border-t border-gray-700">
            <span className="cursor-pointer h-8 px-3 flex items-center justify-center font-medium text-sm rounded-lg bg-purple-500/10 text-purple-300">
              ❤️ <span className="ml-1">{post.like_count ?? 0}</span>
            </span>
            <span className="cursor-pointer h-8 px-3 flex items-center justify-center font-medium text-sm rounded-lg bg-purple-500/10 text-purple-300">
              💬 <span className="ml-1">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
