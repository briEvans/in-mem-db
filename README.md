# In Memory Database

in-mem-db is a javacript implementation of an in memory database. It supports Basic CRUD actions AND fully supports database [transactions](https://www.techopedia.com/definition/16455/transaction) (BEGIN, ROLLBACK, COMMIT) 

## SET UP

1. Install Node v8.70 and NPM
 * https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
```sh
node install
```

1. Install Dependencies via NPM
```sh
npm install
```

## MANUALLY RUN DB APPLICATION
1. `npm start` or `node .`

## INTERFACE
1. Start the app. (npm start or node .)
1. type any of the required commands into the command line:
- `GET <name>`
- `SET <name> <value>`
- `DELETE <name>`
- `COUNT <name>`
- `BEGIN`
- `COMMIT`
- `ROLLBACK`
- `END`
- `OPTIONS`

The OPTIONS command will list all possible actions.

## RUN TEST SUITE

```sh
npm test
```
