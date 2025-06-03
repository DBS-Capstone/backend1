.PHONY: help build up down logs clean load-birds backup restore

# default target
help:
	@echo "Available commands:"
	@echo "  build       - Build all Docker containers"
	@echo "  up          - Start all services"
	@echo "  down        - Stop all services"
	@echo "  logs        - Show logs for all services"
	@echo "  clean       - Remove containers and volumes"
	@echo "  load-birds  - Load bird data into database (run once)"
	@echo "  backup      - Create database backup"
	@echo "  restore     - Restore database from backup"
	@echo "  admin       - Start with pgAdmin"

# build containers
build:
	docker-compose build

# start services
up:
	docker-compose up -d

# start but with pgAdmin
admin:
	docker-compose --profile admin up -d

# stop services
down:
	docker-compose down

# show logs
logs:
	docker-compose logs -f

# clean everything
clean:
	docker-compose down -v
	docker system prune -f

# load bird data (run this once after first startup)
load-birds:
	@echo "Loading bird data from eBird..."
	docker-compose exec postgres /usr/local/bin/load-bird-data.sh

# create database backup
backup:
	@echo "Creating backup..."
	mkdir -p ./backups
	docker-compose exec postgres pg_dump -U kicau_user kicau_db > ./backups/kicau_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in ./backups/"

# restore from backup (usage: make restore FILE=backup_file.sql)
restore:
	@if [ -z "$(FILE)" ]; then echo "Usage: make restore FILE=backup_file.sql"; exit 1; fi
	docker-compose exec -T postgres psql -U kicau_user -d kicau_db < ./backups/$(FILE)

# quick start (build, up, load data)
start: build up
	@echo "Waiting for services to be ready..."
	@sleep 10
	@make load-birds
	@echo "Setup complete! Services running:"
	@echo "  - Backend: http://localhost:3000"
	@echo "  - Database: localhost:5432"
	@echo "  - pgAdmin: http://localhost:8080 (run 'make admin' first)"
