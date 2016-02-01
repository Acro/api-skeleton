# api-skeleton 

![DI graph](https://github.com/Acro/api-skeleton/blob/master/di_graph.jpg)


## Scripts

### npm test

Cleans the db (calls `db-test-reset`) and runs all tests. When env variable `FILE` is provided, it runs only one test file (recommended for development).

    FILE=test/profile.test.js npm test

### db-migrate

Migrate database to the latest migration. Connects to the DB configured in `.env`.

### npm run graph

Generates new `di_grap.jpg` from `di_graph.dot` file which is automatically generated on every start in development mode.

### db-rollback

Rollback one last migration. Connects to the DB configured in `.env`.

### db-test-reset

Rollback all migrations and then migrate the database to the latest version. Uses db configured in `.env-test`.

### db-new-migration

Creates files for the new migration. Automatically figures out the migration number. It opens both files in vim afterwards.

### npm run coverage

Same as `test` but will also generate tests code coverage and saves report in `/coverage` directory. Uses `istanbul` package.

### npm run doc

Regenerates API documentation (doc/api.md -> doc/api.html). Uses `n` to change node version as the tool `aglio` doesn't work with current node version.

### npm run lint

Checks the syntax.