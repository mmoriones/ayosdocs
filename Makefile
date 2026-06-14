.PHONY: infra-bootstrap infra-up infra-down infra-provision vault-edit docker-pull-app docker-up docker-down docker-minimal-pull docker-minimal-up docker-minimal-down docker-minimal-build docker-dev-up docker-dev-down docker-minimal-logs docker-logs ai-sync backup cron-cleanup remote-docker-minimal-up remote-docker-minimal-down remote-docker-minimal-build remote-ai-sync remote-git-pull

infra-bootstrap:
	cd infra/terraform/bootstrap && terraform init && terraform apply -auto-approve

infra-up:
	BUCKET=$$(cd infra/terraform/bootstrap && terraform output -raw state_bucket_name) && cd infra/terraform/root && terraform init -backend-config="bucket=$$BUCKET" -migrate-state && terraform apply -auto-approve

infra-down:
	BUCKET=$$(cd infra/terraform/bootstrap && terraform output -raw state_bucket_name) && cd infra/terraform/root && terraform init -backend-config="bucket=$$BUCKET" -reconfigure && terraform destroy -auto-approve

infra-provision:
	ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i infra/terraform/root/inventory.ini infra/ansible/setup-server.yml --ask-vault-pass

vault-edit:
	ansible-vault edit infra/ansible/vars/secrets.yml



# Full stack docker compose
docker-pull-app:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml pull app

docker-up:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml up -d

docker-down:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml down

docker-logs:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f

docker-log-%:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f $*



# Minimal docker compose for low specs VPS
docker-minimal-pull:
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml pull nginx mongodb backup account-cleanup qdrant

docker-minimal-up:
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml up -d app mongodb nginx backup account-cleanup qdrant

docker-minimal-down:
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml down app mongodb nginx backup account-cleanup qdrant

docker-minimal-build:
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml up -d --build app mongodb nginx backup account-cleanup qdrant

docker-minimal-logs:
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml logs -f

docker-minimal-log-%:
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml logs -f $*


# Remote commands via Ansible ad-hoc (no vault password needed)
INVENTORY = infra/terraform/root/inventory.ini
REMOTE_CMD = ANSIBLE_HOST_KEY_CHECKING=False ansible webservers -i $(INVENTORY) -m shell

remote-docker-minimal-up:
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && make docker-minimal-up"

remote-docker-minimal-down:
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && make docker-minimal-down"

remote-docker-minimal-build:
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && make docker-minimal-build"

remote-ai-sync:
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && make ai-sync"

remote-git-pull:
	$(REMOTE_CMD) -a "cd /home/ubuntu/ayosdocs && git pull"


# for local dev (will run db and qdrant containers)
docker-dev-up:
	docker compose --env-file app/.env.local -f docker/compose/docker-compose.dev.yml up -d

docker-dev-down:
	docker compose --env-file app/.env.local -f docker/compose/docker-compose.dev.yml down



ai-sync:
	node scripts/index-guides.mjs

backup:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml exec backup /scripts/backup.sh

cron-cleanup:
	@SECRET=$$(grep CRON_SECRET app/.env.local | cut -d '=' -f2); \
	if [ -z "$$SECRET" ]; then \
		echo "Error: CRON_SECRET not found in app/.env.local"; \
		exit 1; \
	fi; \
	echo "Triggering account cleanup..."; \
	curl -i -H "Authorization: Bearer $$SECRET" http://localhost:3000/api/cron/cleanup-accounts
