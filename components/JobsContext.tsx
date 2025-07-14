"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type AssetType = "land" | "car";

export interface Job {
  id: string;
  clientName: string;
  assetType: AssetType;
  assetDetails: Record<string, string>;
  status: string;
  chain: {
    surveyor?: string;
    qa?: string;
    md?: string;
    accounts?: string;
  };
  fieldReport?: string;
  qaNotes?: string;
  mdApproval?: string;
  paymentReceived?: boolean;
}

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, "id" | "status" | "chain" | "fieldReport" | "qaNotes" | "mdApproval" | "paymentReceived">) => void;
  updateJob: (id: string, update: Partial<Job>) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
  // Pre-load dummy data to demonstrate the complete workflow
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job-1",
      clientName: "Equity Bank",
      assetType: "land",
      assetDetails: { location: "Kampala", landTitle: "LT1234", plotNo: "45A", size: "2", make: "", model: "", regNo: "", year: "" },
      status: "pending payment",
      chain: {
        surveyor: "John Surveyor",
        qa: "Sarah QA Officer",
        md: "Dr. Michael Director"
      },
      fieldReport: "Site inspection completed. Land is in good condition with proper access roads. GPS coordinates recorded. Photos taken of all boundaries. Soil samples collected for analysis. No encroachments detected.",
      qaNotes: "Field report is comprehensive and accurate. All measurements verified. Photos are clear and properly documented. GPS coordinates match official records. Report approved for MD review.",
      mdApproval: "Approved",
      paymentReceived: false
    },
    {
      id: "job-2", 
      clientName: "Stanbic Bank",
      assetType: "car",
      assetDetails: { location: "", landTitle: "", plotNo: "", size: "", make: "Toyota", model: "Corolla", regNo: "UAA123X", year: "2018" },
      status: "pending QA",
      chain: {
        surveyor: "Alice Field Inspector"
      },
      fieldReport: "Vehicle inspection completed. Engine runs smoothly, no major damage detected. Mileage verified at 45,000 km. Interior in good condition. All documents present and valid. Photos taken of all sides and engine compartment.",
      qaNotes: undefined,
      mdApproval: undefined,
      paymentReceived: false
    },
    {
      id: "job-3",
      clientName: "Private Client - Mr. Ochieng",
      assetType: "land", 
      assetDetails: { location: "Entebbe", landTitle: "LT5678", plotNo: "12B", size: "1.5", make: "", model: "", regNo: "", year: "" },
      status: "pending fieldwork",
      chain: {},
      fieldReport: undefined,
      qaNotes: undefined,
      mdApproval: undefined,
      paymentReceived: false
    },
    {
      id: "job-4",
      clientName: "Centenary Bank",
      assetType: "land",
      assetDetails: { location: "Jinja", landTitle: "LT9999", plotNo: "99C", size: "3", make: "", model: "", regNo: "", year: "" },
      status: "pending MD approval",
      chain: {
        surveyor: "David Field Team",
        qa: "Maria Quality Assurance"
      },
      fieldReport: "Comprehensive land survey completed. Property boundaries clearly marked. Soil quality assessment done. Environmental impact minimal. All regulatory requirements met. Detailed measurements and photos included.",
      qaNotes: "Excellent field work. All documentation is thorough and accurate. Measurements verified against official records. Photos are high quality and comprehensive. No issues found. Ready for MD approval.",
      mdApproval: undefined,
      paymentReceived: false
    },
    {
      id: "job-5",
      clientName: "Demo Motors Ltd",
      assetType: "car",
      assetDetails: { location: "", landTitle: "", plotNo: "", size: "", make: "Honda", model: "Civic", regNo: "UBB456Y", year: "2020" },
      status: "complete",
      chain: {
        surveyor: "Peter Vehicle Inspector",
        qa: "Lisa QA Specialist", 
        md: "Dr. Michael Director",
        accounts: "Finance Team"
      },
      fieldReport: "Vehicle in excellent condition. Low mileage at 25,000 km. All systems functioning properly. Recent service history verified. Market value assessment completed.",
      qaNotes: "Vehicle inspection report is accurate and complete. All documentation verified. Market analysis is sound. Ready for final approval.",
      mdApproval: "Approved for payment",
      paymentReceived: true
    }
  ]);

  const addJob = (job: Omit<Job, "id" | "status" | "chain" | "fieldReport" | "qaNotes" | "mdApproval" | "paymentReceived">) => {
    setJobs(jobs => [
      ...jobs,
      {
        ...job,
        id: Math.random().toString(36).slice(2),
        status: "pending fieldwork",
        chain: {},
        fieldReport: undefined,
        qaNotes: undefined,
        mdApproval: undefined,
        paymentReceived: false,
      },
    ]);
  };

  const updateJob = (id: string, update: Partial<Job>) => {
    setJobs(jobs => jobs.map(j => (j.id === id ? { ...j, ...update } : j)));
  };

  return (
    <JobsContext.Provider value={{ jobs, addJob, updateJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used within a JobsProvider");
  return ctx;
} 