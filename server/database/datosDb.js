;
module.exports = {
    client: process.env.CLIENT || 'pg',
    connection: process.env.CONNECTION_DB || {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'lenin1234',
        database: 'Ferre'
    }
}