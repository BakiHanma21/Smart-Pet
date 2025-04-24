import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaPaw, FaHeart, FaUsers, FaComments, FaSearch, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  // Animation effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // If user is already logged in and tries to access landing page, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

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
          <div className="flex gap-4 justify-center">
            <Link
              to="/home"
              className="group bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center"
          >
            Get Started
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
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
              <div className="relative overflow-hidden h-48">
                <img 
                  src="https://www.happyhousesitters.com.au/blog/wp-content/uploads/2019/08/doggy-cuddle.jpg" 
                  alt="Dogs" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
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
              <div className="relative overflow-hidden h-48">
                <img 
                  src="https://www.animalmedicalcenterofchicago.com/wp-content/uploads/2019/01/shutterstock_1033972651.jpg" 
                  alt="Cats" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
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
              <div className="relative overflow-hidden h-48">
                <img 
                  src="data:image/jpeg;base64,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" 
                  alt="Birds" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
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
              <div className="relative overflow-hidden h-48">
                <img 
                  src="https://www.worldanimalprotection.org/cdn-cgi/image/width=800,format=auto,fit=cover/siteassets/images/article/03084824_1014862.jpg" 
                  alt="Reptiles" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
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