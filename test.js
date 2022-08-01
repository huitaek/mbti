const { Pool } = require('pg');
const pg=new Pool ({
    user:'postgres',
    host:'localhost',
    database:'mbti',
    password:'hp75841587f*',
    port:5432
});

pg.connect(err =>{
    if(err) console.log(err);
    else{
        console.log("Database Connected Successfully.")
    }
});

const queryString = 'SELECT * FROM main';

async function selectFrom(data, table, condition) {

    try {
        const res = await pg.query(
            `SELECT ${data} FROM ${table} ${condition}`
        );
        return res;
    } catch (err) {
        return err.stack;
    }
}

async function whateverFuncName () {
    let response = await selectFrom('*','main', '');
    let result = response.rows[0]
    return result;
}


const getName = (request, response) => {
    pg.query('SELECT * FROM main ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


getName()