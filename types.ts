
export interface User {
  id: string;
  name: string;
  role: 'citizen' | 'government';
  civicPoints?: number;
}

export enum IssueStatus {
  Reported = 'Reported',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
}

export interface CivicIssue {
  id: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  imageUrl: string;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reportedBy: string;
  timestamp: string;
  upvotes: number;
}

export interface LeaderboardUser {
  name: string;
  points: number;
}
