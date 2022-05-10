## API Initiation Steps

### Initialize Nodejs project

``` cli
npm init
```

### Install and configure typecript

``` ts
npm i -D typescript     // A language for application-scale JavaScript
npm i -D @types/node    // Type definitions for Node.js
npx tsc --init          

npm i -D ts-node        // TypeScript execution and REPL for node.js
npm i -D nodemon        // A tool helps develop Node.js based applications
```

### Install and configure linting
``` ts
npm i -D prettier       // An opinionated code formatter
npm i -D eslint         // A tool for identifying and reporting on patterns found in ECMAScript
npm i -D eslint-config-prettier eslint-plugin-prettier
npm init @eslint/config
```

> Create ***.eslintignore*** file and add the excluded files and folders from linting

#### Inject prettier configurations in eslint config file
``` ts
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["warn"]
  },
}
```

### Install .ENV
``` ts
npm i dotenv            // Loads environment variables from a .env file into process.env.
```

### Install Express, and body-parser
``` ts
npm i express           // Fast, unopinionated, minimalist web framework for node
npm i -D @types/express

npm i body-parser
npm i -D @types/body-parser
```

### Install Prisma ORM
``` ts
npm i prisma                // Next-generation Node.js and TypeScript ORM
npm install @prisma/client  // 
```

> Define your models then:

#### Create migrate:down file
``` ts
npx prisma migrate diff --from-schema-datamodel src/prisma/schema.prisma --to-schema-datasource src/prisma/schema.prisma --script > down.sql
```

#### Create migrate:up file
``` ts
npx prisma migrate dev --name init --create-only
npx prisma migrate dev
```

#### To execute migrate:down ***(NOT RECOMMENDED)***
``` ts
npx prisma db execute --file ./down.sql --schema src/prisma/schema.prisma
// OR
npx prisma migrate resolve --rolled-back init
```

### Install sequelize ORM ***(LEGACY-DON'T USE IT)***
``` ts
npm i sequelize             // Sequelize is a promise-based Node.js ORM tool
npm i -D @types/sequelize

npm install pg pg-hstore    // Non-blocking PostgreSQL client for Node.js
npm i -D sequelize-cli      // The Sequelize Command Line Interface (CLI)
```

### Install Jasmine
``` ts
npm i -D jasmine            // CLI for running Jasmine specs under Node
npm i -D @types/jasmine
npx jasmine init

npm i -D jasmine-spec-reporter  // Real time console spec reporter for jasmine
```

#### Configure jasmine-spec-reporter
Create reporter.ts file in the helpers folder and past that code

``` ts
import {
    DisplayProcessor,
    SpecReporter,
    StacktraceOption,
} from "jasmine-spec-reporter";
import SuiteInfo = jasmine.JasmineStartedInfo;

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
        return `TypeScript ${log}`;
    }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
    new SpecReporter({
        spec: {
            displayStacktrace: StacktraceOption.NONE,
        },
        customProcessors: [CustomProcessor],
    })
);

```