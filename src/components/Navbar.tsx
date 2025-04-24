import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPaw, FaHome, FaSearch, FaPlusCircle, FaUsers, FaUserPlus, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { signInWithGoogle, signOut, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define navigation items based on authentication status
  const getNavItems = () => {
    const baseItems = [
      {
        path: "/home",
        label: "Home",
        icon: <FaHome className="text-xl" />,
      },
      {
        path: "/search",
        label: "Search Pet",
        icon: <FaSearch className="text-xl" />,
      },
    ];

    const authenticatedItems = [
      {
        path: "/create",
        label: "Create Post",
        icon: <FaPlusCircle className="text-xl" />,
      },
      {
        path: "/communities",
        label: "Communities",
        icon: <FaUsers className="text-xl" />,
      },
      {
        path: "/community/create",
        label: "Create Community",
        icon: <FaUserPlus className="text-xl" />,
      },
    ];

    return user ? [...baseItems, ...authenticatedItems] : baseItems;
  };

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      scrolled 
        ? "bg-[rgba(10,10,10,0.95)] backdrop-blur-lg shadow-lg" 
        : "bg-[rgba(10,10,10,0.8)] backdrop-blur-md"
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavLink 
            to="/" 
            className="font-mono text-xl font-bold text-white flex items-center gap-2 hover:text-purple-400 transition-colors"
          >
            <FaPaw className="text-purple-500" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              SmartPet
            </span>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <span className={`transition-transform duration-200 ${isActive(item.path) ? "scale-110" : ""}`}>
                  {item.icon}
                </span>
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <NavLink 
                    to="/profile"
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User Avatar"
                      className="relative w-10 h-10 rounded-full object-cover transform transition duration-200 group-hover:scale-105"
                    />
                  </NavLink>
                )}
                <span className="text-gray-300 font-medium">{user.user_metadata.full_name || user.email}</span>
                <button
                  onClick={signOut}
                  className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaSignInAlt />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            menuOpen 
              ? "max-h-screen opacity-100 py-4" 
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col space-y-2">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
            {user ? (
              <>
                {user.user_metadata?.avatar_url && (
                  <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="User Avatar"
                        className="relative w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                  </NavLink>
                )}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-gray-300 font-medium">{user.user_metadata.full_name || user.email}</span>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-700 transition-colors shadow-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  signInWithGoogle();
                  setMenuOpen(false);
                }}
                className="mx-4 bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <FaSignInAlt />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
