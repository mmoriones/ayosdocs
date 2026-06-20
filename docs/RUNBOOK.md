# AyosDocs Runbook

Run `make help` from the repo root for a full command reference.

## Initial Deploy

From a fresh clone on a new server:

```bash
make infra-bootstrap     # Create S3 bucket + DynamoDB for Terraform state (first time only)
make infra-up            # Provision AWS infrastructure (EC2, DNS, etc.)
make infra-provision     # Configure server via Ansible (Docker, secrets, SSH hardening)
make remote-docker-minimal-build  # Build & start minimal stack on the server
make remote-ai-sync      # Index guides into Qdrant for AI chat
```

## Updates (Deployment)

1. Push to `master` on GitHub.
2. GitHub Actions runs lint → Docker build → Trivy scan → push to GHCR.
3. Watchtower on EC2 auto-detects new image and restarts the `app` container.
4. Pull latest code and rebuild if needed:
   ```bash
   make remote-git-pull
   make remote-docker-minimal-build
   ```
5. Verify: `make docker-log-app` and check for startup messages.

## AI Re-indexing

After updating guide content, re-sync the vector database:

```bash
# Locally
make ai-sync

# Remotely (server)
make remote-ai-sync
```

## Monitoring

- **Logs:** `make docker-logs` (all services)
- **Container health:** `docker ps` and `docker stats`
- **Grafana:** SSH tunnel to server and access `localhost:3000`

## Common Tasks

| Task | Command |
|---|---|
| Provision infra from scratch | `make infra-bootstrap && make infra-up && make infra-provision` |
| Build & start minimal stack | `make remote-docker-minimal-build` |
| Start minimal stack (no rebuild) | `make remote-docker-minimal-up` |
| Stop minimal stack | `make remote-docker-minimal-down` |
| Pull latest code on server | `make remote-git-pull` |
| Re-index AI guides on server | `make remote-ai-sync` |
| Restart all services | `make docker-down && make docker-up` |
| View app logs | `make docker-log-app` |
| View nginx logs | `make docker-log-nginx` |
| View MongoDB logs | `make docker-log-mongodb` |
| Check backup logs | `make docker-log-backup` |
| Manual backup | `make backup` |
| Trigger account cleanup | `make cron-cleanup` |
| Edit Ansible Vault secrets | `make vault-edit` |
| SSH into server | `make ssh` |
