import { ReactNode } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  readingTime?: number; // in minutes
  tags?: string[];
  content: ReactNode;
} 