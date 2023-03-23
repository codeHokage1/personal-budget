const { Pool } = require('pg');
const budgetAPIPool = new Pool({
    connectionString: process.env.DBConfigLink,
    ssl: {
        rejectUnauthorized: false
    }
});
module.exports = budgetAPIPool;