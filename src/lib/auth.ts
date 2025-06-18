export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Simple mock authentication - in a real app, this would integrate with a backend
class AuthService {
  private static readonly STORAGE_KEY = "streaming_auth";
  private static readonly USERS_KEY = "streaming_users";

  // Get current user from localStorage
  getCurrentUser(): User | null {
    try {
      const authData = localStorage.getItem(AuthService.STORAGE_KEY);
      if (!authData) return null;

      const { userId } = JSON.parse(authData);
      const users = this.getUsers();
      return users.find((user) => user.id === userId) || null;
    } catch {
      return null;
    }
  }

  // Get all registered users from localStorage
  private getUsers(): User[] {
    try {
      const usersData = localStorage.getItem(AuthService.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch {
      return [];
    }
  }

  // Save users to localStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem(AuthService.USERS_KEY, JSON.stringify(users));
  }

  // Sign up new user
  async signUp(email: string, password: string, name: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = this.getUsers();

    // Check if user already exists
    if (users.some((user) => user.email === email)) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date(),
    };

    // Save user
    users.push(newUser);
    this.saveUsers(users);

    // Auto sign in
    localStorage.setItem(
      AuthService.STORAGE_KEY,
      JSON.stringify({ userId: newUser.id }),
    );

    return newUser;
  }

  // Sign in existing user
  async signIn(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = this.getUsers();
    const user = users.find((user) => user.email === email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // In a real app, you'd verify the password hash here
    // For demo purposes, we'll just accept any password

    // Save auth state
    localStorage.setItem(
      AuthService.STORAGE_KEY,
      JSON.stringify({ userId: user.id }),
    );

    return user;
  }

  // Sign out current user
  async signOut(): Promise<void> {
    localStorage.removeItem(AuthService.STORAGE_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Update user profile
  async updateProfile(
    updates: Partial<Omit<User, "id" | "createdAt">>,
  ): Promise<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.id === currentUser.id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);

    return users[userIndex];
  }
}

export const authService = new AuthService();

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string,
): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { isValid: true };
};

export const validateName = (
  name: string,
): { isValid: boolean; message?: string } => {
  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters long",
    };
  }
  return { isValid: true };
};
