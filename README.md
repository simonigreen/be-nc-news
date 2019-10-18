# News API

An API that queries a database and allows users to create, read, update and delete data. A full list of the available endpoints, methods, queries available [here](https://nc-news-sg.herokuapp.com/api/).

The repository for the front-end project can be viewed here [here](https://github.com/SimonGreenUK/fe-nc-news) with a hosted version of the front-end project available [here](https://nc-news-sg.netlify.com/)

## Getting Started

You can either fork this repository or clone it by running the below command on your own computer:

```bash
git clone https://github.com/SimonGreenUK/be-nc-news.git
```

### Installing prerequisites

You will need Node.js (at least version 12.5) and PostgreSQL (at least version 11.5) to run the project.

Run the following in the command line to install all dependencies shown in the package.json:

```bash
npm install
```

After this you will need to setup and seed the database by running the following commands:

```bash
npm run setup-dbs && npm run seed
```

If you are using Linux you will need to update the knexfile.js file located in the projects root directory and add your PostgreSQL username and password as shown below. This step is not required if you're using macOS.

```js
const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: 'nc_news',
      username: your_psql_username,
      password: your_psql_password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      username: your_psql_username,
      password: your_psql_password
    }
  }
};
```

## Running the tests

To run the main tests run the following command:

```bash
npm test
```

There are also tests for the utility functions that can be run with the following command:

```bash
npm run dev
```

## Built With

- [Node](https://nodejs.org/en/) - JavaScript runtime
- [Express](https://expressjs.com/) - web framework for Node
- [PostgreSQL](https://www.postgresql.org/) - relational database
- [node-postgres](https://node-postgres.com/) - node.js modules for interfacing with PostgreSQL database
- [Knex](http://knexjs.org/) - SQL query builder

For testing:

- [Mocha](https://mochajs.org/) - test framework
- [Chai](https://www.chaijs.com/) - assertion library

## Author

[**Simon Green**](https://github.com/SimonGreenUK)
