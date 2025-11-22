import { api } from './api';

export interface Topic {
  _id: string;
  topic: string;
  keywords?: string[];
  category: string;
  processed: boolean;
  processedAt?: Date;
  blogId?: {
    _id: string;
    title: string;
    slug: string;
    status: string;
    publishDate: Date;
  };
  createdAt: Date;
}

export interface AutomationStatus {
  topics: {
    total: number;
    processed: number;
    remaining: number;
  };
  blogs: {
    total: number;
    published: number;
    drafts: number;
  };
  automation: {
    isActive: boolean;
    schedule: string[];
  };
}

class BlogAutomationService {
  async loadTopics(topics: string[], category: string = 'Tips'): Promise<{ count: number; topics: Topic[] }> {
    const response = await api.post('/automation/topics/load', { topics, category });
    return response.data;
  }

  async generateNow(): Promise<{ blog: any }> {
    const response = await api.post('/automation/generate-now', {});
    return response.data;
  }

  async getStatus(): Promise<AutomationStatus> {
    const response = await api.get('/automation/status');
    return response.data.status;
  }

  async getTopics(): Promise<Topic[]> {
    const response = await api.get('/automation/topics');
    return response.data.topics;
  }

  async clearTopics(): Promise<{ deletedCount: number }> {
    const response = await api.delete('/automation/topics/clear');
    return response.data;
  }
}

export const blogAutomationService = new BlogAutomationService();
