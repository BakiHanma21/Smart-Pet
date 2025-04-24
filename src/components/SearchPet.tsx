import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Post } from "./PostList";
import { PostItem } from "./PostItem";

interface SearchFilters {
  breed?: string;
  location?: string;
  size?: string;
  status?: string;
  minAge?: number;
  maxAge?: number;
  vaccination_status?: boolean;
}

export const SearchPet = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts", filters, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("post")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters.breed) {
        query = query.ilike("breed", `%${filters.breed}%`);
      }
      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters.size) {
        query = query.eq("size", filters.size);
      }
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.minAge !== undefined) {
        query = query.gte("age", filters.minAge);
      }
      if (filters.maxAge !== undefined) {
        query = query.lte("age", filters.maxAge);
      }
      if (filters.vaccination_status !== undefined) {
        query = query.eq("vaccination_status", filters.vaccination_status);
      }

      // Apply search term to name or content
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Post[];
    },
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "" ? undefined : value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">Search Pets</h2>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Search Term
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description"
              className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:ring focus:ring-purple-500"
            />
          </div>

          {/* Breed Filter */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Breed
            </label>
            <input
              type="text"
              value={filters.breed || ""}
              onChange={(e) => handleFilterChange("breed", e.target.value)}
              placeholder="Enter breed"
              className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:ring focus:ring-purple-500"
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              placeholder="Enter location"
              className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:ring focus:ring-purple-500"
            />
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Size
            </label>
            <select
              value={filters.size || ""}
              onChange={(e) => handleFilterChange("size", e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:ring focus:ring-purple-500"
            >
              <option value="">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:ring focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>

          {/* Age Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Min Age (months)
              </label>
              <input
                type="number"
                value={filters.minAge || ""}
                onChange={(e) => handleFilterChange("minAge", e.target.value ? parseInt(e.target.value) : "")}
                min="0"
                className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:ring focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Max Age (months)
              </label>
              <input
                type="number"
                value={filters.maxAge || ""}
                onChange={(e) => handleFilterChange("maxAge", e.target.value ? parseInt(e.target.value) : "")}
                min="0"
                className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:ring focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Vaccination Status */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Vaccination Status
            </label>
            <select
              value={filters.vaccination_status === undefined ? "" : filters.vaccination_status.toString()}
              onChange={(e) => handleFilterChange("vaccination_status", e.target.value === "" ? undefined : e.target.value === "true")}
              className="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded focus:ring focus:ring-purple-500"
            >
              <option value="">All</option>
              <option value="true">Vaccinated</option>
              <option value="false">Not Vaccinated</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {posts?.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
            {posts?.length === 0 && (
              <p className="text-gray-400 text-center w-full py-8">No pets found matching your criteria</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 