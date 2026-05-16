.PHONY: dev build start infra-up infra-down docker-up docker-down

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

docker-up:
	docker compose -f docker/compose/docker-compose.yml up -d

docker-down:
	docker compose -f docker/compose/docker-compose.yml down

infra-up:
	cd infra/terraform && terraform apply

infra-down:
	cd infra/terraform && terraform destroy
