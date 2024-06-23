const Pool = require('pg').Pool;
require('dotenv').config()

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
});

module.exports = pool;