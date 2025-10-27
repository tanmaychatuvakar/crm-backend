# Drep API

The node.js backend app for DREP project.

## Requirements

- [Nodejs LTS](https://nodejs.org/en)
- Git
- PostgreSql

## Common setup

Clone the repo and install the dependencies.

```bash
git clone ssh://git-codecommit.us-west-2.amazonaws.com/v1/repos/api
cd api
```

```bash
npm install
```

### Database Setup:

1. Create a database in PostgreSQL
2. Copy `.env.example` file into `.env` and fill the variables.
3. run the following commands:

```bash
npm run migrate:deploy // or migrate:dev for local development only
```

It will create the tables and run all the migrations and seeders.

## Commands

### Run Project

```bash
npm run dev
```

### Lint Project

```bash
npm run lint
npm run lint:fix
```

### Run Seeders

```bash
npm run db:seed
```

### Run Migrations (for deployments)

```bash
npm run migrate:deploy
```

### Run Migrations (for local development)

```bash
npm run migrate:dev
```

### Generate DBML

```bash
npx prisma generate
```

This command will generate a `schema.dbml` in `prisma/dbml`. Go to [DBDiagram](https://dbdiagram.io/d) and paste the generated file content to preview the ER Diagram of the Database.
# crm-backend
