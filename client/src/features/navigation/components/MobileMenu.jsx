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

  const linkClass = (path) =>
    `block w-full px-3 py-2.5 rounded-xl transition ${isActive(path)
      ? "bg-teal-50 text-teal-600 font-semibold"
      : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="lg:hidden border-b border-gray-200 bg-white shadow-sm overflow-y-auto max-h-[calc(100vh-80px)]">

      <div className="px-6 py-6 space-y-6">

        {/* PRIMARY */}
        <div className="space-y-1">
          <Link
            to="/"
            onClick={() => handleClick()}
            className={linkClass("/")}
          >
            Home
          </Link>

          <Link
            to="/guides"
            onClick={() => handleClick()}
            className={linkClass("/guides")}
          >
            Guides
          </Link>

          {user && (
            <Link
              to="/my-progress"
              onClick={() => handleClick()}
              className={linkClass("/my-progress")}
            >
              My Progress
            </Link>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* SECONDARY */}
        <div className="space-y-1">
          {[
            { label: "About", to: "/about" },
            { label: "FAQs", to: "/faqs" },
            { label: "Contact", to: "/contact" },
          ].map((item) => (
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
          <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl border border-gray-100">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.fullName}
                className="w-10 h-10 rounded-full border border-teal-600 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {user.fullName.charAt(0)}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-gray-800 truncate">
                {user.fullName}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user.email}
              </span>
            </div>
          </div>
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
