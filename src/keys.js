const puerto = 3000;
module.exports = {
    database: {
        host:'localhost',
        user:'root',
        password:'',
        database:'db_3csw'
    },
    port: puerto,
    config : {
        my_domain: 'http://localhost:' + puerto,
    }
}