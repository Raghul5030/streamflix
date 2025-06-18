import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, AuthState, authService } from "@/lib/auth";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (
    updates: Partial<Omit<User, "id" | "createdAt">>,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        setState({
          user,
          isLoading: false,
          isAuthenticated: !!user,
        });
      } catch (error) {
        console.error("Error checking authentication:", error);
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const user = await authService.signIn(email, password);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
  ): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const user = await authService.signUp(email, password, name);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.signOut();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const updateProfile = async (
    updates: Partial<Omit<User, "id" | "createdAt">>,
  ): Promise<void> => {
    if (!state.user) throw new Error("Not authenticated");

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const updatedUser = await authService.updateProfile(updates);
      setState((prev) => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
