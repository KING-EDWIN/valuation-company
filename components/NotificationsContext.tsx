"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "system_manager" | "field_team" | "admin" | "qa_officer" | "md" | "accounts" | "client";

interface Notification {
  id: string;
  message: string;
  jobId?: string;
}

interface NotificationsContextType {
  notifications: Record<Role, Notification[]>;
  addNotification: (role: Role, message: string, jobId?: string) => void;
  clearNotifications: (role: Role) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  // Pre-load notifications to demonstrate the workflow
  const [notifications, setNotifications] = useState<Record<Role, Notification[]>>({
    system_manager: [
      { id: "sys-1", message: "New client acquisition: Equity Bank land valuation", jobId: "job-1" },
      { id: "sys-2", message: "New client acquisition: Stanbic Bank vehicle valuation", jobId: "job-2" }
    ],
    field_team: [
      { id: "field-1", message: "New job ready for fieldwork: Private Client - Mr. Ochieng", jobId: "job-3" },
      { id: "field-2", message: "Job sent back for additional fieldwork: Stanbic Bank", jobId: "job-2" }
    ],
    admin: [],
    qa_officer: [
      { id: "qa-1", message: "New job ready for QA review: Stanbic Bank", jobId: "job-2" },
      { id: "qa-2", message: "New job ready for QA review: Centenary Bank", jobId: "job-4" }
    ],
    md: [
      { id: "md-1", message: "New job ready for MD approval: Centenary Bank", jobId: "job-4" },
      { id: "md-2", message: "New job ready for MD approval: Equity Bank", jobId: "job-1" }
    ],
    accounts: [
      { id: "acc-1", message: "New job ready for payment: Equity Bank", jobId: "job-1" },
      { id: "acc-2", message: "Payment completed: Demo Motors Ltd", jobId: "job-5" }
    ],
    client: [],
  });

  const addNotification = (role: Role, message: string, jobId?: string) => {
    setNotifications(n => ({
      ...n,
      [role]: [
        ...n[role],
        { id: Math.random().toString(36).slice(2), message, jobId },
      ],
    }));
  };

  const clearNotifications = (role: Role) => {
    setNotifications(n => ({ ...n, [role]: [] }));
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
} 