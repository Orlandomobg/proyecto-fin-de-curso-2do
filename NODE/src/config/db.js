const {Pool} = require("pg");

const pool = new Pool ({
    user: process.env.USER_DB,
    port: process.env.PORT_DB,
    password: process.env.PASSWORD_DB,
    host: process.env.HOST_DB,
    database: process.env.NAME_DB
});

pool.on("connect",() => {
        console.log(`Database connected.`)
});

pool.on("error", (err) => {
    console.log("Error:", err);
    process.exit(1);
});

module.exports = pool;