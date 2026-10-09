export interface Review {
  id: string;
  workerId: string;
  workerName: string;
  workerCategory: string;
  workerAvatar?: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  jobTitle: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isCurrentUser?: boolean;
}

export interface WorkerRatingSummary {
  workerName: string;
  workerCategory: string;
  averageRating: number;
  totalReviews: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
