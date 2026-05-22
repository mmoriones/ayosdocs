.PHONY: dev build start infra-up infra-down infra-provision vault-edit docker-up docker-down docker-minimal docker-logs docker-stats

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

docker-up:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml up -d

docker-minimal:

	docker compose --env-file app/.env -f docker/compose/docker-compose.yml up -d app mongodb nginx backup

docker-down:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml down

docker-logs:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f

docker-log-%:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml logs -f $*

backup:
	docker compose --env-file app/.env -f docker/compose/docker-compose.yml exec backup /scripts/backup.sh
