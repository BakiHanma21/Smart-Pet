import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaPaw, FaHeart, FaUsers, FaComments, FaSearch, FaArrowRight } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full bg-green-500/10 animate-pulse"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black z-10" />
        <div className={`relative z-20 text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-4">
            <FaPaw className="text-green-500 text-5xl animate-bounce" />
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Welcome to SmartPet
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Your one-stop platform for pet lovers. Find, share, and connect with pet communities.
          </p>
          <button
            onClick={handleGetStarted}
            className="group bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center mx-auto"
          >
            Get Started
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 relative z-20">
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Our Pet Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Dogs */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/20 border border-gray-800">
              <div className="relative overflow-hidden">
                <img src="/images/dog.png" alt="Dogs" className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-semibold text-white">Dogs</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400">Find your perfect canine companion and connect with dog lovers.</p>
              </div>
            </div>

            {/* Cats */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/20 border border-gray-800">
              <div className="relative overflow-hidden">
                <img src="/images/cats.jpg" alt="Cats" className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-semibold text-white">Cats</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400">Discover feline friends and join cat enthusiast communities.</p>
              </div>
            </div>

            {/* Birds */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/20 border border-gray-800">
              <div className="relative overflow-hidden">
                <img src="/images/birds.jpg" alt="Birds" className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-semibold text-white">Birds</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400">Connect with bird owners and share your feathered friend stories.</p>
              </div>
            </div>

            {/* Reptiles */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/20 border border-gray-800">
              <div className="relative overflow-hidden">
                <img src="/images/reptiles.jpg" alt="Reptiles" className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-semibold text-white">Reptiles</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400">Join the reptile community and share your scaly companion experiences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm relative z-20">
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            About SmartPet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-500/20 p-3 rounded-full mr-4">
                  <FaHeart className="text-green-500 text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-gray-300 mb-4">
                SmartPet is dedicated to creating a vibrant community for pet lovers. We believe that pets bring joy, 
                companionship, and love to our lives, and we want to help you connect with others who share this passion.
              </p>
              <p className="text-gray-300">
                Whether you're looking to adopt a new pet, share your pet's story, or connect with other pet owners, 
                SmartPet provides the platform for you to do so.
              </p>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-500/20 p-3 rounded-full mr-4">
                  <FaPaw className="text-green-500 text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold">What We Offer</h3>
              </div>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Create and share posts about your pets</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Join pet-specific communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Connect with other pet owners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Find pets available for adoption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>Share pet care tips and advice</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4 relative z-20">
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gray-800/80 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-500 border border-gray-700 shadow-lg group-hover:shadow-green-500/20 transition-all duration-300 group-hover:scale-110">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore</h3>
              <p className="text-gray-400">Browse through pet profiles, communities, and posts to find what interests you.</p>
            </div>
            <div className="text-center group">
              <div className="bg-gray-800/80 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-500 border border-gray-700 shadow-lg group-hover:shadow-green-500/20 transition-all duration-300 group-hover:scale-110">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-400">Join communities, follow other pet owners, and engage with content you love.</p>
            </div>
            <div className="text-center group">
              <div className="bg-gray-800/80 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-500 border border-gray-700 shadow-lg group-hover:shadow-green-500/20 transition-all duration-300 group-hover:scale-110">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share</h3>
              <p className="text-gray-400">Create your own posts, share your pet's story, and contribute to the community.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm relative z-20">
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            What Pet Lovers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-500/20 p-3 rounded-full mr-4">
                  <FaUsers className="text-green-500 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Sarah Johnson</h3>
                  <p className="text-gray-400 text-sm">Dog Owner</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"SmartPet helped me find the perfect community for my rescue dog. The support and advice I've received have been invaluable!"</p>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-500/20 p-3 rounded-full mr-4">
                  <FaComments className="text-green-500 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Michael Chen</h3>
                  <p className="text-gray-400 text-sm">Cat Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"I've connected with so many fellow cat lovers on SmartPet. The platform makes it easy to share photos and get advice about cat care."</p>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-500/20 p-3 rounded-full mr-4">
                  <FaSearch className="text-green-500 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Emily Rodriguez</h3>
                  <p className="text-gray-400 text-sm">Bird Owner</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"I found my perfect parrot through SmartPet's adoption listings. The community has been so supportive throughout the adoption process."</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 relative z-20">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-12 shadow-xl border border-green-500/30">
            <h2 className="text-4xl font-bold mb-6">Ready to Join Our Pet Community?</h2>
            <p className="text-xl mb-8 text-gray-200">
              Start exploring, connecting, and sharing with fellow pet lovers today.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-green-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-white/30 flex items-center mx-auto group"
            >
              Get Started Now
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900/80 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <FaPaw className="text-green-500 text-3xl" />
          </div>
          <p className="text-gray-400">© 2025 SmartPet. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link to="/home" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link to="/communities" className="text-gray-400 hover:text-white transition-colors">Communities</Link>
            <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 