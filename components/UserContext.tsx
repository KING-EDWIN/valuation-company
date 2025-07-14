"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

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
  const login = (role: Role) => setUser({ role });
  const logout = () => setUser(null);
  const roles: Role[] = [
    "system_manager",
    "field_team",
    "qa_officer",
    "md",
    "accounts",
    "client",
    "admin",
  ];
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