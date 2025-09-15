'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Job {
  id: string;
  clientName: string;
  clientInfo: {
    clientType: string;
    contactNumber: string;
    email: string;
    address: string;
  };
  assetType: string;
  assetDetails: {
    location: string;
    size: string;
    propertyUse: string;
    plotNo?: string;
    previousWorkHistory: string[];
    neighborhood: string[];
  };
  valuationRequirements: {
    purpose: string;
    value: number;
    currency: string;
    deadline: string;
  };
  bankInfo: {
    bankName: string;
    branch: string;
    contactPerson: string;
    contactNumber: string;
  };
  status: string;
  qaChecklist: {
    completed: boolean;
    items: string[];
    notes: string;
  };
  createdAt: string;
  updatedAt: string;
  fieldReportData?: {
    inspectionDate: string;
    siteConditions: string;
    measurements: string;
    photos: string[];
    notes: string;
    documents: {
      orthophoto: string;
      topographic: string;
      areaSchedule: string;
      titleSearch: string;
      occupancyPermit: string;
      additionalDocs: string[];
    };
  };
  adminReviewed?: boolean;
  adminReviewDate?: string;
  adminReviewNotes?: string;
  qaNotes?: string;
  mdApproval?: boolean;
  paymentReceived?: boolean;
  revocationReason?: string;
  chain: {
    surveyor?: string;
    qa?: string;
    md?: string;
    accounts?: string;
  };
}

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJobsByStatus: (status: string) => Job[];
  getJobsByBank: (bankName: string) => Job[];
  getJobsByNeighborhood: (neighborhood: string) => Job[];
  getJobsByProperty: (location: string, plotNo?: string) => Job[];
  getBankStatistics: () => { [key: string]: number };
  getAllBanks: () => string[];
  refreshJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs', { cache: 'no-store' as RequestCache });
      const data = await response.json();
      
      if (data.success) {
        // Transform database data to match Job interface
        const transformedJobs = data.data.map((job: any) => ({
          ...job,
          id: job.id.toString(),
          clientInfo: job.client_info || {},
          assetDetails: job.asset_details || {},
          valuationRequirements: job.valuation_requirements || {},
          bankInfo: job.bank_info || {},
          qaChecklist: job.qa_checklist || { completed: false, items: [], notes: "" },
          fieldReportData: job.field_report_data,
          adminReviewed: job.admin_reviewed || false,
          adminReviewDate: job.admin_review_date,
          adminReviewNotes: job.admin_review_notes,
          qaNotes: job.qa_notes,
          mdApproval: job.md_approval,
          paymentReceived: job.payment_received || false,
          revocationReason: job.revocation_reason,
          chain: job.chain || {},
          createdAt: job.created_at,
          updatedAt: job.updated_at
        }));
        
        setJobs(transformedJobs);
        setError(null);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchJobs();
    // lightweight polling so dashboard Recent Activity reflects DB in near real-time
    const interval = setInterval(fetchJobs, 8000);
    return () => clearInterval(interval);
  }, []);

  const addJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Transform the response to match Job interface
        const newJob: Job = {
          ...data.data,
          id: data.data.id.toString(),
          clientInfo: data.data.client_info || {},
          assetDetails: data.data.asset_details || {},
          valuationRequirements: data.data.valuation_requirements || {},
          bankInfo: data.data.bank_info || {},
          qaChecklist: data.data.qa_checklist || { completed: false, items: [], notes: "" },
          fieldReportData: data.data.field_report_data,
          adminReviewed: data.data.admin_reviewed || false,
          adminReviewDate: data.data.admin_review_date,
          adminReviewNotes: data.data.admin_review_notes,
          qaNotes: data.data.qa_notes,
          mdApproval: data.data.md_approval,
          paymentReceived: data.data.payment_received || false,
          revocationReason: data.data.revocation_reason,
          chain: data.data.chain || {},
          createdAt: data.data.created_at,
          updatedAt: data.data.updated_at
        };
        
        setJobs(prev => [...prev, newJob]);
      } else {
        throw new Error(data.error || 'Failed to add job');
      }
    } catch (err) {
      console.error('Error adding job:', err);
      throw err;
    }
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Transform the response to match Job interface
        const updatedJob: Job = {
          ...data.data,
          id: data.data.id.toString(),
          clientInfo: data.data.client_info || {},
          assetDetails: data.data.asset_details || {},
          valuationRequirements: data.data.valuation_requirements || {},
          bankInfo: data.data.bank_info || {},
          qaChecklist: data.data.qa_checklist || { completed: false, items: [], notes: "" },
          fieldReportData: data.data.field_report_data,
          adminReviewed: data.data.admin_reviewed || false,
          adminReviewDate: data.data.admin_review_date,
          adminReviewNotes: data.data.admin_review_notes,
          qaNotes: data.data.qa_notes,
          mdApproval: data.data.md_approval,
          paymentReceived: data.data.payment_received || false,
          revocationReason: data.data.revocation_reason,
          chain: data.data.chain || {},
          createdAt: data.data.created_at,
          updatedAt: data.data.updated_at
        };
        
        setJobs(prev => prev.map(job => 
          job.id === id ? updatedJob : job
        ));
      } else {
        throw new Error(data.error || 'Failed to update job');
      }
    } catch (err) {
      console.error('Error updating job:', err);
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJobs(prev => prev.filter(job => job.id !== id));
      } else {
        throw new Error(data.error || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      throw err;
    }
  };

  const getJobsByStatus = (status: string) => {
    return jobs.filter(job => job.status === status);
  };

  const getJobsByBank = (bankName: string) => {
    return jobs.filter(job => job.bankInfo.bankName === bankName);
  };

  const getJobsByNeighborhood = (neighborhood: string) => {
    return jobs.filter(job => 
      job.assetDetails.neighborhood.includes(neighborhood)
    );
  };

  const getJobsByProperty = (location: string, plotNo?: string) => {
    return jobs.filter(job => 
      job.assetDetails.location === location && 
      (!plotNo || job.assetDetails.plotNo === plotNo)
    );
  };

  const getBankStatistics = () => {
    const stats: { [key: string]: number } = {};
    jobs.forEach(job => {
      const bank = job.bankInfo.bankName;
      stats[bank] = (stats[bank] || 0) + 1;
    });
    return stats;
  };

  const getAllBanks = () => {
    const banks = new Set(jobs.map(job => job.bankInfo.bankName));
    return Array.from(banks);
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      loading,
      error,
      addJob,
      updateJob,
      deleteJob,
      getJobsByStatus,
      getJobsByBank,
      getJobsByNeighborhood,
      getJobsByProperty,
      getBankStatistics,
      getAllBanks,
      refreshJobs: fetchJobs,
    }}>
      {children}
    </JobsContext.Provider>
  );
}; 