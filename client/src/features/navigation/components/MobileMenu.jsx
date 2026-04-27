import { Link, useLocation } from "react-router-dom";

const MobileMenu = ({
  isOpen,
  closeMenu,
  user,
  openAuthModal,
  handleLogout,
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  const handleClick = (action) => {
    if (action) action();
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  const primaryItems = [
    { label: "Home", to: "/" },
    { label: "Guides", to: "/guides" },
    ...(user ? [{ label: "My Progress", to: "/my-progress" }] : []),
  ];

  const secondaryItems = [
    { label: "About", to: "/about" },
    { label: "FAQs", to: "/faqs" },
    { label: "Contact", to: "/contact" },
  ];

  const linkClass = (path) =>
    `block w-full px-3 py-2 rounded-lg transition ${
      isActive(path)
        ? "bg-teal-50 text-teal-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="lg:hidden border-b border-gray-200 bg-white shadow-sm">
      
      <div className="px-6 py-4 space-y-4">

        {/* PRIMARY */}
        <div className="space-y-1">
          {primaryItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => handleClick()}
              className={linkClass(item.to)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* SECONDARY */}
        <div className="space-y-1">
          {secondaryItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => handleClick()}
              className={linkClass(item.to)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* USER SECTION */}
        {user && (
          <div className="flex items-center gap-3 px-2 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {user.fullName}
              </span>
              <span className="text-xs text-gray-500">
                Logged in
              </span>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {user && (
          <Link
            to="/profile"
            onClick={() => handleClick()}
            className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Profile Settings
          </Link>
        )}

        {/* CTA */}
        <div className="pt-2">
          {!user ? (
            <button
              onClick={() => handleClick(openAuthModal)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium transition"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={() => handleClick(handleLogout)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium transition"
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default MobileMenu;
