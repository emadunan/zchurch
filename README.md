# zchurch

## Installation

Create databases for development and test

```postgres
CREATE DATABASE mydb;
CREATE DATABASE mydb_test;
```

Create login and grant it the appropriate privileges

```postgres
CREATE ROLE emadunan LOGIN SUPERUSER PASSWORD 'password';
```

Clone the project repository from github

```bash
git clone https://github.com/emadunan/zchurch.git
```

Install zchurch project with npm

```bash
npm install zchurch/zchurch-api
cd zchurch/zchurch-api
```

Create .env file in zchurch-api directory, and provide your connection string in the following pattern

```bash
DATABASE_URL="postgresql://emadunan:password@localhost:5432/mydb?schema=public"
```

Create .env.test file in zchurch-api directory, and provide your connection string for the test database

```bash
DATABASE_URL="postgresql://emadunan:password@localhost:5432/mydb_test?schema=public"
```

Run migration

```bash
npm run migrate           # For dev environment
npm run migrate:test      # For test environment
```

Seed data

```bash
npm run seed              # For dev environment
npm run seed:test         # For test environment
```

***

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

***

## API Reference

#### Get all books

```http
GET /bible
```

#### Get one book

```http
GET /bible/${bookName}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `bookName` | `string` | **Required**. name of book to fetch |

#### Get all expressions

```http
GET /expressions
```

#### Get one expression

```http
GET /expressions/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Id of expression to fetch |

***

## References
- https://nodejs.org/
- https://www.npmjs.com/
- https://expressjs.com/
- https://www.prisma.io/
- https://jestjs.io/
- https://socket.io/
- https://prettier.io/
- https://eslint.org/
- https://www.typescriptlang.org/
- https://www.postgresql.org/
- https://aws.amazon.com/
- https://www.cygwin.com/
- https://www.diagrams.net/
- https://www.cloudcraft.co/
- https://readme.so/
