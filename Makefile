#!/usr/bin/make

SHELL := /bin/bash

.PHONY: help up build down

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

up: ## Up containers
	@docker-compose up -d

build: ## Build app
	@docker-compose build

down: ## Down app
	@docker-compose down -v

migrate: ## Migrate database
	@docker-compose exec app npx prisma migrate dev
	@docker-compose exec subscriber npx prisma migrate dev
