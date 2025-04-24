import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { FaPaw, FaUsers, FaPencilAlt } from "react-icons/fa";

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase.from("communities").insert(community);

  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };

  return (
    <div className="fixed inset-0 w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-black"></div>
        
        {/* Animated Paw Prints */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <FaPaw
              key={i}
              className="absolute text-purple-500/10 animate-float"
              style={{
                fontSize: `${Math.random() * 50 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Glowing Orbs */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full bg-purple-500/20 animate-pulse blur-xl"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 8 + 4}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 mt-24">
        <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20 transform hover:scale-[1.01] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg shadow-purple-500/25 transform -translate-y-16 border-4 border-gray-900/80">
                <FaUsers className="text-4xl text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent -mt-8">
              Create New Community
            </h2>
            <p className="text-gray-400 mt-2">
              Build a space for pet lovers to connect and share their experiences
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label htmlFor="name" className="block mb-2 text-lg font-medium text-purple-300">
                Community Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-800/50 border border-purple-500/30 text-white p-4 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pl-12 group-hover:border-purple-500/50"
                  required
                  placeholder="Enter community name"
                />
                <FaUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-xl" />
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="description" className="block mb-2 text-lg font-medium text-purple-300">
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-800/50 border border-purple-500/30 text-white p-4 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pl-12 min-h-[120px] group-hover:border-purple-500/50"
                  placeholder="Describe your community..."
                />
                <FaPencilAlt className="absolute left-4 top-4 text-purple-400 text-xl" />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Share what makes your community special and what members can expect
              </p>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-3"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Creating Community...</span>
                  </>
                ) : (
                  <>
                    <FaPaw className="text-2xl" />
                    <span>Create Community</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {isError && (
              <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-center">
                Error creating community. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Add custom styles for float animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(var(--rotation));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation));
          }
        }
        .animate-float {
          --rotation: 45deg;
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
