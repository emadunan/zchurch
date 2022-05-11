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

### Install Jasmine ***(LEGACY-DON'T USE IT)***
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