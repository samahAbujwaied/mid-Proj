'use strict';

const client = require('socket.io-client');
const host = "http://localhost:4000/discord";

const socket = client.connect(host);

// pulling msgs 
socket.emit('get_all');//dpne



socket.on('res-client', msg =>{
    console.log("admin got this msg from client: ", msg)
    socket.emit('received-client', msg)
});//done



// socket.emit('admin_msg', "Ok client we will discuss");
const value = process.argv.splice(2)[0];

console.log("value : ", value);