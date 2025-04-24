import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { UserProfile } from "./components/UserProfile";
import { Messages } from "./components/Messages";
import { PetProfile } from "./components/PetProfile";
import CreatePostPage from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { useParams } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { SearchPet } from "./components/SearchPet";

const PetProfileWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return <PetProfile petId={Number(id)} />;
};

function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="*"
          element={
            <div className="pt-20">
              <Navbar />
              <div className="container mx-auto px-4 py-6">
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="search" element={<SearchPet />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="create" element={<CreatePostPage />} />
                  <Route path="pet/:id" element={<PetProfileWrapper />} />
                  <Route path="post/:id" element={<PostPage />} />
                  <Route path="community/create" element={<CreateCommunityPage />} />
                  <Route path="communities" element={<CommunitiesPage />} />
                  <Route path="community/:id" element={<CommunityPage />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
// DB SUPABASE PASSWORD
// petLuna_523;