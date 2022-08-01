import postgresql from 'pg';

const { Pool } = postgresql;

export default (callback = null) => {
    // NOTE: PostgreSQL creates a superuser by default on localhost using the OS username.
    const pool = new Pool ({
        user:'postgres',
        host:'localhost',
        database:'mbti',
        password:'hp75841587f*',
        port:5432
    });
    const connection = {
        pool,
        query: (...args) => {
            return pool.connect().then((client) => {
                return client.query(...args).then((res) => {
                    client.release();
                    return res.rows;
                });
            });
        },
    };

    process.postgresql = connection;

    if (callback) {
        callback(connection);
    }

    return connection;
};