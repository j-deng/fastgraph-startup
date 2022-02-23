# fastgraph server project

Start a apollo graphql server on port 4000

## Install

### Database Setup

Run postgres first

```bash
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

### ENV

Add the envs to `.env` file in root path or run:

```bash
# don't forget to change JWT_SECRET and DATABASE_URL
# by default DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/fgapp
cp example.env .env
```

### Run

```bash
# install dependencies
yarn

# generate prisma client
npx prisma generate

# migrate and generate new client
# should run this command after you change `prisma.schema` model or `/// decorator comment`
yarn migrate:dev

# create a superuser with password so that you can login
yarn createsuperuser

# start
yarn dev
```

## Prisma

Project use [Prisma](https://www.prisma.io/) as ORM.

Install prisma vscode extensions: https://marketplace.visualstudio.com/items?itemName=Prisma.prisma

Generate Prisma Client - init database

```bash
npx prisma generate
```

If you want [Adding Prisma Migrate to an existing project](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/add-prisma-migrate-to-a-project)

```bash
npx prisma db pull
```

Migrate on development

```bash
yarn migrate:dev
```

Make migrations only

```bash
yarn migrate:create
```
