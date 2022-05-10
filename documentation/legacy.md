### Install sequelize ORM ***(LEGACY-DON'T USE IT)***
``` ts
npm i sequelize             // Sequelize is a promise-based Node.js ORM tool
npm i -D @types/sequelize

npm install pg pg-hstore    // Non-blocking PostgreSQL client for Node.js
npm i -D sequelize-cli      // The Sequelize Command Line Interface (CLI)
```

#### To execute migrate:down ***(NOT RECOMMENDED)***
``` ts
npx prisma db execute --file ./down.sql --schema src/prisma/schema.prisma
// OR
npx prisma migrate resolve --rolled-back init
```