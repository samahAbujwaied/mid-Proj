'use strict';

const client = require('socket.io-client');
const host = "http://localhost:8000";

const socket = client.connect(host);

// take the task value from argument form the terminal
// console.log(process.argv)
const value = process.argv.splice(2)[0];
console.log("value : ", value);
socket.emit('get_all-client');//done
socket.emit('client_msg', value);//done


// socket.emit('client_msg', "wash the dishes");


// socket.on('added', payload=> {
//     console.log("Thank you for adding : ", payload , " to the queue");
//     // socket.disconnect();
// });


socket.on('admin-data', msg=> {
    console.log("client got this msg from admin: ", msg)
    socket.emit('received-admin', msg)
})

socket.on('res-client', msg=> {
    console.log("admin got this msg: ", msg)
    socket.emit('received-client', msg)

})