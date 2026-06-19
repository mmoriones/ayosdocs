.PHONY: help infra-bootstrap infra-up infra-down infra-provision vault-edit docker-pull-app docker-up docker-down docker-minimal-pull docker-minimal-up docker-minimal-down docker-minimal-build docker-dev-up docker-dev-down docker-minimal-logs docker-logs ai-sync backup cron-cleanup remote-docker-minimal-up remote-docker-minimal-down remote-docker-minimal-build remote-ai-sync remote-git-pull

.DEFAULT_GOAL := help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

## --- Infrastructure (Terraform) ---

infra-bootstrap: ## Bootstrap remote state: creates S3 bucket + DynamoDB table (run once)
	cd infra/terraform/bootstrap && terraform init && terraform apply -auto-approve

infra-up: ## Provision or update AWS infrastructure via Terraform
	BUCKET=$$(cd infra/terraform/bootstrap && terraform output -raw state_bucket_name) && cd infra/terraform/root && terraform init -backend-config="bucket=$$BUCKET" -migrate-state && terraform apply -auto-approve

infra-down: ## Destroy all AWS infrastructure via Terraform
	BUCKET=$$(cd infra/terraform/bootstrap && terraform output -raw state_bucket_name) && cd infra/terraform/root && terraform init -backend-config="bucket=$$BUCKET" -reconfigure && terraform destroy -auto-approve

infra-provision: ## Configure the server via Ansible (installs Docker, deploys secrets, hardens SSH)
	ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i infra/terraform/root/inventory.ini infra/ansible/setup-server.yml --ask-vault-pass

vault-edit: ## Edit Ansible Vault secrets file
	ansible-vault edit infra/ansible/vars/secrets.yml



## --- Docker (full stack, requires >1GB RAM) ---

docker-pull-app: ## Pull latest app image from GHCR
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml pull app

docker-up: ## Start all services (full stack with monitoring)
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml up -d

docker-down: ## Stop all services (full stack)
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml down

docker-logs: ## Tail logs for all services
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f

docker-log-%: ## Tail logs for a specific service (e.g. make docker-log-nginx)
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f $*

## --- Docker (minimal stack, for 1-2GB RAM instances) ---

docker-minimal-pull: ## Pull images for minimal stack
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml pull nginx mongodb backup account-cleanup qdrant

docker-minimal-up: ## Start minimal stack services
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml up -d app mongodb nginx backup account-cleanup qdrant

docker-minimal-down: ## Stop minimal stack services
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml down app mongodb nginx backup account-cleanup qdrant

docker-minimal-build: ## Build and start minimal stack (rebuilds app image)
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml up -d --build app mongodb nginx backup account-cleanup qdrant

docker-minimal-logs: ## Tail logs for minimal stack
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml logs -f

docker-minimal-log-%: ## Tail logs for a service in minimal stack (e.g. make docker-minimal-log-nginx)
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml logs -f $*

## --- Remote commands (run on server via Ansible, no vault password needed) ---

INVENTORY = infra/terraform/root/inventory.ini
REMOTE_CMD = ANSIBLE_HOST_KEY_CHECKING=False ansible webservers -i $(INVENTORY) -m shell

remote-docker-minimal-up: ## Start minimal stack on the server
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && make docker-minimal-up"

remote-docker-minimal-down: ## Stop minimal stack on the server
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && make docker-minimal-down"

remote-docker-minimal-build: ## Build and start minimal stack on the server (rebuilds app)
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && make docker-minimal-build"

remote-ai-sync: ## Index guides into Qdrant on the server
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && make ai-sync"

remote-git-pull: ## Pull latest code from GitHub on the server
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && git pull"

## --- Local development (runs DB + Qdrant containers only) ---

docker-dev-up: ## Start local dev dependencies (MongoDB + Qdrant)
	docker compose --env-file app/.env.local -f docker/compose/docker-compose.dev.yml up -d

docker-dev-down: ## Stop local dev dependencies
	docker compose --env-file app/.env.local -f docker/compose/docker-compose.dev.yml down



## --- Utilities ---

ai-sync: ## Index all guides into Qdrant locally (generates embeddings via Cohere)
	node scripts/index-guides.mjs

backup: ## Trigger a manual database backup to Cloudflare R2
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml exec backup /scripts/backup.sh

cron-cleanup: ## Trigger manual account cleanup via cron endpoint
	@SECRET=$$(grep CRON_SECRET app/.env.local | cut -d '=' -f2); \
	if [ -z "$$SECRET" ]; then \
		echo "Error: CRON_SECRET not found in app/.env.local"; \
		exit 1; \
	fi; \
	echo "Triggering account cleanup..."; \
	curl -i -H "Authorization: Bearer $$SECRET" http://localhost:3000/api/cron/cleanup-accounts
