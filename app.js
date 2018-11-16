const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

server = app.listen(3000);

const io = require('socket.io')(server);

let userCount = 0;
let history = [];

io.on('connection', (socket) => {
    userCount++;

    socket.username = 'Anonymous';

    socket.on('change_username', (data) => {
        io.sockets.emit('new_message', {
            message: `<p class='message'>${socket.username} has is now ${data.username}</p>`,
            username: data.username
        });
        socket.username = data.username;
    });

    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {
            message: data.message,
            username: socket.username
        });
        history = [...history, {
            message: data.message,
            username: socket.username
        }];
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    socket.on('done', (data) => {
        socket.broadcast.emit('done', {});
    });

    socket.on('history', (data) => {
        io.to(`${socket.id}`).emit('history',history);
    });

});