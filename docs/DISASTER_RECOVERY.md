# Disaster Recovery Plan

## Backup Strategy
- **MongoDB:** Daily automated dumps via the `backup` service, synced to Cloudflare R2 via rclone.
- **Qdrant:** The vector database is not backed up automatically. Guides can be re-indexed after restoration.
- **Config:** All infrastructure config is versioned in Git (Terraform, Ansible, Docker Compose).
- **Secrets:** Stored in Ansible Vault (`infra/ansible/vars/secrets.yml`).

## Recovery Steps

### 1. Restore Infrastructure
```bash
cd infra/terraform
terraform apply
```

### 2. Restore MongoDB
```bash
# List available backups
rclone ls r2:ayosdocs-backups

# Restore latest backup
docker exec -it ayosdocs-mongodb mongorestore --drop /backups/<latest>
```

### 3. Restore Qdrant (Re-index)
Since Qdrant data is ephemeral, re-index from source:
```bash
cd /home/ubuntu/ayosdocs
make ai-sync
```

### 4. Verify
- Check app health at the live URL.
- Check logs: `make docker-log-app`
- Test AI chat with a sample query.
