export interface AdminStats {
  totalAds: {
    total: number;
    active: number;
    expired: number;
    archived: number;
    deleted: number;
  };
  users: {
    total: number;
    free: number;
    basic: number;
    pro: number;
    suspended: number;
    banned: number;
  };
  revenue: {
    mrr: number;
    growth: number;
    thisMonth: number;
    lastMonth: number;
  };
  activity: {
    newAdsToday: number;
    newUsersToday: number;
    reportsToday: number;
    viewsToday: number;
  };
}

export interface AdminActivity {
  _id: string;
  type: 'ad_created' | 'user_registered' | 'report_filed' | 'subscription_upgraded';
  description: string;
  userId?: string;
  entityId?: string;
  createdAt: string;
}

export interface AuditLog {
  _id: string;
  entityType: 'ad' | 'user' | 'report';
  entityId: string;
  action: 'created' | 'updated' | 'deleted' | 'archived' | 'restored' | 'suspended' | 'banned';
  performedBy: string;
  performedByRole: 'user' | 'admin' | 'system';
  performedAt: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, any>;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface ArchiveMetadata {
  _id: string;
  originalId: string;
  entityType: 'ad' | 'user';
  archivedAt: string;
  archivedBy: string;
  storageLocation: 'mongodb' | 's3' | 'glacier';
  storageKey?: string;
  checksum?: string;
  sizeBytes?: number;
  canRestore: boolean;
  legalHold: boolean;
  retentionUntil?: string;
  originalData?: any;
}

export interface Report {
  _id: string;
  entityType: 'ad' | 'user';
  entityId: string;
  reportedBy: string;
  reason: 'spam' | 'inappropriate' | 'scam' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFilters {
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  legalHold?: boolean;
  userId?: string;
}

export interface BulkAction {
  action: 'archive' | 'restore' | 'delete' | 'feature' | 'unfeature';
  ids: string[];
  reason?: string;
}

export interface AdminUser extends Omit<import('./user.types').User, 'favorites'> {
  adsCount: number;
  lastActive: string;
  totalSpent: number;
}
