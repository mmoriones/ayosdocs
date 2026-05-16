# Disaster Recovery Plan

## Backup Strategy
- Database: Daily MongoDB dumps stored in `/backups`.
- Config: Versions kept in Git.

## Recovery Steps
1. Restore database from latest backup.
2. Re-apply infrastructure via Terraform.
