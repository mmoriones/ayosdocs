import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

/**
 * Context provider for managing authentication state.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Execution of this effect occurs once upon component mounting.
  // Checking localStorage determines if a user session was previously active.
  // Persistence ensures the user remains logged in across browser refreshes.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Data in localStorage is stored as strings; parsing back into an object is required.
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /**
   * Logs the user in by saving their data to localStorage and state.
   * 
   * @param {Object} userData - The user information from the server/OAuth.
   */
  const login = (userData) => {
    // Updates both localStorage (persistence) and React state (UI reactivity).
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Logs the user out by clearing localStorage and resetting state.
   */
  const logout = () => {
    // Terminates the session by removing user data from both state and storage.
    localStorage.removeItem("user");
    setUser(null);
  };

  /**
   * Opens the authentication modal.
   */
  const openAuthModal = () => setIsAuthModalOpen(true);

  /**
   * Closes the authentication modal.
   */
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 * 
 * @returns {{
 *   user: Object|null,
 *   isLoggedIn: boolean,
 *   login: Function,
 *   logout: Function,
 *   isAuthModalOpen: boolean,
 *   openAuthModal: Function,
 *   closeAuthModal: Function
 * }} The authentication context value.
 */
export const useAuth = () => useContext(AuthContext);
