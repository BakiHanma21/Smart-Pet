import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { FaMedal, FaUser, FaMapMarkerAlt, FaPaw } from "react-icons/fa";

interface UserData {
  id: string;
  bio: string;
  location: string;
  is_shelter: boolean;
  verified: boolean;
  adoption_history: string[];
  favorites: string[];
}

interface Badge {
  id: number;
  badge_type: string;
  awarded_at: string;
}

const fetchUserData = async (userId: string): Promise<UserData> => {
  // Try to get existing user
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  // If no error but no data, or if error is about no rows, create new user
  if ((!error && !data) || (error && error.message.includes("no rows"))) {
    const defaultUserData = {
      id: userId,
      bio: "",
      location: "",
      is_shelter: false,
      verified: false,
      adoption_history: [],
      favorites: []
    };

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([defaultUserData])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return newUser;
  }

  if (error) {
    throw error;
  }

  return data;
};

const fetchUserBadges = async (userId: string): Promise<Badge[]> => {
  const { data, error } = await supabase
    .from("user_badges")
    .select("*")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data || [];
};

export const UserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userData, isLoading: userLoading, error: userError } = useQuery<UserData, Error>({
    queryKey: ["userData", user?.id],
    queryFn: () => fetchUserData(user!.id),
    enabled: !!user,
    retry: 1
  });

  const { data: badges, isLoading: badgesLoading } = useQuery<Badge[], Error>({
    queryKey: ["userBadges", user?.id],
    queryFn: () => fetchUserBadges(user!.id),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="text-center text-gray-400 py-10">
        Please log in to view your profile.
      </div>
    );
  }

  if (userError) {
    return (
      <div className="text-center text-red-500 py-10">
        Error loading profile: {userError.message}
      </div>
    );
  }

  if (userLoading || badgesLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
              <FaUser className="text-4xl text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.email}
                {userData?.verified && (
                  <span className="ml-2 text-blue-400 text-sm">✓ Verified</span>
                )}
              </h1>
              <div className="flex items-center text-gray-400 mt-1">
                <FaMapMarkerAlt className="mr-1" />
                <span>{userData?.location || "Location not set"}</span>
              </div>
            </div>
          </div>
          {userData?.is_shelter && (
            <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm">
              Shelter Account
            </span>
          )}
        </div>

        <p className="text-gray-300 mt-4">{userData?.bio || "No bio provided"}</p>
      </div>

      {/* Badges Section */}
      {badges && badges.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaMedal className="mr-2 text-yellow-400" />
            Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-800 p-4 rounded-lg flex items-center space-x-3"
              >
                <FaMedal className="text-2xl text-yellow-400" />
                <div>
                  <div className="font-semibold text-white">
                    {badge.badge_type}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(badge.awarded_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adoption History */}
      {userData?.adoption_history && userData.adoption_history.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <FaPaw className="mr-2" />
            Adoption History
          </h2>
          <div className="space-y-4">
            {userData.adoption_history.map((adoption, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg text-gray-300"
              >
                {adoption}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {userData?.favorites && userData.favorites.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">❤️</span>
            Favorite Pets
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userData.favorites.map((favorite, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg text-gray-300"
              >
                {favorite}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 