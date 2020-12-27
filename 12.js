const Socket = io();

Socket.on('Count', count => {
    console.log('Current count:' + count);
})

Socket.on('User Joining', () => {
    console.log('A new user has joined!');
});

Socket.on('User Leaving', () => {
    console.log('A user has left!');
})

let $joinRoom = document.querySelector('#join_room');
$joinRoom.addEventListener('click', () => {
    Socket.emit('Join Room', 'Special Room');
});

let $increment = document.querySelector('#increment');
$increment.addEventListener('click', () => {
    $increment.disabled = true;

    /* The error callback function passed into Socket.emit() is
        an event acknowledgement function. The server will call 
        the function to activate it in the client. */
    Socket.emit('Increment', error => {
        $increment.disabled = false;
        $increment.focus();

        if (error)
            console.log(`You're overfilling the counter!`);
    });
});

