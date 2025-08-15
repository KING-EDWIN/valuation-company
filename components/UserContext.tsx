"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

export type Role =
  | "system_manager"
  | "field_team"
  | "qa_officer"
  | "md"
  | "accounts"
  | "client"
  | "admin";

interface User {
  role: Role;
}

interface UserContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  roles: Role[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('stanfield_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('Loaded user from localStorage:', parsedUser);
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        localStorage.removeItem('stanfield_user');
      }
    }
  }, []);

  const login = useCallback((role: Role) => {
    const newUser = { role };
    console.log('Logging in user:', newUser);
    
    // Update localStorage first
    if (typeof window !== 'undefined') {
      localStorage.setItem('stanfield_user', JSON.stringify(newUser));
      console.log('User saved to localStorage');
    }
    
    // Then update state
    setUser(newUser);
    console.log('State updated, user should now be:', newUser);
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out user');
    
    // Clear localStorage first
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stanfield_user');
      console.log('User removed from localStorage');
    }
    
    // Then update state
    setUser(null);
    console.log('State cleared, user should now be null');
  }, []);

  const roles: Role[] = [
    "system_manager",
    "field_team",
    "qa_officer",
    "md",
    "accounts",
    "client",
    "admin",
  ];

  // Debug: Log whenever user state changes
  useEffect(() => {
    console.log('UserContext: User state changed to:', user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, login, logout, roles }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
} 