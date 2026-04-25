import { Link } from "react-router-dom";

const MobileMenu = ({
  isOpen,
  closeMenu,
  user,
  openAuthModal,
  handleLogout,
}) => {
  if (!isOpen) return null;

  const handleClick = (action) => {
    if (action) action();
    closeMenu();
  };

  const primaryItems = [
    { label: "Home", to: "/" },
    { label: "Guides", to: "/guides" },
    ...(user ? [{ label: "My Progress", to: "/my-progress" }] : []),
  ];

  const secondaryItems = [
    { label: "Resources", to: "/resources" },
    { label: "About", to: "/about" },
  ];

  return (
    <nav className="lg:hidden bg-[#008080] text-white px-6 py-4 shadow-md">
      
      <ul className="flex flex-col gap-4">

        {primaryItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={() => handleClick()}
              className="block w-full font-semibold"
            >
              {item.label}
            </Link>
          </li>
        ))}

        {/* Divider */}
        <hr className="border-white/20" />

        {secondaryItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={() => handleClick()}
              className="block w-full opacity-90"
            >
              {item.label}
            </Link>
          </li>
        ))}

        {/* Divider */}
        <hr className="border-white/20" />

        {user && (
          <li>
            <Link
              to="/profile"
              onClick={() => handleClick()}
              className="block w-full"
            >
              Profile
            </Link>
          </li>
        )}

        <li>
          {!user ? (
            <button
              onClick={() => handleClick(openAuthModal)}
              className="w-full bg-[#006666] py-2 rounded-md"
            >
              LOGIN / REGISTER
            </button>
          ) : (
            <button
              onClick={() => handleClick(handleLogout)}
              className="w-full bg-red-500 py-2 rounded-md"
            >
              Logout
            </button>
          )}
        </li>

      </ul>
    </nav>
  );
};

export default MobileMenu;
