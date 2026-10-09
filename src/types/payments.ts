export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentProof {
  id: string;
  transactionRef: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  workerName: string;
  workerCategory: string;
  amount: number;
  bankName: string;
  slipUrl: string;
  status: PaymentStatus;
  submittedAt: string;
  rejectionReason?: string;
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface WorkerVerification {
  id: string;
  workerName: string;
  workerCategory: string;
  email: string;
  phone: string;
  experienceYears: number;
  nicNumber: string;
  nicFrontUrl: string;
  nicBackUrl: string;
  certificateTitle: string;
  certificateUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  verifiedAt?: string;
}
