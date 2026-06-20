# Disaster Recovery Plan

## Backup Strategy
- **MongoDB:** Daily automated dumps via the `backup` service, synced to Cloudflare R2 via rclone.
- **Qdrant:** The vector database can be re-created from source guides (see Recovery below).
- **Config:** All infrastructure config is versioned in Git (Terraform, Ansible, Docker Compose).
- **Secrets:** Stored in Ansible Vault (`infra/ansible/vars/secrets.yml`).
- **Terraform State:** Stored in S3 (AWS-managed, multi-AZ durability) with DynamoDB locking.

## Recovery Steps

### 1. Restore Infrastructure

```bash
make infra-up
```

> **Caveats:**
> - Requires `infra-bootstrap` to have been run at least once (the S3 bucket + DynamoDB table must already exist).
> - Assumes bootstrap Terraform state is still available locally (`infra/terraform/bootstrap/terraform.tfstate`).
> - `-auto-approve` applies without a plan review. If you want to inspect changes first, run manually:
>   ```bash
>   cd infra/terraform/root
>   terraform plan
>   terraform apply
>   ```
> - If bootstrap state is lost, re-run it first:
>   ```bash
>   cd infra/terraform/bootstrap && terraform init && terraform apply
>   ```

### 2. Provision the Server

```bash
make infra-provision
```

### 3. Restore MongoDB

```bash
# List available backups
rclone ls r2:ayosdocs-backups

# Restore latest backup
docker exec -it ayosdocs-db mongorestore --drop /backups/<latest>
```

### 4. Restore Qdrant (Re-index)

Since Qdrant data is ephemeral, re-index from source:

```bash
# Remotely (recommended)
make remote-ai-sync

# Or SSH into server and run:
# cd /home/ubuntu/ayosdocs && make ai-sync
```

If the app code has been updated, pull the latest first:

```bash
make remote-git-pull
```

### 5. Build & Start the Stack

```bash
make remote-docker-minimal-build
```

### 6. Verify

- Check app health at the live URL.
- Check logs: `make docker-log-app`
- Test AI chat with a sample query.
