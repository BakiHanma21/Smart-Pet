import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PetProfile } from "./PetProfile";

interface SearchFilters {
  breed?: string;
  ageMin?: number;
  ageMax?: number;
  location?: string;
  size?: string;
  status?: string;
}

interface Pet {
  id: number;
  name: string;
  content: string;
  age: number;
  breed: string;
  location: string;
  image_url: string;
  size: string;
  status: string;
  like_count: number;
  comment_count: number;
}

const fetchFilteredPets = async (filters: SearchFilters): Promise<Pet[]> => {
  const { data, error } = await supabase.rpc("get_filtered_posts", {
    breed_filter: filters.breed || null,
    age_min: filters.ageMin || null,
    age_max: filters.ageMax || null,
    location_filter: filters.location || null,
    size_filter: filters.size || null,
    status_filter: filters.status || null,
  });

  if (error) throw new Error(error.message);
  return data as Pet[];
};

export const PetSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedPet, setSelectedPet] = useState<number | null>(null);

  const { data: pets, isLoading } = useQuery<Pet[], Error>({
    queryKey: ["filteredPets", filters],
    queryFn: () => fetchFilteredPets(filters),
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (selectedPet) {
    return (
      <div>
        <button
          onClick={() => setSelectedPet(null)}
          className="mb-6 text-purple-400 hover:text-purple-300 flex items-center"
        >
          ← Back to Search
        </button>
        <PetProfile petId={selectedPet} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Filters */}
      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Find Your Perfect Pet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Breed
            </label>
            <input
              type="text"
              name="breed"
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              placeholder="Enter breed..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              placeholder="Enter location..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Size
            </label>
            <select
              name="size"
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Any Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Minimum Age
            </label>
            <input
              type="number"
              name="ageMin"
              onChange={handleFilterChange}
              min="0"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Age
            </label>
            <input
              type="number"
              name="ageMax"
              onChange={handleFilterChange}
              min="0"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Any Status</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets?.map((pet) => (
            <div
              key={pet.id}
              className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition"
              onClick={() => setSelectedPet(pet.id)}
            >
              <img
                src={pet.image_url}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                  <span className="px-2 py-1 bg-purple-500 text-white text-sm rounded-full">
                    {pet.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {pet.breed} • {pet.age} years • {pet.location}
                </p>
                <p className="text-gray-300 line-clamp-2">{pet.content}</p>
                <div className="mt-4 flex items-center text-sm text-gray-400">
                  <span className="mr-4">❤️ {pet.like_count}</span>
                  <span>💬 {pet.comment_count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pets?.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No pets found matching your criteria.
        </div>
      )}
    </div>
  );
}; 