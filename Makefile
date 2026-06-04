.PHONY: dev build start infra-up infra-down infra-provision vault-edit docker-pull-app docker-up docker-down docker-minimal-pull docker-minimal-up docker-minimal-down docker-minimal-build docker-dev-up docker-dev-down docker-logs ai-sync backup cron-cleanup

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

infra-up:
	cd infra/terraform && terraform apply

infra-down:
	cd infra/terraform && terraform destroy

infra-provision:
	ansible-playbook -i infra/ansible/inventory.ini infra/ansible/setup-server.yml --ask-vault-pass

vault-edit:
	ansible-vault edit infra/ansible/vars/secrets.yml

docker-pull-app:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml pull app

docker-minimal-pull:
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml pull nginx mongodb backup account-cleanup qdrant

docker-up:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml up -d

docker-down:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml down

docker-minimal-up:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml up -d app mongodb nginx backup account-cleanup qdrant

docker-minimal-down:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml down app mongodb nginx backup account-cleanup qdrant

docker-minimal-build:
	docker compose --env-file app/.env -f docker/compose/docker-compose.minimal-build.yml up -d --build app mongodb nginx backup account-cleanup qdrant



docker-dev-up:
	docker compose --env-file app/.env.local -f docker/compose/docker-compose.dev.yml up -d

docker-dev-down:
	docker compose --env-file app/.env.local -f docker/compose/docker-compose.dev.yml down

docker-logs:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f

docker-log-%:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f $*

ai-sync:
	@if [ "$$(docker ps -q -f name=ayosdocs-app)" ]; then \
		echo "Running sync inside Docker container..."; \
		docker exec -it ayosdocs-app node ../scripts/index-guides.mjs; \
	else \
		echo "Running sync locally..."; \
		node scripts/index-guides.mjs; \
	fi

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
