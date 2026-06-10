# AyosDocs Runbook

## Deployment
1. Push to `master` on GitHub.
2. GitHub Actions runs lint → Docker build → Trivy scan → push to GHCR.
3. Watchtower on EC2 auto-detects new image and restarts the `app` container.
4. Verify: `make docker-log-app` and check for startup messages.

## AI Re-indexing
After updating guide content, re-sync the vector database:
```bash
make ai-sync
```

## Monitoring
- **Logs:** `make docker-logs` (all services)
- **Grafana:** `admin.ayosdocs.com/grafana/` or SSH tunnel (`make tunnel`)
- **Container health:** `docker ps` and `docker stats`

## Common Tasks
| Task | Command |
|---|---|
| Restart all services | `make docker-down && make docker-up` |
| View app logs | `make docker-log-app` |
| View nginx logs | `make docker-log-nginx` |
| View MongoDB logs | `make docker-log-mongodb` |
| Check backup logs | `make docker-log-backup` |
| Manual backup | `make backup` |
| SSH into server | `make ssh` |
