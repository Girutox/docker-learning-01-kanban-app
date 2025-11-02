# Kanban App (Docker learning project)

This repository contains a simple Kanban web application split into three services and orchestrated with Docker Compose:

- `kanban-api`: Node/Express API that stores/retrieves boards and tasks from a PostgreSQL database.
- `kanban-app`: Angular front-end served by Nginx.
- `kanban-db`: PostgreSQL database with optional initialization SQL scripts.

The compose setup is configured to make it easy to run the whole stack locally.

## Repository structure

Top-level folders:

- `kanban-api/` – Express API source, database models and routes.
- `kanban-app/` – Angular application and static web server config (nginx).
- `kanban-db/` – database init scripts (SQL files mounted into the postgres container).

Key files:

- `docker-compose.yml` – orchestrates the `db`, `api` and `ui` services.
- `kanban-api/.env` – environment variables used by the API service (port and DB connection settings).

## Prerequisites

- Docker and Docker Compose installed on your machine.
- (Optional) Git to clone or pull updates.

This project was tested on Windows with PowerShell but should work on macOS and Linux as well.

# Kanban App (Docker learning project)

This repository contains a simple Kanban web application split into three services and orchestrated with Docker Compose:

- `kanban-api`: Node/Express API that stores/retrieves boards and tasks from a PostgreSQL database.
- `kanban-app`: Angular front-end served by Nginx.
- `kanban-db`: PostgreSQL database with optional initialization SQL scripts.

The compose setup is configured to make it easy to run the whole stack locally.

## Repository structure

Top-level folders:

- `kanban-api/` – Express API source, database models and routes.
- `kanban-app/` – Angular application and static web server config (nginx).
- `kanban-db/` – database init scripts (SQL files mounted into the postgres container).

Key files:

- `docker-compose.yml` – orchestrates the `db`, `api` and `ui` services.
- `kanban-api/.env` – environment variables used by the API service (port and DB connection settings).

## Prerequisites

- Docker and Docker Compose installed on your machine.
- (Optional) Git to clone or pull updates.

This project was tested on Windows with PowerShell but should work on macOS and Linux as well.

## Quick start (recommended)

From the repository root run:

```powershell
docker-compose up --build
```

What this does:

- Builds the `kanban-api` and `kanban-app` images from their Dockerfiles.
- Starts a Postgres container (`5432`), an API container (`5001` mapped to internal `5000`) and a UI container (`4200` mapped to `80`).

After the stack is up:

- UI: http://localhost:4200
- API root: http://localhost:5001/
- API endpoints are available under: http://localhost:5001/api

If you need to run containers in the background add `-d`:

```powershell
docker-compose up --build -d
```

To stop and remove containers, networks and volumes created by compose:

```powershell
docker-compose down
```

## Service details

docker-compose mappings (important ports):

- Postgres: host `5432` -> container `5432` (db service)
- API: host `5001` -> container `5000` (api service)
- UI: host `4200` -> container `80` (nginx serving the Angular build)

The `ui` service mounts `kanban-app/nginx.conf` into the container to proxy `/api` requests to the API service.

## API overview

The API is a small Express application exposing board and task operations under `/api`.

Base URL (when running with compose):

```
http://localhost:5001/api
```

Endpoints

- GET /boards/
	- Description: Returns all boards (summary/list).
	- Example: `GET http://localhost:5001/api/boards/`

- GET /boards/:id
	- Description: Returns a full board (columns and tasks) by id.
	- Example: `GET http://localhost:5001/api/boards/1`

- POST /boards/save
	- Description: Create or update a board. JSON body expected. Returns saved board object.
	- Example payload:

```json
{
	"id": null,
	"name": "New Board",
	"columns": [
		{ "id": 1, "name": "Todo" },
		{ "id": 2, "name": "In Progress" }
	]
}
```

- DELETE /boards/delete/:id
	- Description: Delete a board by id.

- POST /tasks/save
	- Description: Create or update a task. JSON body expected. Returns saved task object.
	- Example payload:

```json
{
	"id": null,
	"title": "Implement feature X",
	"description": "Details about the task",
	"status": "todo",
	"columnId": 1,
	"subtasks": []
}
```

Data persistence is implemented using Postgres functions and stored procedures. Check `kanban-db/init/001_Init.sql` for the DB schema and stored procedures used by the models.

## Development

API

- To run the API locally without Docker (requires Node >= 18):

```powershell
cd kanban-api
npm install
npm run dev   # uses nodemon
```

Make sure your `kanban-api/.env` points to a running Postgres instance. The compose setup uses `DB_HOST=db` but for local runs you may use `DB_HOST=localhost` and the host's Postgres credentials.

UI

- To run the Angular app in development mode (live-reload):

```powershell
cd kanban-app
npm install
npm start
```

The `start` script runs `ng serve` (port 4200 by default). The Docker `ui` service instead serves a built app through Nginx to simulate production.

## Troubleshooting

- If containers fail to start because the DB is not ready, Docker Compose's `depends_on` ensures start order but not readiness. Check the DB logs and wait a moment, or restart the `api` container after DB is healthy.
- Check logs:

```powershell
docker-compose logs -f api
docker-compose logs -f db
```

- If ports are already in use, free them or change the host port mappings in `docker-compose.yml`.
- If the Angular UI cannot reach the API, confirm `kanban-app/nginx.conf` is present and that the `ui` container can resolve the `api` service (default compose network). When using the API directly, use port `5001`.

## Notes & tips

- The API expects JSON and uses Postgres stored functions for main operations. Look into `kanban-api/src/models` and `kanban-db/init/001_Init.sql` for the SQL implementation.
- The Dockerfiles are intentionally simple for learning purposes; they can be extended with multi-stage builds and caching for faster iteration.

## License

This repository is provided as-is for learning and demo purposes.

---

If you'd like, I can also:

- Add a short CONTRIBUTING.md with local dev setup steps.
- Add examples of curl commands for each endpoint.
- Add a small Makefile or PowerShell script to simplify common tasks (build, up, down).

Tell me which of these you'd like next.