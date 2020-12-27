const Express = require('express');
const SocketIO = require('socket.io');
const HTTP = require('http');

/* Socket.IO is a library that enables realtime, bi-directional
    communication between servers and clients. This is important
    when fast communication is required, such as texting. */

const App = Express();
/*Express calls the HTTP.createServer() method by default. The method
 is manually mentioned here so that Socket.IO has access to the server. */
const Server = HTTP.createServer(App);
const IO = SocketIO(Server);

App.use(Express.static(__dirname));
const PORT = 3000;

let count = 0;
/* The IO.on('connection') method is called every time a client connects
  to the server and sets the real-time event handlers. */
IO.on('connection', Socket => {
    /*The server emits messages to the clients by sending a specified string along
      with the required parameters. The client will then have to react based
      on the string provided. */

    //Socket.emit() signals to the current client.
    Socket.emit('Count', count);
    //Socket.broadcast.emit() signals to all clients except the current one.
    Socket.broadcast.emit('User Joining');

    /*Socket.on() is the implementation used to accept signals from clients.
      The server will react when it receives the 'Increment' string. */
    Socket.on('Increment', callback => {
        count++;
        //IO.emit() signals to all clients.
        IO.emit('Count', count);

        /*If the last argument passed to an emit function is a callback function,
          the function will be treated as an event acknowledgement function. */
        if (count > 10)
            //Calling the function will cause the client to run it instead of the server.
            callback(new Error('Counter is full!'));
        else 
            callback()
    })

    Socket.on('Join Room', room_name => {
        //Clients can join different rooms.
        Socket.join(room_name);

        /*The .to(room_name) function will limit the IO and Socket.broadcast
          methods to signaling clients in the specified room name. */
        IO.to(room_name).emit('Count');
        Socket.broadcast.to(room_name).emit('User Joining');
    })

    //Activates during client disconnection.
    Socket.on('disconnect', () => {
        IO.emit('User Leaving')
    })
});
//Note how all Socket methods are inside the Socket.on('connection') function.


Server.listen(PORT, () => console.log(`Server is set up on Port ${PORT}!`));
