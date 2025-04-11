import pkg from 'pg';
const { Pool } = pkg;

const connectionPool = new Pool({
    connectionString:
    "postgres://postgres:jun@feifei97@localhost:5432/QRM",
    
})

export default connectionPool;
