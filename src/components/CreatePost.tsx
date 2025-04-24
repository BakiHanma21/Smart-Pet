import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import { Community, fetchCommunities } from "./CommunityList";

interface PostInput {
  name: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
  user_id?: string | null;
  age?: number;
  breed?: string;
  vaccination_status?: boolean;
  location?: string;
  size?: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  temperament?: string[];
  health_info?: string;
  status?: 'Available' | 'Pending' | 'Adopted';
  additional_photos?: string[];
}

const createPost = async (
  post: PostInput, 
  imageFile: File, 
  additionalFiles: File[],
  vaccinationProofFile: File | null
) => {
  const filePath = `${post.name}-${Date.now()}-${imageFile.name}`;

  // Upload main image
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  // Upload vaccination proof if provided and update health_info
  let updatedHealthInfo = post.health_info || '';
  if (vaccinationProofFile) {
    const vaccinationFilePath = `vaccination-proof-${post.name}-${Date.now()}-${vaccinationProofFile.name}`;
    const { error: vaccinationUploadError } = await supabase.storage
      .from("post-images")
      .upload(vaccinationFilePath, vaccinationProofFile);

    if (vaccinationUploadError) throw new Error(vaccinationUploadError.message);

    const { data: vaccinationPublicURLData } = supabase.storage
      .from("post-images")
      .getPublicUrl(vaccinationFilePath);

    // Add vaccination proof URL to health_info
    updatedHealthInfo = `${updatedHealthInfo}\n\nVaccination Proof: ${vaccinationPublicURLData.publicUrl}`;
  }

  // Upload additional photos
  const additionalPhotosUrls: string[] = [];
  for (const file of additionalFiles) {
    const additionalFilePath = `${post.name}-${Date.now()}-${file.name}`;
    const { error: additionalUploadError } = await supabase.storage
      .from("post-images")
      .upload(additionalFilePath, file);

    if (additionalUploadError) throw new Error(additionalUploadError.message);

    const { data: additionalPublicURLData } = supabase.storage
      .from("post-images")
      .getPublicUrl(additionalFilePath);

    additionalPhotosUrls.push(additionalPublicURLData.publicUrl);
  }

  const { data, error } = await supabase
    .from("post")
    .insert({ 
      name: post.name,
      content: post.content,
      image_url: publicURLData.publicUrl,
      avatar_url: post.avatar_url,
      community_id: post.community_id,
      age: post.age,
      breed: post.breed,
      vaccination_status: post.vaccination_status,
      location: post.location,
      user_id: post.user_id,
      size: post.size,
      temperament: post.temperament,
      health_info: updatedHealthInfo.trim(),
      status: post.status || 'Available',
      additional_photos: additionalPhotosUrls
    })
    .select('*')
    .single();

  if (error) throw new Error(error?.message);

  return data;
};

