# Admin & Archive System - Quick Reference Card

## 🔐 Admin Routes

```
/admin/dashboard    → Overview & Stats
/admin/ads          → Manage Ads
/admin/users        → Manage Users  
/admin/reports      → Handle Reports
/admin/archive      → View Archives
/admin/analytics    → View Analytics
/admin/settings     → System Config
```

## 📊 Admin Dashboard Stats

```
┌─────────────────────────────────┐
│ Total Ads       User Stats      │
│ Active: 1,234   Free: 5,432    │
│ Expired: 567    Basic: 234      │
│ Archived: 89    Pro: 89         │
├─────────────────────────────────┤
│ Revenue         Activity        │
│ MRR: $4,567     New Ads: 45    │
│ Growth: +12%    New Users: 12   │
└─────────────────────────────────┘
```

## 🗄️ Archive Status Flow

```
active → expired → archived → deleted
   ↓        ↓         ↓          ↓
  30d      90d      2yrs      never
                               (soft)
                               
Legal Hold: Stops deletion at any stage
```

## ⚡ Quick Actions

### Archive an Ad
```typescript
POST /api/admin/ads/:id/archive
Body: { reason: "Expired 90+ days" }
```

### Restore an Ad
```typescript
POST /api/admin/ads/:id/restore
Body: { reason: "User request" }
```

### Set Legal Hold
```typescript
PUT /api/admin/archive/:id/legal-hold
Body: { legalHold: true }
```

### Permanent Delete
```typescript
DELETE /api/admin/ads/:id/permanent-delete
Body: { reason: "User request", confirmed: true }
```

## 🔍 Archive Search Filters

```
Status:     [Active | Archived | Deleted]
Date:       [Last 7d | 30d | 90d | Custom]
Category:   [All | Jobs | Products | etc.]
Legal Hold: [Yes | No]
```

## 📋 Data Models Quick Ref

### Ad (Archive Fields)
```typescript
status: 'active' | 'expired' | 'draft' | 'archived' | 'deleted'
archivedAt?: Date
archivedBy?: string
archivedReason?: string
deletedAt?: Date
deletedBy?: string
deletionReason?: string
legalHold: boolean
retentionUntil?: Date
```

### Audit Log
```typescript
entityType: 'ad' | 'user' | 'report'
entityId: string
action: 'created' | 'updated' | 'deleted' | 'archived' | 'restored'
performedBy: string
performedByRole: 'user' | 'admin' | 'system'
performedAt: Date
reason?: string
```

### Archive Metadata
```typescript
originalId: string
entityType: 'ad' | 'user'
archivedAt: Date
storageType: 'mongodb' | 's3' | 'glacier'
canRestore: boolean
legalHold: boolean
```

## ⏰ Scheduled Jobs

```
Daily 2 AM    → Auto-archive (90+ days expired)
Weekly Sun 3 AM → Move to cold storage
Monthly 1st 4 AM → Generate archive report
Daily 5 AM    → Check legal holds
```

## 🔒 Admin Security

✅ RBAC - Role-based access control  
✅ Separate JWT secret for admins  
✅ All actions logged to AuditLog  
✅ Rate limiting on admin endpoints  
✅ 2FA recommended  
✅ Session timeout  
✅ Legal hold enforcement  

## 📝 Retention Policies

```
Active Ads:     Until expired
Expired Ads:    90 days
Archived Ads:   7 years
Deleted Ads:    30 days (soft)
Audit Logs:     Indefinite
Users (active): Until deleted
Users (deleted): 2 years
```

## 🚨 Admin Alerts

- ⚠️ Legal hold items nearing retention
- ❌ Failed archival operations
- 📦 Cold storage retrieval requests
- 🔍 Unusual deletion patterns
- 💾 Storage quota warnings

## 🎯 Common Admin Tasks

### 1. Archive Old Ads
```bash
# Automatic (runs daily)
cron: 0 2 * * *

# Manual
POST /admin/ads/:id/archive
```

### 2. Suspend User
```bash
POST /admin/users/:id/suspend
Body: { reason: "Policy violation", duration: "7d" }
```

### 3. View Audit Log
```bash
GET /admin/audit-logs?entityId=:id&startDate=2025-01-01
```

### 4. Export Data (GDPR)
```bash
POST /admin/audit-logs/export
Body: { format: "csv", dateRange: {...} }
```

### 5. Bulk Archive
```bash
POST /admin/archive/bulk-archive
Body: { adIds: [...], reason: "Cleanup" }
```

## 🔧 Environment Variables

```env
# Admin
ADMIN_EMAIL=admin@adboard.com
ADMIN_JWT_SECRET=separate_secret

# AWS
AWS_ACCESS_KEY_ID=your_key
AWS_ARCHIVE_BUCKET=adboard-archive
AWS_ARCHIVE_REGION=us-east-1

# Archive Settings
AUTO_ARCHIVE_DAYS=90
COLD_STORAGE_DAYS=730
RETENTION_PERIOD_YEARS=7
```

## 📊 Database Indexes

```typescript
// Critical for performance
Ad.index({ status: 1, archivedAt: 1 });
Ad.index({ status: 1, legalHold: 1 });
AuditLog.index({ entityId: 1, performedAt: -1 });
ArchiveMetadata.index({ originalId: 1 });
```

## 🧪 Testing Checklist

Admin Access:
- [ ] Non-admin blocked from /admin/*
- [ ] Admin login works
- [ ] JWT validation
- [ ] Session timeout

Archive:
- [ ] Auto-archive runs
- [ ] Manual archive works
- [ ] Restore works
- [ ] Legal hold prevents delete
- [ ] Audit logs created
- [ ] Bulk ops work

Compliance:
- [ ] GDPR export
- [ ] Right to be forgotten
- [ ] Retention enforced
- [ ] Audit immutable

## 💡 Pro Tips

1. **Always check legal hold** before any deletion
2. **Log everything** - audit logs are your proof
3. **Test restore** procedures regularly
4. **Monitor storage costs** - cold storage saves money
5. **Set up alerts** for unusual patterns
6. **Document reasons** for all manual actions
7. **Regular backups** of audit logs
8. **Review retention** policies annually

## 🆘 Emergency Procedures

### User Requests Data Deletion
1. Check for legal hold
2. Archive all user data
3. Create audit log entry
4. Wait 30 days (grace period)
5. Permanent delete if no holds

### Accidental Deletion
1. Check audit log for details
2. Use restore endpoint
3. Document incident
4. Review access controls

### Legal Hold Request
1. Set legal hold immediately
2. Document request details
3. Notify relevant parties
4. Create audit log
5. Review retention policy

## 📞 Support Contacts

- **Admin Issues**: admin-support@adboard.com
- **Legal Queries**: legal@adboard.com
- **Technical Issues**: tech-support@adboard.com
- **Emergency**: 24/7 hotline

---

**Quick Ref Version**: 1.0  
**Last Updated**: October 2025  
**Print & Keep Handy!** 📌
