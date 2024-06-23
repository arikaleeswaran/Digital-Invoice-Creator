const Pool = require('pg').Pool;

const connectionString = 'postgres://postgres.tyjihsgkejrqbuposdhi:ari@SupabaseDB@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'

const pool = new Pool({
    connectionString: connectionString,
});

module.exports = pool;