export const CreatePost = () => {
  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [vaccinationProofFile, setVaccinationProofFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [vaccinationPreview, setVaccinationPreview] = useState<string | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);
  const [age, setAge] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [vaccinationStatus, setVaccinationStatus] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [size, setSize] = useState<'Small' | 'Medium' | 'Large' | 'Extra Large'>('Medium');
  const [temperament, setTemperament] = useState<string[]>([]);
  const [healthInfo, setHealthInfo] = useState<string>("");
  const [status, setStatus] = useState<'Available' | 'Pending' | 'Adopted'>('Available');
  
  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  }); 

  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { 
      post: PostInput; 
      imageFile: File; 
      additionalFiles: File[];
      vaccinationProofFile: File | null;
    }) =>
      createPost(
        data.post, 
        data.imageFile, 
        data.additionalFiles,
        data.vaccinationProofFile
      ),
    onSuccess: () => {
      // Clear fields and preview
      setName("");
      setContent("");
      setSelectedFile(null);
      setAdditionalFiles([]);
      setVaccinationProofFile(null);
      setPreview(null);
      setAdditionalPreviews([]);
      setVaccinationPreview(null);
      setAge("");
      setBreed("");
      setVaccinationStatus(false);
      setLocation("");
      setSize('Medium');
      setTemperament([]);
      setHealthInfo("");
      setStatus('Available');

      // Redirect to home page
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    if (!user) {
      alert("You must be logged in to create a post");
      return;
    }

    if (vaccinationStatus && !vaccinationProofFile) {
      alert("Please upload vaccination proof");
      return;
    }

    mutate({
      post: {
        name,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
        user_id: user.id,
        age: age ? parseInt(age) : undefined,
        breed,
        vaccination_status: vaccinationStatus,
        location,
        size,
        temperament,
        health_info: healthInfo,
        status,
      },
      imageFile: selectedFile,
      additionalFiles,
      vaccinationProofFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleVaccinationProofChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVaccinationProofFile(e.target.files[0]);
      setVaccinationPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAdditionalFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAdditionalFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setAdditionalPreviews(previews);
    }
  };

  const handleTemperamentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTemperament(value.split(',').map(item => item.trim()));
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const sizeOptions = [
    { value: 'Small', label: 'Small (0-15 lbs)' },
    { value: 'Medium', label: 'Medium (16-40 lbs)' },
    { value: 'Large', label: 'Large (41-100 lbs)' },
    { value: 'Extra Large', label: 'Extra Large (100+ lbs)' }
  ];

  const statusOptions = [
    { value: 'Available', label: 'Available - Ready for Adoption' },
    { value: 'Pending', label: 'Pending - In Process' },
    { value: 'Adopted', label: 'Adopted - Found Forever Home' }
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-purple-400">
        Create a New Pet Post
      </h2>

      <div>
        <label htmlFor="name" className="block mb-2 font-medium text-purple-300">
          Pet Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-600 bg-transparent p-2 rounded focus:ring focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-2 font-medium text-purple-300">
          Description
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-600 bg-transparent p-2 rounded focus:ring focus:ring-purple-500"
          rows={5}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block mb-2 font-medium text-purple-300">
            Age (in months)
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-600 bg-transparent p-2 rounded focus:ring focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="breed" className="block mb-2 font-medium text-purple-300">
            Breed
          </label>
          <input
            type="text"
            id="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full border border-gray-600 bg-transparent p-2 rounded focus:ring focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block mb-2 font-medium text-purple-300">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-600 bg-transparent p-2 rounded focus:ring focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="size" className="block mb-2 font-medium text-purple-300">
            Size
          </label>
          <select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value as 'Small' | 'Medium' | 'Large' | 'Extra Large')}
            className="w-full border border-gray-600 bg-gray-800 p-2 rounded focus:ring focus:ring-purple-500"
          >
            {sizeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-900 text-white py-2"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="temperament" className="block mb-2 font-medium text-purple-300">
          Temperament (comma-separated)
        </label>
        <input
          type="text"
          id="temperament"
          value={temperament.join(', ')}
          onChange={handleTemperamentChange}
          placeholder="Friendly, Playful, Calm"
          className="w-full border border-gray-600 bg-transparent p-2 rounded focus:ring focus:ring-purple-500"
        />
      </div>

      <div>
        <label htmlFor="healthInfo" className="block mb-2 font-medium text-purple-300">
          Health Information
        </label>
        <textarea
          id="healthInfo"
          value={healthInfo}
          onChange={(e) => setHealthInfo(e.target.value)}
          className="w-full border border-gray-600 bg-transparent p-2 rounded focus:ring focus:ring-purple-500"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="vaccinationStatus"
            checked={vaccinationStatus}
            onChange={(e) => setVaccinationStatus(e.target.checked)}
            className="rounded border-gray-600 bg-transparent focus:ring focus:ring-purple-500"
          />
          <label htmlFor="vaccinationStatus" className="font-medium text-purple-300">
            Vaccinated
          </label>
        </div>

        {vaccinationStatus && (
          <div className="mt-2">
            <label htmlFor="vaccinationProof" className="block mb-2 font-medium text-purple-300">
              Upload Vaccination Proof
            </label>
            <input
              type="file"
              id="vaccinationProof"
              accept="image/*"
              onChange={handleVaccinationProofChange}
              className="hidden"
              required
            />
            <div className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition">
              <label htmlFor="vaccinationProof" className="flex flex-col items-center cursor-pointer">
                <FaImage className="text-3xl text-purple-400" />
                <span className="text-sm text-gray-400 mt-2">
                  Click to upload vaccination proof
                </span>
              </label>
            </div>
            {vaccinationPreview && (
              <div className="mt-2">
                <img
                  src={vaccinationPreview}
                  alt="Vaccination Proof"
                  className="max-w-full h-40 object-cover rounded-lg border border-gray-600"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block mb-2 font-medium text-purple-300">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'Available' | 'Pending' | 'Adopted')}
          className="w-full border border-gray-600 bg-gray-800 p-2 rounded focus:ring focus:ring-purple-500"
        >
          {statusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-900 text-white py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-300 mb-1">
          Select Community
        </label>
        <select
          id="community"
          onChange={handleCommunityChange}
          className="w-full border border-gray-600 bg-gray-800 p-2 rounded focus:ring focus:ring-purple-500"
        >
          <option value="" className="bg-gray-900 text-white py-2">
            -- Choose a Community --
          </option>
          {communities?.map((community) => (
            <option
              key={community.id}
              value={community.id}
              className="bg-gray-900 text-white py-2"
            >
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <label htmlFor="image" className="block mb-2 font-medium text-purple-300">
          Main Pet Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          required
        />
        <div className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition">
          <label htmlFor="image" className="flex flex-col items-center cursor-pointer">
            <FaImage className="text-3xl text-purple-400" />
            <span className="text-sm text-gray-400 mt-2">
              Click to upload main image
            </span>
          </label>
        </div>
      </div>

      {preview && (
        <div className="mt-4">
          <h3 className="text-gray-400 mb-2">Main Image Preview:</h3>
          <img
            src={preview}
            alt="Selected"
            className="w-full h-52 object-cover rounded-lg border border-gray-600"
          />
        </div>
      )}

      <div className="relative">
        <label htmlFor="additionalImages" className="block mb-2 font-medium text-purple-300">
          Additional Images
        </label>
        <input
          type="file"
          id="additionalImages"
          accept="image/*"
          onChange={handleAdditionalFilesChange}
          className="hidden"
          multiple
        />
        <div className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition">
          <label htmlFor="additionalImages" className="flex flex-col items-center cursor-pointer">
            <FaImage className="text-3xl text-purple-400" />
            <span className="text-sm text-gray-400 mt-2">
              Click to upload additional images
            </span>
          </label>
        </div>
      </div>

      {additionalPreviews.length > 0 && (
        <div className="mt-4">
          <h3 className="text-gray-400 mb-2">Additional Images Preview:</h3>
          <div className="grid grid-cols-3 gap-4">
            {additionalPreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Additional ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-600"
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded transition"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && (
        <p className="text-red-500 text-center">Error creating post.</p>
      )}
    </form>
  );
};
