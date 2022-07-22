import pgPromise, { IEventContext } from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

// configuration object for initializing pg-promise
const pgConfig = {
  // overload datbase events to provide logging

  // called when a new database connection is acquired
  connect(client: IClient, dc: any, useCount: number) {
    const cp = client.connectionParameters;
    console.log(`Connected to database: ${cp.database}`);
  },

  // called just BEFORE a query is executed
  query(e: IEventContext) {
    console.log('QUERY RESULT:', e.query);
  },

  // called just BEFORE the client recieves the data
  receive(data: any, result: any, e: IEventContext) {
    console.log(`DATA FROM QUERY ${e.query} WAS RECEIVED.`);
    console.log(`DATA RECEIVED:`);
    console.table(data);
  },
}

// configuration object for connecting to the database
const dbConfig = {
  host: process.env.DB_HOST_NAME,
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DB_NAME,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  max: 10, // maximum number of concurrent connections
};

const pgp = pgPromise(pgConfig);
const db = pgp(dbConfig);

export default db;